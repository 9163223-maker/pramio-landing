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
$feed=[['rank'=>count($due),'section'=>'САЙТЫ','type'=>'ТЁТЯ ЛИДА ЗНАЕТ','href'=>'/blog/tetya-lida/krasivo-a-klient-gde/','title'=>'Почему сайт не приносит заявки: где искать причину','excerpt'=>'Почему сайт не приносит заявки и где искать потери в пользовательском пути.','date'=>'2026-10-03']];
foreach($due as $i=>$a)$feed[]=['rank'=>count($due)-$i-1,'section'=>'САЙТЫ','type'=>'ТЁТЯ ЛИДА ЗНАЕТ','href'=>'/blog/tetya-lida/'.$a['slug'].'/','title'=>$a['title'],'excerpt'=>$a['description'],'date'=>substr((string)$a['publish_at'],0,10)];
$base=[['rank'=>100,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/lid-magnit-v-max/','title'=>'Лид-магнит в MAX: как превратить интерес в обращение','excerpt'=>'Как выдать полезный материал через бота MAX и продолжить общение с человеком после выдачи.'],['rank'=>101,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/kak-sozdat-bota-v-max/','title'=>'Как создать бота в MAX','excerpt'=>'Регистрация, модерация, токен, Webhook и первые шаги после создания бота.'],['rank'=>102,'section'=>'MAX','type'=>'РАЗБОР','href'=>'/blog/max/chto-takoe-mini-app-max/','title'=>'Что такое Mini App в MAX','excerpt'=>'Когда интерфейса обычного бота уже недостаточно.'],['rank'=>103,'section'=>'MAX','type'=>'РАЗБОР','href'=>'/blog/max/chto-umeet-bot-max/','title'=>'Что умеет бот MAX','excerpt'=>'Какие возможности MAX доступны боту и где действуют ограничения.'],['rank'=>104,'section'=>'MAX','type'=>'ПРАКТИКА','href'=>'/blog/max/kak-podklyuchit-bota-k-kanalu-max/','title'=>'Бот и канал MAX','excerpt'=>'Какие права нужны боту в канале MAX и что можно делать через API.']];
$feed=array_merge($feed,$base);$json=json_encode($feed,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
echo 'window.PRAMIO_BLOG_ARTICLES='.$json.';'.<<<'JS'
(function(){
const esc=v=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const href=v=>window.PRAMIO_BASE?window.PRAMIO_BASE+String(v).replace(/^\//,""):v;
const date=v=>v?new Date(v+'T12:00:00+03:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}):'';
const sorted=s=>[...window.PRAMIO_BLOG_ARTICLES].filter(a=>!s||a.section===s).sort((a,b)=>(a.rank??999)-(b.rank??999));
const card=a=>'<a class="link-card" href="'+esc(href(a.href))+'"><time'+(a.date?' datetime="'+esc(a.date)+'"':'')+'>'+esc(a.section)+(a.date?' · '+esc(date(a.date)):'')+'</time><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt)+'</span></a>';
const feat=a=>'<a class="pr-blog-feature" href="'+esc(href(a.href))+'"><span class="pr-blog-kicker">'+esc(a.section)+(a.date?' · '+esc(date(a.date)):'')+'</span><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt)+'</span><span class="pr-blog-read">Читать статью →</span></a>';
const all=sorted();
const latest=document.getElementById('pr-blog-latest');
if(latest)latest.innerHTML=all.slice(0,3).map(feat).join('');
const list=document.getElementById('pr-blog-list');
if(list)list.innerHTML=all.slice(3).map(card).join('');
document.querySelectorAll('[data-blog-feed]').forEach(el=>{if(el===list)return;const s=el.getAttribute('data-blog-feed')||'';el.innerHTML=sorted(s).map(card).join('');});
})();
JS;
