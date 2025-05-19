import xlsx from "xlsx";
import fs from "fs";
import path from "path";

// Paths
const baseDir = "src/locales";
const langs = ["en", "th", "cn", "jp"];

// Ensure folders exist
langs.forEach((lang) => {
  const dirPath = path.join(baseDir, lang);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Load and convert Excel
const workbook = xlsx.readFile(`${baseDir}/translations.xlsx`);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

const translations = { en: {}, th: {}, cn: {}, jp: {} };

data.forEach((row) => {
  const rawKey = row.id;
  const key = rawKey.replace(/\s+/g, "");

  translations.en[key] = row.en;
  translations.th[key] = row.th;
  translations.cn[key] = row.cn;
  translations.jp[key] = row.jp;
});

// Write to JSON files
langs.forEach((lang) => {
  fs.writeFileSync(
    path.join(baseDir, lang, "translation.json"),
    JSON.stringify(translations[lang], null, 2)
  );
});

console.log("✅ Translation JSONs generated.");
