(function () {
  'use strict';

  var OBS_KEY = 'ash-obs';
  var config = {};
  function loadConfig() {
    try { config = JSON.parse(localStorage.getItem(OBS_KEY)) || {}; } catch (e) { config = {}; }
    if (!config.balloonNotes) config.balloonNotes = [];
    if (!config.feathers) config.feathers = { count: 0, rewards: [] };
    if (!config.coffeeAt) config.coffeeAt = 0;
    if (!config.luckyStar) config.luckyStar = {};
    if (!config.fragments) config.fragments = [];
    if (!config.invisibleMsgs) config.invisibleMsgs = [];
  }
  function save() { try { localStorage.setItem(OBS_KEY, JSON.stringify(config)); } catch (e) {} }
  loadConfig();

  function toast(msg, bg, dur) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:18rem;left:50%;transform:translateX(-50%);background:'+(bg||'rgba(255,230,100,0.85)')+';color:#181214;padding:8px 18px;border-radius:20px;font-size:14px;z-index:999999;pointer-events:none;transition:opacity 0.5s;opacity:1;';
    document.body.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { t.remove(); }, 500); }, dur || 2000);
  }

  /* ---------- 1. Balloons ---------- */
  function initBalloons() {
    var msgs = [
      'I wonder who is looking at this sky too...',
      'If you find this, know that someone loves you.',
      'The higher we go, the smaller our problems seem.',
      'I wish I could stay up here forever.',
      'Hello, stranger. I hope your day is beautiful.',
      'This balloon has travelled further than I ever have.',
      'Let go of what holds you down.',
      'Somewhere, someone is waiting for a sign. This is it.'
    ];
    setInterval(function () {
      if (Math.random() > 0.15) return;
      var balloon = document.createElement('div');
      balloon.textContent = '\uD83C\uDF88';
      balloon.style.cssText = 'position:fixed;bottom:-40px;left:'+(10+Math.random()*60)+'vw;font-size:2rem;z-index:999998;pointer-events:auto;cursor:pointer;transition:all 12s linear;opacity:0.9;';
      document.body.appendChild(balloon);
      requestAnimationFrame(function () {
        balloon.style.bottom = (window.innerHeight + 60) + 'px';
        balloon.style.left = (parseFloat(balloon.style.left) + (Math.random()-0.5)*100) + 'px';
      });
      balloon.addEventListener('click', function () {
        var msg = msgs[Math.floor(Math.random()*msgs.length)];
        toast('\uD83C\uDF88 '+msg, 'rgba(200,180,220,0.85)', 5000);
        config.balloonNotes.push({ text: msg, at: Date.now() });
        save();
        if (window.Interactions) window.Interactions.record('catch', 'balloon_hit');
        balloon.style.transform = 'scale(0.3)';
        balloon.style.opacity = '0';
        setTimeout(function () { if (balloon.parentNode) balloon.remove(); }, 800);
      });
      setTimeout(function () {
        if (balloon.parentNode) { balloon.style.opacity = '0'; setTimeout(function () { if (balloon.parentNode) balloon.remove(); }, 1500); }
      }, 14000);
    }, 12000);
  }

  /* ---------- 2. Feathers ---------- */
  // ponytail: 5x5 dot-matrix letters for the feather sparkle word
  var SPARK_LETTERS = {
    S: ['XXXXX','X...X','XXX..','...X.','XXXXX'],
    T: ['XXXXX','..X..','..X..','..X..','..X..'],
    A: ['.X...','X.X..','XXXXX','X...X','X...X'],
    Y: ['X...X','.X.X.','..X..','..X..','..X..']
  };
  function sparkleWord(x, y) {
    var word = 'stay';
    var size = 7, gap = 9, frag = document.createDocumentFragment();
    var dots = [];
    word.split('').forEach(function (ch, li) {
      var m = SPARK_LETTERS[ch.toUpperCase()];
      if (!m) return;
      for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++) {
        if (m[r][c] !== 'X') continue;
        var d = document.createElement('div');
        d.style.cssText = 'position:fixed;left:'+(x + li*gap*5 + c*gap)+'px;top:'+(y + r*gap)+'px;width:4px;height:4px;border-radius:50%;background:rgba(255,240,200,0.95);box-shadow:0 0 6px rgba(255,220,150,0.9);z-index:999999;pointer-events:none;transition:opacity 1.6s ease, transform 1.6s ease;';
        frag.appendChild(d);
        dots.push(d);
      }
    });
    document.body.appendChild(frag);
    setTimeout(function () {
      dots.forEach(function (d, i) { d.style.opacity = '0'; d.style.transform = 'translateY(' + (i % 3) + 'px) scale(0.2)'; });
      setTimeout(function () { dots.forEach(function (d) { if (d.parentNode) d.remove(); }); }, 1800);
    }, 2600);
  }

  function initFeathers() {
    setInterval(function () {
      if (Math.random() > 0.25) return;
      var f = document.createElement('div');
      f.textContent = '\uD83E\uDEB6';
      var startX = 5 + Math.random() * 80;
      f.style.cssText = 'position:fixed;top:-20px;left:'+startX+'vw;font-size:'+(12+Math.random()*10)+'px;z-index:999998;pointer-events:auto;cursor:pointer;opacity:0.9;transition:all 8s linear;';
      document.body.appendChild(f);
      requestAnimationFrame(function () {
        f.style.top = (window.innerHeight + 20) + 'px';
        f.style.left = (startX + (Math.random()-0.5)*15) + 'vw';
      });
      f.addEventListener('click', function (e) {
        config.feathers.count = (config.feathers.count || 0) + 1;
        save();
        var rewards = {3:'\uD83E\uDEB6 3 feathers \u2014 the breeze notices you',7:'\uD83E\uDEB6 7 feathers \u2014 you are becoming lighter',15:'\uD83E\uDEB6 15 feathers \u2014 almost floating',30:'\uD83E\uDEB6 30 feathers \u2014 you could fly'};
        var msg = rewards[config.feathers.count] || '\uD83E\uDEB6 +1 feather ('+config.feathers.count+')';
        toast(msg, 'rgba(200,180,150,0.8)', 2000);
        sparkleWord(e.clientX - 70, e.clientY - 20);
        if (window.Interactions) window.Interactions.record('catch', 'feather_caught');
        f.remove();
      });
      setTimeout(function () { if (f.parentNode) f.remove(); }, 8000);
    }, 8000);
  }

  /* ---------- 3. Coffee (exactly 20 min, no idle reset) ---------- */
  function initCoffee() {
    setTimeout(function () {
      loadConfig();
      var cup = document.createElement('div');
      cup.innerHTML = '<div style="text-align:center;">' +
        '<div style="font-size:3rem;animation:coffeeBounce 1.5s ease-in-out infinite;">\u2615</div>' +
        '<p style="font-family:var(--font-display);color:var(--parchment);margin:0.5rem 0 0;font-size:0.9rem;">Time for a coffee break?</p>' +
        '<p style="font-size:0.75rem;color:var(--ash);margin:0.3rem 0 0;">You have been exploring for a while \u2728</p>' +
      '</div>';
      cup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;background:var(--ink-soft);border:1px solid var(--gold);border-radius:16px;padding:2rem;box-shadow:0 8px 40px rgba(0,0,0,.7);animation:fadeIn 0.5s ease;';
      cup.addEventListener('click', function () { config.coffeeAt = Date.now(); save(); if (window.Interactions) window.Interactions.record('catch', 'coffee_click'); cup.remove(); });
      document.body.appendChild(cup);
      setTimeout(function () {
        cup.style.opacity = '0';
        cup.style.transition = 'opacity 0.5s';
        setTimeout(function () { cup.remove(); }, 600);
      }, 8000);
    }, 20*60*1000);
  }

  /* ---------- 3b. Sleep Break (30 min) ---------- */
  function initSleepBreak() {
    setTimeout(function () {
      var el = document.createElement('div');
      el.innerHTML = '<div style="text-align:center;">' +
        '<div style="font-size:3rem;animation:coffeeBounce 2s ease-in-out infinite;">\uD83D\uDCA4</div>' +
        '<p style="font-family:var(--font-display);color:var(--parchment);margin:0.5rem 0 0;font-size:0.9rem;">Time to rest?</p>' +
        '<p style="font-size:0.75rem;color:var(--ash);margin:0.3rem 0 0;">You have been here for a while \u2728</p>' +
      '</div>';
      el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;background:var(--ink-soft);border:1px solid var(--gold);border-radius:16px;padding:2rem;box-shadow:0 8px 40px rgba(0,0,0,.7);animation:fadeIn 0.5s ease;';
      el.addEventListener('click', function () { el.remove(); });
      document.body.appendChild(el);
      setTimeout(function () {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.5s';
        setTimeout(function () { el.remove(); }, 600);
      }, 8000);
    }, 30*60*1000);
  }

  /* ---------- 4. Lucky Star (only when a specific lucky sky is active) ---------- */
  var LUCKY_SKY_NAMES = ['Starry Night', 'Magical Starfield', 'Stardust'];
  var luckyStarEl = null;

  function initLuckyStar() {
    function checkSky() {
      var sky = window.SkyLiving && window.SkyLiving._currentSky;
      if (sky && LUCKY_SKY_NAMES.indexOf(sky.name) !== -1) {
        if (!luckyStarEl) showLuckyStar();
      } else {
        if (luckyStarEl) { luckyStarEl.remove(); luckyStarEl = null; }
      }
    }
    setInterval(checkSky, 2000);
    checkSky();
  }

  function showLuckyStar() {
    if (config.luckyStar && config.luckyStar.found) return;
    var star = document.createElement('div');
    star.id = 'luckyStar';
    star.textContent = '\u2B50';
    star.style.cssText = 'position:fixed;z-index:999998;font-size:'+(14+Math.random()*10)+'px;cursor:pointer;pointer-events:auto;animation:luckyFloat 4s ease-in-out infinite;opacity:0.7;transition:all 0.3s;';
    star.style.left = (10+Math.random()*80)+'vw';
    star.style.top = (10+Math.random()*70)+'vh';
    star.title = 'A lucky star \u2728';
    star.addEventListener('click', function () {
      var msgs = ['\u2728 You found the lucky star!','\u2B50 The star whispers: you are loved','\uD83C\uDF1F Make a wish \u2728','\u2728 This star chose you today','\u2B50 \u201cYou are someone\'s favourite thought\u201d'];
      toast(msgs[Math.floor(Math.random()*msgs.length)], 'rgba(255,230,128,0.9)', 5000);
      star.style.transform = 'scale(2)';
      star.style.opacity = '0';
      setTimeout(function () { star.remove(); luckyStarEl = null; }, 1000);
      config.luckyStar.found = true;
      save();
      if (window.Interactions) window.Interactions.record('catch', 'lucky_star_found');
    });
    star.addEventListener('mouseenter', function () { star.style.opacity = '1'; star.style.transform = 'scale(1.3)'; });
    star.addEventListener('mouseleave', function () { star.style.opacity = '0.7'; star.style.transform = 'scale(1)'; });
    document.body.appendChild(star);
    luckyStarEl = star;
  }

  /* ---------- 5. Fragments (physical floating crystals) ---------- */
  var GLOBAL_FRAGMENTS = [
    { id: 1, msg: 'Fragment of Dawn \u2014 the first light remembers' },
    { id: 2, msg: 'Fragment of Dusk \u2014 the last sigh of day' },
    { id: 3, msg: 'Fragment of Storm \u2014 chaos has a pattern' },
    { id: 4, msg: 'Fragment of Stars \u2014 each one a witness' },
    { id: 5, msg: 'Fragment of Rain \u2014 tears that nourish' },
    { id: 6, msg: 'Fragment of Aurora \u2014 the sky is alive' },
    { id: 7, msg: 'Fragment of Silence \u2014 the loudest truth' },
    { id: 8, msg: 'Fragment of Light \u2014 found at last' }
  ];
  var FRAGMENT_COLORS = ['#c0a0ff','#60d080','#ffb080','#66ddff','#ff8eb4','#ffe680','#ff6f5e','#c09030'];
  var FRAGMENT_SYMBOLS = ['\u25C7','\u2666','\u2605','\u25C8','\u25CB','\u2663','\u2726','\u221E'];
  var TOTAL_FRAGMENTS = 10;
  function getTotalCollected() {
    if (!config.fragments) config.fragments = [];
    if (!config.invisibleMsgs) config.invisibleMsgs = [];
    var photoCount = 0;
    for (var i = 0; i < config.invisibleMsgs.length; i++) {
      if (config.invisibleMsgs[i].id && config.invisibleMsgs[i].id.indexOf('p') === 0) photoCount++;
    }
    return config.fragments.length + photoCount;
  }
  function checkAllFragments() {
    var total = getTotalCollected();
    if (total >= TOTAL_FRAGMENTS) {
      setTimeout(function () {
        toast('\uD83C\uDF1F ALL FRAGMENTS COLLECTED! The sky reveals its secret...', 'rgba(255,230,128,0.95)', 6000);
      }, 1500);
    }
  }

  function initGlobalFragments() {
    if (!config.fragments) config.fragments = [];
    var uncollected = [];
    for (var fi = 0; fi < GLOBAL_FRAGMENTS.length; fi++) {
      var already = false;
      for (var fj = 0; fj < config.fragments.length; fj++) {
        if (config.fragments[fj].id === GLOBAL_FRAGMENTS[fi].id) { already = true; break; }
      }
      if (!already) uncollected.push(GLOBAL_FRAGMENTS[fi]);
    }
    uncollected.forEach(function (f, idx) {
      setTimeout(function () {
        var color = FRAGMENT_COLORS[f.id - 1] || '#c0a0ff';
        var symbol = FRAGMENT_SYMBOLS[f.id - 1] || '\u25C7';
        var el = document.createElement('div');
        el.textContent = symbol;
        el.style.cssText = 'position:absolute;z-index:99996;font-size:18px;cursor:pointer;pointer-events:auto;opacity:0;transition:opacity 2s ease;color:'+color+';text-shadow:0 0 4px '+color+';';
        el.style.left = (Math.random()*65) + 'vw';
        el.style.top = (5 + Math.random()*65) + 'vh';
        el.title = f.msg;
        el.dataset.fragId = f.id;
        document.body.appendChild(el);
        setTimeout(function (e) { return function () { e.style.opacity = '0.65'; }; }(el), 300);
        el.addEventListener('click', function (f2) { return function () {
          config.fragments.push(f2);
          save();
          var allFrags = document.querySelectorAll('[data-frag-id]');
          for (var k = 0; k < allFrags.length; k++) { allFrags[k].remove(); }
          toast('\uD83E\uDDE9 ' + f2.msg + ' (' + getTotalCollected() + '/' + TOTAL_FRAGMENTS + ')', 'rgba(200,180,255,0.85)', 5000);
          checkAllFragments();
          if (window.Interactions) window.Interactions.record('catch', 'fragment_collected', f2.msg);
        }; }(f));
      }, 5000 + idx * 4000);
    });
  }

  /* ---------- 6. Photo Fragments (specific images in photo gallery) ---------- */
  var PHOTO_FRAGMENTS = {
    0: { id: 'p1', msg: 'Fragment of Memory \u2014 this moment, frozen in light' },
    7: { id: 'p2', msg: 'Fragment of Gaze \u2014 the way you look at the world' }
  };

  function initPhotoFragments() {
    if (!document.getElementById('galleryGrid')) return;
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (!item) return;
      var idx = parseInt(item.dataset.index, 10);
      if (isNaN(idx)) return;
      var pf = PHOTO_FRAGMENTS[idx];
      if (!pf) return;
      if (!config.invisibleMsgs) config.invisibleMsgs = [];
      for (var i = 0; i < config.invisibleMsgs.length; i++) {
        if (config.invisibleMsgs[i].id === pf.id) return;
      }
      config.invisibleMsgs.push({ id: pf.id, text: pf.msg, at: Date.now() });
      save();
      toast('\uD83D\uDCF8 ' + pf.msg + ' (' + getTotalCollected() + '/' + TOTAL_FRAGMENTS + ')', 'rgba(255,200,150,0.9)', 5000);
      checkAllFragments();
      if (window.Interactions) window.Interactions.record('catch', 'photo_fragment_found', pf.msg);
    });
  }

  /* ---------- Achievements ---------- */
  var ACHIEVEMENTS = [
    { id: 'all-fragments', label: 'Fragment Finder', desc: 'Thank you for noticing the little details around the observatory.', hint: 'Find all 10 fragments scattered around the observatory.', icon: '\uD83E\uDDE9', check: function () { return getTotalCollected() >= TOTAL_FRAGMENTS; } },
    { id: 'feather-master', label: 'Feather Finder', desc: 'Your curiosity brings a little brightness to this place.', hint: 'Catch 30 feathers as they drift through the sky.', icon: '\uD83E\uDEB6', check: function () { return (config.feathers && config.feathers.count) >= 30; } },
    { id: 'balloon-hunter', label: 'Wish Notes', desc: 'Thank you for taking a moment to discover each note.', hint: 'Pop 10 balloons to find the notes they carry.', icon: '\uD83C\uDF88', check: function () { return (config.balloonNotes && config.balloonNotes.length) >= 10; } },
    { id: 'lucky-star', label: 'Lucky Star', desc: 'Your patience helped reveal a special spark.', hint: 'Keep exploring the observatory; a lucky star may appear.', icon: '\u2B50', check: function () { return config.luckyStar && config.luckyStar.found; } }
  ];

  function openAchievements() {
    var existing = document.getElementById('achievementPanel');
    var trigger = document.getElementById('achievementLabel');
    if (existing) { existing.remove(); return; }

    var overlay = document.createElement('div');
    overlay.id = 'achievementPanel';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(10,8,6,0.82);backdrop-filter:blur(8px);display:flex;justify-content:center;align-items:center;padding:1rem;';
    var panel = document.createElement('section');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'achievementTitle');
    panel.style.cssText = 'background:rgba(20,16,12,0.97);border:1px solid rgba(255,230,100,0.25);border-radius:16px;padding:20px;max-width:440px;width:100%;max-height:80vh;overflow-y:auto;color:#ffebd2;';

    var title = document.createElement('h2');
    title.id = 'achievementTitle';
    title.textContent = '\uD83C\uDFC6 Achievements';
    title.style.cssText = 'margin:0 0 6px;color:#ffe680;font:600 1.15rem Fraunces,Georgia,serif;text-align:center;';
    panel.appendChild(title);

    var intro = document.createElement('p');
    intro.textContent = 'Your curiosity and attention help make this observatory brighter.';
    intro.style.cssText = 'margin:0 0 14px;color:#d5c7b5;font-size:.8rem;line-height:1.5;text-align:center;';
    panel.appendChild(intro);

    var earned = 0;
    var list = document.createElement('div');
    list.style.cssText = 'display:grid;gap:8px;';
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      var achievement = ACHIEVEMENTS[i];
      var done = achievement.check();
      if (done) earned++;

      var card = document.createElement('article');
      card.style.cssText = 'padding:10px 12px;border:1px solid rgba(255,230,100,0.12);border-radius:10px;background:rgba(255,255,255,0.035);';
      var cardTitle = document.createElement('strong');
      cardTitle.textContent = achievement.icon + ' ' + achievement.label;
      cardTitle.style.cssText = 'display:block;color:' + (done ? '#ffe680' : '#c7b8a1') + ';font-size:.84rem;';
      var appreciation = document.createElement('p');
      appreciation.textContent = achievement.desc;
      appreciation.style.cssText = 'margin:4px 0;color:#e3d8c8;font-size:.75rem;line-height:1.45;';
      var details = document.createElement('small');
      details.textContent = done ? 'Earned' : achievement.hint;
      details.style.cssText = 'color:#a09080;font-size:.68rem;line-height:1.4;';
      card.appendChild(cardTitle);
      card.appendChild(appreciation);
      card.appendChild(details);
      list.appendChild(card);
    }
    panel.appendChild(list);

    var summary = document.createElement('p');
    summary.textContent = earned + ' of ' + ACHIEVEMENTS.length + ' achievements earned';
    summary.style.cssText = 'margin:12px 0;color:#c7b8a1;font-size:.72rem;text-align:center;';
    panel.appendChild(summary);

    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    closeButton.style.cssText = 'display:block;margin:0 auto;padding:6px 20px;border:1px solid rgba(255,230,100,0.3);border-radius:20px;background:rgba(255,230,100,0.15);color:#ffe680;cursor:pointer;font:inherit;font-size:.75rem;';
    function closePanel() {
      overlay.remove();
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    }
    closeButton.addEventListener('click', closePanel);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closePanel();
    });
    overlay.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closePanel();
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButton.focus();
      }
    });
    panel.appendChild(closeButton);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  }

  function initAchievements() {
    var existing = document.getElementById('achievementLabel');
    if (existing) return;
    var container = document.getElementById('skyBtnContainer');
    if (!container) { setTimeout(initAchievements, 1000); return; }

    var button = document.createElement('button');
    button.id = 'achievementLabel';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.title = 'View achievements';
    button.style.cssText = 'display:block;margin:5px auto 0;padding:4px 10px;border:1px solid rgba(255,210,150,0.24);border-radius:999px;background:rgba(255,220,160,0.08);color:rgba(255,235,210,0.82);font:11px Fraunces,Georgia,serif;cursor:pointer;';
    button.addEventListener('click', openAchievements);
    var constLabel = document.getElementById('constellationNameLabel');
    if (constLabel && constLabel.parentNode) {
      constLabel.parentNode.insertBefore(button, constLabel.nextSibling);
    } else {
      container.appendChild(button);
    }
    refreshAchievements();
  }

  function refreshAchievements() {
    var button = document.getElementById('achievementLabel');
    if (!button) return;
    var earned = 0;
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      if (ACHIEVEMENTS[i].check()) earned++;
    }
    button.textContent = '\uD83C\uDFC6 Achievements (' + earned + ' / ' + ACHIEVEMENTS.length + ')';
    button.setAttribute('aria-label', 'Achievements, ' + earned + ' of ' + ACHIEVEMENTS.length + ' earned');
  }

  /* ---------- Init ---------- */
  function init() {
    var path = window.location.pathname;
    if (/404\.html$|stats\.html$/i.test(path)) return;
    if (document.body && (document.body.style.display === 'none' || document.body.innerHTML.indexOf('Locked') !== -1)) return;

    if (!window.FeatureFlags || window.FeatureFlags.get('balloons')) initBalloons();
    if (!window.FeatureFlags || window.FeatureFlags.get('feathers')) initFeathers();
    if (!window.FeatureFlags || window.FeatureFlags.get('coffee')) initCoffee();
    initSleepBreak();
    if (!window.FeatureFlags || window.FeatureFlags.get('lucky-star')) initLuckyStar();
    if (!window.FeatureFlags || window.FeatureFlags.get('fragments')) { initGlobalFragments(); initPhotoFragments(); }
    initAchievements();
    setInterval(refreshAchievements, 3000);

    var css = document.createElement('style');
    css.textContent = '@keyframes luckyFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes fadeIn{from{opacity:0;transform:translate(-50%,-50%) scale(0.9)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}@keyframes coffeeBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes fragPulse{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.12);opacity:1}}';
    document.head.appendChild(css);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
