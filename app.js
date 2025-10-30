
const $ = (q,ctx=document)=>ctx.querySelector(q);
const $$ = (q,ctx=document)=>Array.from(ctx.querySelectorAll(q));


(function setYear(){
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;
})();


(function navToggle(){
  const btn = document.querySelector('.nav-toggle');
  const sidebar = document.getElementById('sidebar');
  if(!btn || !sidebar) return;
  const open = () => { sidebar.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); };
  const close = () => { sidebar.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); };
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });
  
  sidebar.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(a && a.classList.contains('nav__link')) close();
  })
})();



(function smoothScroll(){
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      const target = $(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        history.pushState(null,'',id);
      }
    });
  });
})();


  // Track when user is manually scrolling after a click
  let isManualScroll = false;
  const MANUAL_SCROLL_DELAY = 800; // ms to wait before re-enabling IO

  const io = new IntersectionObserver((entries) => {
    // Skip IO updates if we're in manual scroll
    if (isManualScroll) return;

    let best = null;
    let bestDist = Infinity;
    const viewportMid = window.innerHeight / 2;

    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const box = entry.target.getBoundingClientRect();
      const sectionMid = box.top + box.height / 2;
      const dist = Math.abs(sectionMid - viewportMid);
      if (dist < bestDist) {
        bestDist = dist;
        best = entry;
      }
    });

    if (best) setActive(best.target.id);
  }, {
    root: null,
    rootMargin: "-25% 0px -45% 0px",
    threshold: [0.05, 0.25, 0.5, 0.75]
  });

  // Observe only real sections
  sections.forEach(({ el }) => {
    if (el.classList.contains("section--PS") && el.offsetHeight < 120) return;
    io.observe(el);
  });

  // Smooth scroll + temporary disable of IO highlight
  const HEADER_OFFSET = 72;
  links.forEach(a => {
    a.addEventListener("click", e => {
      const hash = a.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return;
      e.preventDefault();

      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      // disable IO for a short time to avoid flicker
      isManualScroll = true;
      setTimeout(() => { isManualScroll = false; }, MANUAL_SCROLL_DELAY);

      const rect = target.getBoundingClientRect();
      const y = window.pageYOffset + rect.top - HEADER_OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(id); // optimistic highlight
    });
  });


(function form(){
  const form = document.querySelector('.contact-form');
  if(!form) return;
  const note = form.querySelector('.form__note');
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const message = form.querySelector('#message');

  
  const validators = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email.',
    message: v => v.trim().length >= 10 || 'Add a short project brief (10+ chars).'
  };

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const checks = [
      ['name', name.value],
      ['email', email.value],
      ['message', message.value]
    ].map(([k,v])=>({k, ok: validators[k](v) === true, msg: validators[k](v)}));

    const firstError = checks.find(x=>!x.ok);
    if(firstError){
      note.textContent = firstError.msg;
      return;
    }

    
    note.textContent = 'Thanks! Your message was validated locally. (Hook this up to email/API.)';
    form.reset();
  });
})();


document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});


(function setYearNow(){
  const set = () => {
    
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
    
    console.log('Footer year set ✓');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', set);
  } else {
    set();
  }
})();


(function sidebarScrim(){
  const sidebar=document.getElementById('sidebar');
  const btn=document.querySelector('.nav-toggle');
  const scrim=document.getElementById('scrim');
  if(!sidebar||!btn||!scrim) return;
  const open=()=>{sidebar.classList.add('is-open');btn.setAttribute('aria-expanded','true');scrim.classList.add('is-visible');}
  const close=()=>{sidebar.classList.remove('is-open');btn.setAttribute('aria-expanded','false');scrim.classList.remove('is-visible');}
  btn.addEventListener('click',()=>{const x=btn.getAttribute('aria-expanded')==='true';x?close():open();});
  scrim.addEventListener('click',close);
  document.addEventListener('keydown',(e)=>{if(e.key==='Escape') close();});
})();