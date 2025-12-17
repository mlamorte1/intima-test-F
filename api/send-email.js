// api/send-email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    name,
    email,
    physicalPercent,
    emotionalPercent,
    resultTitle,
    resultText
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await resend.emails.send({
      from: "INTIMA Test <results@flowgenicscoaching.com>",
      to: email,
      subject: `Your INTIMA Results – ${resultTitle}`,
      html: `
        <div style="background:#0f0f0f; color:#fef9c3; font-family:sans-serif; padding:24px;">
          <img src="https://intima-test-f.vercel.app/intima-logo.png" alt="INTIMA Logo" style="width:100px; margin-bottom: 12px;" />
          <h2 style="color: #fef9c3;">Hi ${name},</h2>
          <p>Thanks for taking the INTIMA Suggestibility Test. Here's a snapshot of your results:</p>
          <p><strong>🧠 Physical Suggestibility:</strong> ${physicalPercent}%<br/>
          <strong>💞 Emotional Suggestibility:</strong> ${emotionalPercent}%</p>
          <h3 style="margin-top: 20px; color: #facc15;">${resultTitle}</h3>
          <p>${resultText}</p>
          <p style="margin-top: 24px;">Want to learn more about how to use your suggestibility profile for growth?</p>
          <a href="https://flowgenicscoaching.com" style="display:inline-block; background:#facc15; color:#000000; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight: bold; margin-top:12px;">
            Book Your Free Session →
          </a>
          <p style="margin-top: 32px; font-size: 13px; color: #888888;">
            You received this email because you took the INTIMA test.<br/>
            <a href="https://flowgenicscoaching.com" style="color:#facc15;">flowgenicscoaching.com</a>
          </p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Resend error:", error);
    res.status(500).json({ error: "Email failed to send" });
  }
}




