<?php
declare(strict_types=1);

/*
 * PRAMIO scheduled article publisher.
 * CLI only: configure Timeweb cron to run "php /path/to/public_html/publish-content.php" once per day.
 * Idempotent: already-published files are left in place; feed/sitemap are rebuilt from the canonical queue.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$root = __DIR__;
$queueFile = $root . '/content-queue/articles.json';
if (!is_file($queueFile)) {
    fwrite(STDERR, "PRAMIO publisher: queue not found\n");
    exit(1);
}

$data = json_decode((string)file_get_contents($queueFile), true);
if (!is_array($data) || !isset($data['articles']) || !is_array($data['articles'])) {
    fwrite(STDERR, "PRAMIO publisher: invalid queue\n");
    exit(1);
}

$tz = new DateTimeZone((string)($data['timezone'] ?? 'Europe/Moscow'));
$now = new DateTimeImmutable('now', $tz);
$articles = $data['articles'];
usort($articles, static fn(array $a, array $b): int => strcmp((string)$a['publish_at'], (string)$b['publish_at']));

function h(string $v): string { return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function articleUrl(string $slug): string { return 'https://pramio.ru/blog/tetya-lida/' . $slug . '/'; }

function renderArticle(array $a, array $publishedBefore): string {
    $slug = (string)$a['slug'];
    $date = new DateTimeImmutable((string)$a['publish_at']);
    $dateRu = $date->format('d.m.Y');
    $sections = '';
    $toc = '';
    foreach ($a['sections'] as $i => $section) {
        $id = 'part-' . ($i + 1);
        $heading = (string)$section[0];
        $toc .= '<a href="#'.h($id).'">'.($i+1).'. '.h($heading).'</a>';
        $paragraphs = '';
        foreach ($section[1] as $p) $paragraphs .= '<p>'.h((string)$p).'</p>';
        $sections .= '<section class="content-section" id="'.h($id).'"><h2>'.h($heading).'</h2>'.$paragraphs.'</section>';
    }

    $related = '';
    $previous = array_slice($publishedBefore, -3);
    if ($previous) {
        $cards = '';
        foreach (array_reverse($previous) as $p) {
            $cards .= '<a class="link-card" href="/blog/tetya-lida/'.h((string)$p['slug']).'/"><strong>'.h((string)$p['title']).'</strong><span>'.h((string)$p['intent']).'</span></a>';
        }
        $related = '<section class="content-section related-section"><h2>По теме</h2><div class="link-grid">'.$cards.'</div></section>';
    }

    $schema = [
      '@context'=>'https://schema.org',
      '@graph'=>[
        ['@type'=>'Article','headline'=>$a['title'],'description'=>$a['description'],'mainEntityOfPage'=>articleUrl($slug),'datePublished'=>$date->format('Y-m-d'),'dateModified'=>$date->format('Y-m-d'),'inLanguage'=>'ru-RU','author'=>['@type'=>'Organization','name'=>'PRAMIO','url'=>'https://pramio.ru/'],'publisher'=>['@type'=>'Organization','name'=>'PRAMIO','url'=>'https://pramio.ru/']],
        ['@type'=>'BreadcrumbList','itemListElement'=>[
          ['@type'=>'ListItem','position'=>1,'name'=>'Главная','item'=>'https://pramio.ru/'],
          ['@type'=>'ListItem','position'=>2,'name'=>'Блог','item'=>'https://pramio.ru/blog/'],
          ['@type'=>'ListItem','position'=>3,'name'=>'Тётя Лида знает','item'=>articleUrl($slug)]
        ]]
      ]
    ];
    $schemaJson = json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    return '<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>'.h((string)$a['seo_title']).'</title>
<meta name="description" content="'.h((string)$a['description']).'">
<meta name="robots" content="index, follow, max-image-preview:large"><meta name="theme-color" content="#f3f8ff">
<link rel="canonical" href="'.h(articleUrl($slug)).'"><link rel="icon" href="/assets/pramio-mark.webp?v=72" type="image/webp">
<meta property="og:type" content="article"><meta property="og:locale" content="ru_RU"><meta property="og:site_name" content="PRAMIO"><meta property="og:url" content="'.h(articleUrl($slug)).'"><meta property="og:title" content="'.h((string)$a['title']).'"><meta property="og:description" content="'.h((string)$a['description']).'"><meta property="og:image" content="https://pramio.ru/assets/pramio-og.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Geologica:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css?v=37"><link rel="stylesheet" href="/concept.css?v=36"><link rel="stylesheet" href="/final-fixes.css?v=37"><link rel="stylesheet" href="/floating-fixes.css?v=37"><link rel="stylesheet" href="/site-v2.css?v=94">
<script type="application/ld+json">'.$schemaJson.'</script>
</head><body class="inner-page article-page">
<header class="site-header"><a class="brand-logo" href="/" aria-label="PRAMIO — на главную"><img src="/assets/pramio-logo.webp" alt="PRAMIO" width="1000" height="414"></a><nav class="site-nav" aria-label="Основная навигация"><a href="/services/">Услуги</a><a href="/#process">Как мы работаем</a><a href="/portfolio/">Примеры работ</a><a href="/blog/">Блог</a><a class="nav-contact" href="/#contact">Обсудить задачу</a></nav><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Открыть меню"><span></span><span></span></button></header>
<nav class="mobile-nav" id="mobile-nav" aria-label="Мобильная навигация" hidden><a href="/services/">Услуги</a><a href="/#process">Как мы работаем</a><a href="/portfolio/">Примеры работ</a><a href="/blog/">Блог</a><a href="/#contact">Обсудить задачу</a></nav>
<main class="page"><nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="/">Главная</a><span>/</span><a href="/blog/">Блог</a><span>/</span><span>Тётя Лида знает</span></nav>
<article class="blog-article"><section class="service-hero"><div><p class="eyebrow"><span></span> Тётя Лида знает · сайты и конверсия</p><h1>'.h((string)$a['title']).'</h1><p class="lead">'.h((string)$a['lead']).'</p><p class="article-meta">Блог PRAMIO · Тётя Лида знает · '.h($dateRu).'</p></div></section>
<nav class="tlz-tag-carousel" aria-label="Темы блога"><a href="/blog/">ВСЕ</a><a aria-current="page" href="/blog/">САЙТЫ</a><a href="/blog/max/">MAX</a><a href="/blog/">TELEGRAM</a><a href="/blog/">AI</a><a href="/blog/">АВТОМАТИЗАЦИЯ</a></nav>
<aside class="article-toc" aria-label="Оглавление"><strong>В этом материале</strong><nav>'.$toc.'</nav></aside>
'.$sections.'
'.$related.'
<section class="content-section"><h2>Что делать дальше</h2><p>Если причина потери заявок пока неясна, не обязательно переделывать сайт целиком. Сначала полезно проверить конкретный пользовательский путь и определить, какие изменения действительно нужны.</p><p>PRAMIO занимается <a href="/services/interactive-support/">доработкой и технической поддержкой существующих сайтов</a>. Если ограничения текущего проекта уже мешают развитию, отдельно можно рассмотреть <a href="/services/sites/">новый сайт или веб-продукт</a>.</p></section>
<section class="service-cta"><h2>Разберём, где сайт теряет заявки</h2><p>Пришлите ссылку и коротко опишите задачу. Посмотрим путь пользователя и определим, что имеет смысл исправлять в первую очередь.</p><a class="btn" href="/?service=Интерактивный сервис или поддержка#contact">Обсудить доработку сайта</a></section>
</article></main>
<footer class="site-footer"><a class="footer-brand" href="/"><img src="/assets/pramio-logo.webp" alt="PRAMIO" width="1000" height="414"></a><p>Цифровые продукты и разработка под задачи бизнеса.</p><nav><a href="/services/">Все услуги</a><a href="/services/max-bots/">MAX</a><a href="/services/telegram-bots/">Telegram</a><a href="/services/ai-automation/">AI и автоматизация</a><a href="/services/sites/">Сайты</a><a href="/portfolio/">Демо-каталог</a><a href="/blog/">Блог</a><a href="mailto:hello@pramio.ru">hello@pramio.ru</a><a href="/privacy/">Политика обработки данных</a></nav><small>© 2026 PRAMIO</small></footer>
<script src="/script.js?v=62"></script><script src="/site-v2.js?v=70"></script></body></html>';
}

$due = [];
foreach ($articles as $a) {
    $when = new DateTimeImmutable((string)$a['publish_at']);
    if ($when > $now) continue;
    $dir = $root . '/blog/tetya-lida/' . $a['slug'];
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        fwrite(STDERR, "Cannot create " . $dir . "\n");
        exit(1);
    }
    $target = $dir . '/index.html';
    if (!is_file($target)) {
        $tmp = $target . '.tmp';
        file_put_contents($tmp, renderArticle($a, $due), LOCK_EX);
        rename($tmp, $target);
        echo "Published: " . $a['slug'] . "\n";
    }
    $due[] = $a;
}

$baseFeed = [
 ['rank'=>100,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/lid-magnit-v-max/','title'=>'Лид-магнит в MAX: как превратить интерес в обращение','excerpt'=>'Как выдать полезный материал через бота MAX и продолжить общение с человеком после выдачи.'],
 ['rank'=>101,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/kak-sozdat-bota-v-max/','title'=>'Как создать бота в MAX','excerpt'=>'Регистрация, модерация, токен, Webhook и первые шаги после создания бота.'],
 ['rank'=>102,'section'=>'MAX','type'=>'РАЗБОР','href'=>'/blog/max/chto-takoe-mini-app-max/','title'=>'Что такое Mini App в MAX','excerpt'=>'Когда интерфейса обычного бота уже недостаточно.'],
 ['rank'=>103,'section'=>'MAX','type'=>'РАЗБОР','href'=>'/blog/max/chto-umeet-bot-max/','title'=>'Что умеет бот MAX','excerpt'=>'Какие возможности MAX доступны боту и где действуют ограничения.'],
 ['rank'=>104,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/kak-podklyuchit-bota-k-kanalu-max/','title'=>'Бот и канал MAX','excerpt'=>'Какие права нужны боту в канале MAX и что можно делать через API.']
];
$feed = [[
 'rank'=>count($due),
 'section'=>'САЙТЫ','type'=>'ТЁТЯ ЛИДА ЗНАЕТ',
 'href'=>'/blog/tetya-lida/krasivo-a-klient-gde/',
 'title'=>'Красиво. А клиент где?',
 'excerpt'=>'Почему сайт не приносит заявки и где искать потери в пользовательском пути.'
]];
foreach ($due as $i => $a) {
    $feed[] = ['rank'=>count($due)-$i-1,'section'=>'САЙТЫ','type'=>'ТЁТЯ ЛИДА ЗНАЕТ','href'=>'/blog/tetya-lida/'.$a['slug'].'/','title'=>$a['title'],'excerpt'=>$a['description']];
}
$feed = array_merge($feed, $baseFeed);
$feedJson = json_encode($feed, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$feedJs = '/* PRAMIO blog feed — generated by publish-content.php. */'."\n".'window.PRAMIO_BLOG_ARTICLES = '.$feedJson.';'."\n". <<<'JS'
(function(){
  const esc=v=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const href=v=>window.PRAMIO_BASE?window.PRAMIO_BASE+String(v).replace(/^//,""):v;
  const sorted=(section)=>[...window.PRAMIO_BLOG_ARTICLES].filter(a=>!section||a.section===section).sort((a,b)=>(a.rank??999)-(b.rank??999));
  const latest=document.getElementById("latest-materials");
  if(latest){
    const items=sorted().slice(0,3), first=items[0], rest=items.slice(1);
    if(first) latest.innerHTML='<a class="blog-v12-feature" href="'+esc(href(first.href))+'"><span>ВЫБОР РЕДАКЦИИ · '+esc(first.section)+'</span><h2>'+esc(first.title)+'</h2><p>'+esc(first.excerpt)+'</p><b>Читать →</b></a>'+(rest.length?'<div class="blog-v12-stack">'+rest.map(a=>'<a class="blog-v12-preview" href="'+esc(href(a.href))+'"><small>'+esc(a.section)+' · '+esc(a.type)+'</small><strong>'+esc(a.title)+'</strong><em>'+esc(a.excerpt)+'</em></a>').join('')+'</div>':'');
  }
  document.querySelectorAll("[data-blog-feed]").forEach(root=>{
    const items=sorted(root.dataset.blogFeed);
    root.innerHTML=items.map(a=>'<article class="feature-card feature-card--link"><p class="eyebrow">'+esc(a.section)+' · '+esc(a.type)+'</p><h3><a href="'+esc(href(a.href))+'">'+esc(a.title)+'</a></h3><p>'+esc(a.excerpt)+'</p></article>').join("");
  });
})();
JS;
file_put_contents($root . '/blog/blog-feed.js.tmp', $feedJs, LOCK_EX);
rename($root . '/blog/blog-feed.js.tmp', $root . '/blog/blog-feed.js');

$sitemapPath = $root . '/sitemap.xml';
$dom = new DOMDocument('1.0', 'UTF-8');
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
if (!$dom->load($sitemapPath)) {
    fwrite(STDERR, "Cannot parse sitemap.xml\n");
    exit(1);
}
$ns = 'http://www.sitemaps.org/schemas/sitemap/0.9';
$xp = new DOMXPath($dom);
$xp->registerNamespace('s', $ns);
$rootNode = $dom->documentElement;
$existing = [];
foreach ($xp->query('//s:url/s:loc') as $loc) $existing[$loc->nodeValue] = true;
foreach ($due as $a) {
    $url = articleUrl((string)$a['slug']);
    if (isset($existing[$url])) continue;
    $u = $dom->createElementNS($ns, 'url');
    $u->appendChild($dom->createElementNS($ns, 'loc', $url));
    $u->appendChild($dom->createElementNS($ns, 'lastmod', substr((string)$a['publish_at'], 0, 10)));
    $u->appendChild($dom->createElementNS($ns, 'changefreq', 'monthly'));
    $u->appendChild($dom->createElementNS($ns, 'priority', '0.7'));
    $rootNode->appendChild($u);
}
$blogLoc = 'https://pramio.ru/blog/';
foreach ($xp->query('//s:url') as $u) {
    $loc = $xp->query('s:loc', $u)->item(0);
    if ($loc && $loc->nodeValue === $blogLoc) {
        $lm = $xp->query('s:lastmod', $u)->item(0);
        if ($lm) $lm->nodeValue = $now->format('Y-m-d');
    }
}
file_put_contents($sitemapPath . '.tmp', $dom->saveXML(), LOCK_EX);
rename($sitemapPath . '.tmp', $sitemapPath);

echo "PRAMIO publisher complete. Due articles: " . count($due) . "\n";
