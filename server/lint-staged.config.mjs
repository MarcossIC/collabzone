import path from 'node:path';

const config = {
  "*.{ts,mts,js}": (filenames) => [
    "tsc -p tsconfig.build.json --noEmit",
    `eslint --fix --report-unused-disable-directives --max-warnings 0 --no-warn-ignored ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")}`,
  `prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")} --ignore-path .prettierignore`
  ],
  "*": "npm run typos",
  "*.{yml,yaml}": "npm run lint:yaml",
};

export default config;