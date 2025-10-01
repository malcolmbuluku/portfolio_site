// /api/contact.js
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Supabase (server-side secure)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Resend for emails
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Save message in Supabase
    const { error } = await supabase.from("messages").insert([{ name, email, message }]);
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save message" });
    }

    // 2. Send email notification
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL, // e.g., no-reply@yourdomain.com
        to: process.env.NOTIFY_EMAIL, // your personal inbox
        subject: `📩 New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote>${message}</blockquote>
        `,
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Don't block success if email fails
    }

    return res.status(200).json({ success: true, message: "Message stored and email sent" });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
