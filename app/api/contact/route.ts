import { NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";
// import { getSanityClient } from "@/lib/getSanityClient"; // optional

export async function POST(req: Request) {
  try {
    const { name, email, message, token } = await req.json();

    // Validate required fields
    if (!name || !email || !message || !token) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Verify Turnstile token
    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY!,
          response: token,
        }),
      }
    );
    const data = await verify.json();

    console.log("Turnstile verification:", data); // Debug log

    if (!data.success) {
      return NextResponse.json(
        { error: "Bot verification failed", details: data["error-codes"] },
        { status: 400 }
      );
    }

    // 2️⃣ Optional: Save to Sanity
    /*
    const client = getSanityClient();
    await client.create({
      _type: "contactSubmission",
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });
    */

    // 3️⃣ Send email via Fastmail
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `New contact form message`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
