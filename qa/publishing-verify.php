<?php
declare(strict_types=1);
$root=getenv('PRAMIO_TEST_ROOT')?:dirname(__DIR__).'/work';
ob_start();require $root.'/blog/blog-feed.php';ob_end_clean();
$queue=pramioQueue();$future=new DateTimeImmutable('2030-01-01T00:00:00+03:00');$published=0;$paused=0;
foreach($queue['articles'] as $article){$date=new DateTimeImmutable($article['publish_at']);$expected=$date<=new DateTimeImmutable($queue['publication_paused_after']);if(pramioDue($article,$future)!==$expected)throw new RuntimeException('Publication gate mismatch: '.$article['slug']);if($expected)$published++;else $paused++;}
if($published!==4||$paused!==6)throw new RuntimeException('Unexpected publication counts');
echo "PASS: 4 scheduled articles stay published; 6 future articles remain paused.\n";
