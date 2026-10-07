# PRAMIO scheduled SEO publishing

The production package contains ten prepared “Тётя Лида знает” articles in `content-queue/articles.json`.

## Schedule (Europe/Moscow)
- 2026-10-08 — Есть трафик, но нет заявок
- 2026-10-11 — Почему посетители уходят с сайта
- 2026-10-14 — Почему не заполняют форму
- 2026-10-17 — Мобильная версия теряет заявки
- 2026-10-20 — Как увеличить конверсию без редизайна
- 2026-10-23 — Первый экран не приводит к заявке
- 2026-10-26 — Реклама приводит клики, но не заявки
- 2026-10-29 — Доработать или переделать сайт
- 2026-11-01 — Аудит сайта на конверсию
- 2026-11-04 — Сделали новый сайт, а заявок нет

## One-time Timeweb setup
After uploading the production ZIP to `public_html`, create one daily cron task:

`php /absolute/path/to/public_html/publish-content.php`

Run it once per day after 09:05 Moscow time (for example 09:15). The script is CLI-only and idempotent.

The publisher:
1. publishes only articles whose `publish_at` has arrived;
2. creates the public article page;
3. rebuilds `blog/blog-feed.js` so the new article appears in the blog;
4. appends the public URL to the existing `sitemap.xml`;
5. never adds future URLs to the sitemap.

`content-queue/` is denied from HTTP by its own .htaccess. `publish-content.php` returns 404 over HTTP.

Yandex Webmaster should keep using the existing sitemap URL:
`https://pramio.ru/sitemap.xml`

Do not create a second sitemap for the scheduled series.
