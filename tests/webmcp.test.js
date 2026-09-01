import test from "node:test";
import assert from "node:assert/strict";
import { createNavigatorStore } from "../src/state.js";
import { TOOL_NAMES, createWebMCPController } from "../src/webmcp.js";

function modelContextMock({ failAt = -1 } = {}) {
  const registrations = [];
  return {
    registrations,
    async registerTool(definition, options) {
      if (registrations.length === failAt) {
        throw new Error("registration failed");
      }
      const registration = { definition, signal: options.signal, active: true };
      options.signal.addEventListener("abort", () => {
        registration.active = false;
      });
      registrations.push(registration);
    },
  };
}

function delayedModelContextMock() {
  const registrations = [];
  let releaseFirst;
  const firstRegistrationGate = new Promise((resolve) => {
    releaseFirst = resolve;
  });

  return {
    registrations,
    releaseFirst,
    async registerTool(definition, options) {
      const registration = { definition, signal: options.signal, active: true };
      options.signal.addEventListener("abort", () => {
        registration.active = false;
      });
      registrations.push(registration);
      if (registrations.length === 1) {
        await firstRegistrationGate;
      }
    },
  };
}

async function consentedStore() {
  const store = createNavigatorStore({ now: () => new Date("2026-08-31T12:00:00Z") });
  await store.setStatement("My bill is higher. What record should I review?");
  await store.selectNeed("bill-payment");
  await store.selectPath("waterbury-property-tax-billing");
  await store.setConsent(true);
  return store;
}

test("registers exactly four bounded tools once", async () => {
  const store = await consentedStore();
  const modelContext = modelContextMock();
  const controller = createWebMCPController({ store, modelContext });

  await controller.register();
  await controller.register();
  assert.deepEqual(
    modelContext.registrations.map(({ definition }) => definition.name),
    TOOL_NAMES,
  );
  assert.equal(modelContext.registrations.length, 4);
  assert.equal(
    modelContext.registrations.every(({ definition }) =>
      definition.annotations.untrustedContentHint,
    ),
    true,
  );
});

test("registers zero tools before the resident grants consent", async () => {
  const store = createNavigatorStore();
  const modelContext = modelContextMock();
  const controller = createWebMCPController({ store, modelContext });

  const result = await controller.register();
  assert.deepEqual(result, {
    available: true,
    registered: false,
    count: 0,
    reason: "CONSENT_REQUIRED",
  });
  assert.equal(modelContext.registrations.length, 0);
  assert.equal(controller.isRegistered(), false);
});

test("abort lifecycle removes every registration", async () => {
  const store = await consentedStore();
  const modelContext = modelContextMock();
  const controller = createWebMCPController({ store, modelContext });
  await controller.register();
  controller.stop();
  assert.equal(modelContext.registrations.every(({ active }) => !active), true);
});

test("a captured tool handle refuses access after consent is revoked", async () => {
  const store = await consentedStore();
  const controller = createWebMCPController({ store, modelContext: modelContextMock() });
  const read = controller
    .definitionsForTest()
    .find(({ name }) => name === "get_handoff_state");

  assert.equal((await read.execute({})).ok, true);
  await store.setConsent(false);
  const revoked = await read.execute({});
  assert.equal(revoked.ok, false);
  assert.equal(revoked.error.code, "CONSENT_REQUIRED");
});

test("register called after revocation aborts an existing lifecycle", async () => {
  const store = await consentedStore();
  const modelContext = modelContextMock();
  const controller = createWebMCPController({ store, modelContext });
  await controller.register();
  await store.setConsent(false);

  const result = await controller.register();
  assert.equal(result.registered, false);
  assert.equal(modelContext.registrations.every(({ active }) => !active), true);
  assert.equal(controller.isRegistered(), false);
});

test("partial registration failure aborts all registrations", async () => {
  const store = await consentedStore();
  const modelContext = modelContextMock({ failAt: 2 });
  const controller = createWebMCPController({ store, modelContext });
  await assert.rejects(controller.register(), /registration failed/);
  assert.equal(modelContext.registrations.every(({ active }) => !active), true);
  assert.equal(controller.isRegistered(), false);
});

test("concurrent registration calls share one lifecycle", async () => {
  const store = await consentedStore();
  const modelContext = delayedModelContextMock();
  const controller = createWebMCPController({ store, modelContext });

  const first = controller.register();
  const second = controller.register();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(modelContext.registrations.length, 1);
  assert.equal(controller.isRegistered(), false);

  modelContext.releaseFirst();
  const results = await Promise.all([first, second]);
  assert.equal(results.every(({ count }) => count === TOOL_NAMES.length), true);
  assert.equal(modelContext.registrations.length, TOOL_NAMES.length);
  assert.equal(controller.isRegistered(), true);
});

test("revocation during registration aborts the entire lifecycle", async () => {
  const store = await consentedStore();
  const modelContext = delayedModelContextMock();
  const controller = createWebMCPController({ store, modelContext });

  const first = controller.register();
  const second = controller.register();
  await new Promise((resolve) => setImmediate(resolve));
  controller.stop();
  await store.setConsent(false);
  modelContext.releaseFirst();

  const results = await Promise.allSettled([first, second]);
  assert.equal(results.every(({ status }) => status === "rejected"), true);
  assert.equal(modelContext.registrations.every(({ active }) => !active), true);
  assert.equal(modelContext.registrations.length, 1);
  assert.equal(controller.isRegistered(), false);
});

test("consent revocation alone aborts registration still in flight", async () => {
  const store = await consentedStore();
  const modelContext = delayedModelContextMock();
  const controller = createWebMCPController({ store, modelContext });

  const registration = controller.register();
  await new Promise((resolve) => setImmediate(resolve));
  await store.setConsent(false);
  modelContext.releaseFirst();

  await assert.rejects(registration, { code: "CANCELLED" });
  assert.equal(modelContext.registrations.every(({ active }) => !active), true);
  assert.equal(controller.isRegistered(), false);
});

test("tool execution validates inputs at runtime", async () => {
  const store = await consentedStore();
  const controller = createWebMCPController({ store, modelContext: modelContextMock() });
  const definitions = controller.definitionsForTest();
  const read = definitions.find(({ name }) => name === "get_handoff_state");
  const prepare = definitions.find(({ name }) => name === "prepare_handoff");

  assert.equal((await read.execute({ extra: true })).error.code, "INVALID_INPUT");
  assert.equal((await prepare.execute({ revision: 1, body: "attacker" })).error.code, "INVALID_INPUT");
});

test("mutation schemas publish the safe-integer revision ceiling", async () => {
  const store = await consentedStore();
  const controller = createWebMCPController({ store, modelContext: modelContextMock() });
  for (const name of ["prepare_handoff", "propose_case_update"]) {
    const definition = controller.definitionsForTest().find((tool) => tool.name === name);
    assert.equal(
      definition.inputSchema.properties.revision.maximum,
      Number.MAX_SAFE_INTEGER,
    );
  }
});

test("assistant tool stages a deterministic draft without reviewing it", async () => {
  const store = await consentedStore();
  const controller = createWebMCPController({ store, modelContext: modelContextMock() });
  const prepare = controller
    .definitionsForTest()
    .find(({ name }) => name === "prepare_handoff");
  const revision = store.getSnapshot().revision;
  const result = await prepare.execute(
    { revision },
    { signal: new AbortController().signal },
  );

  assert.equal(result.ok, true);
  assert.equal(result.status, "AWAITING_RESIDENT_REVIEW");
  assert.equal(result.draft.reviewed, false);
  assert.equal(store.getSnapshot().draft.createdBy, "assistant");
});
