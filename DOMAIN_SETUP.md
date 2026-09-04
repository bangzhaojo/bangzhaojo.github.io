# Connect bangzhaoshu.com to GitHub Pages

Do this only after `https://bangzhaojo.github.io` displays the finished site correctly.

## 1. Verify the domain in GitHub

In GitHub, open **Settings → Pages → Add a domain**, enter `bangzhaoshu.com`, and copy the TXT record GitHub provides. Add that TXT record in the Squarespace domain DNS panel and complete verification in GitHub. Keep this TXT record after verification.

## 2. Add the custom domain to the website repository

Open the `bangzhaojo.github.io` repository, then **Settings → Pages**. Under **Custom domain**, enter `www.bangzhaoshu.com` and save it.

## 3. Replace only the Squarespace web-hosting records

In the Squarespace domain dashboard, open **DNS → DNS Settings → Custom Records**. Preserve all email-related MX and TXT records. Remove only conflicting Squarespace website A/CNAME records, then add:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `bangzhaojo.github.io` |

Do not add wildcard DNS records.

## 4. Wait and verify

DNS changes may take up to 24 hours. Verify that both `https://bangzhaoshu.com` and `https://www.bangzhaoshu.com` load the new site and that one redirects cleanly to the other.

## 5. Enable HTTPS

Return to the repository’s **Settings → Pages** and enable **Enforce HTTPS** when GitHub makes the option available.

## 6. End the old website subscription

Only after the new site and HTTPS work correctly, cancel the Squarespace **website** subscription if desired. Keep the Squarespace **domain** subscription active so you retain ownership of `bangzhaoshu.com`.
