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

  // Danh sách sản phẩm: lọc theo nhóm + tìm kiếm (không phân biệt dấu, hoa thường)
  var norm = function (str) {
    return str.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').trim();
  };
  var list = document.getElementById('product-list');
  var cards = list ? list.querySelectorAll('.p-card') : [];
  var filters = document.querySelectorAll('.filter');
  var empty = document.getElementById('search-empty');
  var info = document.getElementById('search-info');
  var state = { tag: 'all', q: '' };

  function applyList() {
    var words = norm(state.q).split(/\s+/).filter(Boolean);
    var shown = 0;
    cards.forEach(function (c) {
      var text = norm(c.getAttribute('data-name') || '');
      var okTag = state.tag === 'all' || (' ' + c.getAttribute('data-tags') + ' ').indexOf(' ' + state.tag + ' ') !== -1;
      var okQ = words.every(function (w) { return text.indexOf(w) !== -1; });
      c.hidden = !(okTag && okQ);
      if (!c.hidden) shown++;
    });
    filters.forEach(function (b) {
      var on = b.getAttribute('data-filter') === state.tag;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    if (empty) empty.hidden = shown > 0;
    if (info) {
      info.hidden = !words.length;
      info.innerHTML = '';
      if (words.length) {
        info.append('Kết quả cho ');
        var b = document.createElement('b');
        b.textContent = '“' + state.q.trim() + '”';
        info.append(b, ': ' + shown + ' sản phẩm');
        var reset = document.createElement('button');
        reset.type = 'button';
        reset.textContent = 'Xem tất cả';
        reset.addEventListener('click', function () { setSearch(''); });
        info.append(reset);
      }
    }
  }

  function setSearch(q) {
    state.q = q;
    if (q) state.tag = 'all';
    document.querySelectorAll('form[data-search] input').forEach(function (i) { i.value = q; });
    applyList();
  }

  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      state.tag = b.getAttribute('data-filter');
      applyList();
    });
  });

  document.querySelectorAll('form[data-search]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (!list) return;                  // trang khác: để form chuyển về index.html?q=...
      e.preventDefault();
      closeAll();
      setSearch(f.querySelector('input').value);
      document.getElementById('san-pham').scrollIntoView({ behavior: 'smooth' });
    });
  });

  var q0 = new URLSearchParams(location.search).get('q');
  if (q0 && list) setSearch(q0);

  // Trang chi tiết: thư viện ảnh + xem ảnh lớn
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var thumbs = gallery.querySelectorAll('.pd-thumb');
    var mainImg = document.getElementById('pd-main-img');
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lb-img');
    var cur = 0;

    var show = function (i) {
      cur = (i + thumbs.length) % thumbs.length;
      var t = thumbs[cur];
      mainImg.src = lbImg.src = t.getAttribute('data-src');
      mainImg.width = t.getAttribute('data-w');
      mainImg.height = t.getAttribute('data-h');
      thumbs.forEach(function (x) { x.classList.toggle('active', x === t); });
      document.querySelectorAll('[data-cur]').forEach(function (x) { x.textContent = cur + 1; });
      var box = t.parentNode;
      box.scrollLeft = t.offsetLeft - box.offsetLeft - (box.clientWidth - t.offsetWidth) / 2;
    };
    var openLb = function () { lb.hidden = false; document.body.style.overflow = 'hidden'; };
    var closeLb = function () { lb.hidden = true; document.body.style.overflow = ''; };

    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { show(i); }); });
    gallery.querySelector('.pd-prev').addEventListener('click', function () { show(cur - 1); });
    gallery.querySelector('.pd-next').addEventListener('click', function () { show(cur + 1); });
    gallery.querySelector('.pd-zoom').addEventListener('click', openLb);
    mainImg.addEventListener('click', openLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });

    // Vuốt trái/phải trên điện thoại
    [gallery.querySelector('.pd-main'), lb].forEach(function (el) {
      var x0 = null;
      el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      el.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
        x0 = null;
      });
    });

    // Tải trước ảnh lớn kế tiếp cho mượt
    mainImg.addEventListener('load', function () {
      var next = thumbs[(cur + 1) % thumbs.length];
      new Image().src = next.getAttribute('data-src');
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
