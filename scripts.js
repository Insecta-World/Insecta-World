
for (let i = 0; i < 26; i++) { const f = document.createElement('div'); f.className = 'ff'; f.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${6 + Math.random() * 8}s;--dl:${Math.random() * 9}s;--x:${(Math.random() - .5) * 90}px;--y:${-25 - Math.random() * 65}px;--x2:${(Math.random() - .5) * 130}px;--y2:${(Math.random() - .5) * 50}px`; document.body.appendChild(f) }
const lEs = ['🪳', '🪲', '🐞', '🐛', '🐜', '🐝', '🕷️', '🦋']; for (let i = 0; i < 10; i++) { const l = document.createElement('div'); l.className = 'lf'; l.textContent = lEs[i % 8]; l.style.cssText = `left:${Math.random() * 100}%;--d:${10 + Math.random() * 9}s;--dl:${Math.random() * 11}s;--sw:${(Math.random() - .5) * 130}px`; document.body.appendChild(l) }

/* ── INFINITE SLIDER ── */
const MENU = [
  { label: '🦋  The Class Insecta', key: 'home' },
  { label: '✨  Trivia', key: 'trivia' },
  { label: '📖  Information', key: 'info' },
  { label: '🎮  Game', key: 'game' },
];
const ITEM_H = 55;
const REPS = 7; // repeat list N times for seamless feel
const track = document.getElementById('sliderTrack');
const nodes = [];

for (let r = 0; r < REPS; r++) {
  MENU.forEach(m => {
    const wrap = document.createElement('div'); wrap.className = 'slide-item';
    const btn = document.createElement('button'); btn.className = 'slide-btn'; btn.textContent = m.label;
    btn.addEventListener('click', () => openM(m.key));
    wrap.appendChild(btn); track.appendChild(wrap); nodes.push(wrap);
  });
}

const TOTAL = nodes.length;
// Start at the center-ish block
let cur = Math.floor(REPS / 2) * MENU.length;
let busy = false;

function offset(i) { return -(i * ITEM_H - 82.5); }  // 82.5 = center of 220px window - half item

function setPos(i, anim) {
  track.style.transition = anim ? 'transform .42s cubic-bezier(.22,1,.5,1)' : 'none';
  track.style.transform = `translateY(${offset(i)}px)`;
  paint();
}

function paint() {
  nodes.forEach((n, i) => {
    const d = i - cur;
    n.className = 'slide-item ' + (d === 0 ? 'center' : Math.abs(d) === 1 ? 'near' : 'dim');
  });
}

function step(dir) {
  if (busy) return; busy = true;
  cur += dir; setPos(cur, true);
  setTimeout(() => {
    // seamless wrap
    const lo = MENU.length, hi = TOTAL - MENU.length - 1;
    if (cur <= lo) { cur += MENU.length * (Math.floor(REPS / 2) - 1); setPos(cur, false); }
    else if (cur >= hi) { cur -= MENU.length * (Math.floor(REPS / 2) - 1); setPos(cur, false); }
    busy = false;
  }, 450);
}

document.getElementById('arrUp').addEventListener('click', () => step(-1));
document.getElementById('arrDown').addEventListener('click', () => step(1));
setPos(cur, false);

/* drag */
const outer = document.getElementById('sliderOuter');
let sy = 0, drag = false;
outer.addEventListener('mousedown', e => { sy = e.clientY; drag = true; e.preventDefault() });
window.addEventListener('mousemove', e => { if (!drag) return; const d = sy - e.clientY; if (Math.abs(d) > 36) { step(d > 0 ? 1 : -1); drag = false } });
window.addEventListener('mouseup', () => drag = false);
outer.addEventListener('touchstart', e => { sy = e.touches[0].clientY }, { passive: true });
outer.addEventListener('touchend', e => { const d = sy - e.changedTouches[0].clientY; if (Math.abs(d) > 28) step(d > 0 ? 1 : -1) });
outer.addEventListener('wheel', e => { e.preventDefault(); step(e.deltaY > 0 ? 1 : -1) }, { passive: false });

/* modals */
function openM(k) { document.getElementById('m-' + k).classList.add('open'); document.body.style.overflow = 'hidden'; if (k === 'game') showGameSelection(); }
function closeM(k) { document.getElementById('m-' + k).classList.remove('open'); document.body.style.overflow = ''; }
document.querySelectorAll('.overlay').forEach(el => { el.addEventListener('click', e => { if (e.target === el) closeM(el.id.replace('m-', '')) }) });
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(el => closeM(el.id.replace('m-', ''))) });

/* quiz */
const Qs = [
  { q: "Spider: What is the primary purpose of a spider's web?", opts: ["Housing a colony", "Catching prey", "Storing food", "Communicating with other spiders"], ans: 1 },
  { q: "Bee: What do worker bees primarily collect?", opts: ["Nectar", "Leaves", "Wood pulp", "Pollen only"], ans: 0 },
  { q: "Beetle: Which beetle is famous for rolling dung?", opts: ["Ladybird", "Stag beetle", "Dung beetle", "Weevil"], ans: 2 },
  { q: "Grasshopper: How do grasshoppers primarily move long distances?", opts: ["Flying long distances", "Hopping with powerful hind legs", "Swimming", "Gliding"], ans: 1 },
  { q: "Moth: When are most moth species active?", opts: ["Daytime (diurnal)", "Nighttime (nocturnal)", "Only at dawn", "Only during rain"], ans: 1 },
  { q: "LadyBug: What is a common defense of ladybugs against predators?", opts: ["Camouflage", "Secreting a foul-tasting fluid", "Playing dead", "Biting"], ans: 1 },
  { q: "Butterfly: What is the process called when a caterpillar becomes a butterfly?", opts: ["Metamorphosis", "Photosynthesis", "Pollination", "Ecdysis"], ans: 0 },
];
let qi = 0, qs = 0, qa = false;
function initQ() { qi = 0; qs = 0; document.getElementById('qscore').style.display = 'none'; document.getElementById('qwrap').style.display = 'block'; loadQ() }
function loadQ() {
  if (qi >= Qs.length) { showScore(); return }
  qa = false; const q = Qs[qi];
  document.getElementById('qtext').textContent = `Q${qi + 1}/${Qs.length}: ${q.q}`;
  const opEl = document.getElementById('qopts'); opEl.innerHTML = '';
  q.opts.forEach((o, i) => { const b = document.createElement('button'); b.className = 'qopt'; b.textContent = o; b.onclick = () => chkQ(i); opEl.appendChild(b) });
  const r = document.getElementById('qres'); r.className = 'qres'; r.textContent = '';
  document.getElementById('nxtbtn').className = 'nxtbtn';
}
function chkQ(c) {
  if (qa) return; qa = true; const q = Qs[qi];
  document.querySelectorAll('.qopt').forEach((b, i) => { b.classList.add('off'); if (i === q.ans) b.classList.add('ok'); else if (i === c && c !== q.ans) b.classList.add('ng') });
  const r = document.getElementById('qres');
  if (c === q.ans) { qs++; r.textContent = '✅ Correct! Well done!'; r.className = 'qres show ok'; }
  else { r.textContent = `❌ Nuh uh, it was "${q.opts[q.ans]}"`; r.className = 'qres show ng'; }
  document.getElementById('nxtbtn').className = 'nxtbtn show';
}
function nextQ() { qi++; loadQ() }
function showScore() { document.getElementById('qwrap').style.display = 'none'; document.getElementById('qscore').style.display = 'block'; document.getElementById('scorenum').textContent = `${qs}/${Qs.length}` }

const FPuzzles = [
  { word: 'LADYBUG', images: ['red.jpg', 'bag.jpg', 'polkadots.jpg', 'lady.jpg'] },
  { word: 'GRASSHOPPER', images: ['hopping.png', 'camou.jpg', 'grass.jpg', 'jumping-rope.jpg'] },
  { word: 'BEE', images: ['mesh.png', 'crown.jpg', 'beyonce.jpg', 'hany.jpg'] },
  { word: 'BUTTERFLY', images: ['sleeping-300x300.jpg', 'mariahcarey.jpg', 'butter.jpg', 'flower.jpg'] },
  { word: 'ANTS', images: ['antenna.jpg', 'lifting.jpg', 'mound.jpg', 'lining-up.png'] },
  { word: 'SPIDERS', images: ['match_box.jpg', 'cobweb.jpg', 'Tom-Holland-3994868858.jpg', 'miles-morales.jpg'] },
  { word: 'COCKROACHES', images: ['fly-swatter.jpg', 'slipper.jpg', 'rooster.jpg', 'oggy-and-the-cockroaches.jpg'] },
];
let fpIndex = 0, fpScore = 0, fpAnswered = false;

function showGameSelection() {
  document.getElementById('gameSelection').style.display = 'block';
  document.getElementById('quizGame').style.display = 'none';
  document.getElementById('fourPicsGame').style.display = 'none';
}

function startGame(mode) {
  document.getElementById('gameSelection').style.display = 'none';
  if (mode === 'quiz') {
    document.getElementById('quizGame').style.display = 'block';
    document.getElementById('fourPicsGame').style.display = 'none';
    initQ();
  } else {
    document.getElementById('quizGame').style.display = 'none';
    document.getElementById('fourPicsGame').style.display = 'block';
    initFP();
  }
}

function initFP() {
  fpIndex = 0; fpScore = 0; fpAnswered = false;
  document.getElementById('fpScore').style.display = 'none';
  document.getElementById('fpControls').style.display = 'block';
  document.getElementById('fpNext').classList.remove('show');
  document.getElementById('fpSubmit').classList.add('show');
  loadFP();
}

function loadFP() {
  if (fpIndex >= FPuzzles.length) { showFPScore(); return; }
  fpAnswered = false;
  const fp = FPuzzles[fpIndex];
  document.getElementById('fpProgress').textContent = `Puzzle ${fpIndex + 1}/${FPuzzles.length}`;
  const grid = document.getElementById('fpImages');
  grid.innerHTML = '';
  fp.images.forEach(img => {
    const imgEl = document.createElement('img');
    imgEl.src = `Images/4pics1word/${img}`;
    imgEl.alt = img.replace(/[-_.]/g, ' ');
    imgEl.className = 'fourpics-img';
    grid.appendChild(imgEl);
  });
  document.getElementById('fpGuess').value = '';
  document.getElementById('fpGuess').focus();
  document.getElementById('fpRes').className = 'qres';
  document.getElementById('fpRes').textContent = '';
  document.getElementById('fpNext').classList.remove('show');
  document.getElementById('fpSubmit').classList.add('show');
}

function submitFP() {
  if (fpAnswered) return;
  const guess = document.getElementById('fpGuess').value.trim().toUpperCase().replace(/[^A-Z]/g, '');
  const fp = FPuzzles[fpIndex];
  const res = document.getElementById('fpRes');
  if (!guess) {
    res.textContent = 'Type an answer to continue.';
    res.className = 'qres show ng';
    return;
  }
  fpAnswered = true;
  if (guess === fp.word) {
    fpScore++;
    res.textContent = '✅ Great! That is correct.';
    res.className = 'qres show ok';
    if (fpIndex === FPuzzles.length - 1) {
      setTimeout(() => showFPScore(), 1000);
    } else {
      document.getElementById('fpSubmit').classList.remove('show');
      document.getElementById('fpNext').classList.add('show');
    }
  } else {
    res.textContent = `❌ Not quite. The answer is ${fp.word}.`;
    res.className = 'qres show ng';
    document.getElementById('fpSubmit').classList.remove('show');
    document.getElementById('fpNext').classList.add('show');
  }
}

function nextFP() { fpIndex++; loadFP(); }

function showFPScore() {
  document.getElementById('fpScore').style.display = 'block';
  document.getElementById('fpScoreNum').textContent = `${fpScore}/${FPuzzles.length}`;
  document.getElementById('fpImages').innerHTML = '';
  document.getElementById('fpControls').style.display = 'none';
  document.getElementById('fpProgress').textContent = 'All done!';
  document.getElementById('fpRes').className = 'qres';
  document.getElementById('fpRes').textContent = '';
}
