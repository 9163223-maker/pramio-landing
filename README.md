# PRAMIO Landing

Public marketing site for PRAMIO services and the own product AdminKit.

## What is inside

- `index.html` — main marketing page with services, work process, AdminKit and the contact form.
- `services/` — individual SEO landing pages for five service directions.
- `privacy/` — personal-data processing policy linked from the form.
- `styles.css` plus fix CSS files — visual style, glass effects, responsive layout.
- `script.js` — soft HTML5 canvas animation and reveal effects.
- `form-handler.js` — AJAX handler for the contact form.
- `send.php` — server endpoint for SMTP email / Telegram delivery on PHP hosting.
- `config.sample.php` — safe example of private SMTP and delivery settings.
- `robots.txt` and `sitemap.xml` — indexing rules and the complete public URL list.
- `404.html` — custom noindex 404 page.
- `.htaccess` — Timeweb-compatible HTTPS and canonical redirects, 404, compression, cache/security headers and config protection.
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow.

## Public preview

GitHub Pages preview:

`https://9163223-maker.github.io/pramio-landing/`

Production canonical domain in SEO files:

`https://pramio.ru/`

## Deploy to hosting

Upload the production package contents directly to `public_html` so that `index.html` is located at `public_html/index.html`.

For the contact form, create `config.local.php` on the hosting by copying `config.sample.php` and filling your real SMTP password. Do not commit `config.local.php` to GitHub and do not delete the working hosting copy when updating the public files.

## SMTP settings for Timeweb

The contact form sends email through the configured SMTP mailbox. Telegram duplication is optional.

Recommended settings:

- SMTP host: `smtp.timeweb.ru`
- SMTP port: `465`
- Security: `ssl`
- SMTP user: `no-reply@pramio.ru`
- SMTP password: password for the mailbox `no-reply@pramio.ru`
- Recipient: the mailbox where website requests should arrive

Example local config on hosting:

```php
<?php
return [
    'site_name' => 'PRAMIO',
    'mail_to' => 'hello@pramio.ru',
    'mail_from' => 'no-reply@pramio.ru',
    'smtp_host' => 'ssl://smtp.timeweb.ru',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl',
    'smtp_user' => 'no-reply@pramio.ru',
    'smtp_password' => 'MAILBOX_PASSWORD_HERE',
    'tg_key' => '',
    'tg_chat' => '',
];
```

## Manual follow-up

- Add the legal name, INN and address to `privacy/index.html` once the operator's details are available.
- In Yandex Webmaster, verify `https://pramio.ru/`, submit `https://pramio.ru/sitemap.xml`, and check `https://pramio.ru/robots.txt`.
- Connect analytics only after choosing the counter and updating the privacy disclosure if its scope changes.
