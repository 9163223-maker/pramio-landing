const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
(()=>{
  const nav=document.querySelector('#clinic-nav');
  const menu=document.querySelector('.menu');
  const modal=document.querySelector('#booking');
  const serviceSelect=document.querySelector('#booking-service');
  const nameInput=document.querySelector('#booking-name');
  const error=document.querySelector('#booking-error');
  const submit=document.querySelector('.submit-demo');
  const success=document.querySelector('.success');
  let returnFocus=null;
  const inertSiblings=(value)=>[...document.body.children].filter(el=>el!==modal&&el.tagName!=='SCRIPT').forEach(el=>value?el.setAttribute('inert',''):el.removeAttribute('inert'));

  const dialog=modal?.querySelector('[role="dialog"]');
  const focusables=()=>[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(x=>!x.hidden&&x.getAttribute('aria-hidden')!=='true');
  const closeMenu=()=>{
    nav?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded','false');
  };
  const closeBooking=()=>{
    if(!modal||modal.hidden)return;
    modal.hidden=true;
    document.body.style.overflow='';
    inertSiblings(false);
    returnFocus?.focus();
    returnFocus=null;
  };

  menu?.addEventListener('click',()=>{
    const open=nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded',String(open));
  });
  nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('click',event=>{
    if(nav?.classList.contains('is-open')&&!nav.contains(event.target)&&!menu?.contains(event.target))closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change',event=>{
    if(event.matches)closeMenu();
  });

  document.querySelectorAll('[data-open-booking]').forEach(button=>button.addEventListener('click',()=>{
    returnFocus=button;
    modal.hidden=false;
    document.body.style.overflow='hidden';
    inertSiblings(true);
    dialog?.setAttribute('tabindex','-1');
    success.hidden=true;
    error.hidden=true;
    requestAnimationFrame(()=>dialog?.focus({preventScroll:true}));
  }));
  document.querySelectorAll('[data-close-booking]').forEach(button=>button.addEventListener('click',closeBooking));

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&nav?.classList.contains('is-open')){
      event.preventDefault();
      closeMenu();
      menu?.focus();
      return;
    }
    if(modal.hidden)return;
    if(event.key==='Escape'){
      event.preventDefault();
      closeBooking();
      return;
    }
    if(event.key!=='Tab')return;
    const items=focusables();
    if(!items.length)return;
    const first=items[0],last=items[items.length-1];
    if(!dialog?.contains(document.activeElement)){
      event.preventDefault();
      (event.shiftKey?last:first).focus();
    }else if(event.shiftKey&&document.activeElement===first){
      event.preventDefault();
      last.focus();
    }else if(!event.shiftKey&&document.activeElement===last){
      event.preventDefault();
      first.focus();
    }
  });

  document.querySelectorAll('.service').forEach(button=>button.addEventListener('click',()=>{
    const box=document.querySelector('#service-detail');
    document.querySelector('#service-title').textContent=button.dataset.service;
    if(serviceSelect)serviceSelect.value=button.dataset.service;
    box.hidden=false;
    box.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'nearest'});
  }));
  document.querySelector('.close-detail')?.addEventListener('click',()=>document.querySelector('#service-detail').hidden=true);

  const submitBooking=()=>{
    if(!nameInput.value.trim()){
      error.hidden=false;
      nameInput.setAttribute('aria-invalid','true');
      nameInput.focus();
      return;
    }
    nameInput.removeAttribute('aria-invalid');
    error.hidden=true;
    success.hidden=false;
    success.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'nearest'});success.focus({preventScroll:true});
  };
  submit?.addEventListener('click',submitBooking);
  nameInput?.addEventListener('keydown',event=>{
    if(event.key==='Enter'){
      event.preventDefault();
      submitBooking();
    }
  });
  nameInput?.addEventListener('input',()=>{
    if(nameInput.value.trim()){
      nameInput.removeAttribute('aria-invalid');
      error.hidden=true;
    }
  });
})();
