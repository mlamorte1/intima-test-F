import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, resultId } = req.body;

  if (!email || !resultId) {
    return res.status(400).json({ error: "Missing email or resultId" });
  }

  try {
    const resultLink = `https://${process.env.VERCEL_URL}/result.html?id=${resultId}`;

    await resend.emails.send({
      from: "INTIMA <results@flowgenicscoaching.com>",
      to: email,
      subject: "Your INTIMA results are ready",
      html: `
        <p>Hello,</p>
        <p>Your INTIMA suggestibility results are ready.</p>
        <p>
          <a href="${resultLink}">
            Click here to view your results
          </a>
        </p>
        <p>This link is private and intended only for you.</p>
        <p>— INTIMA</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
