export const ENQUIRY_TYPES = [
  "Cost consultancy",
  "Claims and disputes",
  "Bank monitoring",
  "Careers",
  "Other",
] as const;

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};
