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


  // Vendor helpers
  function vEl(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function vLink(href, text, external, cls) {
    var a = vEl('a', cls || '', text);
    a.href = href;
    if (external) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }
  function vSafe(u) { return /^https?:\/\//i.test(u || '') ? u : ''; }
  function vSlug(v) { return v.slug || String(v.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function vStars(r) { var n = Math.max(0, Math.min(5, Math.round(r || 0))); return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }

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

    var el = vEl, link = function (h, t, x) { return vLink(h, t, x); }, safeUrl = vSafe;

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
        var h3 = el('h3', ''); h3.appendChild(vLink('vendor.html?v=' + encodeURIComponent(vSlug(v)), v.name)); card.appendChild(h3);
        if (v.rating) card.appendChild(el('p', 'vrating', vStars(v.rating) + ' ' + Number(v.rating).toFixed(1) + (v.reviewCount ? ' \u00b7 ' + v.reviewCount + (v.ratingSource ? ' ' + v.ratingSource : '') + ' reviews' : '')));
        if (v.services) card.appendChild(el('p', '', v.services));
        if (v.area) card.appendChild(el('p', '', v.area));
        if (v.note) card.appendChild(el('p', 'vnote', v.note));
        var links = el('div', 'vlinks');
        links.appendChild(vLink('vendor.html?v=' + encodeURIComponent(vSlug(v)), 'View Profile', false, 'vp'));
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
    var qs = new URLSearchParams(location.search), askCat = qs.get('ask'), askFor = qs.get('for');
    if (askCat && sel) { sel.value = askCat; var m0 = document.getElementById('v-msg'); if (m0 && askFor && !m0.value) m0.value = 'I’d like a recommendation or more information about ' + askFor + '.'; }
  }


  // Vendor profile
  var vprof = document.getElementById('vendor-profile');
  if (vprof) {
    var allV = window.VENDORS || [];
    var vid = new URLSearchParams(location.search).get('v') || '';
    var vd = allV.filter(function (x) { return vSlug(x) === vid; })[0];
    vprof.innerHTML = '';
    var setMeta = function (sel, attr, val) { var m = document.querySelector(sel); if (m) m.setAttribute(attr, val); };
    if (!vd) {
      document.title = 'Business not found | Landon Farley';
      setMeta('meta[name="robots"]', 'content', 'noindex,follow');
      vprof.innerHTML = '';
      var nf = vEl('div', 'wrap narrow');
      nf.appendChild(vEl('h1', '', 'We couldn’t find that business'));
      nf.appendChild(vEl('p', '', 'It may have been removed, or the link may be incomplete.'));
      nf.appendChild(vLink('vendors.html', 'Back to the Vendor Directory', false, 'btn'));
      vprof.appendChild(nf);
    } else {
      var pageUrl = 'https://discoversiouxfallshomes.com/vendor.html?v=' + encodeURIComponent(vSlug(vd));
      var ttl = vd.name + ' | ' + vd.category + ' in Sioux Falls | Landon Farley';
      var desc = (vd.about || (vd.name + ': ' + (vd.services || vd.category) + ' in Sioux Falls, SD.')).slice(0, 300);
      document.title = ttl;
      setMeta('meta[name="description"]', 'content', desc);
      setMeta('link[rel="canonical"]', 'href', pageUrl);
      setMeta('meta[property="og:url"]', 'content', pageUrl);
      setMeta('meta[property="og:title"]', 'content', ttl);
      setMeta('meta[property="og:description"]', 'content', desc);
      setMeta('meta[name="twitter:title"]', 'content', ttl);
      setMeta('meta[name="twitter:description"]', 'content', desc);

      // header
      var head = vEl('header', 'vp-head wrap');
      var crumbs = vEl('div', 'crumbs'); crumbs.appendChild(vLink('index.html', 'Home')); crumbs.appendChild(document.createTextNode(' / ')); crumbs.appendChild(vLink('vendors.html', 'Vendor Directory'));
      head.appendChild(crumbs);
      head.appendChild(vEl('span', 'eyebrow', vd.category));
      head.appendChild(vEl('h1', '', vd.name));
      if (vd.rating) {
        var rl = vEl('div', 'vp-rating');
        rl.appendChild(vEl('span', 'stars', vStars(vd.rating)));
        rl.appendChild(vEl('span', '', Number(vd.rating).toFixed(1) + (vd.reviewCount ? ' · ' + vd.reviewCount + (vd.ratingSource ? ' ' + vd.ratingSource : '') + ' reviews' : '')));
        head.appendChild(rl);
      }
      if (vd.services) head.appendChild(vEl('p', 'vp-sub', vd.services));
      vprof.appendChild(head);

      var wrap = vEl('div', 'wrap vp-grid');
      var main = vEl('div', 'vp-main'), side = vEl('aside', 'vp-side');

      // about
      if (vd.about) { var s1 = vEl('section', 'vp-sec'); s1.appendChild(vEl('h2', '', 'About ' + vd.name)); s1.appendChild(vEl('p', '', vd.about)); main.appendChild(s1); }
      if (vd.note) { var nt = vEl('blockquote', 'vp-note', vd.note); main.appendChild(nt); }
      if (vd.offerings && vd.offerings.length) {
        var s2 = vEl('section', 'vp-sec'); s2.appendChild(vEl('h2', '', 'What they do'));
        var ul = vEl('ul', 'vp-list'); vd.offerings.forEach(function (o) { ul.appendChild(vEl('li', '', o)); });
        s2.appendChild(ul); main.appendChild(s2);
      }
      if (vd.highlights && vd.highlights.length) {
        var s3 = vEl('section', 'vp-sec'); s3.appendChild(vEl('h2', '', 'Good to know'));
        var hl = vEl('div', 'vp-chips'); vd.highlights.forEach(function (o) { hl.appendChild(vEl('span', 'vp-chip', o)); });
        s3.appendChild(hl); main.appendChild(s3);
      }

      // reviews
      var s4 = vEl('section', 'vp-sec vp-reviews'); s4.appendChild(vEl('h2', '', 'Reviews'));
      var hasRev = vd.reviews && vd.reviews.length;
      if (vd.rating) {
        var sum = vEl('div', 'rating-sum');
        sum.appendChild(vEl('div', 'big', Number(vd.rating).toFixed(1)));
        var sc = vEl('div', ''); sc.appendChild(vEl('div', 'stars', vStars(vd.rating)));
        sc.appendChild(vEl('div', 'small', (vd.reviewCount ? 'Based on ' + vd.reviewCount + ' ' + (vd.ratingSource || '') + ' reviews' : 'Rating') + (vd.infoDate ? ' (as shown by the business, ' + vd.infoDate + ')' : '')));
        sum.appendChild(sc); s4.appendChild(sum);
      }
      if (hasRev) {
        vd.reviews.forEach(function (r) {
          var rc = vEl('figure', 'vp-review');
          rc.appendChild(vEl('div', 'stars', vStars(r.rating || 5)));
          rc.appendChild(vEl('blockquote', '', r.text));
          rc.appendChild(vEl('figcaption', '', r.author + (r.date ? ' · ' + r.date : '') + (r.source ? ' · ' + r.source : '')));
          s4.appendChild(rc);
        });
      }
      var rlinks = vEl('div', 'vp-rlinks');
      if (vSafe(vd.ratingUrl)) rlinks.appendChild(vLink(vd.ratingUrl, 'Read reviews on ' + (vd.ratingSource || 'their profile'), true, 'btn ghost'));
      if (vSafe(vd.facebook)) rlinks.appendChild(vLink(vd.facebook, 'See their Facebook page', true, 'btn ghost'));
      if (rlinks.children.length) s4.appendChild(rlinks);
      var showRev = vd.rating || hasRev || rlinks.children.length;
      var disc = vEl('p', 'calc-disclaimer', (showRev ? 'Ratings and reviews come from the business\u2019s public profiles and were not written by Landon Farley. ' : '') + 'Details come from ' + (vd.infoSource || 'the business\u2019s own website') + (vd.infoDate ? ' as of ' + vd.infoDate : '') + ', so please confirm services, hours and pricing directly. A listing is not an endorsement or guarantee.');
      if (showRev) { s4.appendChild(disc); main.appendChild(s4); } else { main.appendChild(disc); }

      // sidebar
      var card = vEl('div', 'vp-card');
      card.appendChild(vEl('h2', '', 'Get in touch'));
      if (vd.phone) card.appendChild(vLink('tel:' + vd.phone.replace(/[^0-9+]/g, ''), 'Call ' + vd.phone, false, 'btn'));
      var qurl = vSafe(vd.quoteUrl);
      if (qurl) card.appendChild(vLink(qurl, vd.quoteLabel || 'Request an estimate', true, 'btn ghost'));
      var ln = vEl('ul', 'vp-links');
      [['website', 'Website'], ['facebook', 'Facebook'], ['instagram', 'Instagram']].forEach(function (p) {
        if (vSafe(vd[p[0]])) { var li = vEl('li'); li.appendChild(vLink(vd[p[0]], p[1], true)); ln.appendChild(li); }
      });
      if (vd.email) { var le = vEl('li'); le.appendChild(vLink('mailto:' + vd.email, vd.email)); ln.appendChild(le); }
      if (ln.children.length) card.appendChild(ln);
      var facts = vEl('dl', 'calc-facts');
      [['Category', vd.category], ['Service area', vd.area]].forEach(function (p) {
        if (p[1]) { var d = vEl('div'); d.appendChild(vEl('dt', '', p[0])); d.appendChild(vEl('dd', '', p[1])); facts.appendChild(d); }
      });
      (vd.address || []).forEach(function (a) { var d = vEl('div', 'vp-addr'); d.appendChild(vEl('dd', '', a)); facts.appendChild(d); });
      card.appendChild(facts);
      var ask = vEl('div', 'vp-ask');
      ask.appendChild(vEl('p', '', 'Want my take, or need a different kind of pro?'));
      ask.appendChild(vLink('vendors.html?ask=' + encodeURIComponent(vd.category) + '&for=' + encodeURIComponent(vd.name) + '#vendor-request', 'Ask Landon', false, 'btn ghost'));
      card.appendChild(ask);
      side.appendChild(card);

      wrap.appendChild(main); wrap.appendChild(side); vprof.appendChild(wrap);

      // more in this category
      var others = allV.filter(function (x) { return x !== vd && x.category === vd.category; }).slice(0, 3);
      if (others.length) {
        var sec = vEl('section', 'tint'); var w2 = vEl('div', 'wrap');
        var sh = vEl('div', 'sec-head'); sh.appendChild(vEl('span', 'eyebrow', 'More in ' + vd.category)); w2.appendChild(sh);
        var g = vEl('div', 'grid g3');
        others.forEach(function (o) {
          var c = vEl('article', 'vendor'); c.appendChild(vEl('span', 'tag', o.category));
          var h = vEl('h3'); h.appendChild(vLink('vendor.html?v=' + encodeURIComponent(vSlug(o)), o.name)); c.appendChild(h);
          if (o.services) c.appendChild(vEl('p', '', o.services));
          var l = vEl('div', 'vlinks'); l.appendChild(vLink('vendor.html?v=' + encodeURIComponent(vSlug(o)), 'View Profile', false, 'vp')); c.appendChild(l); g.appendChild(c);
        });
        w2.appendChild(g); sec.appendChild(w2); vprof.appendChild(sec);
      }

      // structured data
      var ld = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: vd.name, url: vSafe(vd.website) || pageUrl, description: vd.about || vd.services || '', areaServed: vd.area || 'Sioux Falls, SD' };
      if (vd.phone) ld.telephone = vd.phone;
      var same = [vd.facebook, vd.instagram].filter(vSafe); if (same.length) ld.sameAs = same;
      var sc2 = document.createElement('script'); sc2.type = 'application/ld+json'; sc2.text = JSON.stringify(ld); document.head.appendChild(sc2);
    }
  }

  // Client review carousel
  var car = document.getElementById('review-carousel');
  if (car && window.REVIEWS && window.REVIEWS.length) {
    var list = window.REVIEWS, gp = window.GOOGLE_PROFILE || {}, idx = 0;
    var sumEl = document.getElementById('review-summary');
    if (sumEl && (gp.rating || gp.url || gp.writeUrl)) {
      sumEl.innerHTML = '';
      if (gp.rating) {
        var gs = vEl('div', 'rating-sum');
        gs.appendChild(vEl('div', 'big', Number(gp.rating).toFixed(1)));
        var gsc = vEl('div', ''); gsc.appendChild(vEl('div', 'stars', vStars(gp.rating)));
        gsc.appendChild(vEl('div', 'small', gp.count ? gp.count + ' Google reviews' : 'Google rating')); gs.appendChild(gsc); sumEl.appendChild(gs);
      }
      var gl = vEl('div', 'vp-rlinks');
      if (vSafe(gp.url)) gl.appendChild(vLink(gp.url, 'Read all reviews on Google', true, 'btn ghost'));
      if (vSafe(gp.writeUrl)) gl.appendChild(vLink(gp.writeUrl, 'Leave a review', true, 'btn ghost'));
      if (gl.children.length) sumEl.appendChild(gl);
      sumEl.hidden = false;
    }
    car.innerHTML = '';
    car.setAttribute('role', 'region'); car.setAttribute('aria-roledescription', 'carousel'); car.setAttribute('aria-label', 'Client reviews');
    var stage = vEl('div', 'car-stage'); stage.setAttribute('aria-live', 'polite');
    var nav = vEl('div', 'car-nav');
    var prev = vEl('button', 'car-btn', '‹ Previous'); prev.type = 'button';
    var count = vEl('span', 'car-count');
    var next = vEl('button', 'car-btn', 'Next ›'); next.type = 'button';
    nav.appendChild(prev); nav.appendChild(count); nav.appendChild(next);
    var dots = vEl('div', 'car-dots');
    list.forEach(function (r, i) {
      var d = vEl('button', 'car-dot'); d.type = 'button'; d.setAttribute('aria-label', 'Show review ' + (i + 1) + ' of ' + list.length);
      d.addEventListener('click', function () { show(i); }); dots.appendChild(d);
    });
    car.appendChild(stage); car.appendChild(nav); car.appendChild(dots);

    function show(i) {
      idx = (i + list.length) % list.length;
      var r = list[idx];
      stage.innerHTML = '';
      var q = vEl('div', 'quote review' + (r.image ? '' : ' no-img'));
      q.appendChild(vEl('div', 'mark', '“'));
      if (r.image) { var im = document.createElement('img'); im.src = r.image; im.alt = r.imageAlt || ''; im.width = 320; im.height = 358; q.appendChild(im); }
      var body = vEl('div', '');
      body.appendChild(vEl('blockquote', '', r.text));
      body.appendChild(vEl('div', 'who', r.author));
      var st = vEl('div', 'stars', vStars(r.rating || 5)); st.setAttribute('aria-label', (r.rating || 5) + ' out of 5 stars'); body.appendChild(st);
      var meta = [r.source ? r.source + ' review' : '', r.date || ''].filter(Boolean).join(' · ');
      if (meta) body.appendChild(vEl('div', 'car-meta', meta));
      q.appendChild(body); stage.appendChild(q);
      count.textContent = (idx + 1) + ' of ' + list.length;
      Array.prototype.forEach.call(dots.children, function (d, k) { d.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
      var single = list.length < 2; nav.hidden = single; dots.hidden = single;
    }
    prev.addEventListener('click', function () { show(idx - 1); });
    next.addEventListener('click', function () { show(idx + 1); });
    car.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1); });
    var tx = null;
    stage.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); tx = null; });
    show(0);
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
