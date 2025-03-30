import { Codex } from "@codex-data/sdk";

let codexInstance: Codex | null = null;

export function initializeCodex(apiKey: string): void {
  if (!apiKey) {
    throw new Error("CODEX_API_KEY is not defined in environment variables");
  }
  codexInstance = new Codex(apiKey);
}

export function getCodex(): Codex {
  if (!codexInstance) {
    throw new Error(
      "Codex client not initialized. Call initializeCodex first."
    );
  }
  return codexInstance;
}
