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
    lightboxPhotos = Array.from(document.querySelectorAll('[data-lightbox="true"] img')).map((img) => {
      return {
        src: img.src,
        alt: img.alt,
        title: img.closest('.port-item').querySelector('h4')?.textContent || 'Photo'
      };
    });
  }

  // Open lightbox
  document.addEventListener('click', function(e) {
    const img = e.target.closest('[data-lightbox="true"] img');
    if (img) {
      const photoSrc = img.src;
      currentIndex = lightboxPhotos.findIndex(p => p.src === photoSrc);
      showPhoto(currentIndex);
      lightbox.classList.add('active');
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
    showPhoto(currentIndex);
  }

  function showPhoto(index) {
    if (lightboxPhotos.length === 0) return;
    lightboxImg.src = lightboxPhotos[index].src;
    lightboxImg.alt = lightboxPhotos[index].alt;
    lightboxTitle.textContent = lightboxPhotos[index].title;
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