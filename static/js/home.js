document.addEventListener('DOMContentLoaded', ()=> {
  // Reveal on scroll
  const io = new IntersectionObserver((entries)=> {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.slide-in, .animate-on-scroll, .stat-item, .floating-banner').forEach(el => io.observe(el));

  // Parallax: slight movement of hero media based on mouse
  const hero = document.querySelector('.enhanced-hero');
  const media = document.querySelector('.hero-media');
  if (hero && media) {
    hero.addEventListener('mousemove', (ev)=> {
      const r = hero.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (ev.clientX - cx) / r.width;
      const dy = (ev.clientY - cy) / r.height;
      media.style.transform = `translate3d(${dx*10}px, ${dy*10}px, 0)`;
      const floats = document.querySelectorAll('.fruit-emoji');
      floats.forEach((f,i)=> f.style.transform = `translate3d(${dx*(6 + i*2)}px, ${Math.sin((Date.now()/1000) + i)*6 + dy*(8+i)}px, 0)`);
    });
    hero.addEventListener('mouseleave', ()=> { media.style.transform = ''; document.querySelectorAll('.fruit-emoji').forEach(f => f.style.transform=''); });
  }

  // subtle continuous float offsets for floating-texts (adds natural variance)
  const floatEls = document.querySelectorAll('.floating-text');
  function drift() {
    const t = Date.now()/1000;
    floatEls.forEach((el, i) => {
      const dx = Math.sin(t * (0.2 + i*0.07) + i) * 6;
      const dy = Math.cos(t * (0.17 + i*0.05) + i) * 4;
      el.style.transform = `translate(-50%,-50%) translate(${dx}px, ${dy}px) rotate(${(i%2? -4:4)}deg)`;
    });
    requestAnimationFrame(drift);
  }
  requestAnimationFrame(drift);
});
