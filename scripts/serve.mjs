import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { isPublicAsset } from "./public-paths.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number.parseInt(process.env.PORT ?? "4173", 10);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const securityHeaders = {
  "Cache-Control": "no-store",
  "Content-Security-Policy":
    "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; font-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function send(res, status, body) {
  res.writeHead(status, { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

createServer(async (req, res) => {
  if (!req.url || !["GET", "HEAD"].includes(req.method ?? "")) {
    send(res, 405, "Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    send(res, 400, "Bad request");
    return;
  }

  let relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  if (relativePath.endsWith("/")) {
    relativePath += "index.html";
  }
  if (!isPublicAsset(relativePath)) {
    send(res, 404, "Not found");
    return;
  }
  const filePath = resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    send(res, 403, "Forbidden");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      send(res, 404, "Not found");
      return;
    }
    res.writeHead(200, {
      ...securityHeaders,
      "Content-Length": info.size,
      "Content-Type": relativePath === "feed.xml"
        ? "application/atom+xml; charset=utf-8"
        : contentTypes[extname(filePath)] ?? "application/octet-stream",
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    createReadStream(filePath).pipe(res);
  } catch {
    send(res, 404, "Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Go Vermont Civic Navigator: http://127.0.0.1:${port}`);
});
