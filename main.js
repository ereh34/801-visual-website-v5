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
