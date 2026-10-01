/* PRAMIO blog feed — canonical article metadata owner. */
window.PRAMIO_BLOG_ARTICLES = [
  {rank:1,section:"MAX",type:"ПРАКТИКА",href:"/blog/max/lid-magnit-v-max/",title:"Лид-магнит в MAX: как превратить интерес в обращение",excerpt:"Что получает человек, где подключается бот и на каком шаге бизнес чаще всего теряет лид."},
  {rank:2,section:"MAX",type:"ПРАКТИКА",href:"/blog/max/kak-sozdat-bota-v-max/",title:"Как создать бота в MAX",excerpt:"От регистрации до первого рабочего сценария."},
  {rank:3,section:"MAX",type:"РАЗБОР",href:"/blog/max/chto-takoe-mini-app-max/",title:"Что такое Mini App в MAX",excerpt:"Когда интерфейса обычного бота уже недостаточно."},
  {rank:4,section:"MAX",type:"РАЗБОР",href:"/blog/max/chto-umeet-bot-max/",title:"Что умеет бот MAX",excerpt:"Возможности Bot API без лишних обещаний."},
  {rank:5,section:"MAX",type:"ПРАКТИКА",href:"/blog/max/kak-podklyuchit-bota-k-kanalu-max/",title:"Бот и канал MAX",excerpt:"Подключение, права и ограничения."}
];
(function(){
  const esc=v=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const href=v=>window.PRAMIO_BASE?window.PRAMIO_BASE+String(v).replace(/^\//,""):v;
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