# PRAMIO scheduled SEO publishing

Ten prepared articles are stored in the protected content-queue/articles.json.

No Timeweb cron task is required. Apache routes a scheduled article URL to scheduled-article.php only when no physical article page exists. The renderer compares publish_at with current time in Europe/Moscow.

Before publish_at the URL returns HTTP 404. At or after publish_at the canonical URL returns server-rendered HTTP 200 HTML with title, description, canonical, OpenGraph and Article JSON-LD.

The blog loads blog/blog-feed.php, which exposes only articles already due and uses a five-minute revalidation cache. The content-queue directory is denied to HTTP clients.

The static sitemap contains only URLs already public at packaging time. Future URLs are not advertised early. Published articles are linked from the blog automatically.

## Sitemap

The public sitemap URL remains `/sitemap.xml`. Apache serves it through `sitemap-live.php`, which keeps the static entries from `sitemap-base.xml` and appends only queue articles whose `publish_at` is already due. Future queue URLs therefore stay out of the sitemap and enter it automatically after publication, without cron or a second sitemap registration.
