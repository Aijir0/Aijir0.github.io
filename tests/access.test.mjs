// Tests du branchement de l’interface, avec réponses API simulées.
// Ces tests ne prouvent PAS une protection serveur.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';


import assert from 'node:assert/strict';
const code = readFileSync(new URL('../espace-jeux/access.js', import.meta.url), 'utf8');
function mount({ page='login', host='example.test', search='', replies=[] } = {}) {
  class Element {
    hidden=true; disabled=true; value=''; textContent=''; listeners={};
    addEventListener(type, fn) { this.listeners[type]=fn; }
    append(...values) { this.children=values; }
    focus() { this.focused=true; }
  }
  const elements = Object.fromEntries(['access-status','password','submit','login-form','logout','cards'].map(id=>[id,new Element()]));
  const redirects=[], requests=[];
  const context = vm.createContext({
    document: { getElementById(id) { if(id==='login-form' && page!=='login'||id==='logout' && page!=='selection') return null; return elements[id]; }, querySelector() { return page==='selection'?elements.cards:null; }, createElement() { return new Element(); } },
    location: { hostname:host, search, replace(target) { redirects.push(target); } },
    window: { addEventListener() {} }, URLSearchParams, AbortSignal,
    async fetch(path, options) { requests.push({path,options}); const reply=replies.shift(); if(!reply)throw Error('unavailable'); return {ok:reply.status===200,status:reply.status,headers:{get:()=>reply.type||'application/json'},json:async()=>reply.data}; }
  });
  vm.runInContext(code,context);
  return { elements,redirects,requests, ready:()=>new Promise(resolve=>setImmediate(resolve)) };
}
const session=(authenticated=false)=>({status:200,data:{authenticated,csrfToken:'FAKE_TEST_TOKEN'}});
export async function runAccessTests() {
  let count=0;
  let app=mount(); await app.ready(); assert.match(app.elements['access-status'].textContent,/pas encore configuré/);assert.equal(app.elements.password.disabled,true);count++;
  app=mount({page:'selection'});await app.ready();assert.equal(app.elements.cards.hidden,true);count++;
  app=mount({page:'selection',host:'127.0.0.1'});await app.ready();assert.equal(app.elements.cards.hidden,false);assert.equal(app.elements.logout.disabled,true);count++;
  app=mount({search:'?next=/jeu/index.html',replies:[session(true)]});await app.ready();assert.equal(app.redirects[0],'/jeu/index.html');count++;
  app=mount({search:'?next=https://evil.test',replies:[session(true)]});await app.ready();assert.equal(app.redirects[0],'/espace-jeux/selection.html');count++;
  app=mount({replies:[session(),{status:401,data:{}}]});await app.ready();app.elements.password.value='FAKE_TEST_PASSWORD';await app.elements['login-form'].listeners.submit({preventDefault(){}});assert.match(app.elements['access-status'].textContent,/incorrect/);assert.equal(app.elements.password.value,'');assert.equal(app.redirects.length,0);count++;
  app=mount({search:'?next=/PacQC/index.html',replies:[session(),session(true)]});await app.ready();app.elements.password.value='FAKE_TEST_PASSWORD';await app.elements['login-form'].listeners.submit({preventDefault(){}});assert.equal(app.redirects[0],'/PacQC/index.html');assert.equal(app.requests[1].options.headers['X-CSRF-Token'],'FAKE_TEST_TOKEN');count++;
  app=mount({replies:[session(),{status:429,data:{}}]});await app.ready();await app.elements['login-form'].listeners.submit({preventDefault(){}});assert.match(app.elements['access-status'].textContent,/Trop de tentatives/);count++;
  app=mount({page:'selection',replies:[session(true),{status:200,data:{}}]});await app.ready();await app.elements.logout.listeners.click();assert.equal(app.redirects[0],'index.html');count++;
  app=mount({page:'selection',replies:[session(false)]});await app.ready();assert.match(app.redirects[0],/^index.html\?next=/);count++;
  return `${count} / ${count} tests interface réussis (API simulée)`;
}
console.log(await runAccessTests());
