import crypto from "crypto";
import qs from "qs";

function sortObject(
  obj: Record<string, string | number>
): Record<string, string> {
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, string> = {};
  for (const k of sortedKeys) {
    result[encodeURIComponent(k)] = encodeURIComponent(String(obj[k])).replace(
      /%20/g,
      "+"
    );
  }
  return result;
}

export function signVnpayPayload(
  payload: Record<string, string | number>,
  secretKey: string
) {
  const sorted = sortObject(payload);
  const signData = qs.stringify(sorted, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  return { sorted, signed };
}

export function getClientIp(req: import("express").Request): string {
  const xfwd = (req.headers["x-forwarded-for"] as string) || "";
  const first = xfwd.split(",")[0]?.trim();
  return first || req.socket.remoteAddress || "127.0.0.1";
}

export function verifyVnpSignature(
  params: Record<string, string | undefined>,
  secretKey: string
): boolean {
  const clone: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) clone[k] = v;
  }
  const secureHash = clone["vnp_SecureHash"];
  delete clone["vnp_SecureHash"];
  delete clone["vnp_SecureHashType"];

  const { signed } = signVnpayPayload(clone, secretKey);
  return secureHash === signed;
}
