import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {JSDOM} from './node_modules/jsdom/lib/api.js';
import * as css from './node_modules/css-tree/lib/index.js';

const root=path.resolve(process.env.PRAMIO_TEST_ROOT||'work');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let failed=false;
function test(name,fn){try{fn();console.log('PASS '+name)}catch(e){failed=true;console.error('FAIL '+name+'\n'+e.stack)}}
// DOM/style regression, not a substitute for Safari's layout/compositing QA.
function atWidth(source,width){const ast=css.parse(source);css.walk(ast,{visit:'Atrule',enter(node,item,list){if(node.name==='media'){const media=css.generate(node.prelude);const bounds=[...media.matchAll(/(max|min)-width:\s*(\d+)px/g)];const match=bounds.length&&bounds.every(([,kind,n])=>kind==='max'?width<=Number(n):width>=Number(n));if(match){const children=node.block.children.copy();list.replace(item,children)}else list.remove(item)}}});return css.generate(ast)}

for(const width of [320,390,430,768,1440])test('Navigation and editor toolbar stacking at '+width+'px',()=>{
 const dom=new JSDOM(read('portfolio/landing-demo/index.html'),{url:'https://pramio.ru/portfolio/landing-demo/',runScripts:'outside-only'});
 const {window:w}=dom,d=w.document;
 d.querySelectorAll('style').forEach(s=>s.textContent=atWidth(s.textContent,width));
 const style=d.createElement('style');style.textContent=atWidth(read('portfolio/demo-nav.css'),width);d.head.append(style);
 let observer;
 w.ResizeObserver=class{constructor(fn){observer=fn}observe(){}};
 w.HTMLElement.prototype.getBoundingClientRect=function(){return {height:this.hasAttribute('data-pramio-demo-nav')?51:0}};
 w.eval(read('portfolio/demo-nav.js'));
 const nav=d.querySelector('[data-pramio-demo-nav]');
 assert.equal(d.body.firstElementChild,nav);
 assert.equal(w.getComputedStyle(nav).position,'sticky');
 assert.equal(w.getComputedStyle(nav).top,'0px');
 assert(w.getComputedStyle(d.querySelector('.lab')).top.includes('--pramio-demo-nav-height'));
 assert(Number(w.getComputedStyle(nav).zIndex)>Number(w.getComputedStyle(d.querySelector('.lab')).zIndex));
 assert.equal(d.documentElement.style.getPropertyValue('--pramio-demo-nav-height'),'51px');
 nav.getBoundingClientRect=()=>({height:61});observer();
 assert.equal(d.documentElement.style.getPropertyValue('--pramio-demo-nav-height'),'61px');
 assert.equal(w.getComputedStyle(d.querySelector('.floating-demo')).display,'flex');
 assert.equal(nav.querySelector('.pdn-back').pathname,'/portfolio/');
 assert.equal(new URL(nav.querySelector('.pdn-contact').href).searchParams.get('example'),'landing-demo');
 w.eval(read('portfolio/demo-nav.js'));assert.equal(d.querySelectorAll('[data-pramio-demo-nav]').length,1);
 dom.window.close();
});
test('Copper section marker ring fits INSIDE the label left boundary at mobile widths',()=>{for(const width of [320,390,430,768]){const dom=new JSDOM('<body class="home-page"><section class="section-heading"><p class="eyebrow"><span></span>Наши услуги</p></section></body>');const s=dom.window.document.createElement('style');s.textContent=atWidth(read('styles.css')+'\n'+read('business.css'),width);dom.window.document.head.append(s);const w=dom.window,label=w.getComputedStyle(w.document.querySelector('.eyebrow')),dot=w.getComputedStyle(w.document.querySelector('span'));assert.equal(label.paddingLeft,'8px');assert.equal(dot.flexShrink,'0');assert.equal(dot.boxShadow,'0 0 0 6px rgba(20,102,255,.09)');assert(parseFloat(label.paddingLeft)>=6,'Ring must not paint outside the section');dom.window.close()}});
if(failed)process.exitCode=1;
