const cargoButtons=[...document.querySelectorAll('.opts button')];
const cargo=document.querySelector('#cargo');
const brief=document.querySelector('#brief');
const weight=document.querySelector('#weight');
const volume=document.querySelector('#volume');
const result=document.querySelector('#calcResult');

cargoButtons.forEach(button=>{
  button.setAttribute('aria-pressed',String(button.classList.contains('on')));
  button.addEventListener('click',()=>{
    cargoButtons.forEach(item=>{
      item.classList.remove('on');
      item.setAttribute('aria-pressed','false');
    });
    button.classList.add('on');
    button.setAttribute('aria-pressed','true');
    cargo.textContent=button.textContent;
  });
});

document.querySelector('#next').addEventListener('click',()=>{
  brief.hidden=false;
  brief.scrollIntoView({behavior:'smooth',block:'center'});
  weight.focus({preventScroll:true});
});

function submitCalculation(){
  const weightValue=weight.value.trim();
  const volumeValue=volume.value.trim();
  if(!weightValue||!volumeValue){
    result.textContent='Заполните вес и объём — это локальная проверка сценария.';
    [weight,volume].forEach(input=>input.setAttribute('aria-invalid',String(!input.value.trim())));
    (!weightValue?weight:volume).focus();
    return;
  }
  [weight,volume].forEach(input=>input.removeAttribute('aria-invalid'));
  result.textContent='Демо-запрос собран: '+cargo.textContent+' · '+weightValue+' кг · '+volumeValue+' м³. Отправка отключена.';
}

document.querySelector('#calcSend').addEventListener('click',submitCalculation);
[weight,volume].forEach(input=>input.addEventListener('keydown',event=>{
  if(event.key==='Enter'){
    event.preventDefault();
    submitCalculation();
  }
}));
