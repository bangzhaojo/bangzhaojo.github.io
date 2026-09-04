# Bangzhao Shu — personal academic website

This is a dependency-free static website prepared for GitHub Pages. It includes the public content and images from the current Squarespace website.

## Preview locally

Open `index.html` in a browser or serve the folder with any local static-file server.

## Publish with GitHub Pages

1. Create a public GitHub repository named `bangzhaojo.github.io`.
2. Add these files to the root of that repository and push the `main` branch.
3. In the repository, open **Settings → Pages** and publish from the `main` branch at `/ (root)`.
4. Confirm the site works at `https://bangzhaojo.github.io` before changing domain DNS.
5. Add `www.bangzhaoshu.com` as the custom domain in GitHub Pages, then update the Squarespace-managed DNS records to point to GitHub Pages.
6. Enable **Enforce HTTPS** after GitHub issues the certificate.

Do not cancel the Squarespace domain subscription. The website subscription can be canceled only after the GitHub-hosted site and both domain variants have been verified.

See `DOMAIN_SETUP.md` for the exact cutover checklist.
