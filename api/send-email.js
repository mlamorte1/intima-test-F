// api/send-email.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
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

      // Plain-text fallback (VERY IMPORTANT)
      text: `Hi ${name},

Your INTIMA test results are ready.

Physical: ${physicalPercent}%
Emotional: ${emotionalPercent}%

${resultTitle}
${resultText}

Visit https://www.flowgenicscoaching.com to book your free session.`,

      // HTML email
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>INTIMA Results</title>
</head>
<body style="margin:0;padding:0;background:#0b0b0b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0b;padding:24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:600px;background:radial-gradient(circle at top,#1a1208,#050509);
          border-radius:16px;padding:32px;color:#fef9c3;font-family:Georgia, serif;">

          <tr>
            <td style="text-align:center;padding-bottom:24px;">
              <h1 style="font-weight:400;letter-spacing:0.5px;color:#facc15;">
                Hi ${name}, your INTIMA results are ready ✨
              </h1>
            </td>
          </tr>

          <tr>
            <td style="font-size:16px;line-height:1.6;padding-bottom:24px;">
              Thank you for taking the <strong>INTIMA Suggestibility Test</strong>.
              Based on your responses, here’s a snapshot of your suggestibility profile:
            </td>
          </tr>

          <tr>
            <td style="background:rgba(255,255,255,0.04);border-radius:14px;
              padding:24px;text-align:center;">
              <img src="https://intima-test-f.vercel.app/intima-logo.png"
                   width="90" alt="INTIMA" style="margin-bottom:16px;" />
              <h2 style="color:#facc15;margin:12px 0;">${resultTitle}</h2>
              <p style="font-size:15px;line-height:1.6;">
                ${resultText}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:28px;font-size:15px;line-height:1.6;">
              <strong>What does this mean?</strong><br><br>
              This insight gives you a powerful starting point for personal growth,
              decision-making, and deeper self-awareness.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:32px;">
              <tr>
  <td align="center" style="padding-top:32px;">
    <table cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" bgcolor="#facc15" style="border-radius: 999px;">
          <a href="https://www.flowgenicscoaching.com"
             target="_blank"
             style="font-size:16px; font-family: sans-serif; font-weight: bold; text-decoration: none;
                    color: #050509; background-color: #facc15; padding: 14px 28px; display: inline-block; border-radius: 999px;">
            Book Your Free Session →
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>


          <tr>
            <td style="padding-top:32px;font-size:12px;color:#bfae7a;text-align:center;">
              You received this email because you took the free INTIMA Suggestibility Test.<br>
              <a href="https://www.flowgenicscoaching.com"
                 style="color:#facc15;text-decoration:none;">
                www.flowgenicscoaching.com
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Resend error:", error);
    res.status(500).json({ error: "Email failed to send" });
  }
};

  








