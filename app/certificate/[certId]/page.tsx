import { notFound } from "next/navigation";
import { generateQrDataUrl, buildVerifyUrl } from "@/lib/qrcode";
import { getMissionById } from "@/lib/scenarios";
import { db } from "@/lib/db";

// Server component: looks up the real Certificate row by its qrToken
// (the [certId] in the URL) and renders it with a freshly generated QR.
export default async function CertificatePage({ params }: { params: { certId: string } }) {
  const cert = await db.certificate.findUnique({
    where: { qrToken: params.certId },
    include: { worker: true }
  });

  if (!cert) {
    notFound();
  }

  const mission = getMissionById(cert.missionId);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const verifyUrl = buildVerifyUrl(cert.qrToken, baseUrl);
  const qrDataUrl = await generateQrDataUrl(verifyUrl);

  return (
    <main className="min-h-screen bg-void text-paper flex items-center justify-center px-6 py-12">
      <div className="bg-steel border border-steelLine rounded-panel max-w-md w-full p-8 text-center">
        <p className="mono text-xs text-signal mb-2">CERTIFICATE OF COMPLETION</p>
        <h1 className="display text-2xl font-bold mb-1">{cert.worker.name}</h1>
        <p className="text-mist mb-6">
          {mission ? `${mission.emoji} ${mission.title}` : cert.missionId}
        </p>

        <div className="bg-white rounded-panel p-4 inline-block mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="Certificate verification QR code" width={200} height={200} />
        </div>

        <div className="text-sm text-mist space-y-1 mb-6">
          <p>Issued {cert.issuedAt.toDateString()}</p>
          <p>Valid until {cert.expiresAt.toDateString()}</p>
        </div>

        <p className="mono text-xs text-mist break-all">{verifyUrl}</p>
      </div>
    </main>
  );
}
