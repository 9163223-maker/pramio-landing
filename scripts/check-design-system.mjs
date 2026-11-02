import { readFileSync } from 'node:fs';

const pages = [
  '404.html','index.html','services/index.html','privacy/index.html',
  'blog/index.html','blog/max/index.html','blog/tetya-lida/index.html',
  'portfolio/index.html',
  'services/sites/index.html','services/max-bots/index.html',
  'services/telegram-bots/index.html','services/ai-automation/index.html',
  'services/interactive-support/index.html',
  'services/max-bots/mini-app/index.html','services/max-bots/business/index.html',
  'services/max-bots/channels/index.html','services/max-bots/applications/index.html',
  'services/max-bots/lead-magnets/index.html','services/max-bots/crm-integration/index.html',
  'services/max-bots/buttons-deeplinks/index.html',
  'services/max-bots/channel-automation/index.html',
  'services/max-bots/comment-moderation/index.html',
  'blog/max/lid-magnit-v-max/index.html','blog/max/chto-umeet-bot-max/index.html',
  'blog/max/kak-sozdat-bota-v-max/index.html',
  'blog/max/chto-takoe-mini-app-max/index.html',
  'blog/max/kak-podklyuchit-bota-k-kanalu-max/index.html',
  'blog/tetya-lida/krasivo-a-klient-gde/index.html',
  'scheduled-article.php','blog/tetya-lida/index.php'
];
const failures=[];
const check=(ok,message)=>{if(!ok)failures.push(message)};
for(const path of pages){
  const html=readFileSync(path,'utf8');
  check(/site-v2\.css\?v=101/.test(html),path+' missing latest CSS');
  check(/site-v2\.js\?v=100/.test(html),path+' missing latest JS');
}
const css=readFileSync('site-v2.css','utf8');
for(const token of ['--pr-font-display','--pr-font-body','--pr-fs-body','--pr-fs-card','--pr-fs-h2','--pr-card','--pr-border','--pr-gap-3']){
  check(css.includes(token),'Missing design token '+token);
}
const js=readFileSync('site-v2.js','utf8');
check(js.includes("visibilitychange"),'Canvas not paused on hidden tabs');
check(js.includes("prefers-reduced-motion"),'Missing reduced motion fallback');
check(js.includes("min-width: 981px"),'Mobile should use static background');
const blog=readFileSync('blog/index.html','utf8');
check((blog.match(/class="link-card" href=/g)||[]).length>=10,'Blog not rendered as an initial article list');
check(blog.includes('data-blog-feed=""'),'Blog cannot progressively update');
check(blog.includes('href="/blog/tetya-lida/')&&blog.includes('href="/blog/max/'),'Blog missing direct article links');
check(!blog.includes('blog-v12-rubrics'),'Blog still uses intermediate rubric cards');
if(failures.length){console.error('PRAMIO DS1 FAIL:\n'+failures.join('\n'));process.exit(1)}
console.log('PRAMIO DS1 PASS: '+pages.length+' pages, design tokens, static article links, motion guards');
