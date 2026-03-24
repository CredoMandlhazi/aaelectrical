/* =========================================
   AA ELECTRICAL — LOADER.JS
   Letter-by-letter animation, then slide up
   ========================================= */

   (function () {

    const LOADER_ID     = 'loader';
    const LETTERS_ID    = 'loaderLetters';
    const TAGLINE_ID    = 'loaderTagline';
    const LINE_ID       = 'loaderLine';
    const PROGRESS_ID   = 'loaderProgress';
  
    // Only show the full loader on first visit per session
    // On inner pages just do a fast fade
    const isHomePage = window.location.pathname === '/' ||
                       window.location.pathname.endsWith('index.html') ||
                       window.location.pathname === '';
  
    const PER_LETTER_DELAY = 130;   // ms between each letter
    const AFTER_LAST_PAUSE = 600;   // ms after last letter before glow
    const AFTER_GLOW_PAUSE = 500;   // ms after glow before slide-up
    const SLIDE_DURATION   = 1000;  // matches CSS transition
  
    function buildLetters() {
      const container = document.getElementById(LETTERS_ID);
      if (!container) return;
  
      // AA row
      const aaRow = document.createElement('div');
      aaRow.className = 'loader-row loader-row-aa';
  
      ['A', 'A'].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'l-char aa-char';
        span.textContent = ch;
        aaRow.appendChild(span);
      });
      container.appendChild(aaRow);
  
      // ELECTRICAL row
      const elecRow = document.createElement('div');
      elecRow.className = 'loader-row';
  
      'ELECTRICAL'.split('').forEach(ch => {
        const span = document.createElement('span');
        span.className = 'l-char elec-char';
        span.textContent = ch;
        elecRow.appendChild(span);
      });
      container.appendChild(elecRow);
    }
  
    function runLoader() {
      const loader   = document.getElementById(LOADER_ID);
      const tagline  = document.getElementById(TAGLINE_ID);
      const line     = document.getElementById(LINE_ID);
      const progress = document.getElementById(PROGRESS_ID);
  
      if (!loader) return;
  
      buildLetters();
  
      const allChars = document.querySelectorAll('.l-char');
      const total    = allChars.length;
  
      // Start progress bar
      if (progress) {
        setTimeout(() => { progress.style.width = '100%'; }, 60);
      }
  
      // Reveal each character sequentially
      let delay = 180;
      allChars.forEach((ch, i) => {
        setTimeout(() => {
          ch.classList.add('visible');
  
          // Last character
          if (i === total - 1) {
            // Show tagline
            setTimeout(() => {
              if (tagline) tagline.classList.add('show');
              if (line)    line.classList.add('expand');
            }, 200);
  
            // Add glow to all
            setTimeout(() => {
              allChars.forEach((c, j) => {
                setTimeout(() => c.classList.add('glow'), j * 55);
              });
            }, AFTER_LAST_PAUSE);
  
            // Slide up
            setTimeout(() => {
              loader.classList.add('slide-up');
              setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = '';
              }, SLIDE_DURATION);
            }, AFTER_LAST_PAUSE + AFTER_GLOW_PAUSE);
          }
        }, delay);
  
        delay += PER_LETTER_DELAY;
        // Slightly longer pause between AA and ELECTRICAL groups
        if (i === 1) delay += 180;
      });
    }
  
    function quickLoad() {
      const loader = document.getElementById(LOADER_ID);
      if (!loader) return;
      // Just fade out fast on inner pages
      loader.style.transition = 'opacity 0.4s ease';
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 450);
    }
  
    // Prevent scroll during load
    document.body.style.overflow = 'hidden';
  
    document.addEventListener('DOMContentLoaded', () => {
      if (isHomePage) {
        runLoader();
      } else {
        quickLoad();
      }
    });
  
  })();