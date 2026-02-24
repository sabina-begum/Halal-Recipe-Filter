const fs = require("fs");
const path = require("path");
const files = getAllTsxFiles(path.join(__dirname, "..", "src"));

function getAllTsxFiles(dir, result = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllTsxFiles(fullPath, result); // go deeper
    } else if (entry.name.endsWith(".tsx")) {
      result.push(fullPath); // found one
    }
  }

  return result;
}

const filesToRefactor = files.filter((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  return content.includes("darkMode: boolean");
});

console.log(`Found ${filesToRefactor.length} files to refactor`);

filesToRefactor.forEach((filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("=> {") && !content.match(/function \w+\(/)) {
    console.log("SKIP (implicit return):", filePath);
    return;
  }
  // 1. Add import if missing
  if (
    !content.includes(
      'import { useDarkMode } from "@/contexts/DarkModeContext";',
    )
  ) {
    content =
      `import { useDarkMode } from "@/contexts/DarkModeContext";\n` + content;
  }
  // 2. Add hook inside component
  const before = content;
  content = content.replace(
    /=> \{\n/,
    `=> {\n  const { darkMode } = useDarkMode()!;\n`,
  );

  if (content === before) {
    // arrow function replace didn't match, try function declaration
    content = content.replace(
      /function \w+\([^)]*\)\s*\{\n/,
      (match) => match + `  const { darkMode } = useDarkMode()!;\n`,
    );
  }

  // 3. Remove darkMode from props
  // Solo: ({ darkMode }: { darkMode: boolean })
  content = content.replace(
    /\(\s*\{\s*darkMode\s*\}\s*:\s*\{\s*darkMode:\s*boolean\s*\}\s*\)/,
    "()",
  );

  // Mixed: , darkMode: boolean or darkMode: boolean;
  content = content.replace(/,\s*darkMode\s*:\s*boolean/, "");
  content = content.replace(/\{\s*darkMode\s*\}\s*,\s*/, "{ ");
  // 4. Remove darkMode={darkMode} from JSX
  content = content.replace(/\s*darkMode=\{darkMode\}/g, "");
  // fs.writeFileSync(filePath, content);
  console.log("WOULD REFACTOR:", filePath);
});
