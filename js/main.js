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

  // Menu mobile
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

  // Bản demo: chặn submit form (trừ ô tìm kiếm, xử lý riêng bên dưới)
  document.querySelectorAll('form:not([data-search])').forEach(function (f) {
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

  // Đồng hồ "Ưu đãi tháng này": đếm ngược đến hết tháng
  var timer = document.querySelector('[data-countdown]');
  if (timer) {
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var el = function (k) { return timer.querySelector('[data-' + k + ']'); };
    var now0 = new Date();
    var end = new Date(now0.getFullYear(), now0.getMonth() + 1, 1);
    var tick = function () {
      var left = Math.max(0, Math.floor((end - new Date()) / 1000));
      el('d').textContent = pad(Math.floor(left / 86400));
      el('h').textContent = pad(Math.floor(left % 86400 / 3600));
      el('m').textContent = pad(Math.floor(left % 3600 / 60));
      el('s').textContent = pad(left % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  // Tìm kiếm trong 5 sản phẩm (không phân biệt dấu, hoa thường)
  var norm = function (str) {
    return str.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').trim();
  };
  var cards = document.querySelectorAll('.p-card');
  var empty = document.getElementById('search-empty');

  function runSearch(q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length || !cards.length) return;
    var first = null;
    cards.forEach(function (c) {
      var text = norm(c.getAttribute('data-name') || '');
      var hit = words.every(function (w) { return text.indexOf(w) !== -1; });
      c.classList.toggle('is-found', hit);
      if (hit && !first) first = c;
    });
    if (empty) empty.hidden = !!first;
    (first || document.getElementById('san-pham')).scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () {
      cards.forEach(function (c) { c.classList.remove('is-found'); });
    }, 4000);
  }

  document.querySelectorAll('form[data-search]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      var q = f.querySelector('input').value;
      if (!cards.length) return;          // trang khác: để form chuyển về index.html?q=...
      e.preventDefault();
      closeAll();
      runSearch(q);
    });
  });

  var q0 = new URLSearchParams(location.search).get('q');
  if (q0) {
    document.querySelectorAll('form[data-search] input').forEach(function (i) { i.value = q0; });
    setTimeout(function () { runSearch(q0); }, 300);
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
