import { exec, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function checkTyposInstalled() {
  try {
    execSync('typos --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('Typos CLI tool is not installed, aborting typo check.');
    console.log(
      "If you want to install it, you can run 'brew install typos-cli'",
    );
    process.exit(0);
  }
}

function getFiles(args) {
  return args.length === 0 ? ['.'] : args;
}

function filterFiles(files) {
  const IGNORE_EXTENSIONS = [
    'png',
    'snap',
    'jpg',
    'gql',
    'json',
    'log',
    'yml',
    'xml',
    'svg',
  ];
  return files.filter((file) => {
    const ext = path.extname(file).slice(1);
    return !IGNORE_EXTENSIONS.includes(ext);
  });
}

function convertToRelativePaths(files) {
  const currentDir = process.cwd();
  return files.map((file) => path.relative(currentDir, file));
}

function runTyposOnFiles(files) {
  if (files.length === 0) {
    console.log('No files to check.');
    return;
  }
  try {
    execSync(`typos ${files.join(' ')}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running typos:', error.message);
    process.exit(1);
  }
}

// Main execution
checkTyposInstalled();
const absolutePathFiles = getFiles(process.argv.slice(2));
const filteredFiles = filterFiles(absolutePathFiles);
const relativeFiles = convertToRelativePaths(filteredFiles);
runTyposOnFiles(relativeFiles);
