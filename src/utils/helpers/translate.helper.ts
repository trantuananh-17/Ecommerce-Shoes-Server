import { translate } from "@vitalets/google-translate-api";

export async function translateViEn(
  text: string,
  lang: string
): Promise<{ textVi: string; textEn: string }> {
  let textVi = "";
  let textEn = "";

  if (lang.startsWith("vi")) {
    textVi = text;
    const res = await translate(text, { from: "vi", to: "en" });
    textEn = res.text;
  } else {
    textEn = text;
    const res = await translate(text, { from: "en", to: "vi" });
    textVi = res.text;
  }

  return { textVi, textEn };
}
