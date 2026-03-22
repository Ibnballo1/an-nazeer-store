export function resetPasswordEmailHtml({
  name,
  url,
}: {
  name: string;
  url: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f5f0;font-family:'DM Sans',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f5f0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#0f7a3a;border-radius:12px;padding:10px 14px;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">
                      🌿 An-Nazeer
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin:8px 0 0;color:#888;font-size:12px;">Holistic Home Ltd</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:20px;border:1px solid #e8e8e8;padding:40px 36px;">

              <!-- Heading -->
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111111;line-height:1.3;">
                Reset your password
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#666666;line-height:1.6;">
                Hi ${name ?? "there"},
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#444444;line-height:1.7;">
                We received a request to reset the password for your
                An-Nazeer account. Click the button below to choose a
                new password. This link will expire in
                <strong>1 hour</strong>.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    
                      href="${url}"
                      style="
                        display:inline-block;
                        background-color:#0f7a3a;
                        color:#ffffff;
                        font-size:15px;
                        font-weight:600;
                        text-decoration:none;
                        padding:14px 32px;
                        border-radius:12px;
                        letter-spacing:0.1px;
                      "
                    >
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <p style="margin:0 0 8px;font-size:13px;color:#888888;line-height:1.6;">
                If the button above doesn&apos;t work, copy and paste
                this link into your browser:
              </p>
              <p style="margin:0 0 28px;word-break:break-all;">
                
                  href="${url}"
                  style="font-size:12px;color:#0f7a3a;text-decoration:underline;"
                >
                  ${url}
                </a>
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #eeeeee;margin:0 0 24px;" />

              <!-- Security note -->
              <p style="margin:0;font-size:13px;color:#999999;line-height:1.6;">
                If you did not request a password reset, you can safely
                ignore this email. Your password will not be changed.
                For security concerns, please contact us at
                
                  href="mailto:hello@an-nazeer.com"
                  style="color:#0f7a3a;text-decoration:none;"
                >
                  hello@an-nazeer.com
                </a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                © ${new Date().getFullYear()} An-Nazeer Holistic Home Ltd · Lagos, Nigeria
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:#aaaaaa;">
                NAFDAC Approved Natural Herbal Wellness
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}
