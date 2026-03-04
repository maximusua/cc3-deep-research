import Exa from "exa-js";

let exaClient: Exa | null = null;

export function getExaClient(): Exa {
  if (!exaClient) {
    exaClient = new Exa(process.env.EXA_API_KEY!);
  }
  return exaClient;
}
