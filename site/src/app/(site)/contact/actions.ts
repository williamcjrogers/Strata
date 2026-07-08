"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { enquiryEmailHtml } from "../../../../emails/enquiry-email";
import { ENQUIRY_TYPES, type EnquiryState } from "@/lib/enquiry";
import { hashKey, isRateLimited } from "@/lib/rate-limit";

const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address."),
  organisation: z.string().max(120).optional(),
  phone: z.string().max(30).optional(),
  enquiryType: z.enum(ENQUIRY_TYPES, "Please choose an enquiry type."),
  message: z
    .string()
    .min(10, "Please tell us a little more about the enquiry.")
    .max(5000),
  marketingConsent: z.boolean(),
  // anti-spam: honeypot must stay empty; the form must take over 3s
  website: z.literal(""),
  startedAt: z.coerce.number(),
});

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    organisation: String(formData.get("organisation") ?? "") || undefined,
    phone: String(formData.get("phone") ?? "") || undefined,
    enquiryType: String(formData.get("enquiryType") ?? ""),
    message: String(formData.get("message") ?? ""),
    marketingConsent: formData.get("marketingConsent") === "on",
    website: String(formData.get("website") ?? ""),
    startedAt: formData.get("startedAt") ?? "0",
  };

  const values: Record<string, string> = {
    name: raw.name,
    email: raw.email,
    organisation: raw.organisation ?? "",
    phone: raw.phone ?? "",
    enquiryType: raw.enquiryType,
    message: raw.message,
  };

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    // honeypot or time-trap failures present as success to bots
    const flat = z.flattenError(parsed.error);
    if (flat.fieldErrors.website) return { status: "success" };
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const [field, messages] of Object.entries(flat.fieldErrors)) {
      if (messages && messages.length > 0) fieldErrors[field] = messages[0];
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  if (Date.now() - parsed.data.startedAt < 3000) {
    return { status: "success" };
  }

  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (isRateLimited(await hashKey(ip))) {
    return {
      status: "error",
      message:
        "Too many enquiries from this connection. Please try again shortly or email us directly.",
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[contact] RESEND_API_KEY absent; enquiry logged:", {
      ...parsed.data,
      website: undefined,
      startedAt: undefined,
    });
    return { status: "success" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
      to: process.env.CONTACT_TO_EMAIL ?? "delivered@resend.dev",
      replyTo: parsed.data.email,
      subject: `Website enquiry: ${parsed.data.name} (${parsed.data.enquiryType})`,
      html: enquiryEmailHtml(parsed.data),
    });
    if (error) throw new Error(error.message);
    return { status: "success" };
  } catch (err) {
    console.error("[contact] send failed:", err);
    return {
      status: "error",
      message:
        "Something went wrong sending your enquiry. Please try again or email us directly.",
      values,
    };
  }
}
