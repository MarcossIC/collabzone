import { execSync } from 'child_process';

// Verifica si 'yamllint' está instalado
try {
  execSync('yamllint --version', { stdio: 'ignore' });
} catch {
  console.log('YamlLint CLI tool is not installed, aborting YAML linter.');
  console.log("If you want to install it, you can run 'brew install yamllint'");
  process.exit(0); // No fallamos si no está instalado
}

// Obtén la lista de archivos a analizar o usa el directorio actual
let files = '.';
if (process.argv.length > 2) {
  const currentDir = process.cwd();
  files = process.argv
    .slice(2)
    .map((file) =>
      file.startsWith(currentDir) ? file.slice(currentDir.length + 1) : file,
    )
    .filter((file) => existsSync(file)) // Filtra archivos que existen
    .join(' ');
}

// Ejecuta yamllint en los archivos especificados
try {
  execSync(`yamllint ${files}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error al ejecutar yamllint:', error.message);
  process.exit(1); // Fallamos si hay un error en yamllint
}
