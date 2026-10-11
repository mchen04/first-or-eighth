// Browser data loader. Fetches the canonical YAML sources at runtime, parses
// them with the shared dependency-free parser, and normalizes + validates them
// with the shared data layer. There is no build step: edit a YAML file in
// data/ and refresh. The Node checks use the same parsing and validation rules.

import { parseYaml } from "./lib/yaml.mjs";
import { buildData, validateData } from "./lib/data.mjs";

let cache = null;

export async function loadData() {
  if (cache) return cache;

  const [rawCreators, rawGames] = await Promise.all([
    fetchYaml("data/creators.yaml"),
    fetchYaml("data/games.yaml")
  ]);

  const data = buildData(rawCreators, rawGames);
  const errors = validateData(data);
  if (errors.length) {
    // Reject invalid runtime data; boot() shows the error.
    throw new Error(`Game data has ${errors.length} validation error(s):\n- ${errors.join("\n- ")}`);
  }

  cache = data;
  return cache;
}

async function fetchYaml(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
  return parseYaml(await response.text());
}
