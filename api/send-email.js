// api/send-email.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Textos por idioma (30-jul-2026: el email ahora respeta el idioma del test;
// los resultados vienen ya localizados desde el front en resultTitle/resultText)
const STRINGS = {
  en: {
    subject: (t) => `Your INTIMA Results – ${t}`,
    greeting: (n) => `Hi ${n}, your INTIMA results are ready ✨`,
    thanks: `Thank you for taking the <strong>INTIMA Suggestibility Test</strong>. Based on your responses, here\u2019s a snapshot of your suggestibility profile:`,
    whatTitle: `What does this mean?`,
    whatText: `This insight gives you a powerful starting point for personal growth, decision-making, and deeper self-awareness.`,
    cta: `Continue your journey with Michelangelo AI \u2192`,
    footer: `You received this email because you took the INTIMA Suggestibility Test.`,
    plain: (n, p, e, t, x) => `Hi ${n},\n\nYour INTIMA test results are ready.\n\nPhysical: ${p}%\nEmotional: ${e}%\n\n${t}\n${x}\n\nhttps://www.flowgenicscoaching.com`,
  },
  es: {
    subject: (t) => `Tus resultados INTIMA – ${t}`,
    greeting: (n) => `Hola ${n}, tus resultados INTIMA están listos ✨`,
    thanks: `Gracias por tomar el <strong>Test de Sugestionabilidad INTIMA</strong>. Con base en tus respuestas, este es un vistazo de tu perfil de sugestionabilidad:`,
    whatTitle: `¿Qué significa esto?`,
    whatText: `Este hallazgo te da un punto de partida poderoso para tu crecimiento personal, tus decisiones y un autoconocimiento más profundo.`,
    cta: `Continúa tu proceso con Michelangelo AI \u2192`,
    footer: `Recibiste este email porque tomaste el Test de Sugestionabilidad INTIMA.`,
    plain: (n, p, e, t, x) => `Hola ${n},\n\nTus resultados del test INTIMA están listos.\n\nFísica: ${p}%\nEmocional: ${e}%\n\n${t}\n${x}\n\nhttps://www.flowgenicscoaching.com`,
  },
};

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
    resultText,
    subscribed,
    lang,
    client_id,
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const L = STRINGS[lang === "es" ? "es" : "en"];

  // CTA condicional: si el test vino de Michelangelo AI (hay client_id), el
  // botón lleva al chat canónico. Standalone: sin botón (el "Book Your Free
  // Session" fue retirado el 30-jul — no correspondía al modelo actual).
  const ctaBlock = client_id
    ? `
          <tr>
            <td align="center" style="padding-top:32px;">
              <table cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" bgcolor="#facc15" style="border-radius: 999px;">
                    <a href="https://michelangeloai.flowgenicscoaching.com/chat"
                       target="_blank"
                       style="font-size:16px; font-family: sans-serif; font-weight: bold; text-decoration: none;
                              color: #050509; background-color: #facc15; padding: 14px 28px; display: inline-block; border-radius: 999px;">
                      ${L.cta}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  try {
    console.log("\ud83d\udce9 Newsletter opt-in:", subscribed, "| lang:", lang, "| M AI:", !!client_id);
    await resend.emails.send({
      from: "INTIMA Test <results@flowgenicscoaching.com>",
      to: email,
      subject: L.subject(resultTitle),

      // Plain-text fallback
      text: L.plain(name, physicalPercent, emotionalPercent, resultTitle, resultText),

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
            <td align="center" style="padding-bottom: 16px;">
              <img src="https://intima-test-f.vercel.app/flowgenics-logo.png"
                   width="180" alt="Flowgenics Logo"
                   style="max-width: 100%; height: auto;" />
            </td>
          </tr>

          <tr>
            <td style="text-align:center;padding-bottom:24px;">
              <h1 style="font-weight:400;letter-spacing:0.5px;color:#facc15;">
                ${L.greeting(name)}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="font-size:16px;line-height:1.6;padding-bottom:24px;">
              ${L.thanks}
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
              <strong>${L.whatTitle}</strong><br><br>
              ${L.whatText}
            </td>
          </tr>
${ctaBlock}

          <tr>
            <td style="padding-top:32px;font-size:12px;color:#bfae7a;text-align:center;">
              ${L.footer}<br>
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
    console.error("\u274c Resend error:", error);
    res.status(500).json({ error: "Email failed to send" });
  }
};
  











