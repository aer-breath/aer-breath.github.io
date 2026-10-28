import{copy}from'./copy.mjs';
const urls={aer:{web:'https://aer-breath.github.io/?utm_source=apps_hub',store:'https://apps.apple.com/app/id6761077610'},youcan:{web:'https://youcan-habits.github.io/?utm_source=apps_hub',store:'https://apps.apple.com/app/id6768371723'}};
const shareURL='https://aer-breath.github.io/go/';
const languages=navigator.languages?.length?navigator.languages:[navigator.language];
let language=new URLSearchParams(location.search).get('lang')||(/\/go\/uk\//.test(location.pathname)?'uk':null);
if(!['en','uk'].includes(language)){try{language=localStorage.getItem('apps.promo.language');}catch{}}
if(!['en','uk'].includes(language))language=languages.some(x=>/^uk(?:-|$)/i.test(x))?'uk':'en';
let device=/iPhone|iPad|iPod/i.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1?'ios':/Android/i.test(navigator.userAgent)?'android':'desktop';
function text(element,value){element.replaceChildren(...value.split('\n').flatMap((line,i)=>i?[document.createElement('br'),document.createTextNode(line)]:[document.createTextNode(line)]));}
function renderDevice(){
 const t=copy[language];
 document.querySelectorAll('[data-device]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.device===device)));
 document.getElementById('device-label').textContent=device==='ios'?'iPhone / iPad':device==='android'?'Android':t.computer;
 document.getElementById('device-title').textContent=t.deviceTitles[device];
 document.getElementById('device-steps').replaceChildren(...t.steps[device].map(value=>{const li=document.createElement('li');li.textContent=value;return li;}));
 for(const app of ['aer','youcan']){
  const primary=document.querySelector(`.primary-app[data-app="${app}"]`),alternate=document.querySelector(`.alternate-app[data-app="${app}"]`);
  primary.href=device==='ios'?urls[app].store:urls[app].web;
  alternate.href=device==='ios'?urls[app].web:urls[app].store;
  document.querySelector(`[data-primary="${app}"]`).textContent=device==='ios'?t.native:app==='aer'?t.webAer:t.webYoucan;
  document.querySelector(`[data-alternate="${app}"]`).textContent=device==='ios'?t.tryWeb:t.iphone;
 }
}
function render(){
 const t=copy[language];document.documentElement.lang=language;document.title=t.pageTitle;
 document.querySelectorAll('[data-t]').forEach(e=>{if(t[e.dataset.t])text(e,t[e.dataset.t]);});
 document.querySelectorAll('[data-t-alt]').forEach(e=>e.alt=t[e.dataset.tAlt]);
 const share=document.getElementById('share');share.title=t.shareTitle;share.setAttribute('aria-label',t.shareTitle);
 const toggle=document.getElementById('language');toggle.textContent=language==='uk'?'EN':'UA';toggle.setAttribute('aria-label',language==='uk'?'Switch to English':'Перемкнути українською');
 document.querySelector('[name=description]').content=t.pageDescription;
 renderDevice();
}
document.getElementById('language').addEventListener('click',()=>{language=language==='uk'?'en':'uk';try{localStorage.setItem('apps.promo.language',language);}catch{}render();});
document.querySelectorAll('[data-device]').forEach(e=>e.addEventListener('click',()=>{device=e.dataset.device;renderDevice();}));
let toastTimer;
function toast(message){const e=document.getElementById('share-status');e.textContent=message;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),7000);}
document.getElementById('share').addEventListener('click',async()=>{
 const t=copy[language];const url=language==='uk'?shareURL+'uk/':shareURL;
 if(navigator.share){try{await navigator.share({title:t.pageTitle,text:t.shareText,url});return;}catch(error){if(error?.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(url);toast(t.copied);}catch{toast(t.shareError+' '+url);}
});
render();
