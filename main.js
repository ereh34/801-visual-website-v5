/* ══════════════════════════════════════════
   801 VISUAL — SHARED JAVASCRIPT
   ══════════════════════════════════════════ */

/* ── NAV SCROLL EFFECT ── */
window.addEventListener('scroll', function () {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

/* ── MOBILE NAV TOGGLE ── */
function toggleNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}

/* ── FAQ ACCORDION ── */
function toggleFaq(el) {
  el.parentElement.classList.toggle('open');
}

/* ── PORTFOLIO FILTERS (work.html)
   Each filter button only filters the grid inside its own section.
   Sports filters only affect #sportsGrid, corporate filters only #corpGrid.
── */
document.querySelectorAll('.work-filter').forEach(function (btn) {
  btn.addEventListener('click', function () {
    /* Deactivate siblings in the same filter bar only */
    var filterBar = this.closest('.work-filters');
    filterBar.querySelectorAll('.work-filter').forEach(function (b) {
      b.classList.remove('active');
    });
    this.classList.add('active');

    var filter = this.dataset.filter;

    /* Find the nearest port-grid within the same section */
    var section = this.closest('section');
    var grid = section ? section.querySelector('.port-grid') : null;
    if (!grid) return;

    grid.querySelectorAll('.port-item').forEach(function (item) {
      var isAll = (filter === 'all-sports' || filter === 'all-corp');
      item.style.display = (isAll || item.dataset.cat === filter) ? '' : 'none';
    });
  });
});

/* ── SCROLL ANIMATIONS ── */
if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(function (el) {
    observer.observe(el);
  });
}

/* ── LIGHTBOX (work.html) ── */
(function() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let lightboxPhotos = [];

  // Initialize lightbox photos on page load
  function initLightbox() {
    lightboxPhotos = Array.from(document.querySelectorAll('[data-lightbox="true"]')).map((item) => {
      const mediaType = item.getAttribute('data-media-type');
      if (mediaType === 'video') {
        const iframe = item.querySelector('iframe');
        if (iframe) {
          return {
            type: 'video',
            src: iframe.src,
            title: item.querySelector('h4')?.textContent || 'Video'
          };
        }
      } else {
        const img = item.querySelector('img');
        if (img && img.alt !== 'Game Day Video Thumbnail') {
          return {
            type: 'image',
            src: img.src,
            alt: img.alt,
            title: item.querySelector('h4')?.textContent || 'Photo'
          };
        }
      }
      return null;
    }).filter(Boolean);
  }

  // Open lightbox on item click
  document.addEventListener('click', function(e) {
    const item = e.target.closest('[data-lightbox="true"]');
    if (item) {
      const mediaType = item.getAttribute('data-media-type');
      let src;
      if (mediaType === 'video') {
        const iframe = item.querySelector('iframe');
        if (iframe) src = iframe.src;
      } else {
        const img = item.querySelector('img');
        if (img) src = img.src;
      }
      if (!src) return;
      currentIndex = lightboxPhotos.findIndex(p => p.src === src);
      if (currentIndex >= 0) {
        showMedia(currentIndex);
        lightbox.classList.add('active');
      }
    }
  });

  // Close lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Navigation
  lightboxPrev.addEventListener('click', () => navigate(-1));
  lightboxNext.addEventListener('click', () => navigate(1));

  function navigate(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = lightboxPhotos.length - 1;
    if (currentIndex >= lightboxPhotos.length) currentIndex = 0;
    showMedia(currentIndex);
  }

  function showMedia(index) {
    if (lightboxPhotos.length === 0) return;
    const media = lightboxPhotos[index];
    const mediaContainer = document.getElementById('lightboxMedia');
    mediaContainer.innerHTML = '';
    if (media.type === 'image') {
      const img = document.createElement('img');
      img.src = media.src;
      img.alt = media.alt;
      mediaContainer.appendChild(img);
    } else if (media.type === 'video') {
      const iframe = document.createElement('iframe');
      iframe.src = media.src;
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;';
      iframe.allowFullscreen = true;
      mediaContainer.appendChild(iframe);
    }
    lightboxTitle.textContent = media.title;
    lightboxTitle.style.display = 'block';
  }

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();