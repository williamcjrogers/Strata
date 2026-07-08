"use client";

import { useActionState, useMemo } from "react";
import { submitEnquiry } from "@/app/(site)/contact/actions";
import { ENQUIRY_TYPES, type EnquiryState } from "@/lib/enquiry";

const initialState: EnquiryState = { status: "idle" };

const inputClasses =
  "w-full rounded-xs border border-strata-500 bg-white px-4 py-3 text-base text-ink placeholder:text-strata-400 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-strata-600";

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-strata-900">
        {label}
        {optional ? (
          <span className="ml-2 font-normal text-strata-600">(optional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm font-medium text-strata-700">
          <span aria-hidden="true">&#9888;</span> {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const startedAt = useMemo(() => Date.now(), []);

  if (state.status === "success") {
    return (
      <div role="status" className="border-t-2 border-accent bg-mist p-8">
        <h2 className="type-h3 text-strata-900">Thank you. We have your enquiry.</h2>
        <p className="mt-3 max-w-prose text-strata-700">
          A director will come back to you, usually the same working day. If the
          matter is urgent, mention that when we reply and we will prioritise it.
        </p>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.status === "error" && state.message ? (
        <p role="alert" className="border-l-2 border-strata-700 bg-mist px-4 py-3 text-sm font-medium text-strata-900">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={values.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={errors.name ? true : undefined}
            className={inputClasses}
          />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={values.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={errors.email ? true : undefined}
            className={inputClasses}
          />
        </Field>
        <Field label="Organisation" name="organisation" optional error={errors.organisation}>
          <input
            id="organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            defaultValue={values.organisation}
            className={inputClasses}
          />
        </Field>
        <Field label="Phone" name="phone" optional error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={values.phone}
            className={inputClasses}
          />
        </Field>
      </div>

      <Field label="Enquiry type" name="enquiryType" error={errors.enquiryType}>
        <select
          id="enquiryType"
          name="enquiryType"
          required
          defaultValue={values.enquiryType ?? ""}
          aria-describedby={errors.enquiryType ? "enquiryType-error" : undefined}
          className={inputClasses}
        >
          <option value="" disabled>
            Choose one
          </option>
          {ENQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Your enquiry" name="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={values.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={errors.message ? true : undefined}
          className={inputClasses}
        />
      </Field>

      <div className="flex items-start gap-3">
        <input
          id="marketingConsent"
          name="marketingConsent"
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--color-strata-600)]"
        />
        <label htmlFor="marketingConsent" className="text-sm text-strata-700">
          Keep me informed about Strata insights and market analysis. We will
          only use your email for this and you can unsubscribe at any time.
        </label>
      </div>

      <p className="text-xs text-strata-600">
        We use your details to respond to your enquiry. See our{" "}
        <a href="/privacy" className="underline underline-offset-4">
          privacy notice
        </a>
        .
      </p>

      {/* honeypot: hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input
        type="hidden"
        name="startedAt"
        value={startedAt}
        suppressHydrationWarning
      />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-xs bg-anchor px-8 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-strata-800 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
