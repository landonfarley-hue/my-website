// Landon Farley Real Estate — site scripts

/* ============ CONTACT FORM SETUP (one-time) ============
   1. Go to https://web3forms.com and click "Create your Access Key".
   2. Enter LandonFarley@kw.com. They email you a key (it looks like a long string of letters and numbers).
   3. Paste it between the quotation marks below, replacing PASTE-YOUR-ACCESS-KEY-HERE. Commit the change.
   From then on, every form submission lands in your inbox. Visitors never leave your site. */
var WEB3FORMS_KEY = "54ef5727-9d0a-4a08-8fc3-3c4fa1a31e29";

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

  // Forms: submit in the page (no email app), delivered to your inbox via Web3Forms.
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type="submit"]');
    var label = submit ? submit.textContent : '';

    function show(msg, ok) {
      status.textContent = msg;
      status.className = 'form-status ' + (ok ? 'ok' : 'err');
      status.hidden = false;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      status.hidden = true;

      var hp = form.querySelector('.hp');
      if (hp && hp.checked) return; // spam bot

      if (WEB3FORMS_KEY.indexOf('PASTE') === 0) {
        show('This form is almost ready. In the meantime, please call or text (605) 251-3116.', false);
        return;
      }

      var data = { access_key: WEB3FORMS_KEY, subject: form.getAttribute('data-subject') || 'Website inquiry', from_name: 'Landon Farley Website' };
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name && el.value && el.type !== 'checkbox' && el.type !== 'submit') data[el.name] = el.value;
      });

      submit.disabled = true;
      submit.textContent = 'Sending…';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json && json.success) {
            form.reset();
            form.classList.add('sent');
            show('Thank you! Your message was sent. I’ll be in touch very soon.', true);
          } else {
            throw new Error('send failed');
          }
        })
        .catch(function () {
          show('Sorry, that didn’t go through. Please call or text (605) 251-3116 and we’ll get you taken care of.', false);
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = label;
        });
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
