/* =====================================================================
   RAVINDU RAVISARA // PORTFOLIO — main.js
   Vanilla JS. No frameworks.
   ===================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* Toggle between the engineering portfolio and the artist profile. */
  (function artistMode() {
    const toggles = document.querySelectorAll('[data-artist-toggle]');
    if (!toggles.length) return;
    let tourFrame = null;
    let previousScrollBehavior = '';
    let audioEnabled = false;

    const enableArtistAudio = () => {
      if (!document.body.classList.contains('artist-mode')) return false;
      const trailer = document.getElementById('artist-trailer-player');
      if (!trailer?.contentWindow) return false;
      trailer.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
      trailer.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
      trailer.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
      audioEnabled = true;
      return true;
    };

    const stopArtistTour = () => {
      if (tourFrame) cancelAnimationFrame(tourFrame);
      tourFrame = null;
      if (previousScrollBehavior) {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        previousScrollBehavior = '';
      }
    };

    const runArtistTour = () => {
      stopArtistTour();
      previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      const startedAt = performance.now();
      const tourDuration = 14000;
      const startY = 0;
      window.scrollTo(0, startY);

      const step = (now) => {
        const elapsed = now - startedAt;
        const pageBottom = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (elapsed <= tourDuration) {
          const progress = elapsed / tourDuration;
          window.scrollTo(0, pageBottom * progress);
          tourFrame = requestAnimationFrame(step);
          return;
        }
        const returnProgress = Math.min(1, (elapsed - tourDuration) / tourDuration);
        window.scrollTo(0, pageBottom * (1 - returnProgress));
        if (returnProgress < 1) tourFrame = requestAnimationFrame(step);
        else stopArtistTour();
      };

      tourFrame = requestAnimationFrame(step);
    };

    const setMode = (isArtist) => {
      if (!isArtist) stopArtistTour();
      if (!isArtist) audioEnabled = false;
      document.body.classList.toggle('artist-mode', isArtist);
      document.documentElement.dataset.profile = isArtist ? 'artist' : 'engineering';
      const trailer = document.getElementById('artist-trailer-player');
      if (trailer) {
        trailer.src = isArtist ? trailer.dataset.src : '';
      }
      toggles.forEach((toggle) => {
        toggle.setAttribute('aria-pressed', String(isArtist));
        toggle.querySelector('.mode-toggle-label').textContent = isArtist ? 'ENGINEERING MODE' : 'ARTIST MODE';
      });
      try { localStorage.setItem('ravindu-profile', isArtist ? 'artist' : 'engineering'); } catch (_) {}
    };
    let isArtist = false;
    try { isArtist = localStorage.getItem('ravindu-profile') === 'artist'; } catch (_) {}
    setMode(isArtist);
    ['pointerdown', 'keydown', 'touchstart'].forEach((eventName) => {
      window.addEventListener(eventName, () => {
        if (!audioEnabled) enableArtistAudio();
      }, { passive: eventName !== 'keydown' });
    });
    toggles.forEach((toggle) => toggle.addEventListener('click', () => {
      const nextMode = !document.body.classList.contains('artist-mode');
      setMode(nextMode);
      if (!nextMode) return;
      enableArtistAudio();

      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu?.classList.contains('open')) {
        document.getElementById('menu-close')?.click();
      }
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (prefersReducedMotion) {
            document.getElementById('artist-work')?.scrollIntoView({ behavior: 'auto', block: 'start' });
          } else {
            runArtistTour();
          }
        });
      });
    }));

    ['wheel', 'touchstart', 'keydown'].forEach((eventName) => {
      window.addEventListener(eventName, stopArtistTour, { passive: eventName !== 'keydown' });
    });
  })();

  const fallbackArtistWorks = [
    { title: 'Dase Kathawai', published: '2025-05-13', videoId: 'bpbPM7gEpno', url: 'https://www.youtube.com/watch?v=bpbPM7gEpno', thumbnail: 'https://i.ytimg.com/vi/bpbPM7gEpno/hqdefault.jpg' },
    { title: 'Wassane', published: '2024-07-13', videoId: 'lHN6PVn7trA', url: 'https://www.youtube.com/watch?v=lHN6PVn7trA', thumbnail: 'https://i.ytimg.com/vi/lHN6PVn7trA/hqdefault.jpg' },
    { title: 'Hitha Niwena', published: '2024-12-22', videoId: 'RrKDqyG2Oik', url: 'https://www.youtube.com/watch?v=RrKDqyG2Oik', thumbnail: 'https://i.ytimg.com/vi/RrKDqyG2Oik/hqdefault.jpg' }
  ];
  const fallbackCompositions = [
    { title: 'Oba magemai', videoId: 'Lv28G1RKgY4', url: 'https://www.youtube.com/watch?v=Lv28G1RKgY4', thumbnail: 'https://i.ytimg.com/vi/Lv28G1RKgY4/hqdefault.jpg' },
    { title: 'Dewliye Mage', videoId: 'aie43g0Ayvw', url: 'https://www.youtube.com/watch?v=aie43g0Ayvw', thumbnail: 'https://i.ytimg.com/vi/aie43g0Ayvw/hqdefault.jpg' },
    { title: 'Sihine', videoId: 'soR1Vj6yC4s', url: 'https://www.youtube.com/watch?v=soR1Vj6yC4s', thumbnail: 'https://i.ytimg.com/vi/soR1Vj6yC4s/hqdefault.jpg' },
    { title: 'Heena Raaka', videoId: 'vhPEGyESUvU', url: 'https://www.youtube.com/watch?v=vhPEGyESUvU', thumbnail: 'https://i.ytimg.com/vi/vhPEGyESUvU/hqdefault.jpg' },
    { title: 'Saragaye', videoId: 'NS6Z5xwuXlw', url: 'https://www.youtube.com/watch?v=NS6Z5xwuXlw', thumbnail: 'https://i.ytimg.com/vi/NS6Z5xwuXlw/hqdefault.jpg' }
  ];

  function renderArtistWorks(works, isLiveData, containerId = 'artist-work-grid', isComposition = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    works.slice(0, 6).forEach((work, index) => {
      const title = work.title.replace(/^Ravindu Ravisara\s*[-|:]\s*/i, '').trim();
      const displayTitle = /oba magemai/i.test(title)
        ? 'Oba magemai'
        : /dewliye mage/i.test(title)
          ? 'Dewliye Mage'
          : /sihine/i.test(title)
            ? 'Sihine'
            : /dase kathawai/i.test(title)
        ? 'Dase Kathawai'
        : /hitha niwena/i.test(title)
          ? 'Hitha Niwena'
          : /wassane/i.test(title)
            ? 'Wassane'
            : /dakina hamaware/i.test(title)
              ? 'Dakina Hamaware'
              : title;
      const published = work.published
        ? new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(work.published))
        : '';
      const isTrailer = /trailer/i.test(title);
      const card = document.createElement('article');
      card.className = 'artist-work-card reveal';
      card.style.setProperty('--d', `${(index % 3) * 90}ms`);
      const thumbnail = work.thumbnail
        ? `<img class="work-cover-image" src="${escapeAttr(work.thumbnail)}" alt="" loading="lazy">`
        : '';
      card.innerHTML = `
        <div class="work-cover cover-${(index % 6) + 1}">
          ${thumbnail}
          <span>${String(index + 1).padStart(2, '0')} / ${isComposition ? 'COMPOSITION' : isTrailer ? 'TRAILER' : 'RELEASE'}</span>
          <strong>${escapeHtml(displayTitle)}</strong>
          <small>${isComposition ? 'LYRICS · COMPOSITION · COLLABORATION' : isLiveData ? 'YOUTUBE // RAVINDU RAVISARA' : 'RAVINDU RAVISARA'}</small>
        </div>
        <div class="work-meta">
          <h3>${escapeHtml(displayTitle)}</h3>
          <p>${isComposition ? 'Composition collaboration' : isLiveData && published ? `Published on YouTube · ${published}` : 'Original release'}</p>
          <a href="${escapeAttr(work.url)}" target="_blank" rel="noopener">${isTrailer ? 'WATCH TRAILER' : 'WATCH VIDEO'} ↗</a>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }

  async function loadArtistWorks() {
    try {
      const response = await fetch('/api/artist-works', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.works) || !data.works.length) throw new Error('EMPTY');
      renderArtistWorks(data.works, true);
      if (Array.isArray(data.compositions) && data.compositions.length) {
        renderArtistWorks(data.compositions, true, 'artist-composition-grid', true);
      }
    } catch (_) {
      renderArtistWorks(fallbackArtistWorks, false);
      renderArtistWorks(fallbackCompositions, false, 'artist-composition-grid', true);
    }
  }

  loadArtistWorks();

  /* Keep the reading position visible without adding another UI control. */
  (function scrollProgress() {
    if (prefersReducedMotion) return;
    let frame;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      document.body.classList.toggle('page-scrolled', window.scrollY > 24);
      frame = null;
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  })();

  /* ------------------------------------------------------------------
     1. TECHNICAL GRID — vertical lines, horizontal lines, + intersections
  ------------------------------------------------------------------ */
  (function buildGrid() {
    const grid = document.getElementById('tech-grid');
    if (!grid) return;

    const vLines = ['12.5%', '37.5%', '62%', '86%'];
    const hLines = ['33%', '71%'];

    vLines.forEach((x) => {
      const el = document.createElement('span');
      el.className = 'grid-line-v';
      el.style.left = x;
      grid.appendChild(el);
    });
    hLines.forEach((y) => {
      const el = document.createElement('span');
      el.className = 'grid-line-h';
      el.style.top = y;
      grid.appendChild(el);
    });
    vLines.forEach((x) => {
      hLines.forEach((y) => {
        const plus = document.createElement('span');
        plus.className = 'plus';
        plus.style.left = x;
        plus.style.top = y;
        grid.appendChild(plus);
      });
    });
  })();

  /* ------------------------------------------------------------------
     2. WORD REVEAL — split .words-pull-up into staggered pull-words
  ------------------------------------------------------------------ */
  (function wordReveal() {
    document.querySelectorAll('.words-pull-up').forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach((word, i) => {
        const wrap = document.createElement('span');
        wrap.className = 'pull-word';
        const inner = document.createElement('span');
        inner.textContent = word;
        inner.style.setProperty('--wd', `${i * 70}ms`);
        wrap.appendChild(inner);
        el.appendChild(wrap);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  })();

  /* ------------------------------------------------------------------
     3. SCROLL REVEAL — IntersectionObserver for .reveal
  ------------------------------------------------------------------ */
  (function scrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  })();

  /* ------------------------------------------------------------------
     4. CURSOR TECH REVEAL — radial spotlight following cursor on portrait
  ------------------------------------------------------------------ */
  (function cursorReveal() {
    if (prefersReducedMotion || !isFinePointer) return;
    const zone = document.getElementById('portrait-zone');
    const reveal = document.getElementById('tech-reveal');
    if (!zone || !reveal) return;

    zone.addEventListener('mousemove', (e) => {
      const rect = zone.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      reveal.style.setProperty('--mx', x.toFixed(2) + '%');
      reveal.style.setProperty('--my', y.toFixed(2) + '%');
      reveal.classList.add('active');
    });
    zone.addEventListener('mouseleave', () => reveal.classList.remove('active'));
  })();

  /* ------------------------------------------------------------------
     5. HERO PARALLAX — spring motion for the layered desktop composition
  ------------------------------------------------------------------ */
  (function heroParallax() {
    if (prefersReducedMotion || !isFinePointer) return;
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(max-width: 767px)').matches) return;

    const layers = [
      ['.hero-copy', 0.35],
      ['.portrait-zone', 0.8],
      ['.ann-1', 0.5],
      ['.ann-2', 0.65],
      ['.ann-3', 0.45],
      ['.status-hud', 0.25]
    ]
      .map(([selector, depth]) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        element.classList.add('hero-parallax');
        return { element, depth };
      })
      .filter(Boolean);

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      layers.forEach(({ element, depth }) => {
        element.style.setProperty('--hero-x', `${(currentX * depth).toFixed(2)}px`);
        element.style.setProperty('--hero-y', `${(currentY * depth).toFixed(2)}px`);
      });
      frame = requestAnimationFrame(tick);
    };

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    });
    hero.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
    });

    tick();
    window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
  })();

  /* ------------------------------------------------------------------
     6. MOBILE MENU
  ------------------------------------------------------------------ */
  (function mobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const openBtn = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('menu-close');
    if (!menu || !openBtn) return;
    let previousFocus = null;

    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open));
      openBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        previousFocus = document.activeElement;
        closeBtn?.focus();
      } else {
        previousFocus?.focus?.();
        previousFocus = null;
      }
    };

    openBtn.addEventListener('click', () => setOpen(true));
    closeBtn.addEventListener('click', () => setOpen(false));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && menu.classList.contains('open')) setOpen(false);
    });
  })();

    /* ------------------------------------------------------------------
      6. PROJECTS — editable data source in data/projects.json
    ------------------------------------------------------------------ */
    /* Project data is loaded from client/data/projects.json. */
    /* The previous embedded project list is intentionally removed. */
    /* ------------------------------------------------------------------ */
  function renderProjects(list) {
    const container = document.getElementById('project-list');
    const moreButton = document.getElementById('projects-more');
    if (!container) return;
    container.innerHTML = '';

    list.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = `project-card reveal${i >= 4 ? ' project-card-more' : ''}`;
      card.style.setProperty('--d', `${(i % 4) * 90}ms`);

      const tech = (p.tech || []).map((t) => `<span>${escapeHtml(t)}</span>`).join('');
      const link = p.url
        ? `<a href="${escapeAttr(p.url)}" target="_blank" rel="noopener">VIEW PROJECT ↗</a>`
        : '';

      card.innerHTML = `
        <div class="p-code">PROJECT_${String(i + 1).padStart(2, '0')}</div>
        <div>
          <h3 class="p-title">${escapeHtml(p.title || '')}</h3>
          <span class="p-cat">${escapeHtml(p.category || 'WEB APPLICATION')}</span>
        </div>
        <div class="p-body">
          <p class="p-problem">${escapeHtml(p.description || '')}</p>
          <p class="p-solution">${escapeHtml(p.highlight || '')}</p>
          <div class="p-tech">${tech}</div>
        </div>
        <div class="p-links">${link}</div>
      `;
      container.appendChild(card);
    });

    if (moreButton) {
      const hasMore = list.length > 4;
      moreButton.hidden = !hasMore;
      moreButton.textContent = hasMore ? 'VIEW MORE' : 'SHOW LESS';
      moreButton.setAttribute('aria-expanded', 'false');
      moreButton.onclick = () => {
        const expanded = moreButton.getAttribute('aria-expanded') === 'true';
        moreButton.setAttribute('aria-expanded', String(!expanded));
        moreButton.textContent = expanded ? 'VIEW MORE' : 'SHOW LESS';
        container.classList.toggle('projects-expanded', !expanded);

        container.querySelectorAll('.project-card-more').forEach((card, index) => {
          card.classList.toggle('is-visible', !expanded);
          card.style.setProperty('--more-delay', `${index * 100}ms`);
        });
      };
    }

    // re-observe new reveal elements
    const items = container.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        }),
        { threshold: 0.08 }
      );
      items.forEach((el) => io.observe(el));
    }
  }

  async function loadProjects() {
    try {
      const res = await fetch('data/projects.json', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('API ' + res.status);
      const projects = await res.json();
      if (!Array.isArray(projects) || !projects.length) throw new Error('EMPTY');
      renderProjects(projects);
    } catch (_) {
      const container = document.getElementById('project-list');
      if (container) container.innerHTML = '<p class="project-fallback-note">[ PROJECT_DATA_UNAVAILABLE ]</p>';
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  loadProjects();

  /* ------------------------------------------------------------------
     7. CONTACT FORM — POST /api/contact, mailto fallback
  ------------------------------------------------------------------ */
  (function contactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('cf-status');
    if (!form || !status) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      status.className = 'cf-status';
      if (!name || !email || !message) {
        status.textContent = '[ VALIDATION // all fields are required ]';
        status.classList.add('err');
        return;
      }

      const btn = form.querySelector('.cf-submit');
      btn.disabled = true;
      status.textContent = '[ TRANSMITTING… ]';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || 'SEND_FAILED');

        status.textContent = '[ MESSAGE RECEIVED // I will get back to you soon ]';
        status.classList.add('ok');
        form.reset();
      } catch (err) {
        // graceful fallback: open mail client with prefilled content
        const subject = encodeURIComponent(`Portfolio inquiry — ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        const reason = err.message === 'EMAIL_SERVICE_NOT_CONFIGURED'
          ? 'EMAIL SERVICE NOT CONFIGURED'
          : err.message === 'EMAIL_DELIVERY_FAILED'
            ? 'EMAIL DELIVERY FAILED'
            : 'API OFFLINE';
        status.innerHTML = `[ ${reason} // <a href="mailto:ravinduravisara@gmail.com?subject=${subject}&body=${body}" class="text-[#AFDDFF] underline">open in your email app ↗</a> ]`;
        status.classList.add('err');
      } finally {
        btn.disabled = false;
      }
    });
  })();

  /* ------------------------------------------------------------------
     8. MISC
  ------------------------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
