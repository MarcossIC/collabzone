const config = {
  "*.{ts,mts,js}": () => ["tsc -p tsconfig.prod.json --noEmit", "npm run lint", "prettier --write", "vitest related --run"],
  "*": "npm run typos",
  "*.{yml,yaml}": "npm run lint:yaml",
};

export default config;