# PRAMIO Landing

Teaser landing page for the PRAMIO ecosystem and the first product — AdminKit.

## What is inside

- `index.html` — one-page teaser landing with primary SEO meta tags, Open Graph and Schema.org JSON-LD.
- `styles.css` plus fix CSS files — visual style, glass effects, responsive layout.
- `script.js` — soft HTML5 canvas animation and reveal effects.
- `form-handler.js` — AJAX handler for the contact form.
- `send.php` — server endpoint for SMTP email / Telegram delivery on PHP hosting.
- `config.sample.php` — safe example of private SMTP and delivery settings.
- `robots.txt` and `sitemap.xml` — base indexing files for PRAMIO.
- `404.html` — custom noindex 404 page.
- `.htaccess` — Apache settings for 404, WebP type, compression, cache headers and config protection.
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow.

## Public preview

GitHub Pages preview:

`https://9163223-maker.github.io/pramio-landing/`

Production canonical domain in SEO files:

`https://pramio.ru/`

## Deploy to hosting

Upload all files from the repository root to the site root, for example `public_html`.

For the contact form, create `config.local.php` on the hosting by copying `config.sample.php` and filling your real SMTP password. Do not commit `config.local.php` to GitHub.

## SMTP settings for Sweb / SpaceWeb

The contact form sends email through SMTP first and falls back to PHP `mail()` only if SMTP fails.

Recommended settings:

- SMTP host: `smtp.spaceweb.ru`
- SMTP port: `465`
- Security: `ssl`
- SMTP user: `no-reply@pramio.ru`
- SMTP password: password for the mailbox `no-reply@pramio.ru`
- Recipient: `9163223@gmail.com`

Example local config on hosting:

```php
<?php
return [
    'site_name' => 'PRAMIO',
    'mail_to' => '9163223@gmail.com',
    'mail_from' => 'no-reply@pramio.ru',
    'smtp_host' => 'smtp.spaceweb.ru',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl',
    'smtp_user' => 'no-reply@pramio.ru',
    'smtp_password' => 'MAILBOX_PASSWORD_HERE',
    'tg_key' => '',
    'tg_chat' => '',
];
```

## Links to replace

- `https://max.ru/` — replace with the real AdminKit community link.
- `hello@pramio.ru` — replace with the preferred contact email if needed.
- In Yandex Webmaster, verify `https://pramio.ru/`, submit `https://pramio.ru/sitemap.xml`, and check `https://pramio.ru/robots.txt`.
