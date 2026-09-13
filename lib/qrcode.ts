// lib/qrcode.ts
import QRCode from "qrcode";
import { randomBytes } from "crypto";

export function generateQrToken(): string {
  return randomBytes(12).toString("hex");
}

export function buildVerifyUrl(qrToken: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, "")}/verify/${qrToken}`;
}

/** Returns a data: URL PNG suitable for <img src=...> or embedding in a PDF certificate. */
export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: { dark: "#0B1220", light: "#FFFFFF" }
  });
}
