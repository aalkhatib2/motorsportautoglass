(function(){
  "use strict";

  /* current year */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* nav state + scroll progress + floating call */
  var nav  = document.getElementById('nav');
  var prog = document.getElementById('progress');
  var fab  = document.getElementById('fab');
  var hero = document.querySelector('.hero');
  var ticking = false;
  var NAV_FADE = 140;

  function onScroll(){
    var y = window.scrollY || window.pageYOffset || 0;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var navProgress = Math.min(1, Math.max(0, y / NAV_FADE));
    if (nav) {
      nav.style.setProperty('--nav-progress', navProgress);
      nav.classList.toggle('scrolled', navProgress > 0.04);
    }
    if (prog) prog.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (fab){
      var threshold = hero ? hero.offsetHeight * 0.7 : 600;
      fab.classList.toggle('show', y > threshold);
    }
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive:true });
  onScroll();

  /* scroll reveal with per-group stagger */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var sibs = Array.prototype.filter.call(el.parentElement.children, function(c){
          return c.classList.contains('reveal');
        });
        var idx = sibs.indexOf(el);
        el.style.transitionDelay = (Math.max(0, idx) * 70) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold:0.14, rootMargin:'0px 0px -8% 0px' });
    reveals.forEach(function(r){ io.observe(r); });
  } else {
    reveals.forEach(function(r){ r.classList.add('in'); });
  }

  /* animated stat counters */
  function animateCount(el){
    var target  = parseFloat(el.getAttribute('data-count'));
    var dec      = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix  = el.getAttribute('data-suffix') || '';
    var dur = 1500, start = null;
    function tick(now){
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(tick);
  }
  var trust = document.getElementById('trust');
  var counters = document.querySelectorAll('[data-count]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (trust && counters.length){
    if (reduceMotion || !('IntersectionObserver' in window)){
      counters.forEach(function(c){
        c.textContent = parseFloat(c.getAttribute('data-count')).toFixed(parseInt(c.getAttribute('data-decimals')||'0',10)) + (c.getAttribute('data-suffix')||'');
      });
    } else {
      var tio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting){
            counters.forEach(animateCount);
            tio.disconnect();
          }
        });
      }, { threshold:0.4 });
      tio.observe(trust);
    }
  }

  /* FAQ accordion — one open at a time, animated via measured max-height */
  var faqItems = document.querySelectorAll('.faq-item');

  function faqPanelHeight(item, open){
    var panel = item.querySelector('.faq-panel');
    if (!panel) return;
    var inner = panel.firstElementChild;
    if (!inner) return;
    if (open){
      panel.style.maxHeight = inner.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  }

  function closeFaqItem(item){
    item.classList.remove('is-open');
    var btn = item.querySelector('.faq-trigger');
    var panel = item.querySelector('.faq-panel');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.setAttribute('aria-hidden', 'true');
    faqPanelHeight(item, false);
  }

  function openFaqItem(item){
    item.classList.add('is-open');
    var btn = item.querySelector('.faq-trigger');
    var panel = item.querySelector('.faq-panel');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (panel) panel.setAttribute('aria-hidden', 'false');
    faqPanelHeight(item, true);
  }

  faqItems.forEach(function(item){
    var btn = item.querySelector('.faq-trigger');
    if (!btn) return;
    faqPanelHeight(item, item.classList.contains('is-open'));
    btn.addEventListener('click', function(){
      var wasOpen = item.classList.contains('is-open');
      faqItems.forEach(closeFaqItem);
      if (!wasOpen) openFaqItem(item);
    });
  });

  requestAnimationFrame(function(){
    faqItems.forEach(function(item){
      if (item.classList.contains('is-open')) faqPanelHeight(item, true);
    });
  });

  if (document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){
      faqItems.forEach(function(item){
        if (item.classList.contains('is-open')) faqPanelHeight(item, true);
      });
    });
  }

  window.addEventListener('resize', function(){
    faqItems.forEach(function(item){
      if (item.classList.contains('is-open')) faqPanelHeight(item, true);
    });
  });
})();
