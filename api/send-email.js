import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, physicalPercent, emotionalPercent } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    await resend.emails.send({
      from: "INTIMA <results@flowgenicscoaching.com>",
      to: email,
      subject: "Your INTIMA Results",
      html: `
        <h2>Your INTIMA Suggestibility Results</h2>
        <p><strong>Physical Suggestibility:</strong> ${physicalPercent}%</p>
        <p><strong>Emotional Suggestibility:</strong> ${emotionalPercent}%</p>
        <p>Thank you for taking the INTIMA test.</p>
        <p>— Flowgenics Coaching</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email failed" });
  }
}


