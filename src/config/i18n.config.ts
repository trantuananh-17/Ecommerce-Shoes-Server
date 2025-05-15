import i18n from "i18n";
import path from "path";

i18n.configure({
  locales: ["en", "vi"],
  directory: path.join(__dirname, "../locales"),
  defaultLocale: "vi",
  queryParameter: "lang",
  header: "accept-language",
  objectNotation: true,
});

export default i18n;
