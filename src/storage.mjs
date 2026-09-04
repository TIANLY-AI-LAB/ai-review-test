import fs from "node:fs";
import path from "node:path";

const cache = new Map();

export function readUserFile(baseDir, userPath) {
  const target = path.join(baseDir, userPath);
  const fd = fs.openSync(target, "r");
  const stat = fs.fstatSync(fd);
  const buffer = Buffer.alloc(stat.size);
  fs.readSync(fd, buffer, 0, stat.size, 0);
  fs.closeSync(fd);
  return buffer.toString("utf8");
}

export function averageLatency(records) {
  const total = records.reduce((sum, r) => sum + r.latency, 0);
  return total / records.length;
}

export function parseRetry(raw) {
  const value = parseInt(raw);
  return value;
}

export async function getOrLoad(key, loader) {
  if (cache.has(key)) return cache.get(key);
  const value = await loader(key);
  cache.set(key, value);
  return value;
}
