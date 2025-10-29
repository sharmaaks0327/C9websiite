// Smooth, visible motion engine (Apple-style hero)
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
const lerp  = (a,b,t)=>a+(b-a)*t;
const hero    = document.querySelector('.hero');
const heroBg  = hero?.querySelector('.bg');
const h1      = hero?.querySelector('h1');
const p       = hero?.querySelector('p');
const logo    = document.querySelector('.brand .logo');

function heroProgress(){
  const rect = hero.getBoundingClientRect();
  const h = rect.height || window.innerHeight;
  return clamp((0 - rect.top) / (h || 1), 0, 1);
}

let ticking = false;
function render(){
  ticking = false;
  const t = heroProgress();
  const scrollY = window.scrollY || window.pageYOffset;
  const parallaxY = scrollY * 0.20;
  const bgScale  = lerp(1.00, 1.28, t);

  if (heroBg) {
    heroBg.style.transform = `translateY(${parallaxY}px) scale(${bgScale})`;
    heroBg.style.willChange = 'transform';
  }

  let headScale;
  if (t < 0.5) headScale = lerp(1.00, 1.45, t/0.5);
  else         headScale = lerp(1.45, 0.92, (t-0.5)/0.5);
  const headY = lerp(0, -window.innerHeight*0.10, t);
  if (h1) {
    h1.style.transform = `translateY(${headY}px) scale(${headScale})`;
    h1.style.willChange = 'transform';
  }

  let op;
  if (t < 0.15) op = t/0.15;
  else if (t > 0.85) op = (1 - t)/0.15;
  else op = 1;
  const py = lerp(18, -36, t);
  if (p) {
    p.style.opacity   = op;
    p.style.transform = `translateY(${py}px)`;
    p.style.willChange = 'transform, opacity';
  }

  if (logo){
    let ls;
    if (t < 0.5) ls = lerp(1.00, 1.08, t/0.5);
    else         ls = lerp(1.08, 1.00, (t-0.5)/0.5);
    logo.style.transform = `translateZ(0) scale(${ls})`;
    logo.style.willChange = 'transform';
  }
}

function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(render); } }
window.addEventListener('scroll', onScroll, { passive:true });
window.addEventListener('resize', render);

// Intersection reveal
const revealEls = document.querySelectorAll('.row, .tile, .section-title, .section-sub, .cta-btn');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.animationPlayState='running'; e.target.classList.add('seen'); io.unobserve(e.target);} });
},{threshold:.15});
revealEls.forEach(el=>{
  const cs = getComputedStyle(el);
  if (cs.animationName !== 'none') el.style.animationPlayState='paused';
  io.observe(el);
});

document.getElementById('year').textContent = new Date().getFullYear();
render();
// Animate all text on scroll
const texts = document.querySelectorAll('h1, h2, h3, h4, p, li, span, .btn');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('seen');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

texts.forEach(el => {
  el.classList.add('rv');
  observer.observe(el);
});
