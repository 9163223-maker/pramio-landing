/* Personal CMS demo data; ordinary shop pages never apply this state. */
(() => {
  const key='pramio_forma_cms_v1';
  const defaults=[
    {id:'arc',name:'Лампа Arc 01',price:12900,description:'Направленный свет для рабочего стола и спокойных вечеров.',category:'light',image:'lamp',status:'published'},
    {id:'fold',name:'Подставка Fold',price:4600,description:'Подставка для удобного и аккуратного рабочего места.',category:'desk',image:'desk',status:'published'},
    {id:'halo',name:'Органайзер Halo',price:3200,description:'Небольшие вещи на своём месте — дома и на рабочем столе.',category:'accessories',image:'home',status:'published'}
  ];
  const clone=value=>JSON.parse(JSON.stringify(value));
  const cleanProduct=(p,fallback)=>({id:/^[a-z0-9-]{1,40}$/.test(p?.id||'')?p.id:fallback.id,name:typeof p?.name==='string'&&p.name.trim()?p.name.slice(0,80):fallback.name,price:Number.isFinite(Number(p?.price))&&Number(p.price)>=0&&Number(p.price)<=100000000?Number(p.price):fallback.price,description:typeof p?.description==='string'?p.description.slice(0,600):fallback.description,category:['light','desk','accessories'].includes(p?.category)?p.category:fallback.category,image:['lamp','desk','home','interior'].includes(p?.image)?p.image:fallback.image,status:['published','draft','hidden'].includes(p?.status)?p.status:fallback.status});
  const initial=()=>({version:1,products:clone(defaults),drafts:{},selected:'arc',updatedAt:null});
  const normalize=value=>{if(value?.version!==1||!Array.isArray(value.products))return initial();const result=initial(),seen=new Set();result.products=value.products.slice(0,12).map((p,i)=>cleanProduct(p,defaults[i%defaults.length])).filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true});if(!result.products.length)return initial();for(const p of result.products)if(value.drafts?.[p.id]){const draft=value.drafts[p.id];result.drafts[p.id]={...cleanProduct({...draft,id:p.id},p),name:typeof draft.name==='string'?draft.name.slice(0,80):p.name,price:typeof draft.price==='string'?draft.price.slice(0,24):p.price}}result.selected=result.products.some(p=>p.id===value.selected)?value.selected:result.products[0].id;result.updatedAt=typeof value.updatedAt==='string'?value.updatedAt:null;return result};
  let available=true;
  const read=()=>{try{return normalize(JSON.parse(localStorage.getItem(key)))}catch(_){available=false;return initial()}};
  const write=state=>{try{localStorage.setItem(key,JSON.stringify(normalize(state)));available=true;return true}catch(_){available=false;return false}};
  const reset=()=>{try{localStorage.removeItem(key);available=true;return true}catch(_){available=false;return false}};
  window.PramioFormaCMS={key,initial,normalize,read,write,reset,cleanProduct,clone,available:()=>available,price:value=>Number(value).toLocaleString('ru-RU')+' ₽'};
})();
