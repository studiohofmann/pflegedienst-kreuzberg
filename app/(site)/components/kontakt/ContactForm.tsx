"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey?: string; callback?: (token: string) => void }
      ) => string | number;
      reset: (widgetId?: string | number) => void;
      execute: (widgetId: string | number) => void;
    };
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | string | null>(null);
  const pendingFormRef = useRef<FormData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const verifyTimerRef = useRef<number | null>(null);
  const verifyTimedOutRef = useRef<boolean>(false);

  // Submit form helper (moved above renderWidget so renderWidget can depend on it)
  const submitForm = useCallback(
    async (fd: FormData, tokenToUse?: string) => {
      setIsSending(true);
      setStatus("Sending…");

      try {
        const body = JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          token: tokenToUse ?? token,
        });
        console.log("Submitting contact with body:", body);

        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });

        if (res.ok) {
          setStatus("✅ Message sent successfully!");
          // clear form fields
          formRef.current?.reset();
          // Reset Turnstile widget
          if (typeof window !== "undefined" && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current ?? undefined);
          }
          setToken("");
        } else {
          const text = await res.text();
          console.warn("/api/contact returned non-ok:", res.status, text);
          try {
            const data = JSON.parse(text);
            setStatus(`❌ Error: ${data.error || "Failed to send message"}`);
          } catch {
            setStatus(
              `❌ Error: Failed to send message (status ${res.status})`
            );
          }
        }
      } catch (error) {
        console.error("Contact form error:", error);
        setStatus("❌ Network error. Please try again.");
      } finally {
        setIsSending(false);
      }
    },
    [token]
  );

  // Render the Turnstile widget once the script is loaded. We also keep
  // a pending form reference so an invisible widget can be executed on submit
  // and we auto-submit when the token arrives.
  const renderWidget = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.turnstile &&
      containerRef.current
    ) {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (tkn: string) => {
          console.log("turnstile callback token:", tkn);
          setToken(tkn);
          setIsVerifying(false);
          if (verifyTimerRef.current) {
            clearTimeout(verifyTimerRef.current);
            verifyTimerRef.current = null;
          }
          // if we were waiting for verification, submit the pending form
          if (pendingFormRef.current) {
            const fd = pendingFormRef.current;
            pendingFormRef.current = null;
            verifyTimedOutRef.current = false;
            void submitForm(fd, tkn);
          }
        },
      });
      console.log("turnstile rendered, widgetId=", widgetIdRef.current);
    }
  }, [submitForm]);

  useEffect(() => {
    // small retry in case the script loads shortly after mount
    if (typeof window !== "undefined" && window.turnstile) renderWidget();
    else {
      const id = setTimeout(() => renderWidget(), 500);
      return () => clearTimeout(id);
    }
  }, [renderWidget]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    // if we already have a token, submit immediately
    if (token) {
      void submitForm(fd);
      return;
    }

    // otherwise, store the form and execute the invisible widget
    pendingFormRef.current = fd;
    setIsVerifying(true);
    setStatus("Please complete verification…");

    if (
      typeof window !== "undefined" &&
      window.turnstile &&
      widgetIdRef.current != null
    ) {
      console.log("executing turnstile widget", widgetIdRef.current);
      window.turnstile.execute(widgetIdRef.current);
      // start a timeout in case verification doesn't return
      if (verifyTimerRef.current) {
        clearTimeout(verifyTimerRef.current);
      }
      verifyTimerRef.current = window.setTimeout(() => {
        verifyTimerRef.current = null;
        setIsVerifying(false);
        verifyTimedOutRef.current = true;
        setStatus("Verification timed out — please try again.");
        console.warn("Turnstile verification timed out");
      }, 12000);
    } else {
      // widget not ready yet; try to render now and execute after
      renderWidget();
      if (
        typeof window !== "undefined" &&
        window.turnstile &&
        widgetIdRef.current != null
      ) {
        console.log(
          "executing turnstile widget after render",
          widgetIdRef.current
        );
        window.turnstile.execute(widgetIdRef.current);
        if (verifyTimerRef.current) {
          clearTimeout(verifyTimerRef.current);
        }
        verifyTimerRef.current = window.setTimeout(() => {
          verifyTimerRef.current = null;
          setIsVerifying(false);
          verifyTimedOutRef.current = true;
          setStatus("Verification timed out — please try again.");
          console.warn("Turnstile verification timed out (post-render)");
        }, 12000);
      }
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />
      <form ref={formRef} onSubmit={handleSubmit}>
        <input name="name" placeholder="Name & Vorname" required />
        <input name="email" type="email" placeholder="Email-Adresse" required />
        <textarea name="message" placeholder="Nachricht..." required />
        <div className="flex items-center justify-center gap-4">
          {/* Turnstile needs a container element but it can be off-screen when invisible */}
          <div
            ref={containerRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              left: -9999,
            }}
          />
          <button type="submit" disabled={isVerifying || isSending}>
            {isVerifying ? "Verifying…" : isSending ? "Sending…" : "senden"}
          </button>
        </div>
        <p>{status}</p>
      </form>
    </>
  );
}
