/* 鱼心快跑 · 麦肯锡方法论科普站
   纯静态、无依赖：站点骨架 / 明暗主题 / 全站朗读 / 图表交互 */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var PAGES = [
    { id: 'index',     href: 'index.html',            label: '首页' },
    { id: 'methods',   href: 'methods.html',          label: '方法论全集' },
    { id: 'solving',   href: 'methods-solving.html',  label: '解题与分析 12 招' },
    { id: 'strategy',  href: 'methods-strategy.html', label: '战略与增长 12 招' },
    { id: 'org',       href: 'methods-org.html',      label: '组织与运营 12 招' },
    { id: 'comm',      href: 'methods-comm.html',     label: '表达与沟通 12 招' },
    { id: 'business',  href: 'business.html',         label: '这家公司' },
    { id: 'thinking',  href: 'thinking.html',         label: '底层思维' },
    { id: 'models',    href: 'models.html',           label: '模型工具箱' },
    { id: 'practice',  href: 'practice.html',         label: '上手实操' },
    { id: 'library',   href: 'library.html',          label: '资料库' },
    { id: 'about',     href: 'about.html',            label: '关于本站' }
  ];
  var MAIN_IDS = ['index', 'methods', 'thinking', 'practice', 'library'];
  var MORE_GROUPS = [
    { label: '方法论全集 · 分类页', ids: ['solving', 'strategy', 'org', 'comm'] },
    { label: '其他入口', ids: ['business', 'models', 'about'] }
  ];
  var body = document.body;
  var page = body.getAttribute('data-page') || 'index';
  var nextPage = body.getAttribute('data-next') || '';
  var minutes = body.getAttribute('data-minutes') || '6';
  var title = document.title.split('|')[0].trim();
  var THEME_KEY = 'yx-mckinsey-theme';

  function byId(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function link(p, cls) { return '<a class="' + (cls || '') + '" href="' + p.href + '">' + p.label + '</a>'; }

  /* ---------- 主题 ---------- */
  function currentTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'light'; } catch (e) { return 'light'; }
  }
  function applyTheme(t) {
    document.documentElement.classList.toggle('dark', t === 'dark');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#06100e' : '#f6f4ee');
    document.querySelectorAll('img[data-logo]').forEach(function (img) {
      img.src = t === 'dark' ? 'assets/logo-dark.svg' : 'assets/logo.svg';
    });
    var btn = byId('themeBtn');
    if (btn) btn.textContent = t === 'dark' ? '☀ 浅色' : '☾ 深色';
  }
  applyTheme(currentTheme());

  /* ---------- 导航 / 页脚 / 播放条 ---------- */
  function buildNav() {
    var el = byId('siteNav'); if (!el) return;
    el.classList.add('nav');
    var navPage = page.indexOf('m-') === 0 ? 'methods' : page;
    var main = PAGES.filter(function (p) { return MAIN_IDS.indexOf(p.id) >= 0; })
      .map(function (p) { return link(p, p.id === navPage ? 'active' : ''); }).join('');
    var more = MORE_GROUPS.map(function (g, i) {
      var rows = g.ids.map(function (id) {
        var p = PAGES.filter(function (x) { return x.id === id; })[0];
        return p ? link(p, p.id === navPage ? 'active' : '') : '';
      }).join('');
      return (i ? '<div class="drop-sep"></div>' : '') + '<span class="drop-label">' + g.label + '</span>' + rows;
    }).join('');
    el.innerHTML =
      '<div class="wrap nav-inner">' +
        '<a class="nav-logo" href="index.html"><img data-logo src="assets/logo.svg" alt="结论方块与三层金字塔标记" width="26" height="26"><span>把话想清楚</span></a>' +
        '<nav class="nav-links" aria-label="主导航">' + main +
          '<details class="nav-more"><summary>更多<span class="caret" aria-hidden="true"></span></summary><div class="drop">' + more + '</div></details>' +
        '</nav>' +
        '<div class="nav-tools">' +
          '<button class="icon-btn" id="themeBtn" type="button" aria-label="切换明暗主题">' + (currentTheme() === 'dark' ? '☀ 浅色' : '☾ 深色') + '</button>' +
          '<button class="icon-btn" id="navListen" type="button">▶ 听这页</button>' +
        '</div>' +
      '</div>';
    byId('themeBtn').addEventListener('click', function () {
      var t = currentTheme() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
      applyTheme(t);
    });
    byId('navListen').addEventListener('click', function () { toggleAudio(); });
    document.querySelectorAll('img[data-logo]').forEach(function (img) {
      img.src = currentTheme() === 'dark' ? 'assets/logo-dark.svg' : 'assets/logo.svg';
    });
    var navMore = el.querySelector('.nav-more');
    if (navMore) {
      document.addEventListener('click', function (e) {
        if (navMore.open && !navMore.contains(e.target)) navMore.open = false;
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMore.open) {
          navMore.open = false;
          var s = navMore.querySelector('summary');
          if (s) s.focus();
        }
      });
      navMore.querySelectorAll('.drop a').forEach(function (a) {
        a.addEventListener('click', function () { navMore.open = false; });
      });
    }
  }
  function buildFooter() {
    var el = byId('siteFooter'); if (!el) return;
    var links = PAGES.map(function (p) { return link(p); }).join('');
    el.innerHTML =
      '<footer class="footer"><div class="wrap">' +
        '<div class="footer-grid">' +
          '<div><div class="footer-brand"><img src="assets/mascot.svg" alt="戴着圆眼镜、拿指示棒讲解金字塔图表的青色小鱼" width="52" height="52">' +
            '<div><div class="fb-name">鱼心快跑 · Yuxin Runs</div><div class="fb-slogan">鱼心快跑，Bug 追不上</div></div></div>' +
            '<p>本站是「鱼心快跑」品牌下的大众科普手册，与 McKinsey &amp; Company 没有任何隶属、授权或代言关系。所有框架均为公开资料的通俗化讲解，模板为本站改编。</p></div>' +
          '<div><span class="mono">SITEMAP · 全站地图</span><div class="footer-links" style="margin-top:14px">' + links + '</div>' +
            '<p style="margin-top:18px">口径与出处见 <a href="library.html">资料库</a>；两份分级事实库落在项目 <code>.qoder/research-mckinsey.md</code> 与 <code>.qoder/research-methods.md</code>。</p></div>' +
        '</div>' +
        '<div class="footer-bottom"><span>© 2026 鱼心快跑 · 把话想清楚</span><span>调研日期 2026-11-07 · 内容随时效更新</span></div>' +
      '</div></footer>';
  }
  function buildAudioBar() {
    var el = byId('audioSlot'); if (!el) return;
    el.innerHTML =
      '<div class="audio-bar" role="region" aria-label="全站朗读播放条">' +
        '<div class="audio-ctrl"><button class="play" id="audioPlay" type="button" aria-label="播放或暂停">▶</button>' +
          '<button id="audioStop" type="button" aria-label="停止">■</button></div>' +
        '<div class="audio-meta" title="读完自动跳下一页"><b>' + esc(title) + '</b><span>约 ' + minutes + ' 分钟 · 通勤可听</span></div>' +
        '<div class="audio-track"><div class="audio-fill" id="audioFill"></div></div>' +
        '<div class="audio-extra"><select id="audioRate" aria-label="朗读语速">' +
          '<option value="0.9">0.9×</option><option value="1" selected>1.0×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option>' +
          '</select><label><input type="checkbox" id="audioAuto" checked> 自动连播</label></div>' +
      '</div>';
  }

  /* ---------- 朗读（Web Speech + MediaSession） ---------- */
  var synth = window.speechSynthesis;
  var queue = [], idx = 0, playing = false, paused = false, stopped = true, rate = 1;
  function splitSentences(t) {
    var res = [], cur = '';
    for (var i = 0; i < t.length; i++) {
      cur += t[i];
      if ('。！？；：'.indexOf(t[i]) >= 0 || cur.length >= 56) { res.push(cur.trim()); cur = ''; }
    }
    if (cur.trim()) res.push(cur.trim());
    return res;
  }
  function buildQueue() {
    var main = document.querySelector('main'); if (!main) return [];
    var out = [], seen = {};
    main.querySelectorAll('h1,h2,h3,p,li,blockquote,figcaption,.band-card p,.flow-step p,.step p,.tl-item p').forEach(function (el) {
      if (el.closest('.no-read') || el.closest('.tool') || el.closest('table') || el.classList.contains('fig-note')) return;
      var clone = el.cloneNode(true);
      clone.querySelectorAll('.fig-note, .mono, .eyebrow, .badge').forEach(function (n) { n.remove(); });
      var t = (clone.textContent || '').replace(/\s+/g, ' ').trim();
      if (t.length < 2 || seen[t]) return;
      seen[t] = 1;
      splitSentences(t).forEach(function (s) { out.push(s); });
    });
    return out;
  }
  function setProgress(p) { var f = byId('audioFill'); if (f) f.style.width = Math.min(100, p) + '%'; }
  function updatePlayBtn(txt) { var b = byId('audioPlay'); if (b) b.textContent = txt; }
  function finish() {
    playing = false; paused = false; stopped = true; setProgress(100); updatePlayBtn('▶');
    var auto = byId('audioAuto');
    if (nextPage && auto && auto.checked) setTimeout(function () { location.href = nextPage; }, 1400);
  }
  function speakAt(i) {
    if (stopped) return;
    if (i >= queue.length) { finish(); return; }
    idx = i;
    var u = new SpeechSynthesisUtterance(queue[i]);
    u.lang = 'zh-CN'; u.rate = rate; u.pitch = 1;
    u.onend = function () { if (stopped) return; setProgress((idx + 1) / queue.length * 100); speakAt(idx + 1); };
    u.onerror = function () { if (stopped) return; speakAt(idx + 1); };
    synth.speak(u);
  }
  function playAudio() {
    if (!synth) { alert('这个浏览器不支持朗读，可以用眼睛读，内容一模一样。'); return; }
    if (paused) { synth.resume(); paused = false; playing = true; stopped = false; updatePlayBtn('❚❚'); return; }
    if (playing) return;
    stopped = false; playing = true;
    if (!queue.length) queue = buildQueue();
    if (!queue.length) { playing = false; stopped = true; return; }
    synth.cancel(); setProgress(0); updatePlayBtn('❚❚'); speakAt(idx);
  }
  function pauseAudio() {
    if (!synth || !playing) return;
    synth.pause(); paused = true; playing = false; updatePlayBtn('▶');
  }
  function toggleAudio() { playing ? pauseAudio() : playAudio(); }
  function stopAudio() {
    if (synth) synth.cancel();
    stopped = true; playing = false; paused = false; idx = 0; setProgress(0); updatePlayBtn('▶');
  }
  function initAudio() {
    byId('audioPlay').addEventListener('click', toggleAudio);
    byId('audioStop').addEventListener('click', stopAudio);
    byId('audioRate').addEventListener('change', function () {
      rate = parseFloat(this.value);
      if (playing || paused) { stopAudio(); playAudio(); }
    });
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: title, artist: '鱼心快跑', album: '把话想清楚' });
        navigator.mediaSession.setActionHandler('play', playAudio);
        navigator.mediaSession.setActionHandler('pause', pauseAudio);
        navigator.mediaSession.setActionHandler('stop', stopAudio);
        navigator.mediaSession.setActionHandler('nexttrack', function () { if (nextPage) location.href = nextPage; });
      } catch (e) {}
    }
    window.addEventListener('beforeunload', function () { if (synth) synth.cancel(); });
  }

  /* ---------- 滚动进度 / 揭幕 / 条形动画 ---------- */
  function initVisuals() {
    var bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + '%';
    }, { passive: true });
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fig, .reveal').forEach(function (el) {
        el.classList.add('in');
        el.querySelectorAll('.bar-fill[data-w]').forEach(function (b) { b.style.width = b.getAttribute('data-w'); });
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('.bar-fill[data-w]').forEach(function (b) { b.style.width = b.getAttribute('data-w'); });
        io.unobserve(e.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll('.fig, .reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---------- 7S 雷达 ---------- */
  function initRadar() {
    var svg = byId('radarSvg'); if (!svg) return;
    var labels = ['战略', '结构', '制度', '共同价值观', '风格', '人员', '技能'];
    var n = 7, cx = 170, cy = 160, R = 106, ns = 'http://www.w3.org/2000/svg';
    function pt(i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }
    var html = '';
    for (var lv = 1; lv <= 5; lv++) {
      var pts = [];
      for (var k = 0; k < n; k++) pts.push(pt(k, R * lv / 5).map(function (v) { return v.toFixed(1); }).join(','));
      html += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="var(--line)" stroke-dasharray="3 5"/>';
    }
    for (var j = 0; j < n; j++) {
      var p = pt(j, R);
      html += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" stroke="var(--line-strong)" stroke-dasharray="3 5"/>';
      var lp = pt(j, R + 24);
      html += '<text x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 3).toFixed(1) + '" text-anchor="' + (lp[0] < cx - 6 ? 'end' : lp[0] > cx + 6 ? 'start' : 'middle') + '" class="lbl">' + labels[j] + '</text>';
    }
    html += '<polygon id="radarData" points="" fill="rgba(10,149,138,.22)" stroke="var(--accent)" stroke-width="2.5"/>';
    svg.innerHTML = html;
    var poly = byId('radarData');
    var sliders = [];
    for (var s = 0; s < n; s++) sliders.push(byId('s' + s));
    function draw() {
      var vals = sliders.map(function (sl, i) { return sl ? parseInt(sl.value, 10) : 3; });
      var pts = vals.map(function (v, i) { return pt(i, R * v / 5).map(function (x) { return x.toFixed(1); }).join(','); });
      poly.setAttribute('points', pts.join(' '));
      sliders.forEach(function (sl, i) { var o = byId('sv' + i); if (o) o.textContent = vals[i]; });
      var min = Math.min.apply(null, vals);
      var weak = vals.map(function (v, i) { return v === min ? labels[i] : null; }).filter(Boolean);
      var out = byId('radarOut');
      if (out) out.innerHTML = '<b>体检结果：</b>目前最短的一根是「' + weak.join('、') + '」（' + min + '/5）。' +
        '7S 的意思不是七项都要满分，而是<strong>别让一根短的把其他六根拖下水</strong>。先补短板，再谈新战略。';
    }
    sliders.forEach(function (sl) { if (sl) sl.addEventListener('input', draw); });
    draw();
  }

  /* ---------- GE–麦肯锡九宫格 ---------- */
  function initNineBox() {
    var box = byId('nineBox'); if (!box) return;
    var rows = ['高', '中', '低'], cols = ['强', '中', '弱'];
    var html = '<div class="ax"></div>';
    cols.forEach(function (c) { html += '<div class="ax">业务实力 ' + c + '</div>'; });
    for (var r = 0; r < 3; r++) {
      html += '<div class="ax">吸引力 ' + rows[r] + '</div>';
      for (var c = 0; c < 3; c++) {
        var score = (2 - r) + (2 - c);
        var zone = score >= 3 ? 'grow' : score === 2 ? 'hold' : 'exit';
        var txt = score >= 3 ? '优先投入' : score === 2 ? '选择性维持' : '收割 / 退出';
        html += '<div class="cell9 ' + zone + '" data-r="' + r + '" data-c="' + c + '"><b>' + txt + '</b>吸引力' + rows[r] + ' × 实力' + cols[c] + '</div>';
      }
    }
    box.innerHTML = html;
    function update() {
      var r = parseInt(byId('attract').value, 10), c = parseInt(byId('strength').value, 10);
      box.querySelectorAll('.cell9').forEach(function (el) { el.classList.toggle('on', +el.dataset.r === r && +el.dataset.c === c); });
      var score = (2 - r) + (2 - c);
      var msg = score >= 3 ? '这格值得认真投：给资源、给人、给时间，并写清楚验证指标。'
        : score === 2 ? '这格先别急着加码：设一个「继续 / 停止」的检查点，用数据决定下一步。'
        : '这格适合体面收尾：少投钱、保住现金，把精力挪到更有胜算的地方。';
      byId('nineOut').innerHTML = '<b>你选中的格子：</b>' + msg + ' <span class="mono">（评分为你自己的判断，不是市场结论）</span>';
    }
    byId('attract').addEventListener('change', update);
    byId('strength').addEventListener('change', update);
    box.querySelectorAll('.cell9').forEach(function (el) {
      el.addEventListener('click', function () {
        byId('attract').value = el.dataset.r; byId('strength').value = el.dataset.c; update();
      });
    });
    update();
  }

  /* ---------- 工具选择器 ---------- */
  function initPicker() {
    var form = byId('toolPicker'); if (!form) return;
    var rec = {
      define: ['问题定义卡 + 七步法第 1 步', '先把「到底要决定什么」写清楚。你现在缺的不是分析，是一句能被回答的问题。'],
      split: ['议题树 + MECE', '把大问题切成能派活的小块，每块都得有人能在一小时内去查。'],
      org: ['7S 轮盘', '事情推不动多半不是战略不对，是结构、制度、人或风格里有一根没跟上。'],
      growth: ['三层面增长', '把「现在的饭碗」和「以后的饭碗」分开摆，别让今天忙的事吃照明天的种子。'],
      priority: ['影响–可行性矩阵 / 九宫格', '事太多时先排序：影响小又难做的，先请它排队。'],
      comm: ['金字塔原理 + SCQA', '你大概已经有答案了，缺的是让对方 30 秒听懂的顺序。']
    };
    function update() {
      var counts = {};
      form.querySelectorAll('input:checked').forEach(function (i) { counts[i.value] = (counts[i.value] || 0) + 1; });
      var best = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      if (!best) { byId('pickerOut').textContent = '先回答上面四个问题，我再给你挑工具。'; return; }
      byId('pickerOut').innerHTML = '<b>建议先用：' + rec[best][0] + '</b>\n' + rec[best][1] +
        '\n<span class="mono">同分时会取先被选到的那项，别把它当判决，当菜单看。</span>';
    }
    form.addEventListener('change', update); update();
  }

  /* ---------- SCQA 电梯稿生成器 ---------- */
  function initElevator() {
    var btn = byId('scqaBtn'); if (!btn) return;
    function build() {
      var s = byId('scqaS').value.trim(), c = byId('scqaC').value.trim(),
          q = byId('scqaQ').value.trim(), a = byId('scqaA').value.trim();
      if (!s || !a) { byId('scqaOut').innerHTML = '<b>还差一点：</b>至少把「现状」和「你的答案」写上。'; return; }
      var txt = '【情境】' + s + '\n【冲突】' + (c || '但最近情况变了。') + '\n【疑问】' + (q || '那我们到底该怎么办？') + '\n【答案】' + a;
      var secs = Math.round(txt.replace(/【|】|\n/g, '').length / 4.6);
      var verdict = secs <= 30 ? '在 30 秒内，可以进电梯了。' : '超过 30 秒了，删掉形容词和背景，只留一句结论 + 两条理由。';
      byId('scqaOut').innerHTML = '<b>你的 30 秒稿：</b>\n' + esc(txt) +
        '\n<span class="mono">约 ' + secs + ' 秒 · ' + verdict + '</span>';
    }
    btn.addEventListener('click', build);
    byId('scqaCopy').addEventListener('click', function () { copyText(byId('scqaOut').innerText, this); });
  }

  /* ---------- MECE 体检 ---------- */
  function initMece() {
    var btn = byId('meceBtn'); if (!btn) return;
    btn.addEventListener('click', function () {
      var items = byId('meceItems').value.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
      var out = byId('meceOut');
      if (items.length < 2) { out.innerHTML = '<b>还没拆呢：</b>至少写两项，才谈得上「不重不漏」。'; return; }
      var problems = [], seen = {}, overlap = 0;
      items.forEach(function (it) {
        if (seen[it]) problems.push('「' + it + '」出现了两次，属于重复（不独立）。');
        seen[it] = 1;
      });
      for (var i = 0; i < items.length; i++) for (var j = 0; j < items.length; j++) {
        if (i !== j && items[i].length > 1 && items[j].indexOf(items[i]) >= 0) {
          problems.push('「' + items[i] + '」被「' + items[j] + '」包住了，两者会抢同一件事。'); overlap++; break;
        }
      }
      items.forEach(function (it) {
        if (/其他|等等|杂项|各种|misc/i.test(it)) problems.push('「' + it + '」是万能筐：它兜住了遗漏，也掩盖了遗漏。');
      });
      var indep = Math.max(0, 100 - overlap * 25 - (problems.length - overlap) * 12);
      var html = '<b>独立性自测：</b><div class="bars" style="margin:10px 0 14px">' +
        '<div class="bar-row"><span class="bar-label">不重（自动检查）</span><div class="bar-track"><div class="bar-fill teal" style="width:' + indep + '%"></div></div><span class="bar-val">' + indep + '</span></div>' +
        '<div class="bar-row"><span class="bar-label">不漏（需要你回答）</span><div class="bar-track"><div class="bar-fill blue" style="width:0%"></div></div><span class="bar-val">?</span></div></div>';
      html += problems.length ? '<b>查到这些：</b>\n· ' + problems.map(esc).join('\n· ') : '<b>没查到明显重叠。</b>机器只能查字面重叠，查不出分类逻辑。';
      html += '\n<b>最后一问（必须自己答）：</b>把这 ' + items.length + ' 项加起来，能不能装下全部情况？举一个反例试试——比如「周末在家点外卖算哪一项」。';
      out.innerHTML = html;
    });
  }

  /* ---------- 小生意计算器（含敏感度） ---------- */
  function initProfit() {
    var btn = byId('pcBtn'); if (!btn) return;
    function val(id) { var v = parseFloat(byId(id).value); return isNaN(v) ? 0 : v; }
    btn.addEventListener('click', function () {
      var t = val('pcTraffic'), c = val('pcConv'), p = val('pcPrice'), m = val('pcMargin'),
          f = val('pcFixed'), goal = val('pcTarget') || 300;
      var profit = t * c / 100 * p * m / 100 - f;
      var levers = [
        { name: '路过人数 +50 人', v: (t + 50) * c / 100 * p * m / 100 - f },
        { name: '转化率 +1 个点',  v: t * Math.min(100, c + 1) / 100 * p * m / 100 - f },
        { name: '客单价 +2 元',    v: t * c / 100 * (p + 2) * m / 100 - f },
        { name: '毛利率 +2 个点',  v: t * c / 100 * p * Math.min(100, m + 2) / 100 - f }
      ].map(function (x) { x.gain = x.v - profit; return x; }).sort(function (a, b) { return b.gain - a.gain; });
      var max = Math.max.apply(null, levers.map(function (x) { return x.gain; })) || 1;
      var bars = levers.map(function (x) {
        return '<div class="bar-row"><span class="bar-label">' + x.name + '</span><div class="bar-track"><div class="bar-fill lime" style="width:' + (x.gain / max * 100).toFixed(0) + '%"></div></div><span class="bar-val">+' + x.gain.toFixed(0) + '</span></div>';
      }).join('');
      var verdict = profit >= goal ? '过了你设的线，可以进下一步：花半天去实地数一次人流。'
        : '还没过线。别急着改装修，先看下面哪根杠杆最值钱。';
      byId('pcOut').innerHTML = '<b>算出来：日利润约 ' + profit.toFixed(0) + ' 元</b>（目标 ' + goal.toFixed(0) + ' 元）。' + verdict +
        '\n公式：路过人数 × 转化率 × 客单价 × 毛利率 − 每天固定成本。' +
        '\n\n<b>各动一点点，哪个最划算：</b><div class="bars" style="margin-top:10px">' + bars + '</div>' +
        '<span class="mono">全部为示意参数，用你自己的数字替换；这不是收益预测。</span>';
    });
  }

  /* ---------- 影响–可行性矩阵 ---------- */
  function initMatrix() {
    var grid = byId('impactMatrix'); if (!grid) return;
    var advice = {
      q1: '立即做：影响大、又容易，别把它排在会后。今天下午就能动手的，通常就是这一格。',
      q2: '拆小再做：影响大但难，先做一个最小验证，别一上来就写三个月计划。',
      q3: '顺手做：容易但影响小，放在零碎时间，别让它占掉黄金两小时。',
      q4: '先别做：又难又不划算，写进「以后再说」清单，比硬扛诚实。'
    };
    grid.querySelectorAll('.q2').forEach(function (cell) {
      cell.addEventListener('click', function () {
        grid.querySelectorAll('.q2').forEach(function (x) { x.classList.remove('on'); });
        cell.classList.add('on');
        byId('matrixOut').innerHTML = '<b>' + cell.querySelector('b').textContent + '：</b>' + advice[cell.dataset.q];
      });
    });
  }

  /* ---------- 复制 ---------- */
  function copyText(txt, btn) {
    var done = function () { var old = btn.textContent; btn.textContent = '✓ 已复制'; setTimeout(function () { btn.textContent = old; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { fallback(); });
    else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = '复制失败'; }
      document.body.removeChild(ta);
    }
  }
  function initCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = byId(btn.getAttribute('data-copy')); if (t) copyText(t.innerText || t.textContent, btn);
      });
    });
  }

  /* ---------- 方法论全集：目录筛选 ---------- */
  function initMethodIndex() {
    var table = byId('methodTable'); if (!table) return;
    var input = byId('methodSearch');
    var btns = document.querySelectorAll('.filter-btn[data-cat]');
    var count = byId('methodCount');
    var rows = table.querySelectorAll('tr.method-row');
    var cat = 'all';
    function update() {
      var q = ((input && input.value) || '').trim().toLowerCase();
      var n = 0;
      rows.forEach(function (r) {
        var okCat = cat === 'all' || r.getAttribute('data-cat') === cat;
        var text = ((r.getAttribute('data-text') || '') + ' ' + r.textContent).toLowerCase();
        var show = okCat && (!q || text.indexOf(q) >= 0);
        r.classList.toggle('hidden', !show);
        if (show) n++;
      });
      if (count) count.textContent = '显示 ' + n + ' / ' + rows.length + ' 条';
    }
    if (input) input.addEventListener('input', update);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); cat = b.getAttribute('data-cat'); update();
      });
    });
    update();
  }

  /* ---------- 通用勾选体检 ---------- */
  function initChecklist(formId, outId, cfg) {
    var form = byId(formId); if (!form) return;
    var boxes = form.querySelectorAll('input[type=checkbox]');
    function update() {
      var n = form.querySelectorAll('input:checked').length;
      var pct = Math.round(n / boxes.length * 100);
      var msg = pct >= 80 ? cfg.high : pct >= 50 ? cfg.mid : cfg.low;
      byId(outId).innerHTML = '<b>' + n + ' / ' + boxes.length + ' 项</b> · ' + msg +
        '<div class="bars" style="margin-top:10px"><div class="bar-row"><span class="bar-label">' + esc(cfg.label) +
        '</span><div class="bar-track"><div class="bar-fill teal" style="width:' + pct + '%"></div></div><span class="bar-val">' + pct + '%</span></div></div>' +
        '<span class="mono">勾选是你自己的判断，不是测评分数，无信效度依据。</span>';
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();
  }

  /* ---------- 费米估算器 ---------- */
  function initFermi() {
    var btn = byId('fmBtn'); if (!btn) return;
    function num(id) { var v = parseFloat(byId(id).value); return isNaN(v) ? 0 : v; }
    btn.addEventListener('click', function () {
      var pop = num('fmPeople') * 10000, rate = num('fmRate'), times = num('fmTimes'), price = num('fmPrice');
      var buyers = pop * rate / 100, cups = buyers * times, money = cups * price;
      function f(x) { return Math.round(x).toLocaleString('zh-CN'); }
      byId('fmOut').innerHTML =
        '<b>一周大约 ' + f(cups) + ' 杯，约 ' + f(money) + ' 元</b>\n' +
        '拆法：' + f(pop) + ' 人 × ' + rate + '% 会买 = ' + f(buyers) + ' 人；' +
        '每人每周 ' + times + ' 杯 = ' + f(cups) + ' 杯；再乘 ' + price + ' 元 = ' + f(money) + ' 元。\n' +
        '<b>重点不是这个数准不准</b>，是你能把它拆成四个「能各自去查」的小数字。任何一个明显不靠谱，就单独去改那一个。\n' +
        '<span class="mono">示例参数仅为教学演算，不是任何市场数据或收益预测。</span>';
    });
  }

  /* ---------- 行动标题改写器 ---------- */
  function initHeadline() {
    var btn = byId('hlBtn'); if (!btn) return;
    btn.addEventListener('click', function () {
      var t = byId('hlInput').value.trim();
      if (!t) { byId('hlOut').innerHTML = '<b>先写一句标题</b>，比如「本月销售情况」。'; return; }
      byId('hlOut').innerHTML = '<b>原句：</b>' + esc(t) + '\n\n' +
        '<b>换成三个骨架（横线处得你自己填）：</b>\n' +
        '① 描述式 → 行动式：「' + esc(t) + '，因此建议先 ____，下一步 ____。」\n' +
        '② 结论先行：「建议 ____；因为' + esc(t) + '；所以本周先 ____。」\n' +
        '③ 带反驳空间：「' + esc(t) + '，但这不代表 ____，需要先验证 ____。」\n\n' +
        '<b>三问自检：</b>标题里有动词吗？有「所以呢」吗？别人能反驳它吗？三问都过不了，那还只是个话题，不是标题。\n' +
        '<span class="mono">生成器只搭骨架，不替你想结论；本站改编模板，非官方格式。</span>';
    });
  }

  /* ---------- 页面切换 / 操作动效 / 单招页互动 ---------- */
  function initPageTransition() {
    document.body.classList.add('page-enter');
    window.addEventListener('pageshow', function (e) {
      document.body.classList.remove('page-leave');
      if (e.persisted) document.body.classList.add('page-enter');
    });
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      document.body.classList.add('page-leave');
      setTimeout(function () { location.href = a.href; }, 200);
    });
  }

  function initMotion() {
    ['.mp-step', '.mp-trap', '.mp-rel', '.mp-flip', '.mp-quiz-opt', '.mp-flow .flow-step',
     '.mp-cycle-node', '.mp-layer', '.mp-f-item', '.mp-scale-item', '.mp-wf-col',
     '.mp-pyr-tier', '.grid.reveal > *', '.mp-fig .bar-row'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) { el.style.setProperty('--i', i % 8); });
    });
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.card, .mcard').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });
    }
    document.addEventListener('pointerdown', function (e) {
      var b = e.target && e.target.closest && e.target.closest('.btn, .icon-btn, .filter-btn, .mini-btn, .mp-quiz-opt, .mp-flip');
      if (!b) return;
      var r = b.getBoundingClientRect(), size = Math.max(r.width, r.height) * 1.7;
      var s = document.createElement('span');
      s.className = 'ripple';
      s.style.width = s.style.height = size + 'px';
      s.style.left = (e.clientX - r.left - size / 2) + 'px';
      s.style.top = (e.clientY - r.top - size / 2) + 'px';
      b.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 660);
    });
    var bt = document.createElement('button');
    bt.className = 'backtop'; bt.type = 'button';
    bt.setAttribute('aria-label', '回到顶部'); bt.textContent = '↑';
    document.body.appendChild(bt);
    bt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', function () { bt.classList.toggle('show', window.scrollY > 480); }, { passive: true });
    var chips = document.querySelectorAll('.toc a.chip[href^="#"]');
    if (chips.length && 'IntersectionObserver' in window) {
      var map = {};
      chips.forEach(function (c) {
        var sec = byId(c.getAttribute('href').slice(1));
        if (sec) map[sec.id] = c;
      });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || !map[en.target.id]) return;
          chips.forEach(function (c) { c.classList.remove('on'); });
          map[en.target.id].classList.add('on');
        });
      }, { rootMargin: '-18% 0px -72% 0px' });
      Object.keys(map).forEach(function (id) { spy.observe(byId(id)); });
    }
    if (page.indexOf('m-') === 0) {
      document.addEventListener('keydown', function (e) {
        if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
        var sel = e.key === 'ArrowLeft' ? '.mp-pager-card.prev' : e.key === 'ArrowRight' ? '.mp-pager-card.next' : '';
        if (!sel) return;
        var a = document.querySelector(sel);
        if (a) a.click();
      });
    }
  }

  function initMethodTools() {
    document.querySelectorAll('.mp-tool').forEach(function (tool) {
      var kind = tool.getAttribute('data-mp-tool');
      var out = tool.querySelector('.mp-tool-out');
      if (kind === 'check') {
        var boxes = tool.querySelectorAll('input[type=checkbox]');
        function upd() {
          var n = tool.querySelectorAll('input:checked').length;
          if (!out) return;
          out.innerHTML = '<b>' + n + ' / ' + boxes.length + ' 项</b> · ' +
            (n === boxes.length ? '四步都过了一遍，可以拿去用了。' : n >= 2 ? '大方向对了，把没勾的那两条补上。' : '先照着没勾的做一遍，比再读一遍讲解管用。') +
            '<span class="mono"> · 自评，不是测评分数</span>';
        }
        boxes.forEach(function (b) { b.addEventListener('change', upd); });
        upd();
      } else if (kind === 'flip') {
        tool.querySelectorAll('.mp-flip').forEach(function (b) {
          b.addEventListener('click', function () {
            var on = b.classList.toggle('on');
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
        });
      } else if (kind === 'quiz') {
        tool.querySelectorAll('.mp-quiz-opt').forEach(function (b) {
          b.addEventListener('click', function () {
            var ok = b.getAttribute('data-ok') === '1';
            tool.querySelectorAll('.mp-quiz-opt').forEach(function (x) { x.classList.remove('right', 'wrong'); });
            b.classList.add(ok ? 'right' : 'wrong');
            if (out) out.innerHTML = ok
              ? '<b>答对了。</b>关键就在这一句；往下看「带走一句」再记一遍。'
              : '<b>再想想。</b>提示：回到上面那张图，看它到底在解决什么问题。';
          });
        });
      } else if (kind === 'slider') {
        var input = tool.querySelector('input[type=range]');
        if (!input || !out) return;
        var vals = {};
        (tool.getAttribute('data-vals') || '').split(',').forEach(function (p) {
          var kv = p.split(':'); if (kv.length === 2) vals[kv[0]] = kv[1];
        });
        var eq = tool.querySelector('.mp-slider-eq');
        var res = tool.querySelector('.mp-slider-res');
        var formula = tool.getAttribute('data-formula') || '';
        function upd() {
          var v = input.value;
          if (eq) eq.textContent = formula.replace('{v}', v);
          if (res) res.textContent = vals[v] !== undefined ? vals[v] : '—';
          out.innerHTML = '<b>' + esc(tool.getAttribute('data-label') || '') + '</b><br>' +
            '拨一下这个数，看结果怎么动。重点是「哪个变量最灵敏」，不是记住某个具体数值。' +
            '<span class="mono"> · 示意参数，非真实数据</span>';
        }
        input.addEventListener('input', upd);
        upd();
      }
    });
  }

  /* ---------- 启动 ---------- */
  buildNav(); buildFooter(); buildAudioBar(); initAudio(); initVisuals();
  initPageTransition(); initMotion(); initMethodTools();
  initRadar(); initNineBox(); initPicker(); initElevator(); initMece(); initProfit(); initMatrix(); initCopy();
  initMethodIndex(); initFermi(); initHeadline();
  initChecklist('strategyCheck', 'strategyOut', {
    label: '战略十测通过率',
    high: '这份战略经得住大部分追问，剩下的挑最弱那一条补证据。',
    mid: '一半左右立得住，先补「优势来源」和「不确定性」这两类问题。',
    low: '这更像一份愿望清单。回到第 1 步：先把「要在哪竞争、凭什么赢」写具体。'
  });
  initChecklist('changeCheck', 'changeOut', {
    label: '变革四杠杆齐备度',
    high: '四根杠杆基本都在，接下来只要保持一致，别中途换说法。',
    mid: '缺的那一根通常会把另外三根拖住，先补它。',
    low: '只靠发通知推不动变化：先把「为什么」和「谁做示范」补上。'
  });
  initChecklist('commCheck', 'commOut', {
    label: '一页纸自检通过率',
    high: '可以拿去讲了，记得最后留一句「还没查什么」。',
    mid: '结构还行，但结论或证据有一层是虚的，回去补。',
    low: '先别做 PPT，回去把结论写成一句能被反驳的话。'
  });
  document.querySelectorAll('a[href^="http"]').forEach(function (a) { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
})();
