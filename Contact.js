// api/contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, phone, address, message } = req.body || {};
  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Build a simple HTML email
  const html = `
    <h2>New Cloud9Blinds Quote Request</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Address:</b> ${address}</p>
    <p><b>Message:</b> ${message || ''}</p>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,    // e.g. notifications@cloud9blinds.ca
        to: process.env.TO_EMAIL,        // your real inbox
        subject: 'New Cloud9Blinds Quote Request',
        html,
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: 'Resend failed', detail: txt });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Email error' });
  }
}
