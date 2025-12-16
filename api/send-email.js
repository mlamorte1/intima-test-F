export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, resultId } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "INTIMA <results@flowgenicscoaching.com>",
        to: email,
        subject: "Your INTIMA results are ready",
        html: `
          <p>Hello,</p>
          <p>Your INTIMA suggestibility results are ready.</p>
          <p><strong>Combined score:</strong> ${resultId}</p>
          <p>Thank you for completing the assessment.</p>
          <p>— INTIMA</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
