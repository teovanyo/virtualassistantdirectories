import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2] || "/var/folders/ww/l8s99r4j69n1hx7y_s845fn00000gn/T/opencode/US.txt";
const OUT = path.join(process.cwd(), "data", "cities.json");

const STATES = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
  MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const MIN_POP = Number(process.env.MIN_POP || 5000);

const best = new Map();
for (const line of fs.readFileSync(SRC, "utf8").split("\n")) {
  const f = line.split("\t");
  if (f.length < 15 || f[6] !== "P") continue;
  const pop = Number(f[14]) || 0;
  if (pop < MIN_POP) continue;
  const state = f[10];
  if (!STATES[state]) continue;
  const name = f[1];
  const key = `${name.toLowerCase()}|${state}`;
  const prev = best.get(key);
  if (!prev || pop > prev.population) {
    best.set(key, {
      name,
      state,
      stateName: STATES[state],
      population: pop,
      lat: Number(f[4]),
      lon: Number(f[5]),
    });
  }
}

const cities = [...best.values()].sort((a, b) => b.population - a.population);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(cities, null, 0));
console.log(`wrote ${cities.length} cities to ${OUT}`);
