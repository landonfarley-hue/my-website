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

      var missing = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (el) { return !el.value.trim(); });
      if (missing.length) {
        show('Please fill in the required fields.', false);
        missing[0].focus();
        return;
      }

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
            show(form.getAttribute('data-success') || 'Thank you! Your message was sent. I’ll be in touch very soon.', true);
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


  // Mortgage payment calculator
  document.querySelectorAll('[data-calc]').forEach(function (c) {
    var f = function (n) { return c.querySelector('[name="' + n + '"]'); };
    var out = function (n) { return c.querySelector('[data-out="' + n + '"]'); };
    var money = function (v) {
      return '$' + Math.round(v).toLocaleString('en-US');
    };
    var num = function (el) {
      var v = parseFloat(el.value);
      return isFinite(v) && v > 0 ? v : 0;
    };
    var syncing = false;

    function calc() {
      var price = num(f('price'));
      var down = Math.min(num(f('down')), price);
      var loan = Math.max(price - down, 0);
      var years = parseInt(f('term').value, 10) || 30;
      var n = years * 12;
      var r = num(f('rate')) / 100 / 12;
      var pi = loan === 0 ? 0 : (r === 0 ? loan / n : loan * r / (1 - Math.pow(1 + r, -n)));
      var tax = price * num(f('tax')) / 100 / 12;
      var ins = num(f('ins')) / 12;
      var downPct = price > 0 ? down / price * 100 : 0;
      var pmi = (loan > 0 && downPct < 20) ? loan * 0.005 / 12 : 0;
      var hoa = num(f('hoa'));
      var total = pi + tax + ins + pmi + hoa;

      if (price <= 0) {
        // No price entered yet: show dashes instead of a misleading partial total.
        ['total', 'pi', 'tax', 'ins', 'pmi', 'hoa', 'loan', 'interest'].forEach(function (k) { out(k).textContent = '—'; });
        c.querySelector('[data-row="pmi"]').hidden = true;
        c.querySelector('[data-row="hoa"]').hidden = true;
        c.querySelector('[data-note="pmi"]').hidden = true;
        c.querySelectorAll('[data-seg]').forEach(function (s) { s.style.display = 'none'; });
        return;
      }

      out('total').textContent = money(total);
      out('pi').textContent = money(pi);
      out('tax').textContent = money(tax);
      out('ins').textContent = money(ins);
      out('pmi').textContent = money(pmi);
      out('hoa').textContent = money(hoa);
      out('loan').textContent = money(loan);
      out('interest').textContent = money(Math.max(pi * n - loan, 0));
      c.querySelector('[data-row="pmi"]').hidden = pmi === 0;
      c.querySelector('[data-row="hoa"]').hidden = hoa === 0;
      c.querySelector('[data-note="pmi"]').hidden = pmi === 0;

      var parts = { pi: pi, tax: tax, ins: ins, pmi: pmi, hoa: hoa };
      Object.keys(parts).forEach(function (k) {
        var seg = c.querySelector('[data-seg="' + k + '"]');
        seg.style.width = total > 0 ? (parts[k] / total * 100) + '%' : '0%';
        seg.style.display = parts[k] > 0 ? 'block' : 'none';
      });
    }

    // Keep the down payment $ and % in step with each other and the price.
    f('down').addEventListener('input', function () {
      if (syncing) return; syncing = true;
      var p = num(f('price'));
      f('downpct').value = p > 0 ? Math.round(num(f('down')) / p * 1000) / 10 : 0;
      syncing = false; calc();
    });
    f('downpct').addEventListener('input', function () {
      if (syncing) return; syncing = true;
      var pct = Math.min(num(f('downpct')), 100);
      f('down').value = Math.round(num(f('price')) * pct / 100);
      syncing = false; calc();
    });
    f('price').addEventListener('input', function () {
      var pct = Math.min(num(f('downpct')), 100);
      f('down').value = Math.round(num(f('price')) * pct / 100);
      calc();
    });
    ['term', 'rate', 'tax', 'ins', 'hoa'].forEach(function (n) {
      f(n).addEventListener('input', calc);
      f(n).addEventListener('change', calc);
    });
    calc();
  });


  // Rent vs. buy calculator
  document.querySelectorAll('[data-rvb]').forEach(function (c) {
    var f = function (n) { return c.querySelector('[name="' + n + '"]'); };
    var out = function (n) { return c.querySelector('[data-out="' + n + '"]'); };
    var money = function (v) { return (v < 0 ? '-' : '') + '$' + Math.round(Math.abs(v)).toLocaleString('en-US'); };
    var num = function (el) { var v = parseFloat(el.value); return isFinite(v) && v > 0 ? v : 0; };

    function model() {
      var price = num(f('price')), dpct = Math.min(num(f('downpct')), 100);
      var rate = num(f('rate')) / 1200, term = parseInt(f('term').value, 10) || 30, n = term * 12;
      var taxr = num(f('tax')) / 100, ins = num(f('ins')), maint = num(f('maint')) / 100;
      var closing = num(f('closing')) / 100, sell = num(f('sell')) / 100;
      var rent0 = num(f('rent')), rg = num(f('rentgrow')) / 100;
      var ap = num(f('apprec')) / 100, ret = num(f('ret')) / 100;
      var loan = price * (1 - dpct / 100);
      var pi = loan === 0 ? 0 : (rate === 0 ? loan / n : loan * rate / (1 - Math.pow(1 + rate, -n)));
      var upfront = price * dpct / 100 + price * closing;
      var pmiOn = dpct < 20, bal = loan, cumBuy = 0, cumRent = 0, rows = [], own1 = 0;
      for (var m = 1; m <= 360; m++) {
        var y = Math.floor((m - 1) / 12);
        var val = price * Math.pow(1 + ap, y);
        var pmi = (pmiOn && bal > price * 0.8) ? loan * 0.005 / 12 : 0;
        var pay = 0;
        if (m <= n) {
          var intr = bal * rate, prin = Math.min(pi - intr, bal);
          bal = Math.max(bal - prin, 0); pay = pi;
        }
        var own = pay + pmi + val * taxr / 12 + ins / 12 * Math.pow(1 + ap, y) + val * maint / 12;
        if (m === 1) own1 = own;
        cumBuy += own;
        cumRent += rent0 * Math.pow(1 + rg, y);
        if (m % 12 === 0) {
          var yr = m / 12;
          var proceeds = price * Math.pow(1 + ap, yr) * (1 - sell) - bal;
          var opp = upfront * (Math.pow(1 + ret, yr) - 1);
          rows.push({ yr: yr, buy: upfront + cumBuy - proceeds + opp, rent: cumRent, upfront: upfront, paid: cumBuy, proceeds: proceeds, opp: opp });
        }
      }
      return { price: price, rows: rows, own1: own1, rent1: rent0 };
    }

    function calc() {
      var yrs = Math.min(Math.max(Math.round(num(f('years'))) || 7, 1), 30);
      var mdl = model();
      out('yrs').textContent = yrs;
      if (mdl.price <= 0) {
        ['buy', 'rent', 'own1', 'rent1', 'upfront', 'paid', 'proceeds', 'opp'].forEach(function (k) { out(k).textContent = '—'; });
        out('verdict').textContent = 'Enter a home price to compare.';
        out('be').textContent = ''; out('rows').innerHTML = '';
        return;
      }
      var r = mdl.rows[yrs - 1];
      out('buy').textContent = money(r.buy);
      out('rent').textContent = money(r.rent);
      out('own1').textContent = money(mdl.own1);
      out('rent1').textContent = money(mdl.rent1);
      out('upfront').textContent = money(r.upfront);
      out('paid').textContent = money(r.paid);
      out('proceeds').textContent = money(r.proceeds);
      out('opp').textContent = money(r.opp);
      var diff = r.rent - r.buy, base = Math.max(r.rent, 1);
      if (Math.abs(diff) < base * 0.01) out('verdict').textContent = 'About even over ' + yrs + ' years';
      else if (diff > 0) out('verdict').textContent = 'Buying costs about ' + money(diff) + ' less';
      else out('verdict').textContent = 'Renting costs about ' + money(-diff) + ' less';

      var lastWorse = 0;
      mdl.rows.forEach(function (x) { if (x.buy >= x.rent) lastWorse = x.yr; });
      out('be').textContent = lastWorse >= 30 ? 'With these numbers, buying does not catch up with renting within 30 years.'
        : (lastWorse === 0 ? 'Buying costs less than renting from the first year.' : 'Break-even: buying starts costing less than renting in year ' + (lastWorse + 1) + '.');

      out('rows').innerHTML = [1, 3, 5, 7, 10, 15, 30].map(function (y) {
        var x = mdl.rows[y - 1], buyWins = x.buy < x.rent;
        return '<tr><td>' + y + '</td><td>' + money(x.buy) + '</td><td>' + money(x.rent) + '</td><td class="win">' + (buyWins ? 'Buy' : 'Rent') + '</td></tr>';
      }).join('');
    }

    c.querySelectorAll('input, select').forEach(function (el) {
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });
    calc();
  });


  // Vendor directory
  var vgrid = document.getElementById('vendor-grid');
  if (vgrid) {
    var cats = window.VENDOR_CATEGORIES || [];
    var vendors = (window.VENDORS || []).slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    var search = document.getElementById('vendor-search');
    var chipsEl = document.getElementById('vendor-chips');
    var countEl = document.getElementById('vendor-count');
    var emptyEl = document.getElementById('vendor-empty');
    var active = '';

    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text) e.textContent = text;
      return e;
    }
    function link(href, text, external) {
      var a = el('a', '', text);
      a.href = href;
      if (external) { a.target = '_blank'; a.rel = 'noopener'; }
      return a;
    }
    function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : ''; }

    // Category chips + form dropdown
    function addChip(label, value) {
      var b = el('button', 'chip', label);
      b.type = 'button';
      b.setAttribute('aria-pressed', value === active ? 'true' : 'false');
      b.addEventListener('click', function () {
        active = value;
        Array.prototype.forEach.call(chipsEl.children, function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
        render();
      });
      chipsEl.appendChild(b);
    }
    addChip('All', '');
    cats.forEach(function (c) { addChip(c, c); });
    var sel = document.querySelector('[data-vendor-cats]');
    if (sel) {
      cats.concat(['Something else']).forEach(function (c) { var o = el('option', '', c); sel.appendChild(o); });
    }

    function render() {
      var q = (search.value || '').toLowerCase().trim();
      var list = vendors.filter(function (v) {
        if (active && v.category !== active) return false;
        if (!q) return true;
        return [v.name, v.category, v.services, v.area, v.note].join(' ').toLowerCase().indexOf(q) !== -1;
      });
      vgrid.innerHTML = '';
      list.forEach(function (v) {
        var card = el('article', 'vendor');
        card.appendChild(el('span', 'tag', v.category));
        card.appendChild(el('h3', '', v.name));
        if (v.services) card.appendChild(el('p', '', v.services));
        if (v.area) card.appendChild(el('p', '', v.area));
        if (v.note) card.appendChild(el('p', 'vnote', v.note));
        var links = el('div', 'vlinks');
        if (v.phone) links.appendChild(link('tel:' + v.phone.replace(/[^0-9+]/g, ''), 'Call ' + v.phone));
        if (safeUrl(v.website)) links.appendChild(link(safeUrl(v.website), 'Website', true));
        if (v.email) links.appendChild(link('mailto:' + v.email, 'Email'));
        card.appendChild(links);
        vgrid.appendChild(card);
      });

      var filtered = !!(q || active);
      if (list.length) {
        countEl.textContent = 'Showing ' + list.length + ' of ' + vendors.length + ' businesses';
        emptyEl.hidden = true;
      } else {
        countEl.textContent = '';
        emptyEl.hidden = false;
        var none = vendors.length === 0;
        document.getElementById('vendor-empty-eyebrow').textContent = none ? 'Directory' : 'No matches';
        document.getElementById('vendor-empty-title').textContent = none ? 'Businesses are being added' : 'No matches yet';
        document.getElementById('vendor-empty-text').textContent = none
          ? 'I\u2019m adding local businesses to this directory. In the meantime, choose a category above and ask me for a recommendation, and I\u2019ll point you to someone I trust.'
          : 'I may know someone who isn\u2019t listed yet. Ask me and I\u2019ll point you in the right direction.';
        void filtered;
      }
    }
    var ask = document.getElementById('vendor-ask');
    if (ask) ask.addEventListener('click', function () {
      if (sel) sel.value = active && cats.indexOf(active) !== -1 ? active : (sel.options[0] ? sel.options[0].value : '');
      var msg = document.getElementById('v-msg');
      var q = (search.value || '').trim();
      if (msg && q && !msg.value) msg.value = 'I\u2019m looking for: ' + q;
    });
    search.addEventListener('input', render);
    render();
  }

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
