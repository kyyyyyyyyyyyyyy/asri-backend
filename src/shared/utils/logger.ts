import { mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";

export type LogLevel = "info" | "error";

export type LogEntry = {
  level: LogLevel;
  event: string;
  message: string;
  payload?: unknown;
};

const logDirectory = process.env.LOG_DIR ?? "logs";

function getTimestamp() {
  return new Date().toISOString();
}

function getLogFileName(timestamp: string) {
  const date = timestamp.slice(0, 10);
  return `asri-${date}.log`;
}

export async function writeLog(entry: LogEntry) {
  const timestamp = getTimestamp();
  const line = JSON.stringify({
    timestamp,
    date: timestamp.slice(0, 10),
    ...entry
  });

  await mkdir(logDirectory, { recursive: true });
  await appendFile(join(logDirectory, getLogFileName(timestamp)), `${line}\n`, "utf8");
}

export function writeLogAsync(entry: LogEntry) {
  void writeLog(entry).catch((error) => {
    console.error("Failed to write application log", error);
  });
}
