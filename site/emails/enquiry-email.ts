/* Branded HTML for enquiry notification emails. Plain string template:
   one internal notification does not justify a component library. */

export type EnquiryData = {
  name: string;
  email: string;
  organisation?: string;
  phone?: string;
  enquiryType: string;
  message: string;
  marketingConsent: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 16px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#0e4f3f;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 16px;font-size:14px;color:#001a16;">${escapeHtml(value)}</td>
  </tr>`;
}

export function enquiryEmailHtml(data: EnquiryData): string {
  return `<!doctype html>
<html lang="en-GB">
  <body style="margin:0;padding:0;background:#fafaf7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;">
      <tr>
        <td style="background:#002924;padding:24px 16px;">
          <p style="margin:0;color:#fafaf7;font-size:18px;font-weight:bold;letter-spacing:0.02em;">Strata Cost Consulting</p>
          <p style="margin:4px 0 0;color:#99cbb8;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">Website enquiry</p>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;padding:16px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Name", data.name)}
            ${row("Email", data.email)}
            ${data.organisation ? row("Organisation", data.organisation) : ""}
            ${data.phone ? row("Phone", data.phone) : ""}
            ${row("Enquiry type", data.enquiryType)}
            ${row("Marketing opt-in", data.marketingConsent ? "Yes" : "No")}
          </table>
          <div style="margin:16px;padding:16px;background:#ecf5f1;border-left:3px solid #3d8a72;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#001a16;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px;color:#0e4f3f;font-size:12px;">Reply directly to this email to respond to the enquirer.</td>
      </tr>
    </table>
  </body>
</html>`;
}
