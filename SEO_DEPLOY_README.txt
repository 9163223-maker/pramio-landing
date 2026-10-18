PRAMIO SEO update — 19.08.2026

КАК УСТАНОВИТЬ
1. НЕ удаляйте существующий public_html целиком.
2. Обязательно сохраните существующий config.local.php на хостинге.
3. Распакуйте содержимое этого ZIP прямо в public_html с заменой совпадающих файлов.
4. Папки assets/ и services/ удалять не нужно: этот пакет их не трогает.

ЧТО МЕНЯЕТСЯ
- favicon.svg + favicon.ico + PNG-варианты в корне сайта;
- apple-touch-icon.png;
- script.js: добавляет корректные favicon-ссылки и BreadcrumbList JSON-LD без изменения интерфейса;
- yandex_2290324373e8d807.html: подтверждение прав на https://pramio.ru в Яндекс Вебмастере;
- .htaccess: HTTPS/www canonical redirects, canonical redirect для вложенных index.html, MIME для SVG/ICO;
- sitemap.xml: актуальные HTTPS URL и lastmod 2026-08-19;
- robots.txt: сохраняет разрешение на обход и HTTPS sitemap.

ПОСЛЕ РАСПАКОВКИ
- откройте https://pramio.ru/yandex_2290324373e8d807.html — должен быть HTTP 200 и текст verification;
- в Яндекс Вебмастере нажмите «Подтвердить» для https://pramio.ru;
- затем в старой HTTP-карточке выполните Индексирование -> Переезд сайта -> Добавить HTTPS;
- добавьте/проверьте https://pramio.ru/sitemap.xml;
- отправьте HTTPS-страницы на переобход;
- после обхода проверьте предупреждение о favicon.
