// Landon Farley Real Estate — site scripts
(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Fade-in on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Forms: opens the visitor's email app with the message filled in (no sign-up needed).
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var lines = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !el.value) return;
        var label = el.getAttribute('data-label') || el.name;
        lines.push(label + ': ' + el.value);
      });
      var subject = form.getAttribute('data-subject') || 'Website inquiry';
      var href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var t = form.querySelector('.thanks');
      if (t) t.style.display = 'block';
      window.location.href = href;
    });
  });

  // Listings
  var grid = document.getElementById('listing-grid');
  if (grid && window.LISTINGS && window.LISTINGS.length) {
    var empty = document.getElementById('listing-empty');
    if (empty) empty.style.display = 'none';
    grid.innerHTML = window.LISTINGS.map(function (l) {
      return '<a class="listing reveal in" href="' + (l.link || 'lets-talk.html') + '">' +
        '<div class="ph" style="background-image:url(\'' + l.photo + '\')">' +
        (l.status ? '<span class="tagline">' + l.status + '</span>' : '') + '</div>' +
        '<div class="body"><div class="price">' + l.price + '</div>' +
        '<div class="addr">' + l.address + '</div>' +
        '<div class="meta">' + l.beds + ' Bd &middot; ' + l.baths + ' Ba &middot; ' + l.sqft + ' Sq Ft</div></div></a>';
    }).join('');
  }
})();
