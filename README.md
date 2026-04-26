# POLYAMORY website

A Daft Punk-inspired archive/store site built around the provided press image.

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Editable backend

This package includes a Decap CMS scaffold:

- `admin/index.html`
- `admin/config.yml`
- editable content in `data/site.json`

For production, deploy to Netlify or another static host and connect Git Gateway / GitHub auth. Editors can then visit `/admin` and update:

- homepage copy
- archive cards
- live dates
- merch products
- social/video links

## Integrations

- Mailing list: connect the form in `index.html` / `script.js` to Klaviyo, Mailchimp, Shopify Forms, or a custom endpoint.
- Shopify: replace product anchors with Shopify Buy Button SDK, Hydrogen routes, or direct product URLs.
- Meta Pixel / GA4: add IDs inside `script.js`.


## Backend access

This static package includes a Decap CMS admin scaffold at `/admin`. To make it editable by non-technical users:

1. Push this folder to a GitHub repository.
2. Deploy the repo on Netlify.
3. In Netlify, enable Identity and Git Gateway.
4. Invite editors in Netlify Identity.
5. Editors log in at `https://your-domain.com/admin` and edit `data/site.json` through the CMS.

Until it is deployed with Netlify Identity/Git Gateway, `/admin` is present but cannot save changes locally from the browser. Developers can edit `data/site.json` directly.

## What changed in this version

- Mailing list is now a primary launch module in the hero and first post-hero section.
- YouTube videos play in a side player.
- Added second YouTube video: `HDwookIE2nI`.
- `data/site.json` now has a `videos` collection for CMS editing.
