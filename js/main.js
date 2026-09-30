(function () {
  var header = document.getElementById('header');
  var topLink = document.getElementById('top-link');

  // Header dính + nút lên đầu trang
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('stuck', y > header.offsetHeight);
    topLink.classList.toggle('active', y > 100);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  topLink.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Popup đăng nhập & menu mobile
  function closeAll() {
    document.querySelectorAll('.overlay.open').forEach(function (el) {
      el.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  function open(id) {
    closeAll();
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      open(btn.getAttribute('data-open'));
    });
  });

  document.querySelectorAll('.overlay').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.classList.contains('overlay-close')) closeAll();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  // Bản demo: chặn submit form
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  // Form liên hệ (trang Chính sách trách nhiệm)
  var contactForm = document.getElementById('contact-form');
  var contactSuccess = document.getElementById('contact-success');
  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', function () {
      contactForm.hidden = true;
      contactSuccess.hidden = false;
      contactForm.reset();
    });
    document.getElementById('contact-back').addEventListener('click', function (e) {
      e.preventDefault();
      contactSuccess.hidden = true;
      contactForm.hidden = false;
    });
  }

  // Nút chia sẻ: gắn URL trang hiện tại
  var pageUrl = encodeURIComponent(location.href);
  var pageTitle = encodeURIComponent(document.title);
  document.querySelectorAll('[data-share]').forEach(function (a) {
    if (a.getAttribute('data-share') === 'facebook') {
      a.href = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
    } else {
      a.href = 'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle;
    }
  });
})();
