<?php
declare(strict_types=1);

$basePath=__DIR__.'/sitemap-base.xml';
$queuePath=__DIR__.'/content-queue/articles.json';
if(!is_file($basePath)||!is_readable($basePath)){
  http_response_code(503);
  header('Content-Type: text/plain; charset=UTF-8');
  echo 'Sitemap unavailable';
  exit;
}
$base=file_get_contents($basePath);
if($base===false){
  http_response_code(503);
  exit;
}
$extra='';
$raw=is_file($queuePath)?file_get_contents($queuePath):false;
$data=$raw!==false?json_decode($raw,true):null;
if(is_array($data)&&isset($data['articles'])&&is_array($data['articles'])){
  try{$tz=new DateTimeZone((string)($data['timezone']??'Europe/Moscow'));}catch(Throwable $e){$tz=new DateTimeZone('Europe/Moscow');}
  $now=new DateTimeImmutable('now',$tz);
  foreach($data['articles'] as $a){
    if(!is_array($a)||empty($a['slug'])||empty($a['publish_at'])) continue;
    $slug=(string)$a['slug'];
    if(!preg_match('/^[a-z0-9-]+$/',$slug)) continue;
    try{$date=new DateTimeImmutable((string)$a['publish_at']);}catch(Throwable $e){continue;}
    if($date>$now) continue;
    $loc='https://pramio.ru/blog/tetya-lida/'.$slug.'/';
    $extra.="  <url><loc>".htmlspecialchars($loc,ENT_XML1|ENT_QUOTES,'UTF-8')."</loc><lastmod>".$date->format('Y-m-d')."</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n";
  }
}
$out=preg_replace('/\s*<\/urlset>\s*$/',$extra."</urlset>\n",$base,1);
if(!is_string($out)){
  http_response_code(503);
  exit;
}
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=300, must-revalidate');
echo $out;
