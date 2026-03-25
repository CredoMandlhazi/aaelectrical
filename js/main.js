/* =========================================
   AA ELECTRICAL — MAIN.JS (CLEAN, NO LOADER)
   ========================================= */

   document.addEventListener('DOMContentLoaded', () => {

    // ── CUSTOM CURSOR ────────────────────────────────
    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
  
    if (cursor && cursorRing) {
      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  
      document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
      });
  
      (function animateRing() {
        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
      })();
  
      const interactives = document.querySelectorAll(
        'a, button, .service-card, .team-card, .project-card, .equipment-card'
      );
  
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('cursor-grow');
          cursorRing.classList.add('ring-grow');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('cursor-grow');
          cursorRing.classList.remove('ring-grow');
        });
      });
    }
  
    // ── NAVBAR SCROLL ────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  
    // ── ACTIVE NAV LINK ──────────────────────────────
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  
    // ── MOBILE MENU ──────────────────────────────────
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
  
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
  
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  
    // ── REVEAL ON SCROLL ─────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.08 });
  
    reveals.forEach(el => {
      revealObserver.observe(el);
      if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('visible');
    });
  
    // ── SMOOTH SCROLL ───────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  
    // ── FEATHER ICONS ───────────────────────────────
    if (typeof feather !== 'undefined') feather.replace({ 'stroke-width': 1.8 });
  
    // ── PAGE FADE IN ────────────────────────────────
    document.body.classList.add('page-transition-in');
  
    // ── CONTACT FORM ────────────────────────────────
    const formSubmit = document.querySelector('.form-submit');
    if (formSubmit) formSubmit.addEventListener('click', handleFormSubmit);
  
    function handleFormSubmit() {
      const name = document.getElementById('f-name');
      if (!name || !name.value.trim()) { showToast('Please enter your name.', false); return; }
  
      const email = document.getElementById('f-email');
      if (!email || !email.value.includes('@')) { showToast('Please enter a valid email.', false); return; }
  
      showToast('Quote request sent! We\'ll be in touch within 24 hours.', true);
  
      ['f-name','f-email','f-phone','f-company','f-type','f-desc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }
  
    function showToast(message, success = true) {
      let toast = document.getElementById('toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
      }
  
      toast.innerHTML = success
        ? `<strong>Message Sent</strong> ${message}`
        : `<strong style="color:#f87171;">Notice</strong> ${message}`;
  
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    }
  
    // ── LEAFLET MAP ──────────────────────────────────
    const mapEl = document.getElementById('leaflet-map');
    if (mapEl && typeof L !== 'undefined') initLeafletMap();
  
    function initLeafletMap() {
      const map = L.map('leaflet-map', { center: [-25.745, 28.36], zoom: 11, scrollWheelZoom: false, zoomControl: true });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
      }).addTo(map);
  
      const glowMarker = L.divIcon({
        html: `
          <div style="position:relative;width:46px;height:46px;">
            <div style="position:absolute;inset:0;background:rgba(28,108,255,0.2);border-radius:50%;animation:mapPulse 2s infinite;"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:20px;height:20px;background:linear-gradient(135deg,#1C6CFF,#00E5FF);border-radius:50%;border:2px solid white;"></div>
          </div>`,
        className: '',
        iconSize: [46, 46],
        iconAnchor: [23, 23]
      });
  
      const marker = L.marker([-25.745, 28.36], { icon: glowMarker }).addTo(map);
      marker.bindPopup(`<div style="font-family:'Nunito',sans-serif;padding:10px;"><strong>AA Electrical</strong><br>Pretoria, Gauteng<br>+27 12 566 3752</div>`);
      L.circle([-25.745, 28.36], { color:'#1C6CFF', fillColor:'#1C6CFF', fillOpacity:0.05, radius:75000 }).addTo(map);
      marker.openPopup();
      setTimeout(() => map.invalidateSize(), 150);
    }

    /* CONTACT FORM EMAIL */
   document.getElementById("contact-form").addEventListener("submit", function(e){
     e.preventDefault();

     const name = document.getElementById("f-name").value;
     const email = document.getElementById("f-email").value;
     const phone = document.getElementById("f-phone").value;
     const company = document.getElementById("f-company").value;
     const type = document.getElementById("f-type").value;
     const desc = document.getElementById("f-desc").value;

     const subject = encodeURIComponent("AA Electrical Quote Request");

     const body = encodeURIComponent(
      `Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Company: ${company}
      Project Type: ${type}

      Project Description:
      ${desc}`
        );

        window.location.href =
        `mailto:duane@aaelectrical.co.za?subject=${subject}&body=${body}`;
      });  
  
    // ── HERO PARALLAX ───────────────────────────────
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) heroContent.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }, { passive: true });
  
    // ── NUMBER COUNTER ───────────────────────────────
    const numberEls = document.querySelectorAll('[data-count]');
    if (numberEls.length) {
      const countObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      numberEls.forEach(el => countObserver.observe(el));
    }
  
    function animateCount(el) {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
  
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
  
      requestAnimationFrame(step);
    }
  a
  });
