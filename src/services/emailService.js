import nodemailer from "nodemailer";
import config from "../config/index.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
});

export async function renderTemplate(templateName, payload = {}) {
  const file = path.join(__dirname, "..", "Templates", "Emails", `${templateName}.ejs`);
  return ejs.renderFile(file, payload);
}

export async function sendEmail(to, subject, htmlContent) {
  const message = {
    from: "Event Hub <noreply@eventhub.com>",
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}


export async function sendUserRegistrationEmail(userEmail, userName) {
  const htmlContent = await renderTemplate("userRegistration", { userName });
  await sendEmail(
    userEmail,
    "Welcome to Event Hub!",
    htmlContent
  );
}

export async function sendWelcomeEmail(userEmail, userName) {
  // alias for backward compatibility with controllers that call sendWelcomeEmail
  return sendUserRegistrationEmail(userEmail, userName);
}


export async function sendEventRegistrationEmail(userEmail, eventName, eventDate, eventLocation) {
  const htmlContent = await renderTemplate("eventRegistration", {
    eventName,
    eventDate,
    eventLocation,
  });
  await sendEmail(
    userEmail,
    `You’re registered for ${eventName}!`,
    htmlContent
  );
}


export async function sendEventCancellationEmail(userEmail, eventName, reason = "unforeseen circumstances") {
  const htmlContent = await renderTemplate("eventCancellation", {
    eventName,
    reason,
  });
  await sendEmail(
    userEmail,
    `Important: ${eventName} has been cancelled`,
    htmlContent
  );
}

export default {
  renderTemplate,
  sendEmail,
  sendUserRegistrationEmail,
  sendWelcomeEmail,
  sendEventRegistrationEmail,
  sendEventCancellationEmail,
};
