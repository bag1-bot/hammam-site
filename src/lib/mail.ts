import nodemailer from "nodemailer";

type MailPayload = {
  subject: string;
  html: string;
  text: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendMail(payload: MailPayload) {
  const to = process.env.MAIL_TO || "blackleon1699@gmail.com";
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("[mail] SMTP not configured. Logging email instead:");
    console.warn(payload.subject);
    console.warn(payload.text);
    return { queued: false, logged: true };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  return { queued: true, logged: false };
}

export function bookingMailHtml(data: {
  name: string;
  phone: string;
  email?: string | null;
  hammamName?: string;
  preferredAt?: string | null;
  message?: string | null;
  locale: string;
}) {
  return `
    <h2>New booking request — Aslan</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email || "—")}</p>
    <p><strong>Hammam:</strong> ${escapeHtml(data.hammamName || "—")}</p>
    <p><strong>Preferred time:</strong> ${escapeHtml(data.preferredAt || "—")}</p>
    <p><strong>Message:</strong> ${escapeHtml(data.message || "—")}</p>
    <p><strong>Locale:</strong> ${escapeHtml(data.locale)}</p>
  `;
}

export function callbackMailHtml(data: {
  name: string;
  phone: string;
  locale: string;
}) {
  return `
    <h2>Callback request — Aslan</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Locale:</strong> ${escapeHtml(data.locale)}</p>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
