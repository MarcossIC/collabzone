import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Initialize Husky
  execSync('cd .. && npx husky server/.husky', { stdio: 'inherit' });

  // Create .husky directory if it doesn't exist
  const huskyDir = path.join(__dirname, '.husky');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir);
  }

  // Create commit-msg hook for Commitlint
  const commitMsgPath = path.join(huskyDir, 'commit-msg');
  const commitMsgHook = `set +e
if [ ! -d "server" ]; then
  echo "Not found server skip commit-msg for server."
  exit 0
fi

if ! git diff --cached --name-only | grep -q '^server/'; then
  echo "No changes in server, skipping commit-msg for server."
  exit 0
fi

cd server

npx --no -- commitlint --edit || { echo -e "$(tput setaf 1)❌The commit message does not meet the requirements. Look at "commitlint.config.js" file.$(tput sgr0)"; exit 1; }`;
  fs.writeFileSync(commitMsgPath, commitMsgHook);

  // Create pre-commit hook
  const preCommitPath = path.join(huskyDir, 'pre-commit');
  const preCommitHook = `set +e
if [ ! -d "server" ]; then
  echo "Not found server skip pre-commit for server."
  exit 0
fi

if ! git diff --cached --name-only | grep -q '^server/'; then
  echo "No changes in server, skipping pre-commit for server."
  exit 0
fi

cd server

npx --no lint-staged || { echo -e "$(tput setaf 1)❌There is a bug in Eslint or Prettier, you cannot commit with these errors.$(tput sgr0)"; exit 1; }`;
  fs.writeFileSync(preCommitPath, preCommitHook);

  // Create pre-push hook
  const prePushPath = path.join(huskyDir, 'pre-push');
  const prePushHook = `set +e
if [ ! -d "server" ]; then
  echo "Not found server skip pre-push for server."
  exit 0
fi

cd server

npx vitest run --passWithNoTests || { echo -e "$(tput setaf 1)❌Tests failed. Push aborted.$(tput sgr0)"; exit 1; }`;
  fs.writeFileSync(prePushPath, prePushHook);

  // Make hooks executable
  if (process.platform !== 'win32') {
    execSync(`chmod +x ${commitMsgPath}`, { stdio: 'inherit' });
    execSync(`chmod +x ${preCommitPath}`, { stdio: 'inherit' });
    execSync(`chmod +x ${prePushPath}`, { stdio: 'inherit' });
  }

  console.log('Husky has been set up with a commit-msg, pre-commit and pre-push hook');
} catch (error) {
  console.error('Error setting up Husky:', error);
  process.exit(1);
}
