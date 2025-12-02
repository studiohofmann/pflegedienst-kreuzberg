"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey?: string; callback?: (token: string) => void }
      ) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tryRender = () => {
      if (
        typeof window !== "undefined" &&
        window.turnstile &&
        containerRef.current
      ) {
        window.turnstile.render(containerRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback: (token: string) => setToken(token),
        });
      }
    };

    if (typeof window !== "undefined" && window.turnstile) tryRender();
    else setTimeout(tryRender, 500);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token) {
      setStatus("Please complete the verification.");
      return;
    }

    setStatus("Sending…");

    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          token,
        }),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        e.currentTarget.reset();
        // Reset Turnstile widget
        if (typeof window !== "undefined" && window.turnstile) {
          window.turnstile.reset();
        }
        setToken("");
      } else {
        const data = await res.json();
        setStatus(`❌ Error: ${data.error || "Failed to send message"}`);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("❌ Network error. Please try again.");
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name & Vorname" required />
        <input name="email" type="email" placeholder="Email-Adresse" required />
        <textarea name="message" placeholder="Nachricht..." required />
        <div className="flex items-center justify-center gap-4">
          <div ref={containerRef} /> {/* Turnstile widget renders here */}
          <button type="submit">senden</button>
        </div>
        <p>{status}</p>
      </form>
    </>
  );
}
