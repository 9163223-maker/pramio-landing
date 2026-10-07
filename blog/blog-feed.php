<?php
declare(strict_types=1);
function pramioQueue(): array {
  $path=dirname(__DIR__).'/content-queue/articles.json';
  $raw=is_file($path)?file_get_contents($path):false;
  $data=$raw!==false?json_decode($raw,true):null;
  if(!is_array($data)||!isset($data['articles'])||!is_array($data['articles'])) return ['timezone'=>'Europe/Moscow','articles'=>[]];
  return $data;
}
function pramioDue(array $a, DateTimeImmutable $now): bool {
  try { return new DateTimeImmutable((string)$a['publish_at']) <= $now; } catch(Throwable $e){ return false; }
}
function pramioH(string $v): string { return htmlspecialchars($v,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8'); }
function pramioUrl(string $slug): string { return 'https://pramio.ru/blog/tetya-lida/'.$slug.'/'; }

header('Content-Type: application/javascript; charset=UTF-8'); header('Cache-Control: public, max-age=300, must-revalidate');
$data=pramioQueue();$tz=new DateTimeZone((string)($data['timezone']??'Europe/Moscow'));$now=new DateTimeImmutable('now',$tz);$due=[];
foreach($data['articles'] as $a)if(pramioDue($a,$now))$due[]=$a;
usort($due,fn($a,$b)=>strcmp((string)$a['publish_at'],(string)$b['publish_at']));
$feed=[['rank'=>count($due),'section'=>'САЙТЫ','type'=>'ТЁТЯ ЛИДА ЗНАЕТ','href'=>'/blog/tetya-lida/krasivo-a-klient-gde/','title'=>'Почему сайт не приносит заявки: где искать причину','excerpt'=>'Почему сайт не приносит заявки и где искать потери в пользовательском пути.']];
foreach($due as $i=>$a)$feed[]=['rank'=>count($due)-$i-1,'section'=>'САЙТЫ','type'=>'ТЁТЯ ЛИДА ЗНАЕТ','href'=>'/blog/tetya-lida/'.$a['slug'].'/','title'=>$a['title'],'excerpt'=>$a['description']];
$base=[['rank'=>100,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/lid-magnit-v-max/','title'=>'Лид-магнит в MAX: как превратить интерес в обращение','excerpt'=>'Как выдать полезный материал через бота MAX и продолжить общение с человеком после выдачи.'],['rank'=>101,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/kak-sozdat-bota-v-max/','title'=>'Как создать бота в MAX','excerpt'=>'Регистрация, модерация, токен, Webhook и первые шаги после создания бота.'],['rank'=>102,'section'=>'MAX','type'=>'РАЗБОР','href'=>'/blog/max/chto-takoe-mini-app-max/','title'=>'Что такое Mini App в MAX','excerpt'=>'Когда интерфейса обычного бота уже недостаточно.'],['rank'=>103,'section'=>'MAX','type'=>'РАЗБОР','href'=>'/blog/max/chto-umeet-bot-max/','title'=>'Что умеет бот MAX','excerpt'=>'Какие возможности MAX доступны боту и где действуют ограничения.'],['rank'=>104,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/kak-podklyuchit-bota-k-kanalu-max/','title'=>'Бот и канал MAX','excerpt'=>'Какие права нужны боту в канале MAX и что можно делать через API.']];
$feed=array_merge($feed,$base);$json=json_encode($feed,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
echo 'window.PRAMIO_BLOG_ARTICLES='.$json.';'.<<<'JS'
(function(){const esc=v=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));const href=v=>window.PRAMIO_BASE?window.PRAMIO_BASE+String(v).replace(/^\//,""):v;const sorted=s=>[...window.PRAMIO_BLOG_ARTICLES].filter(a=>!s||a.section===s).sort((a,b)=>(a.rank??999)-(b.rank??999));document.querySelectorAll('[data-blog-feed]').forEach(el=>{const s=el.getAttribute('data-blog-feed')||'';el.innerHTML=sorted(s).map(a=>'<a class=\"link-card\" href=\"'+esc(href(a.href))+'\"><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt)+'</span></a>').join('');});const latest=document.getElementById("latest-materials");if(latest){const items=sorted().slice(0,3),first=items[0],rest=items.slice(1);if(first)latest.innerHTML='<a class="blog-v12-feature" href="'+esc(href(first.href))+'"><span>ВЫБОР РЕДАКЦИИ · '+esc(first.section)+'</span><h2>'+esc(first.title)+'</h2><p>'+esc(first.excerpt)+'</p><b>Читать →</b></a>'+(rest.length?'<div class="blog-v12-stack">'+rest.map(a=>'<a class="blog-v12-preview" href="'+esc(href(a.href))+'"><small>'+esc(a.section)+' · '+esc(a.type)+'</small><strong>'+esc(a.title)+'</strong><em>'+esc(a.excerpt)+'</em></a>').join("")+'</div>':"");}})();
JS;
