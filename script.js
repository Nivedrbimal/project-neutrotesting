const firebaseConfig = { 
  apiKey: "AIzaSyDRTudYlNmrMCA-mS_sD728w3kEbc4Yc-w",
  authDomain: "neutroxity-9c5f6.firebaseapp.com",
  databaseURL: "https://neutroxity-9c5f6-default-rtdb.firebaseio.com",
  projectId: "neutroxity-9c5f6",
  storageBucket: "neutroxity-9c5f6.firebasestorage.app",
  messagingSenderId: "729204963407",
  appId: "1:729204963407:web:f561d70d4cd9e12556523a",
  measurementId: "G-EBHBKRW3KK"
};
let db = null;
let currentUser = null;
firebase.initializeApp(firebaseConfig);
firebase.appCheck().activate('6LdbiwcsAAAAAI1ZW4dAvR9yJuDT0sYBAaMtDmyF',true);
const auth = firebase.auth();
const signUpLoginScreen = document.getElementById('signUpLoginScreen');
const profileScreen = document.getElementById('profileScreen');
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    db = firebase.database();
    console.log("Signed in as:", user.email);
    showScreen(profileScreen);
    startApp(user);
  } 
  else {
    currentUser = null;
    db = firebase.database();
    console.log("No user signed in");
    showScreen(signUpLoginScreen);
  }
  showSnakeLeaderScores();
  showJetShooterLeaderScores();
});
function showScreen(screenToShow) {
  const screens = [signUpLoginScreen, profileScreen];
  screens.forEach(screen => {
    if (screen === screenToShow) {
      screen.classList.add('sll-visible');
      screen.classList.remove('sll-hidden');
    } else {
      screen.classList.add('sll-hidden');
      screen.classList.remove('sll-visible');
    }
  });
}
async function signUp() {
  const usernameInput = document.getElementById('signUpUsername');
  const passwordInput = document.getElementById('signUpPassword');
  const signUpOut = document.getElementById('signUpOut');
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    signUpOut.textContent = "Please enter a username and password.";
    return;
  }
  const email = username + "@neutroxity.com";
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;
    currentUser = user;
    db = firebase.database();
    const userData = {
      uid: user.uid,
      email: email,
      username: username,
      highscores: {
        snakeHighScore: 0,
        jetShooterHighScore: 0,
      },
      themes: {}
    };
    await db.ref(`users/${user.uid}`).set(userData);
    signUpOut.textContent = `User created: ${user.email}`;
    startApp(user);
    await wait(4000);
    showScreen(profileScreen);
    usernameInput.value = '';
    passwordInput.value = '';
    signUpOut.textContent = '';
  } catch (err) {
    console.error("Sign-up error:", err);
    signUpOut.textContent = "Unable to create an account, please try again later.";
  }
}
async function signIn() {
  const usernameInput = document.getElementById('loginUsername');
  const passwordInput = document.getElementById('loginPassword');
  const loginOut = document.getElementById('loginOut');
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    loginOut.textContent = "Please enter a username and password.";
    return;
  }
  const email = username + "@neutroxity.com";
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const result = await auth.signInWithEmailAndPassword(email, password);
    currentUser = result.user;
    db = firebase.database();
    loginOut.textContent = `User signed in: ${result.user.email}`;
    startApp(result.user);
    await wait(4000);
    showScreen(profileScreen);
    usernameInput.value = '';
    passwordInput.value = '';
    loginOut.textContent = '';
  } 
  catch (err) {
    console.error("Sign-in error:", err);
    loginOut.textContent = "Unable to login, please check your login info.";
  }
}
async function signOut() {
  const profileOut = document.getElementById('profileOut');
  try {
    await auth.signOut();
    currentUser = null;
    db = null;
    profileOut.textContent = "Successfully signed out";
    await wait(4000);
    showScreen(signUpLoginScreen);
    profileOut.textContent = '';
  } catch (err) {
    console.error("Sign-out error:", err);
    profileOut.textContent = "Unable to sign out, please try again later";
  }
}
function startApp(user) {
  firebase.appCheck().getToken(false)
    .then(tokenResponse => {
      if (tokenResponse) console.log("App Check token recieved");
      db.ref(`users/${user.uid}/test`).set({ message: "Hello!" })
        .then(() => console.log("Data written successfully!"))
        .catch(err => console.error("Write failed:", err));
        loadElementData();
      db.ref(`users/${user.uid}/test`).on("value", snapshot => {
        console.log("Database value:", snapshot.val());
      });
    })
    .catch(err => {
      if (err) console.error("App Check failed, unidentified domain")
    });
}
function addUserData(newData) {
  if (!db || !currentUser) return console.error("Database or user not initialized!");
  db.ref(`users/${currentUser.uid}`).update(newData)
    .then(() => console.log("Data updated successfully!"))
    .catch(err => console.error("Failed to update data:", err));
}
function getUserData() {
  if (!db || !currentUser) return console.error("Database or user not initialized!");
  db.ref(`users/${currentUser.uid}`).once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        console.log("User data:", snapshot.val());
      } else {
        console.log("No data found for this user.");
      }
    })
    .catch(err => console.error("Failed to get data:", err));
}


document.body.style.overflow = 'hidden';

// ---------- Supporter ----------
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const isNum = v => v !== null && v !== '' && !Number.isNaN(Number(v));
const toNum = v => isNum(v) ? Number(v) : null;
const known = x => x !== null;
const deg2rad = d => d * Math.PI / 180;
const rad2deg = r => r * 180 / Math.PI;

// ------ Favicon Selection ------
function setFavicon() {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const lightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
  const favicon = document.querySelector('link[rel="icon"]');
  const faviconApple = document.querySelector('link[rel="apple-touch-icon"]');
  if(darkMode) favicon.href = 'faviconNRB.ico';
  else favicon.href = 'faviconNRB.png';
  if(darkMode) faviconApple.href = 'faviconNRB.png'; 
  else faviconApple.href = 'faviconNRBAD.png';
}
setFavicon();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setFavicon);

// ---------- Navigation ----------
const topLinks = document.querySelectorAll(".top-link");
function switchTopPanel(e) {
  const targetPanelId = e.target.getAttribute("data-target");
  const allPanels = document.querySelectorAll(".panel");
  allPanels.forEach(panel => {
    panel.classList.remove("visible-panel");
    panel.classList.add("hidden");
  });
  const activePanel = document.getElementById(targetPanelId);
  if (activePanel) {
    activePanel.classList.remove("hidden");
    activePanel.classList.add("visible-panel");
  }
}
topLinks.forEach(link => link.addEventListener("click", switchTopPanel));
document.getElementById("panel-home").classList.add("visible-panel");
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const toggleSidebarResponsive = document.getElementById("toggleSidebarResponsive");

  toggleSidebarResponsive.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
});
document.addEventListener("click", (e) => {
  if (
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    e.target !== toggleSidebarResponsive
  ) {
    sidebar.classList.remove("open");
  }
});
function navTo(id) {
  document.querySelectorAll('.panel').forEach(s => {
    if (s.id === id) {
      s.classList.remove('hidden');
      s.classList.add('visible-panel');
      s.querySelectorAll('input, button, select, textarea').forEach(el => el.setAttribute('tabindex', '0'));
    } else {
      s.classList.add('hidden');
      s.classList.remove('visible-panel');
      s.querySelectorAll('input, button, select, textarea').forEach(el => el.setAttribute('tabindex', '-1'));
    }
  });
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.menu-btn[data-target="${id}"]`);
  if (btn) btn.classList.add('active');
  const app = document.getElementById('app');
  if (app) app.focus();
}
document.addEventListener('click', (e) => {
  const mb = e.target.closest('.menu-btn');
  if (mb) navTo(mb.dataset.target);
});
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("toggleSidebar");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
});
// ---------- INTRO SCREEN ----------
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');
  const header = document.getElementById('mainHeader');
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('app');
  if (!intro) {
    header.classList.remove('hidden');
    sidebar.classList.remove('hidden');
    main.classList.remove('hidden');
    header.classList.add('visible');
    sidebar.classList.add('visible');
    main.classList.add('visible');
    document.body.style.overflow = 'auto';
    return;
  }
  setTimeout(() => { intro.classList.add('fade-out'); }, 4000);
  setTimeout(() => {
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    if (header) header.classList.remove('hidden');
    if (sidebar) sidebar.classList.remove('hidden');
    if (main) main.classList.remove('hidden');

    header && header.classList.add('visible');
    sidebar && sidebar.classList.add('visible');
    main && main.classList.add('visible');

    document.body.style.overflow = 'auto';
  }, 5000);
});

// =========== MATHEMATICS ============

// -------- GENERAL CALCULATOR --------
function genCalcCompute() {
  const input = document.getElementById('genCalcVal').value;
  const mode = document.getElementById('genCalcAngleMode').value;
  const round = document.getElementById('genCalcRound').value || 10000;
  let expr = input
    .replace(/x/g, '*')
    .replace(/÷/g, '/')
    .replace(/\^/g, '**')
    .replace(/π/g, 'Math.PI');

  if (mode === 'deg') {
    expr = expr.replace(/sin⁻¹\(([^)]+)\)/g, '(Math.asin($1) * 180 / Math.PI)');
    expr = expr.replace(/cos⁻¹\(([^)]+)\)/g, '(Math.acos($1) * 180 / Math.PI)');
    expr = expr.replace(/tan⁻¹\(([^)]+)\)/g, '(Math.atan($1) * 180 / Math.PI)');
    expr = expr.replace(/csc⁻¹\(([^)]+)\)/g, '(Math.asin(1 / $1) * 180 / Math.PI)');
    expr = expr.replace(/sec⁻¹\(([^)]+)\)/g, '(Math.acos(1 / $1) * 180 / Math.PI)');
    expr = expr.replace(/cot⁻¹\(([^)]+)\)/g, '(Math.atan(1 / $1) * 180 / Math.PI)');
    expr = expr.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
    expr = expr.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
    expr = expr.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
    expr = expr.replace(/csc\(([^)]+)\)/g, '1 / Math.sin(($1) * Math.PI / 180)');
    expr = expr.replace(/sec\(([^)]+)\)/g, '1 / Math.cos(($1) * Math.PI / 180)');
    expr = expr.replace(/cot\(([^)]+)\)/g, '1 / Math.tan(($1) * Math.PI / 180)');
    expr = expr.replace(/asin\(([^)]+)\)/g, '(Math.asin($1) * 180 / Math.PI)');
    expr = expr.replace(/acos\(([^)]+)\)/g, '(Math.acos($1) * 180 / Math.PI)');
    expr = expr.replace(/atan\(([^)]+)\)/g, '(Math.atan($1) * 180 / Math.PI)');
    expr = expr.replace(/acsc\(([^)]+)\)/g, '(Math.asin(1 / $1) * 180 / Math.PI)');
    expr = expr.replace(/asec\(([^)]+)\)/g, '(Math.acos(1 / $1) * 180 / Math.PI)');
    expr = expr.replace(/acot\(([^)]+)\)/g, '(Math.atan(1 / $1) * 180 / Math.PI)');
  } else {
    expr = expr.replace(/sin⁻¹\(([^)]+)\)/g, 'Math.asin($1)');
    expr = expr.replace(/cos⁻¹\(([^)]+)\)/g, 'Math.acos($1)');
    expr = expr.replace(/tan⁻¹\(([^)]+)\)/g, 'Math.atan($1)');
    expr = expr.replace(/csc⁻¹\(([^)]+)\)/g, 'Math.asin(1 / $1)');
    expr = expr.replace(/sec⁻¹\(([^)]+)\)/g, 'Math.acos(1 / $1)');
    expr = expr.replace(/cot⁻¹\(([^)]+)\)/g, 'Math.atan(1 / $1)');
    expr = expr.replace(/sin\(([^)]+)\)/g, 'Math.sin($1)');
    expr = expr.replace(/cos\(([^)]+)\)/g, 'Math.cos($1)');
    expr = expr.replace(/tan\(([^)]+)\)/g, 'Math.tan($1)');
    expr = expr.replace(/csc\(([^)]+)\)/g, '1 / Math.sin($1)');
    expr = expr.replace(/sec\(([^)]+)\)/g, '1 / Math.cos($1)');
    expr = expr.replace(/cot\(([^)]+)\)/g, '1 / Math.tan($1)');
    expr = expr.replace(/asin\(([^)]+)\)/g, 'Math.asin($1)');
    expr = expr.replace(/acos\(([^)]+)\)/g, 'Math.acos($1)');
    expr = expr.replace(/atan\(([^)]+)\)/g, 'Math.atan($1)');
    expr = expr.replace(/acsc\(([^)]+)\)/g, 'Math.asin(1 / $1)');
    expr = expr.replace(/asec\(([^)]+)\)/g, 'Math.acos(1 / $1)');
    expr = expr.replace(/acot\(([^)]+)\)/g, 'Math.atan(1 / $1)');
  }
  try {
    const result = eval(expr);
    if (round === 0) {
      document.getElementById('genCalcOut').textContent = result;
    }
    else {
      document.getElementById('genCalcOut').textContent = Math.round(result * round) / round;
    }
  }
  catch (e) {
    document.getElementById('genCalcOut').textContent = "Invalid Expression";
  }
}
function genCalcClear() {
  document.getElementById('genCalcVal').value = '';
  document.getElementById('genCalcRound').value = 'select'
  document.getElementById('genCalcAngleMode').value = 'select'
  document.getElementById('genCalcOut').textContent = '';
}


// ---------- TRIG EVALUATOR ----------

function fmt(v) { v = Number(v); if (isNaN(v)) return 0; return Number(v.toFixed(6)); }

function parseRadianInput(raw) {
  try { return eval(raw.replace(/π/g, 'Math.PI')); }
  catch { return NaN; }
}
function parsePolarInput(raw) {
  const match = raw.match(/^\s*([\d.]+)\s*∠\s*([\d.π\/+-]+)\s*$/i);
  if (!match) return null;
  let r = parseFloat(match[1]);
  let theta;
  try { theta = eval(match[2].replace(/π/g, 'Math.PI')); }
  catch { return null; }
  return { r, theta };
}
function updatePlaceholder() {
  const mode = document.getElementById('triMode').value;
  const op = document.getElementById('triOp').value;
  const input = document.getElementById('triVal');
  if (['asin', 'acos', 'atan', 'acsc', 'asec', 'acot'].includes(op))
    input.placeholder = 'Enter value';
  else if (['sinh', 'cosh', 'tanh', 'csch', 'sech', 'coth'].includes(op))
    input.placeholder = 'Enter a real number';
  else if (mode === 'deg') input.placeholder = 'Enter in degree(s)';
  else input.placeholder = 'Enter in radian(s)';
}
function trigClear() {
  document.getElementById('triOut').textContent = '';
  document.getElementById('triVal').value = '';
  document.getElementById('triPolar').value = '';
  document.getElementById('triOp').value = 'sin';
  document.getElementById('triMode').value = 'deg';
  updatePlaceholder();
}
function getNiceAngle(op, angle) {
  const pi = Math.PI, tol = 1e-6;
  const near = (a, b) => Math.abs(a - b) < tol;

  switch (op) {
    case 'sin':
      if (near(angle, 0) || near(angle, 2 * pi)) return '0';
      if (near(angle, pi / 6) || near(angle, 11 * pi / 6)) return '1/2';
      if (near(angle, pi / 4) || near(angle, 7 * pi / 4)) return '√2/2';
      if (near(angle, pi / 3) || near(angle, 5 * pi / 3)) return '√3/2';
      if (near(angle, pi / 2)) return '1';
      if (near(angle, pi)) return '0';
      break;
    case 'cos':
      if (near(angle, 0) || near(angle, 2 * pi)) return '1';
      if (near(angle, pi / 6) || near(angle, 11 * pi / 6)) return '√3/2';
      if (near(angle, pi / 4) || near(angle, 7 * pi / 4)) return '√2/2';
      if (near(angle, pi / 3) || near(angle, 5 * pi / 3)) return '1/2';
      if (near(angle, pi / 2) || near(angle, 3 * pi / 2)) return '0';
      if (near(angle, pi)) return '-1';
      break;
    case 'tan':
      if (near(angle, 0) || near(angle, pi) || near(angle, 2 * pi)) return '0';
      if (near(angle, pi / 6) || near(angle, 7 * pi / 6)) return '1/√3';
      if (near(angle, pi / 4) || near(angle, 5 * pi / 4)) return '1';
      if (near(angle, pi / 3) || near(angle, 4 * pi / 3)) return '√3';
      if (near(angle, pi / 2) || near(angle, 3 * pi / 2)) return 'undefined';
      break;
    case 'csc':
      if (near(angle, 0) || near(angle, pi) || near(angle, 2 * pi)) return 'undefined';
      if (near(angle, pi / 6) || near(angle, 5 * pi / 6)) return '2';
      if (near(angle, pi / 4) || near(angle, 3 * pi / 4)) return '√2';
      if (near(angle, pi / 3) || near(angle, 2 * pi / 3)) return '2√3/3';
      if (near(angle, pi / 2)) return '1';
      break;
    case 'sec':
      if (near(angle, pi / 2) || near(angle, 3 * pi / 2)) return 'undefined';
      if (near(angle, 0) || near(angle, 2 * pi)) return '1';
      if (near(angle, pi / 6) || near(angle, 11 * pi / 6)) return '2√3/3';
      if (near(angle, pi / 4) || near(angle, 7 * pi / 4)) return '√2';
      if (near(angle, pi / 3) || near(angle, 5 * pi / 3)) return '2';
      if (near(angle, pi)) return '-1';
      break;
    case 'cot':
      if (near(angle, 0) || near(angle, pi) || near(angle, 2 * pi)) return 'undefined';
      if (near(angle, pi / 6) || near(angle, 7 * pi / 6)) return '√3';
      if (near(angle, pi / 4) || near(angle, 5 * pi / 4)) return '1';
      if (near(angle, pi / 3) || near(angle, 4 * pi / 3)) return '1/√3';
      if (near(angle, pi / 2)) return '0';
      break;
    default: return null;
  }
  return null;
}
function trigCompute() {
  const mode = document.getElementById('triMode').value;
  const op = document.getElementById('triOp').value;
  const raw = document.getElementById('triVal').value;
  const polarRaw = document.getElementById('triPolar').value;
  const outEl = document.getElementById('triOut');
  if (!raw && !polarRaw) { outEl.textContent = 'Enter a value'; return; }
  let x, polar = null;
  if (polarRaw) {
    polar = parsePolarInput(polarRaw);
    if (!polar) {
      outEl.textContent = 'Invalid polar input';
      return;
    }
    const thetaRad = (mode === 'deg') ? polar.theta * Math.PI / 180 : polar.theta;
    const xRect = polar.r * Math.cos(thetaRad);
    const yRect = polar.r * Math.sin(thetaRad);
    let trigValue;
    switch (op) {
      case 'sin': trigValue = Math.sin(thetaRad); break;
      case 'cos': trigValue = Math.cos(thetaRad); break;
      case 'tan': trigValue = Math.tan(thetaRad); break;
      case 'csc': trigValue = 1 / Math.sin(thetaRad); break;
      case 'sec': trigValue = 1 / Math.cos(thetaRad); break;
      case 'cot': trigValue = 1 / Math.tan(thetaRad); break;
      default: trigValue = NaN;
    }

    outEl.textContent = `Result: ${fmt(trigValue)} | Rectangular: (${fmt(xRect)}, ${fmt(yRect)})`;
    return;
  }

  else if (mode === 'rad') {
    x = parseRadianInput(raw);
  } else {
    x = Number(raw);
  }
  if (isNaN(x)) { outEl.textContent = 'Invalid input'; return; }

  const toRad = v => mode === 'deg' ? v * Math.PI / 180 : v;
  const fromRad = v => mode === 'deg' ? v * 180 / Math.PI : v;
  const angle = toRad(x);

  let res;
  try {
    if (polar) {
      res = evalTrig(op, polar.theta, mode);
    } else {
      res = evalTrig(op, angle, mode);
    }
    switch (op) {
      case 'sin': res = Math.sin(angle); break;
      case 'cos': res = Math.cos(angle); break;
      case 'tan': res = Math.tan(angle); break;
      case 'csc': res = 1 / Math.sin(angle); break;
      case 'sec': res = 1 / Math.cos(angle); break;
      case 'cot': res = 1 / Math.tan(angle); break;
      case 'asin': res = fromRad(Math.asin(x)); break;
      case 'acos': res = fromRad(Math.acos(x)); break;
      case 'atan': res = fromRad(Math.atan(x)); break;
      case 'asec': res = fromRad(Math.acos(1 / x)); break;
      case 'acsc': res = fromRad(Math.asin(1 / x)); break;
      case 'acot': res = fromRad(Math.atan(1 / x)); break;
      case 'sinh': res = Math.sinh(x); break;
      case 'cosh': res = Math.cosh(x); break;
      case 'tanh': res = Math.tanh(x); break;
      case 'csch': res = 1 / Math.sinh(x); break;
      case 'sech': res = 1 / Math.cosh(x); break;
      case 'coth': res = 1 / Math.tanh(x); break;
      default: res = NaN;
    }
    let output = `Result: ${fmt(res)}`;
    const nice = getNiceAngle(op, angle);
    if (nice) output += ` or ${nice}`;

    if (polar) {
      let xr = polar.r * Math.cos(polar.theta);
      let yr = polar.r * Math.sin(polar.theta);
      output += ` | Rectangular: (${fmt(xr)}, ${fmt(yr)})`;
    }

    outEl.textContent = output;
  } catch (e) { outEl.textContent = 'Error: ' + e.message; }
}


// -------- QUADRATIC EQUATION ---------
function quadeClear() {
  ['quadA', 'quadB', 'quadC', 'quadX1', 'quadX2', 'quadH', 'quadK', 'quadPx', 'quadPy'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('quadOut').textContent = '';
}
function quadeSolve() {
  let a = toNum(document.getElementById('quadA').value);
  let b = toNum(document.getElementById('quadB').value);
  let c = toNum(document.getElementById('quadC').value);
  let x1 = toNum(document.getElementById('quadX1').value);
  let x2 = toNum(document.getElementById('quadX2').value);
  let h = toNum(document.getElementById('quadH').value);
  let k = toNum(document.getElementById('quadK').value);
  let px = toNum(document.getElementById('quadPx').value);
  let py = toNum(document.getElementById('quadPy').value);
  const known = x => x !== null && x !== undefined && !isNaN(x);

  let changed = true, iter = 0;
  while (changed && iter < 40) {
    changed = false; iter++;
    if (known(a) && known(b) && known(c) && !known(x1) && !known(x2)) {
      let discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) { x1 = (-b + Math.sqrt(discriminant)) / (2 * a); x2 = (-b - Math.sqrt(discriminant)) / (2 * a); changed = true; }
    }
    if (known(a) && known(x1) && known(x2)) {
      if (!known(b)) { b = -a * (x1 + x2); changed = true; }
      if (!known(c)) { c = a * (x1 * x2); changed = true; }
    }
    if (known(a) && known(x1)) {
      if (!known(b) && known(c)) { b = -(a * x1 * x1 + c) / x1; changed = true; }
      if (!known(c) && known(b)) { c = -(a * x1 * x1 + b * x1); changed = true; }
    }
    if (!known(a) && known(b) && known(c) && known(x1)) { a = -(b * x1 + c) / (x1 * x1); changed = true; }
    if (known(a) && known(b) && !known(h)) { h = -b / (2 * a); changed = true; }
    if (known(a) && known(h) && !known(k) && known(c)) { k = a * h * h + b * h + c; changed = true; }
    if (known(a) && known(h) && !known(b)) { b = -2 * a * h; changed = true; }
    if (known(a) && known(b) && known(h) && known(k) && !known(c)) { c = k - (a * h * h + b * h); changed = true; }
    if (known(a) && known(b) && known(px) && known(py) && !known(c)) { c = py - (a * px * px + b * px); changed = true; }
    if (known(a) && known(c) && known(px) && known(py) && !known(b)) { b = (py - c - a * px * px) / px; changed = true; }
    if (known(b) && known(c) && known(px) && known(py) && !known(a)) { a = (py - b * px - c) / (px * px); changed = true; }
  }

  const out = `Iterations: ${iter}\n` +
    `a = ${fmt(a)}\n` +
    `b = ${fmt(b)}\n` +
    `c = ${fmt(c)}\n` +
    `x1 = ${fmt(x1)}\n` +
    `x2 = ${fmt(x2)}\n` +
    `h = ${fmt(h)}\n` +
    `k = ${fmt(k)}\n` +
    `x = ${fmt(px)}\n` +
    `y = ${fmt(py)}`;

  document.getElementById('quadOut').textContent = out;
}

// --------- 2D Shapes -----------
function showShape2DInputs() {
  const shape = document.getElementById('shape2D').value;
  document.querySelectorAll('.shapes-2d').forEach(el => {
    el.classList.add('shapes-2d-hidden');
    el.classList.remove('shapes-2d-visible');
  });

  switch (shape) {
    case 'circle':
    case 'semicircle':
      document.getElementById('shapes2DCircleGrid').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DCircleGrid').classList.add('shapes-2d-visible');
      break;
    case 'triangle':
      document.getElementById('shapes2DTriangleGrid').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DTriangleGrid').classList.add('shapes-2d-visible');
      break;
    case 'square':
      document.getElementById('shapes2DSquareGrid').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DSquareGrid').classList.add('shapes-2d-visible');
      break;
    case 'rectangle':
      document.getElementById('shapes2DRectangleGrid').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DRectangleGrid').classList.add('shapes-2d-visible');
      break;
    case 'parallelogram':
      document.getElementById('shapes2DParallelogramGrid').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DParallelogramGrid').classList.add('shapes-2d-visible');
      break;
    case 'trapezoid':
      document.getElementById('shapes2DTrapezoidGrid').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DTrapezoidGrid').classList.add('shapes-2d-visible');
      break;
    case 'kite':
      document.getElementById('shapes2DInputsKites').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DInputsKites').classList.add('shapes-2d-visible');
      break;
    case 'ellipse':
      document.getElementById('shapes2DEllipseGrid').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DEllipseGrid').classList.add('shapes-2d-visible');
      break;
    case 'regularPolygon':
      document.getElementById('shapes2DRegularPolygonGrid').classList.remove('shapes-2d-hidden');
      document.getElementById('shapes2DRegularPolygonGrid').classList.add('shapes-2d-visible');
      break;
  }
}
function solveShape2D(shape, inputs) {
  let changed = true, iter = 0;
  const known = (x) => x !== null && x !== undefined && !isNaN(x);

  while (changed && iter < 60) {
    changed = false; iter++;

    switch (shape) {
      // ==================== CIRCLE ====================
      case "circle":
        if (!known(inputs.d) && known(inputs.r)) { inputs.d = 2 * inputs.r; changed = true; }
        if (!known(inputs.r) && known(inputs.d)) { inputs.r = inputs.d / 2; changed = true; }
        if (!known(inputs.c) && known(inputs.r)) { inputs.c = 2 * Math.PI * inputs.r; changed = true; }
        if (!known(inputs.r) && known(inputs.c)) { inputs.r = inputs.c / (2 * Math.PI); changed = true; }
        if (!known(inputs.a) && known(inputs.r)) { inputs.a = Math.PI * inputs.r ** 2; changed = true; }
        if (!known(inputs.r) && known(inputs.a)) { inputs.r = Math.sqrt(inputs.a / Math.PI); changed = true; }
        if (!known(inputs.arcLength) && known(inputs.centralAngle) && known(inputs.r)) { inputs.arcLength = (inputs.centralAngle / 360) * 2 * Math.PI * inputs.r; changed = true; }
        if (!known(inputs.centralAngle) && known(inputs.arcLength) && known(inputs.r) && inputs.r !== 0) { inputs.centralAngle = (inputs.arcLength / (2 * Math.PI * inputs.r)) * 360; changed = true; }
        if (!known(inputs.sectorArea) && known(inputs.centralAngle) && known(inputs.r)) { inputs.sectorArea = (inputs.centralAngle / 360) * Math.PI * inputs.r ** 2; changed = true; }
        if (!known(inputs.centralAngle) && known(inputs.sectorArea) && known(inputs.r) && inputs.r !== 0) { inputs.centralAngle = (inputs.sectorArea / (Math.PI * inputs.r ** 2)) * 360; changed = true; }
        break;

      // ==================== TRIANGLE ====================
      case "triangle":
        if (!known(inputs.angleA) && known(inputs.s1) && known(inputs.s2) && known(inputs.angleB) && (inputs.tp === 'acute' || inputs.tp === 'right')) { inputs.angleA = Math.asin(inputs.s1 * Math.sin(inputs.angleB * Math.PI / 180) / inputs.s2) * 180 / Math.PI; changed = true; }
        if (!known(inputs.angleA) && known(inputs.s1) && known(inputs.s3) && known(inputs.angleC) && (inputs.tp === 'acute' || inputs.tp === 'right')) { inputs.angleA = Math.asin(inputs.s1 * Math.sin(inputs.angleC * Math.PI / 180) / inputs.s3) * 180 / Math.PI; changed = true; }
        if (!known(inputs.angleB) && known(inputs.s2) && known(inputs.s1) && known(inputs.angleA) && (inputs.tp === 'acute' || inputs.tp === 'right')) { inputs.angleB = Math.asin(inputs.s2 * Math.sin(inputs.angleA * Math.PI / 180) / inputs.s1) * 180 / Math.PI; changed = true; }
        if (!known(inputs.angleB) && known(inputs.s2) && known(inputs.s3) && known(inputs.angleC) && (inputs.tp === 'acute' || inputs.tp === 'right')) { inputs.angleB = Math.asin(inputs.s2 * Math.sin(inputs.angleC * Math.PI / 180) / inputs.s3) * 180 / Math.PI; changed = true; }
        if (!known(inputs.angleC) && known(inputs.s3) && known(inputs.s1) && known(inputs.angleA) && (inputs.tp === 'acute' || inputs.tp === 'right')) { inputs.angleC = Math.asin(inputs.s3 * Math.sin(inputs.angleA * Math.PI / 180) / inputs.s1) * 180 / Math.PI; changed = true; }
        if (!known(inputs.angleC) && known(inputs.s3) && known(inputs.s2) && known(inputs.angleB) && (inputs.tp === 'acute' || inputs.tp === 'right')) { inputs.angleC = Math.asin(inputs.s3 * Math.sin(inputs.angleB * Math.PI / 180) / inputs.s2) * 180 / Math.PI; changed = true; }
        if (!known(inputs.angleA) && known(inputs.angleB) && known(inputs.angleC)) { inputs.angleA = 180 - (inputs.angleB + inputs.angleC); changed = true; }
        if (!known(inputs.angleB) && known(inputs.angleA) && known(inputs.angleC)) { inputs.angleB = 180 - (inputs.angleA + inputs.angleC); changed = true; }
        if (!known(inputs.angleC) && known(inputs.angleA) && known(inputs.angleB)) { inputs.angleC = 180 - (inputs.angleA + inputs.angleB); changed = true; }
        if (!known(inputs.sp) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3)) { inputs.sp = (inputs.s1 + inputs.s2 + inputs.s3) / 2; changed = true; }
        if (!known(inputs.tp) && known(inputs.angleA) && known(inputs.angleB) && known(inputs.angleC) && (inputs.angleA < 90 && inputs.angleB < 90 && inputs.angleC < 90)) { inputs.tp = 'acute'; changed = true; }
        if (!known(inputs.tp) && ((known(inputs.angleA) && inputs.angleA === 90) || (known(inputs.angleB) && inputs.angleB === 90) || (known(inputs.angleC) && inputs.angleC === 90))) { inputs.tp = 'right'; changed = true; }
        if (!known(inputs.tp) && ((known(inputs.angleA) && inputs.angleA > 90) || (known(inputs.angleB) && inputs.angleB > 90) || (known(inputs.angleC) && inputs.angleC > 90))) { inputs.tp = 'obtuse'; changed = true; }
        if (!known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && (inputs.tp === 'right')) { inputs.s1 = Math.sqrt(inputs.s3 ** 2 - inputs.s2 ** 2); changed = true; }
        if (!known(inputs.s2) && known(inputs.s1) && known(inputs.s3) && (inputs.tp === 'right')) { inputs.s2 = Math.sqrt(inputs.s3 ** 2 - inputs.s1 ** 2); changed = true; }
        if (!known(inputs.s3) && known(inputs.s1) && known(inputs.s2) && (inputs.tp === 'right')) { inputs.s3 = Math.sqrt(inputs.s1 ** 2 + inputs.s2 ** 2); changed = true; }
        if (!known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && (inputs.angleC === 90)) { inputs.s1 = Math.sqrt(inputs.s3 ** 2 - inputs.s2 ** 2); changed = true; }
        if (!known(inputs.s2) && known(inputs.s1) && known(inputs.s3) && (inputs.angleC === 90)) { inputs.s2 = Math.sqrt(inputs.s3 ** 2 - inputs.s1 ** 2); changed = true; }
        if (!known(inputs.s3) && known(inputs.s1) && known(inputs.s2) && (inputs.angleC === 90)) { inputs.s3 = Math.sqrt(inputs.s1 ** 2 + inputs.s2 ** 2); changed = true; }
        if (!known(inputs.angleA) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && known(inputs.tp) && (inputs.s1 > inputs.s2) && (inputs.s1 > inputs.s3) && inputs.tp === 'right') { inputs.angleA = 90; changed = true; }
        if (!known(inputs.angleB) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && known(inputs.tp) && (inputs.s2 > inputs.s1) && (inputs.s1 > inputs.s3) && inputs.tp === 'right') { inputs.angleB = 90; changed = true; }
        if (!known(inputs.angleC) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && known(inputs.tp) && (inputs.s3 > inputs.s1) && (inputs.s3 > inputs.s2) && inputs.tp === 'right') { inputs.angleC = 90; changed = true; }
        if (!known(inputs.tT) && known(inputs.s1) && (inputs.s2) && (inputs.s3) && (inputs.s1 + inputs.s2 <= inputs.s3 || inputs.s1 + inputs.s3 <= inputs.s2 || inputs.s2 + inputs.s3 <= inputs.s1)) { inputs.tT = "Invalid"; }
        if (!known(inputs.tT) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && inputs.s1 === inputs.s2 && inputs.s2 === inputs.s3) { inputs.tT = 'equilateral'; changed = true; }
        if (!known(inputs.tT) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && ((inputs.s1 === inputs.s2 && inputs.s1 !== inputs.s3) || (inputs.s2 === inputs.s3 && inputs.s2 !== inputs.s1) || (inputs.s1 === inputs.s3 && inputs.s1 !== inputs.s2))) { inputs.tT = 'isosceles'; changed = true; }
        if (!known(inputs.tT) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && (inputs.s1 !== inputs.s2 && inputs.s2 !== inputs.s3 && inputs.s1 !== inputs.s3)) { inputs.tT = 'scalene'; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s1) && !known(inputs.s2)) { inputs.s2 = inputs.s1; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s1) && !known(inputs.s3)) { inputs.s3 = inputs.s1; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s2) && !known(inputs.s1)) { inputs.s1 = inputs.s2; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s2) && !known(inputs.s3)) { inputs.s3 = inputs.s2; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s3) && !known(inputs.s1)) { inputs.s1 = inputs.s3; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s3) && !known(inputs.s2)) { inputs.s2 = inputs.s3; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'isosceles' && known(inputs.s1) && known(inputs.s2) && inputs.s1 === inputs.s2 && !known(inputs.s3)) { }
        if (known(inputs.tT) && inputs.tT === 'isosceles' && known(inputs.s1) && known(inputs.s3) && inputs.s1 === inputs.s3 && !known(inputs.s2)) { }
        if (known(inputs.tT) && inputs.tT === 'isosceles' && known(inputs.s2) && known(inputs.s3) && inputs.s2 === inputs.s3 && !known(inputs.s1)) { }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && !known(inputs.angleA)) { inputs.angleA = 60; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && !known(inputs.angleB)) { inputs.angleB = 60; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && !known(inputs.angleC)) { inputs.angleC = 60; changed = true; }
        if (!known(inputs.p) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3)) { inputs.p = inputs.s1 + inputs.s2 + inputs.s3; changed = true; }
        if (!known(inputs.a) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3)) { let s = (inputs.s1 + inputs.s2 + inputs.s3) / 2; inputs.a = Math.sqrt(s * (s - inputs.s1) * (s - inputs.s2) * (s - inputs.s3)); changed = true; }
        if (!known(inputs.b) && known(inputs.s1)) { inputs.b = inputs.s1; changed = true; }
        if (!known(inputs.s1) && known(inputs.b)) { inputs.s1 = inputs.b; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s1) && !known(inputs.h1)) { inputs.h1 = (Math.sqrt(3) / 2) * inputs.s1; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s1) && !known(inputs.a)) { inputs.a = (Math.sqrt(3) / 4) * inputs.s1 ** 2; changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s1) && !known(inputs.inR)) { inputs.inR = inputs.s1 / (2 * Math.sqrt(3)); changed = true; }
        if (known(inputs.tT) && inputs.tT === 'equilateral' && known(inputs.s1) && !known(inputs.circumR)) { inputs.circumR = inputs.s1 / Math.sqrt(3); changed = true; }
        if (!known(inputs.h1) && known(inputs.a) && known(inputs.s1)) { inputs.h1 = 2 * inputs.a / inputs.s1; changed = true; }
        if (!known(inputs.h2) && known(inputs.a) && known(inputs.s2)) { inputs.h2 = 2 * inputs.a / inputs.s2; changed = true; }
        if (!known(inputs.h3) && known(inputs.a) && known(inputs.s3)) { inputs.h3 = 2 * inputs.a / inputs.s3; changed = true; }
        if (!known(inputs.a) && known(inputs.h1) && known(inputs.s1)) { inputs.a = 0.5 * inputs.h1 * inputs.s1; changed = true; }
        if (!known(inputs.a) && known(inputs.h2) && known(inputs.s2)) { inputs.a = 0.5 * inputs.h2 * inputs.s2; changed = true; }
        if (!known(inputs.a) && known(inputs.h3) && known(inputs.s3)) { inputs.a = 0.5 * inputs.h3 * inputs.s3; changed = true; }
        if (!known(inputs.s1) && known(inputs.a) && known(inputs.h1)) { inputs.s1 = 2 * inputs.a / inputs.h1; changed = true; }
        if (!known(inputs.s2) && known(inputs.a) && known(inputs.h2)) { inputs.s2 = 2 * inputs.a / inputs.h2; changed = true; }
        if (!known(inputs.s3) && known(inputs.a) && known(inputs.h3)) { inputs.s3 = 2 * inputs.a / inputs.h3; changed = true; }
        if (!known(inputs.a) && known(inputs.s1) && known(inputs.s2) && known(inputs.angleC)) { inputs.a = 0.5 * inputs.s1 * inputs.s2 * Math.sin(inputs.angleC * Math.PI / 180); changed = true; }
        if (!known(inputs.a) && known(inputs.s2) && known(inputs.s3) && known(inputs.angleA)) { inputs.a = 0.5 * inputs.s2 * inputs.s3 * Math.sin(inputs.angleA * Math.PI / 180); changed = true; }
        if (!known(inputs.a) && known(inputs.s3) && known(inputs.s1) && known(inputs.angleB)) { inputs.a = 0.5 * inputs.s3 * inputs.s1 * Math.sin(inputs.angleB * Math.PI / 180); changed = true; }
        if (!known(inputs.m1) && known(inputs.s2) && known(inputs.s3)) { inputs.m1 = 0.5 * Math.sqrt(2 * inputs.s2 ** 2 + 2 * inputs.s3 ** 2 - inputs.s1 ** 2); changed = true; }
        if (!known(inputs.m2) && known(inputs.s1) && known(inputs.s3)) { inputs.m2 = 0.5 * Math.sqrt(2 * inputs.s1 ** 2 + 2 * inputs.s3 ** 2 - inputs.s2 ** 2); changed = true; }
        if (!known(inputs.m3) && known(inputs.s1) && known(inputs.s2)) { inputs.m3 = 0.5 * Math.sqrt(2 * inputs.s1 ** 2 + 2 * inputs.s2 ** 2 - inputs.s3 ** 2); changed = true; }
        if (!known(inputs.mid1) && known(inputs.s1)) { inputs.mid1 = inputs.s1 / 2; changed = true; }
        if (!known(inputs.mid2) && known(inputs.s2)) { inputs.mid2 = inputs.s2 / 2; changed = true; }
        if (!known(inputs.mid3) && known(inputs.s3)) { inputs.mid3 = inputs.s3 / 2; changed = true; }
        if (!known(inputs.s1) && known(inputs.mid1)) { inputs.s1 = 2 * inputs.mid1; changed = true; }
        if (!known(inputs.s2) && known(inputs.mid2)) { inputs.s2 = 2 * inputs.mid2; changed = true; }
        if (!known(inputs.s3) && known(inputs.mid3)) { inputs.s3 = 2 * inputs.mid3; changed = true; }
        if (!known(inputs.s1) && known(inputs.m1) && known(inputs.s2) && known(inputs.s3)) { inputs.s1 = Math.sqrt(2 * inputs.s2 ** 2 + 2 * inputs.s3 ** 2 - 4 * inputs.m1 ** 2); changed = true; }
        if (!known(inputs.s2) && known(inputs.m2) && known(inputs.s1) && known(inputs.s3)) { inputs.s2 = Math.sqrt(2 * inputs.s1 ** 2 + 2 * inputs.s3 ** 2 - 4 * inputs.m2 ** 2); changed = true; }
        if (!known(inputs.s3) && known(inputs.m3) && known(inputs.s1) && known(inputs.s2)) { inputs.s3 = Math.sqrt(2 * inputs.s1 ** 2 + 2 * inputs.s2 ** 2 - 4 * inputs.m3 ** 2); changed = true; }
        if (!known(inputs.s1) && !known(inputs.s2) && !known(inputs.s3) && known(inputs.m1) && known(inputs.m2) && known(inputs.m3)) { inputs.s1 = (2 / 3) * Math.sqrt(2 * (inputs.m2 ** 2 + inputs.m3 ** 2) - inputs.m1 ** 2); changed = true; }
        if (!known(inputs.s1) && !known(inputs.s2) && !known(inputs.s3) && known(inputs.m1) && known(inputs.m2) && known(inputs.m3)) { inputs.s2 = (2 / 3) * Math.sqrt(2 * (inputs.m1 ** 2 + inputs.m3 ** 2) - inputs.m2 ** 2); changed = true; }
        if (!known(inputs.s1) && !known(inputs.s2) && !known(inputs.s3) && known(inputs.m1) && known(inputs.m2) && known(inputs.m3)) { inputs.s3 = (2 / 3) * Math.sqrt(2 * (inputs.m1 ** 2 + inputs.m2 ** 2) - inputs.m3 ** 2); changed = true; }
        if (!known(inputs.s3) && known(inputs.s1) && known(inputs.s2) && known(inputs.angleC)) { inputs.s3 = Math.sqrt(inputs.s1 ** 2 + inputs.s2 ** 2 - 2 * inputs.s1 * inputs.s2 * Math.cos(inputs.angleC * Math.PI / 180)); changed = true; }
        if (!known(inputs.s2) && known(inputs.s1) && known(inputs.s3) && known(inputs.angleB)) { inputs.s2 = Math.sqrt(inputs.s1 ** 2 + inputs.s3 ** 2 - 2 * inputs.s1 * inputs.s3 * Math.cos(inputs.angleB * Math.PI / 180)); changed = true; }
        if (!known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && known(inputs.angleA)) { inputs.s1 = Math.sqrt(inputs.s2 ** 2 + inputs.s3 ** 2 - 2 * inputs.s2 * inputs.s3 * Math.cos(inputs.angleA * Math.PI / 180)); changed = true; }
        if (!known(inputs.angleA) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3)) { inputs.angleA = Math.acos((inputs.s1 ** 2 - inputs.s2 ** 2 - inputs.s3 ** 2) / (-2 * inputs.s2 * inputs.s3)) * 180 / Math.PI; changed = true; }
        if (!known(inputs.angleB) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3)) { inputs.angleB = Math.acos((inputs.s2 ** 2 - inputs.s1 ** 2 - inputs.s3 ** 2) / (-2 * inputs.s1 * inputs.s3)) * 180 / Math.PI; changed = true; }
        if (!known(inputs.angleC) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3)) { inputs.angleC = Math.acos((inputs.s3 ** 2 - inputs.s1 ** 2 - inputs.s2 ** 2) / (-2 * inputs.s1 * inputs.s2)) * 180 / Math.PI; changed = true; }
        if (!known(inputs.s1) && known(inputs.s2) && known(inputs.angleA) && known(inputs.angleB)) { inputs.s1 = inputs.s2 * Math.sin(inputs.angleA * Math.PI / 180) / Math.sin(inputs.angleB * Math.PI / 180); changed = true; }
        if (!known(inputs.s2) && known(inputs.s1) && known(inputs.angleA) && known(inputs.angleB)) { inputs.s2 = inputs.s1 * Math.sin(inputs.angleB * Math.PI / 180) / Math.sin(inputs.angleA * Math.PI / 180); changed = true; }
        if (!known(inputs.s3) && known(inputs.s1) && known(inputs.angleA) && known(inputs.angleC)) { inputs.s3 = inputs.s1 * Math.sin(inputs.angleC * Math.PI / 180) / Math.sin(inputs.angleA * Math.PI / 180); changed = true; }
        if (!known(inputs.inR) && known(inputs.a) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3)) { let s = (inputs.s1 + inputs.s2 + inputs.s3) / 2; inputs.inR = inputs.a / s; changed = true; }
        if (!known(inputs.circumR) && known(inputs.s1) && known(inputs.s2) && known(inputs.s3) && known(inputs.a)) { inputs.circumR = (inputs.s1 * inputs.s2 * inputs.s3) / (4 * inputs.a); changed = true; }
        if (!known(inputs.exR1) && known(inputs.a) && known(inputs.p) && known(inputs.s1)) { let s = inputs.p / 2; inputs.exR1 = inputs.a / (s - inputs.s1); changed = true; }
        if (!known(inputs.exR2) && known(inputs.a) && known(inputs.p) && known(inputs.s2)) { let s = inputs.p / 2; inputs.exR2 = inputs.a / (s - inputs.s2); changed = true; }
        if (!known(inputs.exR3) && known(inputs.a) && known(inputs.p) && known(inputs.s3)) { let s = inputs.p / 2; inputs.exR3 = inputs.a / (s - inputs.s3); changed = true; }
        break;

      // ==================== SQUARE ====================
      case "square":
        if (!known(inputs.p) && known(inputs.s)) { inputs.p = 4 * inputs.s; changed = true; }
        if (!known(inputs.s) && known(inputs.p)) { inputs.s = inputs.p / 4; changed = true; }
        if (!known(inputs.d) && known(inputs.s)) { inputs.d = Math.sqrt(2) * inputs.s; changed = true; }
        if (!known(inputs.s) && known(inputs.d)) { inputs.s = inputs.d / Math.sqrt(2); changed = true; }
        if (!known(inputs.a) && known(inputs.s)) { inputs.a = inputs.s ** 2; changed = true; }
        if (!known(inputs.s) && known(inputs.a)) { inputs.s = Math.sqrt(inputs.a); changed = true; }
        if (!known(inputs.inR) && known(inputs.s)) { inputs.inR = inputs.s / 2; changed = true; }
        if (!known(inputs.circumR) && known(inputs.s)) { inputs.circumR = (Math.sqrt(2) * inputs.s) / 2; changed = true; }
        if (!known(inputs.ml) && known(inputs.s)) { inputs.ml = (Math.sqrt(2) * inputs.s) / 2; changed = true; }
        if (!known(inputs.h) && known(inputs.h)) { inputs.h = inputs.s; changed = true; }
        if (!known(inputs.m) && known(inputs.h)) { inputs.m = inputs.s; changed = true; }
        break;

      // ==================== RECTANGLE ====================
      case "rectangle":
        if (!known(inputs.a) && known(inputs.l) && known(inputs.w)) { inputs.p = 2 * (inputs.l + inputs.w); changed = true; }
        if (!known(inputs.l) && known(inputs.p) && known(inputs.w)) { inputs.l = inputs.p / 2 - inputs.w; changed = true; }
        if (!known(inputs.w) && known(inputs.p) && known(inputs.l)) { inputs.w = inputs.p / 2 - inputs.l; changed = true; }
        if (!known(inputs.d) && known(inputs.l) && known(inputs.w)) { inputs.d = Math.sqrt(inputs.l ** 2 + inputs.w ** 2); changed = true; }
        if (!known(inputs.a) && known(inputs.l) && known(inputs.w)) { inputs.p = inputs.l * inputs.w; changed = true; }
        if (!known(inputs.l) && known(inputs.a) && known(inputs.w) && inputs.w !== 0) { inputs.l = inputs.a / inputs.w; changed = true; }
        if (!known(inputs.w) && known(inputs.a) && known(inputs.l) && inputs.l !== 0) { inputs.w = inputs.a / inputs.l; changed = true; }
        if (!known(inputs.midL) && known(inputs.l)) { inputs.midL = inputs.l / 2; changed = true; }
        if (!known(inputs.midW) && known(inputs.w)) { inputs.midW = inputs.w / 2; changed = true; }
        if (!known(inputs.l) && known(inputs.midL)) { inputs.l = 2 * inputs.midL; changed = true; }
        if (!known(inputs.w) && known(inputs.midW)) { inputs.w = 2 * inputs.midW; changed = true; }
        if (!known(inputs.inR) && known(inputs.l) && known(inputs.w)) { inputs.inR = Math.min(inputs.l, inputs.w) / 2; changed = true; }
        if (!known(inputs.circumR) && known(inputs.d)) { inputs.circumR = inputs.d / 2; changed = true; }
        if (!known(inputs.m1) && known(inputs.l) && known(inputs.w)) { inputs.m1 = 0.5 * Math.sqrt(2 * inputs.l ** 2 + 2 * inputs.w ** 2); changed = true; }
        if (!known(inputs.m2) && known(inputs.l) && known(inputs.w)) { inputs.m2 = inputs.m1; changed = true; }
        break;

      // ==================== PARALLELOGRAM ====================
      case "parallelogram":
        if (!known(inputs.a) && known(inputs.b) && known(inputs.h)) { inputs.a = inputs.b * inputs.h; changed = true; }
        if (!known(inputs.h) && known(inputs.a) && known(inputs.b) && inputs.b !== 0) { inputs.h = inputs.a / inputs.b; changed = true; }
        if (!known(inputs.p) && known(inputs.b) && known(inputs.s)) { inputs.p = 2 * (inputs.b + inputs.s); changed = true; }
        if (!known(inputs.angleB) && known(inputs.angleA)) { inputs.angleB = 180 - inputs.angleA; changed = true; }
        if (!known(inputs.angleA) && known(inputs.angleB)) { inputs.angleA = 180 - inputs.angleB; changed = true; }
        if (!known(inputs.midB) && known(inputs.b)) { inputs.midB = inputs.b / 2; changed = true; }
        if (!known(inputs.midS) && known(inputs.s)) { inputs.midS = inputs.s / 2; changed = true; }
        if (!known(inputs.inR) && known(inputs.a) && known(inputs.p)) { inputs.inR = inputs.a / (0.5 * inputs.P); changed = true; }
        if (!known(inputs.circumR) && known(inputs.b) && known(inputs.s) && known(inputs.angleA)) { inputs.circumR = Math.sqrt(inputs.b ** 2 + inputs.s ** 2 - 2 * inputs.b * inputs.s * Math.cos(inputs.angleA * Math.PI / 180)) / 2; changed = true; }
        if (!known(inputs.m1) && known(inputs.b) && known(inputs.s)) { inputs.m1 = 0.5 * Math.sqrt(2 * inputs.b ** 2 + 2 * inputs.s ** 2 - 4 * inputs.b * inputs.s * Math.cos(inputs.angleA * Math.PI / 180)); changed = true; }
        if (!known(inputs.m2) && known(inputs.b) && known(inputs.s)) { inputs.m2 = inputs.m1; changed = true; }
        break;

      // ==================== TRAPEZOID ====================
      case "trapezoid":
        if (!known(inputs.a) && known(inputs.b1) && known(inputs.b2) && known(inputs.h)) { inputs.a = 0.5 * (inputs.b1 + inputs.b2) * inputs.h; changed = true; }
        if (!known(inputs.h) && known(inputs.a) && known(inputs.b1) && known(inputs.b2) && (inputs.b1 + inputs.b2) !== 0) { inputs.h = (2 * inputs.a) / (inputs.b1 + inputs.b2); changed = true; }
        if (!known(inputs.mid) && known(inputs.b1) && known(inputs.b2)) { inputs.mid = 0.5 * (inputs.b1 + inputs.b2); changed = true; }
        if (!known(inputs.p) && known(inputs.b1) && known(inputs.b2) && known(inputs.s1) && known(inputs.s2)) { inputs.p = inputs.b1 + inputs.b2 + inputs.s1 + inputs.s2; changed = true; }
        if (!known(inputs.b1) && known(inputs.mid) && known(inputs.b2)) { inputs.b1 = 2 * inputs.mid - inputs.b2; changed = true; }
        if (!known(inputs.b2) && known(inputs.mid) && known(inputs.b1)) { inputs.b2 = 2 * inputs.mid - inputs.b1; changed = true; }
        if (!known(inputs.inR) && known(inputs.a) && known(inputs.p)) { inputs.inR = 2 * inputs.a / inputs.a; changed = true; }
        if (!known(inputs.circumR) && known(inputs.b1) && known(inputs.b2) && known(inputs.s1) && known(inputs.s2)) { inputs.circumR = (inputs.b1 * inputs.b2 + inputs.s1 * inputs.s2) / (4 * inputs.A); changed = true; }
        if (!known(inputs.m1) && known(inputs.b1) && known(inputs.b2) && known(inputs.s1) && known(inputs.s2)) { inputs.m1 = 0.5 * Math.sqrt(inputs.b1 ** 2 + inputs.s1 ** 2); changed = true; }
        if (!known(inputs.m2) && known(inputs.b1) && known(inputs.b2) && known(inputs.s1) && known(inputs.s2)) { inputs.m2 = 0.5 * Math.sqrt(inputs.b2 ** 2 + inputs.s2 ** 2); changed = true; }
        break;

      // ==================== RHOMBUS ====================
      case "rhombus":
        if (!known(inputs.p) && known(inputs.s)) { inputs.p = 4 * inputs.s; changed = true; }
        if (!known(inputs.a) && known(inputs.d1) && known(inputs.d2)) { inputs.a = 0.5 * inputs.d1 * inputs.d2; changed = true; }
        if (!known(inputs.s) && known(inputs.p)) { inputs.s = inputs.p / 4; changed = true; }
        if (!known(inputs.d1) && known(inputs.a) && known(inputs.d2)) { inputs.d1 = (2 * inputs.a) / inputs.d2; changed = true; }
        if (!known(inputs.d2) && known(inputs.a) && known(inputs.d1)) { inputs.d2 = (2 * inputs.a) / inputs.d1; changed = true; }
        if (!known(inputs.h) && known(inputs.a) && known(inputs.s)) { inputs.h = inputs.a / inputs.s; changed = true; }
        if (!known(inputs.midD1) && known(inputs.d1)) { inputs.midD1 = inputs.d1 / 2; changed = true; }
        if (!known(inputs.midD2) && known(inputs.d2)) { inputs.midD2 = inputs.d2 / 2; changed = true; }
        if (!known(inputs.m1) && known(inputs.s)) { inputs.m1 = inputs.s; changed = true; }
        if (!known(inputs.m2) && known(inputs.s)) { inputs.m2 = inputs.s; changed = true; }
        break;

      // ==================== KITE ====================
      case "kite":
        if (!known(inputs.p) && known(inputs.s1) && known(inputs.s2)) { inputs.p = 2 * (inputs.s1 + inputs.s2); changed = true; }
        if (!known(inputs.a) && known(inputs.d1) && known(inputs.d2)) { inputs.a = 0.5 * inputs.d1 * inputs.d2; changed = true; }
        if (!known(inputs.midD1) && known(inputs.d1)) { inputs.midD1 = inputs.d1 / 2; changed = true; }
        if (!known(inputs.midD2) && known(inputs.d2)) { inputs.midD2 = inputs.d2 / 2; changed = true; }
        if (!known(inputs.d1) && known(inputs.midD1)) { inputs.d1 = 2 * inputs.midD1; changed = true; }
        if (!known(inputs.d2) && known(inputs.midD2)) { inputs.d2 = 2 * inputs.midD2; changed = true; }
        if (!known(inputs.inR) && known(inputs.a) && known(inputs.p)) { inputs.inR = inputs.a / (0.5 * inputs.p); changed = true; }
        if (!known(inputs.circumR) && known(inputs.d1) && known(inputs.d2)) { inputs.circumR = 0.5 * Math.sqrt(inputs.d1 ** 2 + inputs.d2 ** 2); changed = true; }
        if (!known(inputs.m1) && known(inputs.s1) && known(inputs.s2)) { inputs.m1 = 0.5 * Math.sqrt(2 * inputs.s1 ** 2 + 2 * inputs.s2 ** 2); changed = true; }
        if (!known(inputs.m2) && known(inputs.s1) && known(inputs.s2)) { inputs.m2 = inputs.m1; changed = true; }
        break;

      // ==================== ELLIPSE ====================
      case "ellipse":
        if (!known(inputs.a) && known(inputs.a) && known(inputs.b)) { inputs.a = Math.PI * inputs.a * inputs.b; changed = true; }
        if (!known(inputs.p) && known(inputs.a) && known(inputs.b)) { inputs.p = Math.PI * (3 * (inputs.a + inputs.b) - Math.sqrt((3 * inputs.a + inputs.b) * (inputs.a + 3 * inputs.b))); changed = true; }
        if (!known(inputs.c) && known(inputs.a) && known(inputs.b)) { inputs.c = Math.sqrt(inputs.a ** 2 - inputs.b ** 2); changed = true; }
        if (!known(inputs.b) && known(inputs.a) && known(inputs.c)) { inputs.b = Math.sqrt(inputs.a ** 2 - inputs.c ** 2); changed = true; }
        break;

      // ==================== REGULAR POLYGON ====================
      case "regularPolygon":
        if (!known(inputs.p) && known(inputs.n) && known(inputs.s)) { inputs.p = inputs.n * inputs.s; changed = true; }
        if (!known(inputs.a) && known(inputs.n) && known(inputs.s) && known(inputs.apothem)) { inputs.a = 0.5 * inputs.n * inputs.s * inputs.apothem; changed = true; }
        if (!known(inputs.apothem) && known(inputs.a) && known(inputs.p) && inputs.p !== 0) { inputs.apothem = (2 * inputs.a) / inputs.p; changed = true; }
        if (!known(inputs.inR) && known(inputs.a) && known(inputs.p) && inputs.p !== 0) { inputs.inR = (2 * inputs.a) / inputs.p; changed = true; }
        if (!known(inputs.circumR) && known(inputs.s) && known(inputs.n)) { inputs.circumR = inputs.s / (2 * Math.sin(Math.PI / inputs.n)); changed = true; }
        break;
    }
  }

  return inputs;
}
function shapes2DCompute() {
  const shape = document.getElementById("shape2D").value;
  let inputs = {};
  const nameMap = {
    r: "Radius",
    d: "Diameter",
    c: "Circumference",
    a: "Area",
    tp: "Triangle type based on angles",
    tT: "Triangle type based on sides",
    b: "Base",
    h1: "Height 1",
    h2: "Height 2",
    h3: "Height 3",
    m1: "Median 1",
    m2: "Median 2",
    m3: "Median 3",
    h: "Height",
    ml: "Midline",
    ml1: "Midline",
    ml2: "Midline",
    s1: "Side 1",
    s2: "Side 2",
    s3: "Side 3",
    p: "Perimeter",
    sp: "Semierimeter",
    l: "Length",
    w: "Width",
    d1: "Diagonal 1",
    d2: "Diagonal 2",
    n: "Number of Sides",
    s: "Side Length",
    apothem: "Apothem Length",
    sectorArea: "Sector Area",
    arcLength: "Arc Length",
    centralAngle: "Central Angle",
    semiperimeter: "Semiperimeter",
    inR: "Inradius",
    circumR: "Circumradius",
    exR1: "Exradius 1",
    exR2: "Exradius 2",
    exR3: "Exradius 3",
    angleA: "Angle A",
    angleB: "Angle B",
    angleC: "Angle C",
    midsegment: "Midsegment",
    base1: "Base 1",
    base2: "Base 2",
    focalDistance: "Focal Distance",
    semiMajor: "Semi-Major Axis",
    semiMinor: "Semi-Minor Axis",
    midL: "Longer midline",
    midW: "Shorter midline",
    midB: "Midline of base",
    midS: "Midline of side",
    midD1: "Midsegment of diagonal 1",
    midS: "Midsegment of diagonal 2",
    mid1: "Midsegment 1",
    mid2: "Midsegment 2",
    mid3: "Midsegment 3"
  };
  switch (shape) {
    case "circle":
      inputs = {
        r: parseFloat(shape2DCircleRadius?.value) || null,
        d: parseFloat(shape2DCircleDiameter?.value) || null,
        c: parseFloat(shape2DCircleCircumference?.value) || null,
        a: parseFloat(shape2DCircleArea?.value) || null,
        SectorArea: parseFloat(shape2DCircleSectorArea?.value) || null,
        ArcLength: parseFloat(shape2DCircleArcLength?.value) || null,
        CentralAngle: parseFloat(shape2DCircleCentralAngle?.value) || null
      };
      break;
    case "triangle":
      inputs = {
        tp: shape2DTriangleAngleType?.value || null,
        tT: shape2DTriangleSideType?.value || null,
        s1: parseFloat(shape2DTriangleSide1?.value) || null,
        s2: parseFloat(shape2DTriangleSide2?.value) || null,
        s3: parseFloat(shape2DTriangleSide3?.value) || null,
        b: parseFloat(shape2DTriangleBase?.value) || null,
        h1: parseFloat(shape2DTriangleHeight1?.value) || null,
        h2: parseFloat(shape2DTriangleHeight2?.value) || null,
        h3: parseFloat(shape2DTriangleHeight3?.value) || null,
        m1: parseFloat(shape2DTriangleMedian1?.value) || null,
        m2: parseFloat(shape2DTriangleMedian2?.value) || null,
        m3: parseFloat(shape2DTriangleMedian3?.value) || null,
        mid1: parseFloat(shape2DTriangleMidsegment1?.value) || null,
        mid2: parseFloat(shape2DTriangleMidsegment2?.value) || null,
        mid3: parseFloat(shape2DTriangleMidsegment3?.value) || null,
        p: parseFloat(shape2DTrianglePerimeter?.value) || null,
        sp: parseFloat(shape2DTriangleSemiperimeter?.value) || null,
        a: parseFloat(shape2DTriangleArea?.value) || null,
        angleA: parseFloat(shape2DTriangleAngle1?.value) || null,
        angleB: parseFloat(shape2DTriangleAngle2?.value) || null,
        angleC: parseFloat(shape2DTriangleAngle3?.value) || null,
        inR: parseFloat(shape2DTriangleInradius?.value) || null,
        exR1: parseFloat(shape2DTriangleExradius1?.value) || null,
        exR2: parseFloat(shape2DTriangleExradius2?.value) || null,
        exR3: parseFloat(shape2DTriangleExradius3?.value) || null,
        circumR: parseFloat(shape2DTriangleCircumradius?.value) || null
      };
      break;
    case "square":
      inputs = {
        s: parseFloat(shape2DSquareSide?.value) || null,
        d: parseFloat(shape2DSquareDiagonal?.value) || null,
        m: parseFloat(shape2DSquareMedian?.value) || null,
        h: parseFloat(shape2DSquareHeight?.value) || null,
        ml: parseFloat(shape2DSquareMidline?.value) || null,
        p: parseFloat(shape2DSquarePerimeter?.value) || null,
        a: parseFloat(shape2DSquareArea?.value) || null,
        inR: parseFloat(shape2DSquareInradius?.value) || null,
        circumR: parseFloat(shape2DSquareCircumradius?.value) || null
      };
      break;
    case "rectangle":
      inputs = {
        l: parseFloat(shape2DRectangleLength?.value) || null,
        w: parseFloat(shape2DRectangleWidth?.value) || null,
        d: parseFloat(shape2DRectangleDiagonal?.value) || null,
        p: parseFloat(shape2DRectanglePerimeter?.value) || null,
        a: parseFloat(shape2DRectangleArea?.value) || null,
        midL: parseFloat(shape2DRectangleMidlineL?.value) || null,
        midW: parseFloat(shape2DRectangleMidlineW?.value) || null,
        inR: parseFloat(shape2DRectangleInradius?.value) || null,
        circumR: parseFloat(shape2DRectangleCircumradius?.value) || null,
        m1: parseFloat(shape2DRectangleMedian1?.value) || null,
        m2: parseFloat(shape2DRectangleMedian2?.value) || null
      };
      break;
    case "parallelogram":
      inputs = {
        b: parseFloat(shape2DParallelogramBase?.value) || null,
        h: parseFloat(shape2DParallelogramHeight?.value) || null,
        s: parseFloat(shape2DParallelogramSide?.value) || null,
        angleA: parseFloat(shape2DParallelogramAngleA?.value) || null,
        angleB: parseFloat(shape2DParallelogramAngleB?.value) || null,
        p: parseFloat(shape2DParallelogramPerimeter?.value) || null,
        a: parseFloat(shape2DParallelogramArea?.value) || null,
        midB: parseFloat(shape2DParallelogramMidlineB?.value) || null,
        midS: parseFloat(shape2DParallelogramMidlineS?.value) || null,
        inR: parseFloat(shape2DParallelogramInradius?.value) || null,
        circumR: parseFloat(shape2DParallelogramCircumradius?.value) || null,
        m1: parseFloat(shape2DParallelogramMedian1?.value) || null,
        m2: parseFloat(shape2DParallelogramMedian2?.value) || null
      };
      break;
    case "trapezoid":
      inputs = {
        b1: parseFloat(shape2DTrapezoidBase1?.value) || null,
        b2: parseFloat(shape2DTrapezoidBase2?.value) || null,
        h: parseFloat(shape2DTrapezoidHeight?.value) || null,
        s1: parseFloat(shape2DTrapezoidSide1?.value) || null,
        s2: parseFloat(shape2DTrapezoidSide2?.value) || null,
        mid: parseFloat(shape2DTrapezoidMidsegment?.value) || null,
        p: parseFloat(shape2DTrapezoidPerimeter?.value) || null,
        a: parseFloat(shape2DTrapezoidArea?.value) || null,
        inR: parseFloat(shape2DTrapezoidInradius?.value) || null,
        circumR: parseFloat(shape2DTrapezoidCircumradius?.value) || null,
        m1: parseFloat(shape2DTrapezoidMedian1?.value) || null,
        m2: parseFloat(shape2DTrapezoidMedian2?.value) || null
      };
      break;
    case "rhombus":
      inputs = {
        s: parseFloat(shape2DRhombusSide?.value) || null,
        d1: parseFloat(shape2DRhombusDiagonal1?.value) || null,
        d2: parseFloat(shape2DRhombusDiagonal2?.value) || null,
        h: parseFloat(shape2DRhombusHeight?.value) || null,
        midD1: parseFloat(shape2DRhombusMidDiagonal1?.value) || null,
        midD2: parseFloat(shape2DRhombusMidDiagonal2?.value) || null,
        P: parseFloat(shape2DRhombusPerimeter?.value) || null,
        A: parseFloat(shape2DRhombusArea?.value) || null,
        m1: parseFloat(shape2DRhombusMedian1?.value) || null,
        m2: parseFloat(shape2DRhombusMedian2?.value) || null
      };
      break;
    case "kite":
      inputs = {
        d1: parseFloat(shape2DKiteDiagonal1?.value) || null,
        d2: parseFloat(shape2DKiteDiagonal2?.value) || null,
        s1: parseFloat(shape2DKiteSide1?.value) || null,
        s2: parseFloat(shape2DKiteSide2?.value) || null,
        p: parseFloat(shape2DKitePerimeter?.value) || null,
        a: parseFloat(shape2DKiteArea?.value) || null,
        midD1: parseFloat(shape2DKiteMidD1?.value) || null,
        midD2: parseFloat(shape2DKiteMidD2?.value) || null,
        inR: parseFloat(shape2DKiteInradius?.value) || null,
        circumR: parseFloat(shape2DKiteCircumradius?.value) || null,
        m1: parseFloat(shape2DKiteMedian1?.value) || null,
        m2: parseFloat(shape2DKiteMedian2?.value) || null
      };
      break;
    case "ellipse":
      inputs = {
        a: parseFloat(shape2DEllipseSemiMajor?.value) || null,
        b: parseFloat(shape2DEllipseSemiMinor?.value) || null,
        c: parseFloat(shape2DEllipseFocalDistance?.value) || null,
        p: parseFloat(shape2DEllipsePerimeter?.value) || null,
        a: parseFloat(shape2DEllipseArea?.value) || null
      };
      break;
    case "regularPolygon":
      inputs = {
        n: parseFloat(shape2DRegularPolygonSides?.value) || null,
        s: parseFloat(shape2DRegularPolygonSideLength?.value) || null,
        apothem: parseFloat(shape2DRegularPolygonApothemLength?.value) || null,
        a: parseFloat(shape2DRegularPolygonArea?.value) || null,
        p: parseFloat(shape2DRegularPolygonPerimeter?.value) || null,
        circumR: parseFloat(shape2DRegularPolygonCircumradius?.value) || null,
        inR: parseFloat(shape2DRegularPolygonInradius?.value) || null
      };
      break;
  }

  const result = solveShape2D(shape, inputs);
  const fmt = (x) => {
    if (typeof x === "string") return x; if (x !== null && !isNaN(x)) return x.toFixed(4); return "unknown";
  };
  let out = `Shape: ${shape}\n`;
  for (const [key, val] of Object.entries(result)) out += `${nameMap[key] || key} = ${fmt(val)}\n`;
  document.getElementById("shapes2DOut").textContent = out;
}
function shapes2DClear() {
  document.querySelectorAll('.shapes-2d-visible input').forEach(input => input.value = '');
  document.getElementById('shape2D').value = 'select';
  document.getElementById('shapes2DOut').textContent = '';
  const grids = [
    'shapes2DCircleGrid',
    'shapes2DTriangleGrid',
    'shapes2DSquareGrid',
    'shapes2DRectangleGrid',
    'shapes2DParallelogramGrid',
    'shapes2DTrapezoidGrid',
    'shapes2DRhombusGrid',
    'shapes2DKiteGrid',
    'shapes2DEllipseGrid',
    'shapes2DRegularPolygonGrid'
  ];
  grids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('shapes-2d-visible');
      el.classList.add('shapes-2d-hidden');
    }
  });
}

// =============== PHYSICS ===============

// ---------- KINEMATICS SOLVER ----------
function kinematics_clear() {
  ['kin_s', 'kin_u', 'kin_v', 'kin_a', 'kin_t'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('kin_out').textContent = '';
}
function kinematics_solve() {
  let s = toNum(document.getElementById('kin_s').value);
  let u = toNum(document.getElementById('kin_u').value);
  let v = toNum(document.getElementById('kin_v').value);
  let a = toNum(document.getElementById('kin_a').value);
  let t = toNum(document.getElementById('kin_t').value);
  const known = x => x !== null;

  let changed = true, iter = 0;
  while (changed && iter < 40) {
    changed = false; iter++;
    if (!known(v) && known(u) && known(a) && known(t)) { v = u + a * t; changed = true; }
    if (!known(u) && known(v) && known(a) && known(t)) { u = v - a * t; changed = true; }
    if (!known(a) && known(v) && known(u) && known(t) && t !== 0) { a = (v - u) / t; changed = true; }
    if (!known(t) && known(v) && known(u) && known(a) && a !== 0) { t = (v - u) / a; changed = true; }
    if (!known(s) && known(u) && known(t) && known(a)) { s = u * t + 0.5 * a * t * t; changed = true; }
    if (!known(s) && known(u) && known(v) && known(t)) { s = (u + v) / 2 * t; changed = true; }
    if (!known(t) && known(s) && known(u) && known(v) && (u + v) !== 0) { t = (2 * s) / (u + v); changed = true; }
    if (!known(v) && known(u) && known(a) && known(s)) { const val = u * u + 2 * a * s; if (val >= 0) { v = Math.sqrt(val); changed = true; } }
    if (!known(u) && known(v) && known(a) && known(s)) { const val = v * v - 2 * a * s; if (val >= 0) { u = Math.sqrt(val); changed = true; } }
    if (!known(a) && known(v) && known(u) && known(s) && s !== 0) { a = (v * v - u * u) / (2 * s); changed = true; }
  }

  const out = `Iterations: ${iter}\n` +
    `s = ${fmt(s)}\n` +
    `u = ${fmt(u)}\n` +
    `v = ${fmt(v)}\n` +
    `a = ${fmt(a)}\n` +
    `t = ${fmt(t)}`;

  document.getElementById('kin_out').textContent = out;
}

// ---------- PROJECTILE FLEXIBLE SOLVER ----------
function proj_clear() {
  ['pm_v0', 'pm_theta', 'pm_g', 'pm_T', 'pm_R', 'pm_H'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pm_out').textContent = '';
}
function proj_flexible() {
  let v0 = toNum(document.getElementById('pm_v0').value);
  let theta = toNum(document.getElementById('pm_theta').value); // degrees
  let g = toNum(document.getElementById('pm_g').value) ?? 9.81;
  let T = toNum(document.getElementById('pm_T').value);
  let R = toNum(document.getElementById('pm_R').value);
  let H = toNum(document.getElementById('pm_H').value);


  let changed = true, iter = 0;
  while (changed && iter < 40) {
    changed = false; iter++;
    if (known(v0) && known(theta)) {
      const th = deg2rad(theta);
      if (!known(T)) { T = 2 * v0 * Math.sin(th) / g; changed = true; }
      if (!known(R)) { R = (v0 * v0 * Math.sin(2 * th)) / g; changed = true; }
      if (!known(H)) { H = (v0 * v0 * Math.sin(th) * Math.sin(th)) / (2 * g); changed = true; }
    }
    if (known(T) && known(theta) && !known(v0)) { const th = deg2rad(theta); v0 = (T * g) / (2 * Math.sin(th)); changed = true; }
    if (known(R) && known(theta) && !known(v0)) { const th = deg2rad(theta); const denom = Math.sin(2 * th); if (Math.abs(denom) > 1e-12) { v0 = Math.sqrt(R * g / denom); changed = true; } }
    if (known(v0) && known(R) && !known(theta)) { const val = (R * g) / (v0 * v0); if (Math.abs(val) <= 1) { const twoTh = Math.asin(val); theta = rad2deg(twoTh / 2); changed = true; } }
    if (known(H) && known(v0) && !known(theta)) { const v = (2 * g * H) / (v0 * v0); if (v >= 0 && v <= 1) { theta = rad2deg(Math.asin(Math.sqrt(v))); changed = true; } }
    if (known(H) && known(theta) && !known(v0)) { const th = deg2rad(theta); const denom = Math.sin(th) * Math.sin(th); if (denom > 0) { v0 = Math.sqrt(2 * g * H / denom); changed = true; } }
    if (known(T) && known(v0) && !known(theta)) { const val = (T * g) / (2 * v0); if (Math.abs(val) <= 1) { theta = rad2deg(Math.asin(val)); changed = true; } }
  }

  const out = `Iterations: ${iter}\n` +
    `v0 = ${fmt(v0)} m/s\n` +
    `θ = ${fmt(theta)}°\n` +
    `g = ${fmt(g)} m/s²\n` +
    `T = ${fmt(T)} s\n` +
    `R = ${fmt(R)} m\n` +
    `H = ${fmt(H)} m`;
  document.getElementById('pm_out').textContent = out;
}

// ---------- WAVES CALCULATOR ----------
function waves_clear() {
  ['wav_v', 'wav_f', 'wav_lambda', 'wav_T', 'wav_F', 'wav_mu'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('wav_out').textContent = '';
}
function waves_solve() {
  let v = toNum(document.getElementById('wav_v').value);
  let f = toNum(document.getElementById('wav_f').value);
  let lambda = toNum(document.getElementById('wav_lambda').value);
  let T = toNum(document.getElementById('wav_T').value);
  let F = toNum(document.getElementById('wav_F').value);
  let mu = toNum(document.getElementById('wav_mu').value);
  const known = x => x !== null;

  let changed = true, iter = 0;
  while (changed && iter < 40) {
    changed = false; iter++;
    if (!known(v) && known(f) && known(lambda)) { v = f * lambda; changed = true; }
    if (!known(f) && known(v) && known(lambda) && lambda !== 0) { f = v / lambda; changed = true; }
    if (!known(lambda) && known(v) && known(f) && f !== 0) { lambda = v / f; changed = true; }
    if (!known(T) && known(f) && f !== 0) { T = 1 / f; changed = true; }
    if (!known(f) && known(T) && T !== 0) { f = 1 / T; changed = true; }
    if (!known(v) && known(lambda) && known(T) && T !== 0) { v = lambda / T; changed = true; }
    if (!known(lambda) && known(v) && known(T)) { lambda = v * T; changed = true; }
    if (!known(T) && known(v) && known(lambda) && v !== 0) { T = lambda / v; changed = true; }
    if (!known(v) && known(F) && known(mu) && mu !== 0) { v = Math.sqrt(F / mu); changed = true; }
    if (!known(F) && known(v) && known(mu)) { F = mu * v * v; changed = true; }
    if (!known(mu) && known(v) && known(F) && v !== 0) { mu = F / (v * v); changed = true; }
  }

  const out = `Iterations: ${iter}\n` +
    `v = ${fmt(v)}\n` +
    `f = ${fmt(f)}\n` +
    `λ = ${fmt(lambda)}\n` +
    `T = ${fmt(T)}\n` +
    `F = ${fmt(F)}\n` +
    `μ = ${fmt(mu)}`;

  document.getElementById('wav_out').textContent = out;
}

// ======== CHEMISTRY ========
function highlightElementGroup(type) {
  const elements = document.querySelectorAll(`.${type}`);
  const alreadyHighlighted = Array.from(elements).some(el => el.classList.contains('highlighted'));
  document.querySelectorAll('.element-box').forEach(el => el.classList.remove('highlighted'));
  if (!alreadyHighlighted) {
    elements.forEach(el => el.classList.add('highlighted'));
  }
}
const elementData = [
  {"Z": 1, "Symbol": "H", "Name": "Hydrogen"},
  {"Z": 2, "Symbol": "He", "Name": "Helium"},
  {"Z": 3, "Symbol": "Li", "Name": "Lithium"},
  {"Z": 4, "Symbol": "Be", "Name": "Beryllium"},
  {"Z": 5, "Symbol": "B", "Name": "Boron"},
  {"Z": 6, "Symbol": "C", "Name": "Carbon"},
  {"Z": 7, "Symbol": "N", "Name": "Nitrogen"},
  {"Z": 8, "Symbol": "O", "Name": "Oxygen"},
  {"Z": 9, "Symbol": "F", "Name": "Fluorine"},
  {"Z": 10, "Symbol": "Ne", "Name": "Neon"},
  {"Z": 11, "Symbol": "Na", "Name": "Sodium"},
  {"Z": 12, "Symbol": "Mg", "Name": "Magnesium"},
  {"Z": 13, "Symbol": "Al", "Name": "Aluminum"},
  {"Z": 14, "Symbol": "Si", "Name": "Silicon"},
  {"Z": 15, "Symbol": "P", "Name": "Phosphorus"},
  {"Z": 16, "Symbol": "S", "Name": "Sulfur"},
  {"Z": 17, "Symbol": "Cl", "Name": "Chlorine"},
  {"Z": 18, "Symbol": "Ar", "Name": "Argon"},
  {"Z": 19, "Symbol": "K", "Name": "Potassium"},
  {"Z": 20, "Symbol": "Ca", "Name": "Calcium"},
  {"Z": 21, "Symbol": "Sc", "Name": "Scandium"},
  {"Z": 22, "Symbol": "Ti", "Name": "Titanium"},
  {"Z": 23, "Symbol": "V", "Name": "Vanadium"},
  {"Z": 24, "Symbol": "Cr", "Name": "Chromium"},
  {"Z": 25, "Symbol": "Mn", "Name": "Manganese"},
  {"Z": 26, "Symbol": "Fe", "Name": "Iron"},
  {"Z": 27, "Symbol": "Co", "Name": "Cobalt"},
  {"Z": 28, "Symbol": "Ni", "Name": "Nickel"},
  {"Z": 29, "Symbol": "Cu", "Name": "Copper"},
  {"Z": 30, "Symbol": "Zn", "Name": "Zinc"},
  {"Z": 31, "Symbol": "Ga", "Name": "Gallium"},
  {"Z": 32, "Symbol": "Ge", "Name": "Germanium"},
  {"Z": 33, "Symbol": "As", "Name": "Arsenic"},
  {"Z": 34, "Symbol": "Se", "Name": "Selenium"},
  {"Z": 35, "Symbol": "Br", "Name": "Bromine"},
  {"Z": 36, "Symbol": "Kr", "Name": "Krypton"},
  {"Z": 37, "Symbol": "Rb", "Name": "Rubidium"},
  {"Z": 38, "Symbol": "Sr", "Name": "Strontium"},
  {"Z": 39, "Symbol": "Y", "Name": "Yttrium"},
  {"Z": 40, "Symbol": "Zr", "Name": "Zirconium"},
  {"Z": 41, "Symbol": "Nb", "Name": "Niobium"},
  {"Z": 42, "Symbol": "Mo", "Name": "Molybdenum"},
  {"Z": 43, "Symbol": "Tc", "Name": "Technetium"},
  {"Z": 44, "Symbol": "Ru", "Name": "Ruthenium"},
  {"Z": 45, "Symbol": "Rh", "Name": "Rhodium"},
  {"Z": 46, "Symbol": "Pd", "Name": "Palladium"},
  {"Z": 47, "Symbol": "Ag", "Name": "Silver"},
  {"Z": 48, "Symbol": "Cd", "Name": "Cadmium"},
  {"Z": 49, "Symbol": "In", "Name": "Indium"},
  {"Z": 50, "Symbol": "Sn", "Name": "Tin"},
  {"Z": 51, "Symbol": "Sb", "Name": "Antimony"},
  {"Z": 52, "Symbol": "Te", "Name": "Tellurium"},
  {"Z": 53, "Symbol": "I", "Name": "Iodine"},
  {"Z": 54, "Symbol": "Xe", "Name": "Xenon"},
  {"Z": 55, "Symbol": "Cs", "Name": "Cesium"},
  {"Z": 56, "Symbol": "Ba", "Name": "Barium"},
  {"Z": 57, "Symbol": "La", "Name": "Lanthanum"},
  {"Z": 58, "Symbol": "Ce", "Name": "Cerium"},
  {"Z": 59, "Symbol": "Pr", "Name": "Praseodymium"},
  {"Z": 60, "Symbol": "Nd", "Name": "Neodymium"},
  {"Z": 61, "Symbol": "Pm", "Name": "Promethium"},
  {"Z": 62, "Symbol": "Sm", "Name": "Samarium"},
  {"Z": 63, "Symbol": "Eu", "Name": "Europium"},
  {"Z": 64, "Symbol": "Gd", "Name": "Gadolinium"},
  {"Z": 65, "Symbol": "Tb", "Name": "Terbium"},
  {"Z": 66, "Symbol": "Dy", "Name": "Dysprosium"},
  {"Z": 67, "Symbol": "Ho", "Name": "Holmium"},
  {"Z": 68, "Symbol": "Er", "Name": "Erbium"},
  {"Z": 69, "Symbol": "Tm", "Name": "Thulium"},
  {"Z": 70, "Symbol": "Yb", "Name": "Ytterbium"},
  {"Z": 71, "Symbol": "Lu", "Name": "Lutetium"},
  {"Z": 72, "Symbol": "Hf", "Name": "Hafnium"},
  {"Z": 73, "Symbol": "Ta", "Name": "Tantalum"},
  {"Z": 74, "Symbol": "W", "Name": "Tungsten"},
  {"Z": 75, "Symbol": "Re", "Name": "Rhenium"},
  {"Z": 76, "Symbol": "Os", "Name": "Osmium"},
  {"Z": 77, "Symbol": "Ir", "Name": "Iridium"},
  {"Z": 78, "Symbol": "Pt", "Name": "Platinum"},
  {"Z": 79, "Symbol": "Au", "Name": "Gold"},
  {"Z": 80, "Symbol": "Hg", "Name": "Mercury"},
  {"Z": 81, "Symbol": "Tl", "Name": "Thallium"},
  {"Z": 82, "Symbol": "Pb", "Name": "Lead"},
  {"Z": 83, "Symbol": "Bi", "Name": "Bismuth"},
  {"Z": 84, "Symbol": "Po", "Name": "Polonium"},
  {"Z": 85, "Symbol": "At", "Name": "Astatine"},
  {"Z": 86, "Symbol": "Rn", "Name": "Radon"},
  {"Z": 87, "Symbol": "Fr", "Name": "Francium"},
  {"Z": 88, "Symbol": "Ra", "Name": "Radium"},
  {"Z": 89, "Symbol": "Ac", "Name": "Actinium"},
  {"Z": 90, "Symbol": "Th", "Name": "Thorium"},
  {"Z": 91, "Symbol": "Pa", "Name": "Protactinium"},
  {"Z": 92, "Symbol": "U", "Name": "Uranium"},
  {"Z": 93, "Symbol": "Np", "Name": "Neptunium"},
  {"Z": 94, "Symbol": "Pu", "Name": "Plutonium"},
  {"Z": 95, "Symbol": "Am", "Name": "Americium"},
  {"Z": 96, "Symbol": "Cm", "Name": "Curium"},
  {"Z": 97, "Symbol": "Bk", "Name": "Berkelium"},
  {"Z": 98, "Symbol": "Cf", "Name": "Californium"},
  {"Z": 99, "Symbol": "Es", "Name": "Einsteinium"},
  {"Z": 100, "Symbol": "Fm", "Name": "Fermium"},
  {"Z": 101, "Symbol": "Md", "Name": "Mendelevium"},
  {"Z": 102, "Symbol": "No", "Name": "Nobelium"},
  {"Z": 103, "Symbol": "Lr", "Name": "Lawrencium"},
  {"Z": 104, "Symbol": "Rf", "Name": "Rutherfordium"},
  {"Z": 105, "Symbol": "Db", "Name": "Dubnium"},
  {"Z": 106, "Symbol": "Sg", "Name": "Seaborgium"},
  {"Z": 107, "Symbol": "Bh", "Name": "Bohrium"},
  {"Z": 108, "Symbol": "Hs", "Name": "Hassium"},
  {"Z": 109, "Symbol": "Mt", "Name": "Meitnerium"},
  {"Z": 110, "Symbol": "Ds", "Name": "Darmstadtium"},
  {"Z": 111, "Symbol": "Rg", "Name": "Roentgenium"},
  {"Z": 112, "Symbol": "Cn", "Name": "Copernicium"},
  {"Z": 113, "Symbol": "Nh", "Name": "Nihonium"},
  {"Z": 114, "Symbol": "Fl", "Name": "Flerovium"},
  {"Z": 115, "Symbol": "Mc", "Name": "Moscovium"},
  {"Z": 116, "Symbol": "Lv", "Name": "Livermorium"},
  {"Z": 117, "Symbol": "Ts", "Name": "Tennessine"},
  {"Z": 118, "Symbol": "Og", "Name": "Oganesson"}
]
let elementDataDB = [];
const ptOut = document.getElementById('ptOut');
document.querySelectorAll('.element-box').forEach(box => {
  box.addEventListener('click', () => {
    const symbol = box.getAttribute('data-symbol');
    if (!db || !currentUser) {
      ptOut.textContent = `Sign in to see more detailed info on ${symbol}`;
      setTimeout(() => ptOut.textContent = '', 4000);
    }
    else showElementInfo(symbol);
  });
});
function searchElement() {
  const searchedElement = document.getElementById('ptSearch').value.trim().toLowerCase();
  const element = elementData.find(el =>
    el.Symbol.toLowerCase() === searchedElement ||
    el.Name.toLowerCase() === searchedElement ||
    el.Z.toString() === searchedElement
  );
  if (element) {
    const elementId = "atom" + element.Symbol;
    const elementElem = document.getElementById(elementId);
    if (elementElem) {
      elementElem.click();
      elementElem.classList.add("hover-element");
      setTimeout(() => elementElem.classList.remove("hover-element"), 4000);
    } 
    else {
      ptOut.textContent = `Element found, but no HTML element with ID "${elementId}" exists.`;
    }
  } 
  else {
    ptOut.textContent = 'Invalid input. Please enter a valid element name, symbol, or atomic number.';
  }
}
document.getElementById('ptSearch').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchElement();
  }
});
function showElementInfoOut(button) {
  if (!db || !currentUser) return;
  document.querySelectorAll('.element-info-out-display').forEach(e => {
    e.classList.remove('active');
  });
  const targetId = button.getAttribute('data-target-id');
  const contentElement = document.getElementById(targetId);
  if (contentElement) {
    contentElement.classList.add('active');
  }
}
function loadElementData() {
  if (!db || !currentUser) {
    console.error("Firebase DB not initialized yet!");
    return;
  }
  db.ref("elementData").once("value")
    .then(snapshot => {
      elementDataDB = Object.values(snapshot.val());
      console.log("Element data loaded:", elementDataDB.length, "elements");
    })
    .catch(err => console.error("Error loading elementData from Firebase:", err));
}
function showElementInfo(symbol) {
  if (!db || !currentUser) return;
  document.getElementById('ptOutElementInfo').classList.add("visible");
  const element = elementDataDB.find(e => e.Symbol === symbol);
  const mainInfo = document.getElementById('elementInfoOutMain');
  mainInfo.classList.remove(
    "alkaliMetalsLegend", "metalloidsLegend", "actinidesLegend",
    "alkalineEarthMetalsLegend", "reactiveNonMetalsLegend",
    "unknownElementsLegend", "transitionMetalsLegend",
    "nobleGasesLegend", "postTransitionMetalsLegend", "lanthanidesLegend"
  );
  if (element) {
    const atomicNumber = element.Z;
    const elementCategories = {
      "alkaliMetalsLegend": [3, 11, 19, 37, 55, 87],
      "metalloidsLegend": [5, 6, 14, 32, 33, 51, 52],
      "actinidesLegend": [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103],
      "alkalineEarthMetalsLegend": [4, 12, 20, 38, 56, 88],
      "reactiveNonMetalsLegend": [1, 7, 8, 9, 15, 16, 17, 34, 35, 53],
      "unknownElementsLegend": [109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
      "transitionMetalsLegend": [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 72, 73, 74, 75, 76, 77, 78, 79, 80, 104, 105, 106, 107, 108],
      "nobleGasesLegend": [2, 10, 18, 36, 54, 86],
      "postTransitionMetalsLegend": [13, 31, 49, 50, 81, 82, 83, 84, 85],
      "lanthanidesLegend": [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70]
    };
    for (const [className, atomicNumbers] of Object.entries(elementCategories)) {
      if (atomicNumbers.includes(atomicNumber)) {
        mainInfo.classList.add(className);
        break;
      }
    }
    document.getElementById("element-info-out-number").textContent = element.Z;
    document.getElementById("element-info-out-symbol").textContent = element.Symbol;
    document.getElementById("element-info-out-name").textContent = element.Name;
    document.getElementById("element-info-out-classification").textContent = 'Classification: ' + element.Classification;
    document.getElementById("element-info-out-standard-state").textContent = 'State: ' + element.Standard_State;
    // * temp 
    document.getElementById("element-info-out-period").textContent = 'Period: ' + element.Period;
    document.getElementById("element-info-out-group").textContent = 'Group: ' + element.Group;
    document.getElementById("element-info-out-block").textContent = 'Block: ' + element.Block;
    document.getElementById("element-info-out-atomic-mass").textContent = 'Atomic Mass: ' + element.Atomic_Mass;
    document.getElementById("element-info-out-protons").textContent = 'Protons: ' + element.Protons;
    document.getElementById("element-info-out-neutrons").textContent = 'Neutrons: ' + element.Neutrons;
    document.getElementById("element-info-out-electrons-neutral").textContent = 'Electrons (Neutral): ' + element["Electrons (Neutral)"];
    document.getElementById("element-info-out-discoverer").textContent = 'Discoverer: ' + element.Discoverer;
    document.getElementById("element-info-out-date").textContent = 'Discovery Date: ' + element.Date;
    document.getElementById("element-info-out-origin").textContent = 'Name Origin: ' + element.Origin;
    document.getElementById("element-info-out-abundance-earth").textContent = 'Abundance on Earth: ' + element.Abundance_On_Earth;
    document.getElementById("element-info-out-abundance-other").textContent = 'Abundance: ' + element.Abundance;
    document.getElementById("element-info-out-sources").textContent = 'Sources: ' + element.Sources;
    document.getElementById("element-info-out-electron-configuration").textContent = 'Complete Electron Configuration: ' + element.Electron_Configuration;
    document.getElementById("element-info-out-condensed-electron-configuration").textContent = 'Condensed Electron Configuration: ' + element.Condensed_Electron_Configuration;
    if (element && element.Isotopes && element.Isotopes.length > 0) {
      createIsotopeSlider(element);
    }
    document.getElementById("element-info-out-common-oxidation-states").textContent = 'Common Oxidation States: ' + element.Common_Oxidation_States;
    document.getElementById("element-info-out-electron-count-in-ion").textContent = 'Electron Count in Ion: ' + element.Electron_Count_in_Ion;
    document.getElementById("element-info-out-valence-orbital-diagram").textContent = 'Valence Electron Diagram: ' + element.Valence_Orbital_Diagram;
    document.getElementById("element-info-out-dot-structure").textContent = 'Dot Structure: ' + element.DotStructure;
    document.getElementById("element-info-out-nuclear-spin").textContent = 'Nuclear Spin (I): ' + element["Nuclear Spin (I)"];
    document.getElementById("element-info-out-magnetic-moment").textContent = 'Magnetic Moment (μ/μN​): ' + element["Magnetic Moment (μ/μN​)"];
    document.getElementById("element-info-out-melting-point-c").textContent = 'Melting Point (°C): ' + element["Melting Point (°C)"];
    document.getElementById("element-info-out-melting-point-k").textContent = 'Melting Point (K): ' + element["Melting Point (K)"];
    document.getElementById("element-info-out-melting-point-pressure-dependency").textContent = 'Melting Point Pressure Dependency: ' + element["Melting Point Pressure Dependency"];
    document.getElementById("element-info-out-boiling-point-c").textContent = 'Boiling Point (°C): ' + element["Boiling Point (°C)"];
    document.getElementById("element-info-out-boiling-point-k").textContent = 'Boiling Point (K): ' + element["Boiling Point (K)"];
    document.getElementById("element-info-out-boiling-point-pressure-dependency").textContent = 'Boiling Point Pressure Dependency: ' + element["Boiling Point Pressure Dependency"];
    document.getElementById("element-info-out-density").textContent = 'Density (g/cm³): ' + element["Density (g/cm³)"];
    document.getElementById("element-info-out-atomic-radius").textContent = 'Atomic Radius (pm): ' + element["Atomic Radius (pm)"];
    document.getElementById("element-info-out-covalent-radius").textContent = 'Covalent Radius (pm): ' + element["Covalent Radius (pm)"];
    document.getElementById("element-info-out-van-der-waals-radius").textContent = 'Van der Waals Radius (pm): ' + element["Van der Waals Radius (pm)"];
    document.getElementById("element-info-out-ionic-radius").textContent = 'Ionic Radius(es) (pm): ' + element["Ionic Radius(es) (pm)"];
    document.getElementById("element-info-out-mohs-hardness").textContent = 'Mohs Hardness: ' + element["Mohs Hardness"];
    document.getElementById("element-info-out-youngs-modulus").textContent = 'Young\'s Modulus (GPa): ' + element["Young's Modulus (GPa)"];
    document.getElementById("element-info-out-bulk-modulus").textContent = 'Bulk Modulus (GPa): ' + element["Bulk Modulus (GPa)"];
    document.getElementById("element-info-out-shear-modulus").textContent = 'Shear Modulus (GPa): ' + element["Shear Modulus (GPa)"];
    document.getElementById("element-info-out-thermal-conductivity").textContent = 'Thermal Conductivity (W/m·K): ' + element["Thermal Conductivity (W/m·K)"];
    document.getElementById("element-info-out-specific-heat").textContent = 'Specific Heat (J/g·K): ' + element["Specific Heat (J/g·K)"];
    document.getElementById("element-info-out-heat-of-fusion").textContent = 'Heat of Fusion (kJ/mol): ' + element["Heat of Fusion (kJ/mol)"];
    document.getElementById("element-info-out-heat-of-vaporization").textContent = 'Heat of Vaporization (kJ/mol): ' + element["Heat of Vaporization (kJ/mol)"];
    document.getElementById("element-info-out-color-solid").textContent = 'Color in Solid State: ' + element["Color_in_Solid_State"];
    document.getElementById("element-info-out-refractive-index").textContent = 'Refractive Index: ' + element["Refractive_Index"];
    document.getElementById("element-info-out-crystal-structure").textContent = 'Crystal Structure: ' + element["Crystal_Structure"];
    document.getElementById("element-info-out-lattice-parameters").textContent = 'Lattice Parameters: ' + element["Lattice Parameters (a, b, c in Å, angles α, β, γ)"];
    document.getElementById("element-info-out-space-group").textContent = 'Space Group: ' + element["Space_Group"];
    document.getElementById("element-info-out-molar-volume").textContent = 'Molar Volume: ' + element["Molar_Volume"];
    document.getElementById("element-info-out-solubility").textContent = 'Solubility: ' + element["Solubility"];
    document.getElementById("element-info-out-vapor-point").textContent = 'Vapor Point: ' + element["Vapor_Point"];
    document.getElementById("element-info-out-electronegativity").textContent = 'Electron Negativity: ' + element["Electronegativity"];
    document.getElementById("element-info-out-electron-affinity").textContent = 'Electron Affinity: ' + element["Electron_Affinity"];
    document.getElementById("element-info-out-ionization-energy").textContent = '1st Ionization Energy (kJ/mol): ' + element["1st Ionization Energy (kJ/mol)"];
    document.getElementById("element-info-out-electrode-potential").textContent = 'Standard Electrode Potential: ' + element["Standard_Electrode_Potential"];
    document.getElementById("element-info-out-acid-base-behavior").textContent = 'Acid or Base Behavior: ' + element["Acid_or_base_behavior"];
    document.getElementById("element-info-out-reactivity").textContent = 'Reactivity: ' + element["Reactivity"];
    document.getElementById("element-info-out-electrical-conductivity").textContentmagnetic = 'Electrical Conductivity: ' + element["Electrical_Conductivity"];
    document.getElementById("element-info-out-magnetic-properties").textContent = 'Magnetic Properties: ' + element["Magnetic_Properties"];
    document.getElementById("element-info-out-band-gap").textContent = 'Band Gap: ' + element["Band_Gap"];
    document.getElementById("element-info-out-radioactivity").textContent = element["Radioactive?"];
    document.getElementById("element-info-out-half-life").textContent = 'Half Life: ' + element["Half-life"];
    document.getElementById("element-info-out-toxicity").textContent = 'Toxicity: ' + element["Toxicity"];
    document.getElementById("element-info-out-bio-role").textContent = 'Biological Role: ' + element["Biological_Role"];
  } 
  else {
    console.warn("No element found for symbol:", symbol);
  }
  document.getElementById("ptInfoBtn").classList.remove('ptInfoBtnHidden');
  document.getElementById("ptInfoBtn").classList.add('ptInfoBtnVisible');
}
function createIsotopeSlider(element) {
  const atomicNumber = element.Z;
  const elementCategories = {
    "alkaliMetalsLegend": [3, 11, 19, 37, 55, 87],
    "metalloidsLegend": [5, 6, 14, 32, 33, 51, 52],
    "actinidesLegend": [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103],
    "alkalineEarthMetalsLegend": [4, 12, 20, 38, 56, 88],
    "reactiveNonMetalsLegend": [1, 7, 8, 9, 15, 16, 17, 34, 35, 53],
    "unknownElementsLegend": [109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    "transitionMetalsLegend": [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 72, 73, 74, 75, 76, 77, 78, 79, 80, 104, 105, 106, 107, 108],
    "nobleGasesLegend": [2, 10, 18, 36, 54, 86],
    "postTransitionMetalsLegend": [13, 31, 49, 50, 81, 82, 83, 84, 85],
    "lanthanidesLegend": [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70]
  };
  if (!element || !element.Isotopes) return;
  const isotopes = Object.values(element.Isotopes);
  const slider = document.getElementById('isotopeSlider');
  const btnLeft = document.getElementById('isotopeLeft');
  const btnRight = document.getElementById('isotopeRight');
  slider.innerHTML = "";
  isotopes.forEach(iso => {
    const box = document.createElement('div');
    box.className = 'iso-box';
    box.classList.remove(
    "alkaliMetalsLegend", "metalloidsLegend", "actinidesLegend",
    "alkalineEarthMetalsLegend", "reactiveNonMetalsLegend",
    "unknownElementsLegend", "transitionMetalsLegend",
    "nobleGasesLegend", "postTransitionMetalsLegend", "lanthanidesLegend"
  );
  for (const [className, atomicNumbers] of Object.entries(elementCategories)) {
    if (atomicNumbers.includes(atomicNumber)) {
      box.classList.add(className);
      break;
    }
  }
    box.dataset.isoName = iso.Name;
    box.innerHTML = `
      <div class="iso-symbol">${iso.Symbol}</div>
      <div class="iso-mass">${iso.Mass}</div>
    `;
    box.addEventListener('click', () => showIsotopeInfo(iso));
    slider.appendChild(box);
  });
  btnLeft.onclick = () => {
    slider.scrollBy({ left: -250, behavior: "smooth" });
  };
  btnRight.onclick = () => {
    slider.scrollBy({ left: 250, behavior: "smooth" });
  };
}

function showIsotopeInfo(iso) {
  document.getElementById("isotope-name").textContent = "Name: " + (iso.Name || "N/A");
  document.getElementById("isotope-symbol").textContent = "Symbol: " + (iso.Symbol || "N/A");
  document.getElementById("isotope-neutrons").textContent = "Neutrons: " + (iso.Neutrons || "N/A");
  document.getElementById("isotope-mass").textContent = "Mass: " + (iso.Mass || "N/A");
  document.getElementById("isotope-mass-excess").textContent = "Mass Excess: " + (iso.Mass_Excess || "N/A");
  document.getElementById("element-info-out-natural").textContent = "Natural Abundance: " + (iso.Abundances?.Natural ?? "N/A");
  document.getElementById("element-info-out-solar").textContent = "Solar Abundance: " + (iso.Abundances?.Solar ?? "N/A");
  document.getElementById("element-info-out-universe").textContent = "Universe Abundance: " + (iso.Abundances?.Universe ?? "N/A");
  document.getElementById("isotope-binding-energy").textContent = "Binding Energy: " + (iso.Binding_Energy || "N/A");
  document.getElementById("isotope-decay-energy").textContent = "Decay Energy: " + (iso.Decay_Energy || "N/A");
  document.getElementById("isotope-decay-mode").textContent = "Decay Mode: " + (iso.Decay_Mode || "N/A");
  document.getElementById("isotope-decay-width").textContent = "Decay Width: " + (iso.Decay_Width || "N/A");
  document.getElementById("isotope-half-life").textContent = "Half-Life: " + (iso.Half_Life || "N/A");
  document.getElementById("isotope-mag-moment").textContent = "Magnetic Moment: " + (iso.Magnetic_Moment || "N/A");
  document.getElementById("isotope-quadrupole").textContent = "Quadrupole Moment: " + (iso.Quadrupole_Moment || "N/A");
  document.getElementById("isotope-specific-activity").textContent = "Specific Activity: " + (iso.Specific_Activity || "N/A");
  document.getElementById("isotope-spin").textContent = "Spin: " + (iso.Spin || "N/A");
  document.getElementById("isotope-notes").textContent = "Notes: " + (iso.Notes || "N/A");
  document.getElementById("isotope-use").textContent = "Use: " + (iso.Use || "N/A");
}
document.querySelectorAll('.info-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = 'info-' + btn.dataset.target;
    const panel = document.getElementById(targetId);
    document.querySelectorAll('.info-panel').forEach(p => {
      if (p !== panel) p.classList.remove('active');
    });
    panel.classList.toggle('active');
  });
});
function ptInfoClear() {
  document.getElementById('ptOutElementInfo').classList.remove("visible");
  document.getElementById("ptInfoBtn").classList.add('ptInfoBtnHidden');
  document.getElementById("ptInfoBtn").classList.remove('ptInfoBtnVisible');
}


// ========== GAMES ==========


// --------- Pi Game ---------
const pi = '141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141';
let piIndex = 0;
let mistakesAllowed = 3;
function changePiMode() {
  const piStart = document.getElementById("piStart");
  const piReset = document.getElementById("piReset");
  const piComment = document.getElementById("piComment");
  const mode = document.getElementById("piMode").value;
  const piTestHolder = document.getElementById("piTesterHolder");
  const piPracticeHolder = document.getElementById("piPracticeHolder");
  const piRevealHolder = document.getElementById("piRevealHolder");
  [piTestHolder, piPracticeHolder, piRevealHolder].forEach(el => {
    el.classList.add('piHidden');
    el.classList.remove('piVisible');
  });
  if (mode === 'selectPi') {
    [piTestHolder, piPracticeHolder, piRevealHolder].forEach(el => {
      el.classList.add('piHidden');
      el.classList.remove('piVisible');
    });
    piReset.classList.add('pi-reset-hidden');
    piReset.classList.remove('pi-reset-visible');
    piStart.classList.add('pi-start-hidden');
    piStart.classList.remove('pi-start-visible');
    piComment.classList.add('pi-comment-hidden');
    piComment.classList.remove('pi-comment-visible');
    document.getElementById("piComment").textContent = "";
    document.getElementById("piTestInput").value = "";
  }
  else if (mode === 'testPi') {
    piTestHolder.classList.remove('piHidden');
    piTestHolder.classList.add('piVisible');
    piReset.classList.remove('pi-reset-hidden');
    piReset.classList.add('pi-reset-visible');
    piStart.classList.remove('pi-start-hidden');
    piStart.classList.add('pi-start-visible');
    piComment.classList.remove('pi-comment-hidden');
    piComment.classList.add('pi-comment-visible');
    document.getElementById("piComment").textContent = "";
    document.getElementById("piTestInput").value = "";
  } else if (mode === 'pracPi') {
    piPracticeHolder.classList.remove('piHidden');
    piPracticeHolder.classList.add('piVisible');
    piReset.classList.remove('pi-reset-hidden');
    piReset.classList.add('pi-reset-visible');
    piStart.classList.remove('pi-start-hidden');
    piStart.classList.add('pi-start-visible');
    piComment.classList.remove('pi-comment-hidden');
    piComment.classList.add('pi-comment-visible');
    document.getElementById("piComment").textContent = "";
    document.getElementById("piTestInput").value = "";
  } else {
    piRevealHolder.classList.remove('piHidden');
    piRevealHolder.classList.add('piVisible');
    piReset.classList.add('pi-reset-hidden');
    piReset.classList.remove('pi-reset-visible');
    piStart.classList.add('pi-start-hidden');
    piStart.classList.remove('pi-start-visible');
    piComment.classList.add('pi-comment-hidden');
    piComment.classList.remove('pi-comment-visible');
    document.getElementById("piComment").textContent = "";
    document.getElementById("piTestInput").value = "";
  }
}
function piReset() {
  [document.getElementById("piTesterHolder"), document.getElementById("piPracticeHolder"), document.getElementById("piRevealHolder")].forEach(el => {
    el.classList.add('piHidden');
    el.classList.remove('piVisible');
  });
  document.getElementById("piMode").value = 'selectPi';
  document.getElementById("piReset").classList.add('pi-reset-hidden');
  document.getElementById("piStart").classList.add('pi-start-hidden');
  document.getElementById("piStart").textContent = 'Start';
  document.getElementById("piComment").classList.add('pi-comment-hidden');
  document.getElementById("piComment").classList.remove('pi-comment-visible');
  document.getElementById("piComment").textContent = "";
  document.getElementById("piTestInput").value = "";
  document.getElementById("piInputs").innerHTML = "";
  piIndex = 0;
  mistakesAllowed = 3;
}
function piStart() {
  const piStart = document.getElementById("piStart");
  const mode = document.getElementById("piMode").value;
  if (piStart.textContent === 'Start') {
    document.getElementById("piTestInput").disabled = false;
    if (mode === 'testPi') {
      startPiTest();
    }
    else {
      startPiPractice()
    }
    piStart.textContent = 'Restart';
  }
  else {
    piStart.textContent = 'Start';
    document.getElementById("piComment").textContent = "";
    document.getElementById("piTestInput").value = "";
    document.getElementById("piInputs").innerHTML = "";
    document.getElementById("piTestInput").disabled = false;
  }
}
function startPiTest() {
  const piTestInput = document.getElementById("piTestInput");
  const piComment = document.getElementById("piComment");
  let startTime = 0;
  piIndex = 0;
  startTime = Date.now();
  piComment.textContent = 'Start typing...';
  piTestInput.value = '';
  piTestInput.focus();
  piTestInput.oninput = () => {
    const val = piTestInput.value;
    if (val[val.length - 1] === pi[piIndex]) {
      piIndex++;
    } else {
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      piComment.textContent = `Wrong digit at position ${piIndex + 1}. Time: ${timeTaken}s`;
      piTestInput.disabled = true;
      return;
    }
    if (piIndex >= pi.length) {
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
      piComment.textContent = `Perfect! You typed all ${pi.length} digits correctly in ${totalTime}s!`;
      piTestInput.disabled = true;
    }
  };
}
function startPiPractice() {
  mistakesAllowed = parseInt(document.getElementById("mistakeLimit").value || '3');
  piIndex = 0;
  document.getElementById("piInputs").innerHTML = "";
  createNextPracticeInput();
}
function createNextPracticeInput() {
  const inputContainer = document.getElementById("piInputs");
  const input = document.createElement("input");
  const piComment = document.getElementById("piComment");
  input.type = "text";
  input.inputMode = "numeric";
  input.className = "pi-digit-input";
  input.placeholder = `#${piIndex + 1}`;
  piComment.textContent = 'Start typing...';
  input.addEventListener("input", () => {
    const entered = input.value.trim();
    if (entered === "") {
      input.style.borderColor = "";
      return;
    }
    if (!/^\d$/.test(entered)) {
      piComment.textContent = "Please enter a number.";
      input.value = "";
      input.style.borderColor = "orange";
      return;
    }
    if (entered === pi[piIndex]) {
      input.style.borderColor = "green";
      input.style.transition = "border-color 0.3s";
      piIndex++;
      setTimeout(() => {
        input.style.borderColor = "";
        input.disabled = true;
        if (piIndex < pi.length) createNextPracticeInput();
        else piComment.textContent = `You completed all ${pi.length} digits!`;
      }, 300);
    }
    else {
      input.style.borderColor = "red";
      input.style.transition = "border-color 0.3s";
      mistakesAllowed--;
      if (mistakesAllowed <= 0) {
        piComment.textContent = `You’ve reached the mistake limit. Final digit count: ${piIndex}`;
        disableAllInputs();
      } else {
        piComment.textContent = `Oops, you got that one wrong. Mistakes left: ${mistakesAllowed}. Try again!`;
      }
    }
  });
  inputContainer.appendChild(input);
  input.focus();
}
function disableAllInputs() {
  document.querySelectorAll(".pi-digit-input").forEach(inp => inp.disabled = true);
}


// -------- Math Quiz ---------
let fg2_state = null;
function getSelectedOperations() {
  const ops = [];
  document.querySelectorAll('.operation:checked').forEach(cb => {
    ops.push(cb.value);
  });
  return ops.length > 0 ? ops : ['+'];
}
function fg2_start() {
  const min = toNum(document.getElementById('fg_min').value) ?? 0;
  const max = toNum(document.getElementById('fg_max').value) ?? 10;
  const opsPer = toNum(document.getElementById('fg_ops').value) ?? 1;
  const n = toNum(document.getElementById('fg_n').value) ?? 5;

  if (min >= max) {
    document.getElementById('fg2_area').textContent = 'Minimum number must be less than the maximum number.';
    return;
  }

  const allowed = getSelectedOperations();
  fg2_state = { min, max, opsPer, n, idx: 0, score: 0, allowed };
  fg2_next();
}
function fg2_reset() {
  fg2_state = null;
  document.getElementById('fg2_area').textContent = 'Reset. Configure and press Start.';
}
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function makeExpr(min, max, ops, allowedOps) {
  const nums = [];
  for (let i = 0; i < ops + 1; i++) nums.push(randInt(min, max));
  let expr = '' + nums[0];
  for (let i = 0; i < ops; i++) {
    let op = randChoice(allowedOps);
    let val = nums[i + 1];
    if ((op === '÷' || op === '/' || op === '%') && val === 0) val = 1;
    switch (op) {
      case '*':
        op = '×';
        break;
      case '/':
        op = '÷';
        break;
      case '**':
        op = '^';
        break;
    }
    expr += ` ${op} ${val}`;
  }
  return expr;
}
function toggleDropdown() {
  const dd = document.getElementById('operationDropdown');
  if (!dd) return;
  dd.classList.toggle('open');
  const content = document.getElementById('opsContent');
  const toggle = document.getElementById('opsToggle');
  if (dd.classList.contains('open')) {
    content.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
  } else {
    content.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }
}
const opsToggle = document.getElementById('opsToggle');
if (opsToggle) {
  opsToggle.addEventListener('click', toggleDropdown);
  opsToggle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown(); } });
}
document.addEventListener('click', (e) => {
  const dd = document.getElementById('operationDropdown');
  if (!dd) return;
  if (!dd.contains(e.target)) {
    dd.classList.remove('open');
    document.getElementById('opsContent').setAttribute('aria-hidden', 'true');
    document.getElementById('opsToggle').setAttribute('aria-expanded', 'false');
  }
});
function getSelectedOperations() {
  const boxes = Array.from(document.querySelectorAll('.operation'));
  const ops = boxes.filter(cb => cb.checked).map(cb => cb.value);
  return ops.length ? ops : ['+', '-', '*', '/'];
}
function evalExpr(s) {
  if (!/^[0-9+\-x×÷*/%^().\s]+$/.test(s)) throw new Error('Invalid tokens');
  const safe = s
    .replace(/×|x/g, '*')
    .replace(/÷/g, '/')
    .replace(/\^/g, '**');
  return Function(`"use strict"; return (${safe})`)();
}
function fg2_next() {
  if (!fg2_state) return;

  if (fg2_state.idx >= fg2_state.n) {
    document.getElementById('fg2_area').textContent =
      `Finished! Score: ${fg2_state.score}/${fg2_state.n}`;
    return;
  }

  const expr = makeExpr(fg2_state.min, fg2_state.max, fg2_state.opsPer, fg2_state.allowed);
  let correct;
  try {
    correct = evalExpr(expr);
  } catch (e) {
    return fg2_next();
  }
  correct = Math.round(correct * 100) / 100;

  fg2_state.current = { expr, correct };

  const area = document.getElementById('fg2_area');
  area.innerHTML = `
    Q${fg2_state.idx + 1}/${fg2_state.n}: Solve → ${expr}
    <br><br>
    <input id="fg2_answer" type="number" step="0.01" style="padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.03);background:#071219;color:#e6eef6;font-family:var(--mono)"/>
    <button class="btn" onclick="fg2_submit()">Submit</button>
  `;

  const ansInput = document.getElementById('fg2_answer');
  if (ansInput) ansInput.focus();
}
function fg2_submit() {
  const ansInput = document.getElementById('fg2_answer');
  const ans = ansInput ? Number(ansInput.value) : NaN;

  const correct = Math.round(fg2_state.current.correct * 100) / 100;
  const ok = Math.abs(ans - correct) < 1e-9;

  if (ok) fg2_state.score++;
  fg2_state.idx++;

  document.getElementById('fg2_area').textContent =
    (ok ? 'Correct! ' : 'Incorrect. ') + `Answer: ${fmt(correct)}`;

  setTimeout(fg2_next, 2000);
}
document.addEventListener('DOMContentLoaded', () => {
  const opsToggle = document.getElementById('opsToggle');
  const opsContent = document.getElementById('opsContent');

  if (opsToggle && opsContent) {
    opsToggle.addEventListener('click', () => {
      const expanded = opsToggle.getAttribute('aria-expanded') === 'true';
      opsToggle.setAttribute('aria-expanded', !expanded);
      opsContent.setAttribute('aria-hidden', expanded);
      opsContent.classList.toggle('show');
    });
  }
});

// ---------- Number Guessing ----------
let ng_secret = null, ng_tries = 0;
function ng_start() {
  ng_secret = randInt(1, 100); ng_tries = 0; document.getElementById('ng_out').textContent = 'I picked a number 1–100. Start guessing!';
}
function ng_try() {
  const g = toNum(document.getElementById('ng_guess').value);
  if (g === null) return;
  ng_tries++;
  if (g === ng_secret) { document.getElementById('ng_out').textContent = `🎉 You got it in ${ng_tries} tries!`; ng_secret = null; }
  else if (g < ng_secret) document.getElementById('ng_out').textContent = 'Too low.';
  else document.getElementById('ng_out').textContent = 'Too high.';
}





// ------------- Monopoly -------------
const neutropolisGame = document.getElementById('neutropolisGame');
if (!db || !currentUser) neutropolisGame.classList.add('hidden');
const ngmi = document.getElementById('ngmi');
const jngr = document.getElementById('jngr');
const cngr = document.getElementById('cngr');
const ngrc = document.getElementById('ngrc');
[jngr, cngr, ngrc].forEach(el => {
  if (el) {
    el.classList.remove('visible');
    el.classList.add('hidden');
  }
});
function changengr() {
  const mngr = document.getElementById('mngr').value;
  if (mngr === 'jngr') {
    ngmi.classList.add('hidden');
    jngr.classList.remove('hidden');
    mngr.value = 'selectngr';
  }
  else if (mngr === 'cngr') {
    ngmi.classList.add('hidden');
    cngr.classList.remove('hidden');
    mngr.value = 'selectngr';
  }
}
function backngr() {
  [jngr, cngr, ngrc].forEach(el => {
    if (el) {
      el.classList.remove('visible');
      el.classList.add('hidden');
    }
  });
  ngmi.classList.remove('hidden');
}

async function crngr() {
  if (!db || !currentUser) return;
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  const roomData = {
    public: document.getElementById('ngrRoomPublic').checked,
    maxPlayers: Number(document.getElementById('ngrMaxPlayers').value),
    allowBots: document.getElementById('ngrAllowBots').checked,
    allowMortgage: document.getElementById('ngrAllowMortgage').checked,
    allowPrisonRent: document.getElementById('ngrAllowPrisonRent').checked,
    allowAuction: document.getElementById('ngrAllowAuction').checked,
    allowVacationCash: document.getElementById('ngrAllowVacationCash').checked,
    allowDoubleRentSet: document.getElementById('ngrAllowDoubleRentSet').checked,
    allowEvenBuild: document.getElementById('ngrAllowEvenBuild').checked,
    allowRandomOrder: document.getElementById('ngrAllowRandomPlayerOrder').checked,
    createdBy: currentUser,
    players: {
      [currentUser.uid]: {
        name: currentUser.username || "Player",
        money: 1500,
        position: 0, 
        properties: null
      }
    },
    gameState: {
      started: false,
      turn: currentUser.uid,
      log: ["Room created"]
    }
  };
  await set(ref(db, "rooms/" + code), roomData);
  window.ngrRoomCode = code;
  cngr.classList.add('hidden');
  ngrc.classList.remove('hidden');
  ngrc.classList.add('visible');
  document.getElementById("ngbj").innerText = code;
  loadRoom(window.ngrRoomCode);
}
function loadRoom(code) {
  const roomRef = ref(db, "rooms/" + code);
  onValue(roomRef, snap => {
    const room = snap.val();
    if (!room) return;
    applySettings(room);
    updatePlayerList(room.players);
    updateGameState(room.gameState);
    loadBoardProperties(room.properties || {});
  });
}
function updatePlayerList(players) {
  const container = document.getElementById("ngrcplc");
  container.innerHTML = "";
  Object.entries(players).forEach(([id, p]) => {
    const div = document.createElement("div");
    div.className = "ng-player";
    div.innerHTML = `
      <span class="name">${p.name}</span>
      <span class="money">₦${p.money}</span>
    `;
    container.appendChild(div);
  });
}




const ngrccis = document.getElementById('ngrccis');
const ngrccit = document.getElementById('ngrccit');
const ngrccm = document.getElementById('ngrccm');
ngrccis.addEventListener('click', () => {
  const msg = ngrccit.value.trim();
  if(msg) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('ngrccml', 'player');
    messageEl.textContent = msg;
    ngrccm.appendChild(messageEl);
    ngrccit.value = '';
    ngrccm.scrollTop = ngrccm.scrollHeight;
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.classList.add('ngrccml', 'opponent');
      botMsg.textContent = "Opponent: " + msg.split('').reverse().join('');
      ngrccm.appendChild(botMsg);
      ngrccm.scrollTop = ngrccm.scrollHeight;
    }, 500);
  }
});
ngrccit.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') ngrccis.click();
});


const dices = document.querySelectorAll(".cube");
const baseRotations = {
  1: { x: 0,   y: 0 },
  2: { x: 90,  y: 0 },
  3: { x: 0,   y: -90 },
  4: { x: 0,   y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 180, y: 0 }
};
const diceState = new Map();
dices.forEach(d => diceState.set(d, { x: baseRotations[1].x, y: baseRotations[1].y }));
let currentDiceValue1 = 1;
let currentDiceValue2 = 1;
function norm360(angle) {
  return ((angle % 360) + 360) % 360;
}
function shortestDelta(current, target) {
  const c = norm360(current);
  const t = norm360(target);
  let delta = t - c;
  if (delta <= -180) delta += 360;
  if (delta > 180) delta -= 360;
  return delta;
}
function rollDice(dice) {
  const state = diceState.get(dice);
  const value = Math.floor(Math.random() * 6) + 1;
  const target = baseRotations[value];
  const turnsX = (Math.floor(Math.random() * 5) + 3) * 360;
  const turnsY = (Math.floor(Math.random() * 5) + 3) * 360;
  const deltaX = shortestDelta(state.x, target.x);
  const deltaY = shortestDelta(state.y, target.y);
  const finalX = state.x + turnsX + deltaX;
  const finalY = state.y + turnsY + deltaY;
  dice.style.transition = "transform 2s cubic-bezier(0.25,1,0.5,1)";
  dice.style.transform = `
    rotateX(${finalX}deg)
    rotateY(${finalY}deg)
  `;
  diceState.set(dice, { x: finalX, y: finalY });
  return value;
}
dices.forEach((dice, i) => {
  dice.addEventListener("click", () => {
    dices.forEach((d, idx) => {
      const result = rollDice(d);
      if (idx === 0) currentDiceValue1 = result;
      if (idx === 1) currentDiceValue2 = result;
    });
    const lastDice = dices[dices.length - 1];
    const onEnd = (ev) => {
      if (ev.propertyName && ev.propertyName.includes("transform")) {
        console.log(`Dice 1 value: ${currentDiceValue1}\nDice 2 value: ${currentDiceValue2}`);
        lastDice.removeEventListener("transitionend", onEnd);
      }
    };
    lastDice.addEventListener("transitionend", onEnd);
  });
});



// -------------- Snake Game -------------
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");
const snakeScoreHolder = document.getElementById("snakeScore");
const snakeLeftBtn = document.getElementById("leftSnake");
const snakeUpBtn = document.getElementById("upSnake");
const snakeRightBtn = document.getElementById("rightSnake");
const snakeDownBtn = document.getElementById("downSnake");
const snakeStartBtn = document.getElementById("startSnakeBtn");
const snakePauseBtn = document.getElementById("pauseSnakeBtn");
const snakeSize = Math.floor(window.innerHeight * 0.65);
snakeCanvas.width = 25 * Math.floor(snakeSize / 25);
snakeCanvas.height = 25 * Math.floor(snakeSize / 25);
let snakeBox = Math.floor(snakeSize / 25);
snakeCanvas.width = 25 * snakeBox;
snakeCanvas.height = 25 * snakeBox;
let snake, snakeDirection, snakeFood, snakeScore, snakeFoodsEaten;
let snakeSpecialFood = null;
let snakeHighScore;
if (db && currentUser) {
  db.ref(`users/${currentUser.uid}/highscores/snakeHighScore`).once('value')
    .then(snapshot => {
      snakeHighScore = snapshot.val();
    });
}
else snakeHighScore = parseInt(localStorage.getItem("snakeHighScore")) || 0;
document.getElementById("snakeHighScore").textContent = "High score = " + snakeHighScore;
let snakeSpecialFoodTimer = null;
let snakeSpecialFoodTime = 5000;
let snakePaused = false;
let snakeLastFrameTime = 0;
let snakeMoveDelay = 100;
let snakeAccumulatedTime = 0;
let snakeRunning = false;
function startSnakeGame() {
  snakeMoveDelay = 200;
  snake = [{ x: 3 * snakeBox, y: 3 * snakeBox }];
  snakeDirection = "RIGHT";
  snakeFood = randomFood();
  snakeScore = 0;
  snakeFoodsEaten = 0;
  snakeSpecialFood = null;
  snakePaused = false;
  snakeRunning = true;
  snakeLastFrameTime = 0;
  snakeAccumulatedTime = 0;
  snakePauseBtn.textContent = "Pause";
  snakeCanvas.focus();
  requestAnimationFrame(snakeGameLoop);
}
function randomFood() {
  return {
    x: Math.floor(Math.random() * 25) * snakeBox,
    y: Math.floor(Math.random() * 25) * snakeBox
  };
}
function spawnSpecialFood() {
  snakeSpecialFood = {
    x: Math.floor(Math.random() * 25) * snakeBox,
    y: Math.floor(Math.random() * 25) * snakeBox
  };
  clearTimeout(snakeSpecialFoodTimer);
  snakeSpecialFoodTimer = setTimeout(() => (snakeSpecialFood = null), snakeSpecialFoodTime);
}
function hitSpecialFood(snakeX, snakeY) {
  if (!snakeSpecialFood) return false;
  return (
    snakeX < snakeSpecialFood.x + snakeBox * 2 &&
    snakeX + snakeBox > snakeSpecialFood.x &&
    snakeY < snakeSpecialFood.y + snakeBox * 2 &&
    snakeY + snakeBox > snakeSpecialFood.y
  );
}
function snakeGameCheckCollision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}
snakeStartBtn.onclick = () => {
  if (snakeRunning) startSnakeGame();
  else {
    startSnakeGame();
    snakeStartBtn.textContent = "Restart"
  }
}
snakePauseBtn.addEventListener("click", () => {
  if (!snakeRunning) return;
  snakePaused = !snakePaused;
  snakePauseBtn.textContent = snakePaused ? "Resume" : "Pause";
  if (!snakePaused) requestAnimationFrame(snakeGameLoop);
});
function drawGame() {
  snakeCtx.fillStyle = "#000";
  snakeCtx.fillRect(0, 0, 25 * snakeBox, 25 * snakeBox);
  snakeCtx.beginPath();
  snakeCtx.arc(snakeFood.x + snakeBox / 2, snakeFood.y + snakeBox / 2, snakeBox / 2, 0, Math.PI * 2);
  snakeCtx.fillStyle = "#ac2727ff";
  snakeCtx.fill();
  if (snakeSpecialFood) {
    snakeCtx.beginPath();
    snakeCtx.arc(snakeSpecialFood.x + snakeBox, snakeSpecialFood.y + snakeBox, snakeBox, 0, Math.PI * 2);
    snakeCtx.fillStyle = "gold";
    snakeCtx.fill();
  }
  snake.forEach((segment, index) => {
    snakeCtx.fillStyle = index === 0 ? "rgba(13, 55, 128, 1)" : "rgba(53, 127, 208, 1)";
    snakeCtx.fillRect(segment.x, segment.y, snakeBox, snakeBox);
  });
}
function updateGame() {
  snakeLeftBtn.addEventListener("click", () => { if (snakeDirection !== "RIGHT") snakeDirection = "LEFT"; });
  snakeUpBtn.addEventListener("click", () => { if (snakeDirection !== "DOWN") snakeDirection = "UP"; });
  snakeRightBtn.addEventListener("click", () => { if (snakeDirection !== "LEFT") snakeDirection = "RIGHT"; });
  snakeDownBtn.addEventListener("click", () => { if (snakeDirection !== "UP") snakeDirection = "DOWN"; });
  document.addEventListener("keydown",
    event => {
      if (!snakeRunning) return;
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        event.preventDefault();
      }
      if ((key === "a" || key === "arrowleft") && snakeDirection !== "RIGHT") snakeDirection = "LEFT";
      else if ((key === "w" || key === "arrowup") && snakeDirection !== "DOWN") snakeDirection = "UP";
      else if ((key === "d" || key === "arrowright") && snakeDirection !== "LEFT") snakeDirection = "RIGHT";
      else if ((key === "s" || key === "arrowdown") && snakeDirection !== "UP") snakeDirection = "DOWN";
    },
    { passive: false }
  );
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (snakeDirection === "LEFT") snakeX -= snakeBox;
  if (snakeDirection === "UP") snakeY -= snakeBox;
  if (snakeDirection === "RIGHT") snakeX += snakeBox;
  if (snakeDirection === "DOWN") snakeY += snakeBox;
  if (snakeX === snakeFood.x && snakeY === snakeFood.y) {
    snakeScore += 5;
    snakeFoodsEaten++;
    snakeMoveDelay -= 2.5;
    snakeFood = randomFood();
    if (snakeFoodsEaten % 10 === 0) spawnSpecialFood();
  } else {
    snake.pop();
  }
  if (snakeSpecialFood && hitSpecialFood(snakeX, snakeY)) {
    snakeScore += 50;
    snakeSpecialFood = null;
    clearTimeout(snakeSpecialFoodTimer);
  }
  const newHead = { x: snakeX, y: snakeY };
  if (
    snakeX < 0 || snakeY < 0 ||
    snakeX >= snakeCanvas.width || snakeY >= snakeCanvas.height ||
    snakeGameCheckCollision(newHead, snake)
  ) {
    gameOver();
    return;
  }
  snake.unshift(newHead);
  snakeScoreHolder.textContent = "Score: " + snakeScore;
}
function gameOver() {
  snakeRunning = false;
  clearTimeout(snakeSpecialFoodTimer);
  snake = [];
  snakeFood = null;
  snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  snakeCtx.fillStyle = "#000";
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  snakeCtx.font = "32px Arial";
  snakeCtx.fillStyle = "white";
  snakeCtx.textAlign = "center";
  const cx = snakeCanvas.width / 2;
  const cy = snakeCanvas.height / 2;
  if (db && currentUser) {
    let snakePlayerNameValue;
    db.ref(`users/${currentUser.uid}/username`).once('value')
    .then(snapshot => {
      snakePlayerNameValue = snapshot.val();
    });
    db.ref(`highScores/snakeGame/${currentUser}`).set({
      name: snakePlayerNameValue,
      score: snakeScore
    });
    db.ref(`highScores/snakeGame`).once('value').then(snapshot => {
      const scores = snapshot.val() || {};
      const sorted = Object.values(scores)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      const position = sorted.findIndex(entry => entry.name === snakePlayerNameValue && entry.score === snakeScore) + 1;
      if (position > 0 && position <= 10) {
        if (snakeScore > snakeHighScore) {
          snakeHighScore = snakeScore;
          localStorage.setItem("snakeHighScore", snakeHighScore);
          db.ref(`users/${currentUser.uid}/highscores`).set({
            snakeHighscore: snakeHighScore
          });
          document.getElementById("snakeHighScore").textContent = "High score = " + snakeHighScore;
          snakeCtx.fillStyle = "white";
          snakeCtx.fillText("New High Score: " + snakeHighScore + "!", cx, cy - 40);
        }
        else {
          snakeCtx.fillStyle = "white";
          snakeCtx.fillText(`Game Over! Score: ${snakeScore}`, cx, cy - 40);
        }
        snakeCtx.fillText(`Congrats! You're #${position} on the leaderboard!`, cx, cy + 10);
      } 
      else {
        if (snakeScore > snakeHighScore) {
          snakeHighScore = snakeScore;
          localStorage.setItem("snakeHighScore", snakeHighScore);
          db.ref(`users/${currentUser.uid}/highscores`).set({
            snakeHighscore: snakeHighScore
          });
          document.getElementById("snakeHighScore").textContent = "High score = " + snakeHighScore;
          snakeCtx.fillStyle = "white";
          snakeCtx.fillText("New High Score: " + snakeHighScore + "!", cx, cy - 20);
        }
        else {
          snakeCtx.fillStyle = "white";
          snakeCtx.fillText("Game Over!", cx, cy - 20);
        }
        snakeCtx.fillStyle = "white";
        snakeCtx.fillText(`Score: ${snakeScore}`, cx, cy + 20);
      }
    });
  }
  else {
    if (snakeScore > snakeHighScore) {
      snakeHighScore = snakeScore;
      localStorage.setItem("snakeHighScore", snakeHighScore);
      document.getElementById("snakeHighScore").textContent = "High score = " + snakeHighScore;
      snakeCtx.fillStyle = "white";
      snakeCtx.fillText("New High Score: " + snakeHighScore + "!", cx, cy - 20);
    }
    else {
      snakeCtx.fillStyle = "white";
      snakeCtx.fillText("Game Over!", cx, cy - 20);
    }
    snakeCtx.fillStyle = "white";
    snakeCtx.fillText(`Score: ${snakeScore}`, cx, cy + 20);
  }
  snakeCtx.font = "20px Arial";
  snakeCtx.fillStyle = "white";
  snakeCtx.fillText("Press Restart to Play Again", cx, cy + 90);
}
function showSnakeLeaderScores() {
  const leaderboard = document.getElementById('snakeGameLeaderboard');
  const scoresRef = db.ref(`highScores/snakeGame`);
  scoresRef.off('value');
  scoresRef.on('value', snapshot => {
    const scores = snapshot.val() || {};
    const sorted = Object.values(scores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    leaderboard.innerHTML = '';
    sorted.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name}: ${entry.score}`;
      leaderboard.appendChild(li);
    });
  });
}
function snakeGameLoop(timestamp) {
  if (!snakeRunning) return;
  if (snakePaused) {
    snakeLastFrameTime = timestamp;
    requestAnimationFrame(snakeGameLoop);
    return;
  }
  if (!snakeLastFrameTime) snakeLastFrameTime = timestamp;
  const snakeDeltaTime = timestamp - snakeLastFrameTime;
  snakeLastFrameTime = timestamp;
  snakeAccumulatedTime += snakeDeltaTime;
  if (snakeAccumulatedTime >= snakeMoveDelay) {
    updateGame();
    snakeAccumulatedTime = 0;
  }
  if (!snakeRunning) return;
  drawGame();
  requestAnimationFrame(snakeGameLoop);
}
snakeStartBtn.addEventListener("click", startSnakeGame);

// --------- Jet Shooter Game ----------
const jetShooterCanvas = document.getElementById('jetShooterCanvas');
const jetShooterCtx = jetShooterCanvas.getContext("2d");
const jetShooterScoreHolder = document.getElementById("jetShooterScore");
const jetShooterShieldHolder = document.getElementById("jetShooterShield");
const jetShooterBulletHolder = document.getElementById("jetShooterBullets");
const jetShooterLeftBtn = document.getElementById("leftJetShooter");
const jetShooterRightBtn = document.getElementById("rightJetShooter");
const jetShooterShootBtn = document.getElementById("shootJetShooter");
const jetShooterStartBtn = document.getElementById("startJetShooterBtn");
const jetShooterPauseBtn = document.getElementById("pauseJetShooterBtn");
const jetShooterSize = Math.floor(window.innerHeight * 0.65);
jetShooterCanvas.width = 100 * Math.floor(jetShooterSize / 100);
jetShooterCanvas.height = 100 * Math.floor(jetShooterSize / 100);
let jetShooterBox = Math.floor(jetShooterCanvas.width / 100);
let jetShooterFrameId = null;
let gameFrameId = null;
let jetShooterMessage = "";
let jetShooterMessageTimeout = null;
let movement = 0;
const keys = {};
let lastKeyPressed = null; 
let jetShooterHighScore;
if (db && currentUser) {
  db.ref(`users/${currentUser.uid}/highscores/jetShooterHighScore`).once('value')
    .then(snapshot => {
      jetShooterHighScore = snapshot.val();
    });
}
else jetShooterHighScore = parseInt(localStorage.getItem("jetShooterHighScore")) || 0;
document.getElementById("jetShooterHighScore").textContent = "High score = " + jetShooterHighScore;
let jetShooter, jetShooterBullets, jetShooterEnemies, jetShooterShields, jetShooterBulletBarrel, jetShooterScore;
let jetShooterPaused = false;
let jetShooterRunning = false;
let isShooting = false;
let jetShooterLastFrameTime = 0;
let lastShotTime = 0;
const FIRE_RATE = 100;
let jetShooterEnemyTimer = 0;
let jetShooterShieldTimer = 0;
let jetShooterBulletTimer = 0;
let jetShooterEnemySpawnRate = 2000;
let jetShooterBulletBarrelRate = 10000;
let jetShooterShieldSpawnRate = 15000;
let jetShooterHasShield = 0;
let jetShooterBulletRemaining = 100;
function jetShooterGameStart() {
  if (jetShooterFrameId) cancelAnimationFrame(jetShooterFrameId);
  if (gameFrameId) cancelAnimationFrame(gameFrameId);
  jetShooterLastFrameTime = 0;
  jetShooterPaused = false;
  jetShooterRunning = true;
  jetShooter = { x: 50 * jetShooterBox, y: 95 * jetShooterBox, size: jetShooterBox * 4 };
  jetShooterBullets = [];
  jetShooterEnemies = [];
  jetShooterShields = [];
  jetShooterBulletBarrel = [];
  jetShooterScore = 0;
  jetShooterEnemyTimer = 0;
  jetShooterShieldTimer = 0;
  jetShooterBulletTimer = 0;
  jetShooterHasShield = 0;
  jetShooterBulletRemaining = 100;
  jetShooterPauseBtn.textContent = "Pause";
  jetShooterCanvas.focus();
  jetShooterLastFrameTime = performance.now();
  jetShooterFrameId = requestAnimationFrame(jetShooterGameLoop);
  gameFrameId = requestAnimationFrame(gameLoop);
}
function jetShooterGameLoop(timestamp) {
  if (!jetShooterRunning) return;
  if (jetShooterPaused) {
    jetShooterFrameId = requestAnimationFrame(jetShooterGameLoop);
    return;
  }
  const delta = timestamp - jetShooterLastFrameTime;
  jetShooterLastFrameTime = timestamp;
  updateJetShooter(delta);
  drawJetShooter();
  jetShooterFrameId = requestAnimationFrame(jetShooterGameLoop);
}
function updateJetShooter(delta) {
  jetShooterBullets.forEach(b => (b.y -= b.speed));
  jetShooterBullets = jetShooterBullets.filter(b => b.y + b.size > 0);
  jetShooterEnemyTimer += delta;
  if (jetShooterEnemyTimer > jetShooterEnemySpawnRate) {
    spawnEnemy();
    jetShooterEnemyTimer = 0;
  }
  jetShooterShieldTimer += delta;
  if (jetShooterShieldTimer > jetShooterShieldSpawnRate) {
    spawnShield();
    jetShooterShieldTimer = 0;
  }
  jetShooterBulletTimer += delta;
  if (jetShooterBulletTimer > jetShooterBulletBarrelRate) {
    spawnBulletBarrel();
    jetShooterBulletTimer = 0;
  }
  jetShooterEnemies.forEach(e => (e.y += e.speed));
  jetShooterEnemies = jetShooterEnemies.filter(e => e.y < jetShooterCanvas.height);
  jetShooterShields.forEach(s => {
    s.y += s.speedY;
    s.angle += s.oscillationSpeed;
    s.x = s.baseX + Math.sin(s.angle) * s.amplitude;
  });
  jetShooterBulletBarrel.forEach(b => {
    b.y += b.speedY;
    b.angle += b.oscillationSpeed;
    b.x = b.baseX + Math.sin(b.angle) * b.amplitude;
  });
  jetShooterShields = jetShooterShields.filter(s => s.y < jetShooterCanvas.height);
  for (let i = jetShooterEnemies.length - 1; i >= 0; i--) {
    for (let j = jetShooterBullets.length - 1; j >= 0; j--) {
      if (jetShooterCheckCollision(jetShooterEnemies[i], jetShooterBullets[j])) {
        jetShooterEnemies.splice(i, 1);
        jetShooterBullets.splice(j, 1);
        jetShooterScore += 10;
        break;
      }
    }
  }
  for (let i = 0; i < jetShooterEnemies.length; i++) {
    if (jetShooterCheckCollision(jetShooterEnemies[i], jetShooter)) {
      if (jetShooterHasShield >= 1) {
        jetShooterHasShield--;
        jetShooterShieldHolder.textContent = "Shields: " + jetShooterHasShield;
        jetShooterEnemies.splice(i, 1);
        break;
      } else {
        jetShooterGameOver();
        return;
      }
    }
    if (jetShooterEnemies[i].y + jetShooterEnemies[i].size >= jetShooterCanvas.height) {
      jetShooterScoreHolder.textContent = "Score: " + jetShooterScore;
      jetShooterEnemies.splice(i, 1);
    }
  }
  for (let i = 0; i < jetShooterShields.length; i++) {
    if (jetShooterCheckCollision(jetShooterShields[i], jetShooter)) {
      jetShooterExtraLife();
      jetShooterShields.splice(i, 1);
      break;
    }
  }
  for (let i = 0; i < jetShooterBulletBarrel.length; i++) {
    if (jetShooterCheckCollision(jetShooterBulletBarrel[i], jetShooter)) {
      jetShooterAddBullets();
      jetShooterBulletBarrel.splice(i, 1);
      break;
    }
  }
}
function drawJetShooter() {
  jetShooterCtx.clearRect(0, 0, jetShooterCanvas.width, jetShooterCanvas.height);
  const jx = jetShooter.x + jetShooter.size / 2;
  const jy = jetShooter.y + jetShooter.size / 2;
  jetShooterCtx.beginPath();
  jetShooterCtx.moveTo(jx, jetShooter.y - jetShooter.size * 0.3);
  jetShooterCtx.lineTo(jx - jetShooter.size * 0.35, jetShooter.y + jetShooter.size * 0.9);
  jetShooterCtx.lineTo(jx + jetShooter.size * 0.35, jetShooter.y + jetShooter.size * 0.9);
  jetShooterCtx.closePath();
  jetShooterCtx.fillStyle = jetShooterHasShield >= 1 ? "#6aff91" : "cyan";
  jetShooterCtx.fill();
  jetShooterCtx.strokeStyle = "#00bcd4";
  jetShooterCtx.lineWidth = 2;
  jetShooterCtx.stroke();
  jetShooterCtx.beginPath();
  jetShooterCtx.ellipse(
    jx,
    jetShooter.y + jetShooter.size * 0.25,
    jetShooter.size * 0.15,
    jetShooter.size * 0.25,
    0,
    0,
    Math.PI * 2
  );
  jetShooterCtx.fillStyle = "rgba(0, 150, 255, 0.6)";
  jetShooterCtx.fill();
  jetShooterCtx.strokeStyle = "white";
  jetShooterCtx.lineWidth = 1.5;
  jetShooterCtx.stroke();
  jetShooterCtx.beginPath();
  jetShooterCtx.moveTo(jx - jetShooter.size * 0.6, jetShooter.y + jetShooter.size * 0.4);
  jetShooterCtx.lineTo(jx + jetShooter.size * 0.6, jetShooter.y + jetShooter.size * 0.4);
  jetShooterCtx.lineTo(jx + jetShooter.size * 0.3, jetShooter.y + jetShooter.size * 0.7);
  jetShooterCtx.lineTo(jx - jetShooter.size * 0.3, jetShooter.y + jetShooter.size * 0.7);
  jetShooterCtx.closePath();
  jetShooterCtx.fillStyle = jetShooterHasShield >= 1 ? "#7affb2" : "#00bcd4";
  jetShooterCtx.fill();
  jetShooterCtx.strokeStyle = "#007bff";
  jetShooterCtx.stroke();
  const gradient = jetShooterCtx.createRadialGradient(jx, jetShooter.y + jetShooter.size * 0.95, 2, jx, jetShooter.y + jetShooter.size * 0.95, 20);
  gradient.addColorStop(0, "rgba(255, 150, 0, 0.9)");
  gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
  jetShooterCtx.beginPath();
  jetShooterCtx.fillStyle = gradient;
  jetShooterCtx.arc(jx, jetShooter.y + jetShooter.size * 0.95, jetShooter.size * 0.25, 0, Math.PI * 2);
  jetShooterCtx.fill();

  jetShooterCtx.fillStyle = "yellow";
  jetShooterBullets.forEach(b => {
    jetShooterCtx.fillRect(b.x, b.y, b.size, b.size * 2);
  });
  jetShooterEnemies.forEach(e => {
    const cx = e.x + e.size / 2;
    const cy = e.y + e.size / 2;
    jetShooterCtx.fillStyle = "silver";
    jetShooterCtx.beginPath();
    jetShooterCtx.moveTo(cx, e.y + e.size);
    jetShooterCtx.lineTo(e.x, e.y);
    jetShooterCtx.lineTo(e.x + e.size, e.y);
    jetShooterCtx.closePath();
    jetShooterCtx.fill();
    jetShooterCtx.fillStyle = "cyan";
    jetShooterCtx.beginPath();
    jetShooterCtx.arc(cx, e.y + e.size * 0.55, e.size * 0.15, 0, Math.PI * 2);
    jetShooterCtx.fill();
    jetShooterCtx.fillStyle = "orange";
    jetShooterCtx.beginPath();
    jetShooterCtx.moveTo(cx - e.size * 0.15, e.y);
    jetShooterCtx.lineTo(cx + e.size * 0.15, e.y);
    jetShooterCtx.lineTo(cx, e.y - e.size * 0.3);
    jetShooterCtx.closePath();
    jetShooterCtx.fill();
  });
  jetShooterShields.forEach(s => {
    jetShooterCtx.beginPath();
    jetShooterCtx.moveTo(s.x + s.size / 2, s.y);
    jetShooterCtx.lineTo(s.x, s.y + s.size * 0.4);
    jetShooterCtx.quadraticCurveTo(
      s.x + s.size * 0.1,
      s.y + s.size * 0.9,
      s.x + s.size / 2,
      s.y + s.size
    );
    jetShooterCtx.quadraticCurveTo(
      s.x + s.size * 0.9,
      s.y + s.size * 0.9,
      s.x + s.size,
      s.y + s.size * 0.4
    );
    jetShooterCtx.closePath();
    jetShooterCtx.fillStyle = "lightgreen";
    jetShooterCtx.fill();
    jetShooterCtx.strokeStyle = "white";
    jetShooterCtx.lineWidth = 2;
    jetShooterCtx.stroke();
  });
  jetShooterBulletBarrel.forEach(b => {
    const cx = b.x + b.size / 2;
    const cy = b.y + b.size / 2;
    const w = b.size * 0.6;
    const h = b.size * 1.4;
    jetShooterCtx.beginPath();
    jetShooterCtx.moveTo(cx - w / 2, cy - h / 4);
    jetShooterCtx.lineTo(cx - w / 2, cy + h / 2);
    jetShooterCtx.lineTo(cx + w / 2, cy + h / 2);
    jetShooterCtx.lineTo(cx + w / 2, cy - h / 4);
    jetShooterCtx.closePath();
    jetShooterCtx.fillStyle = "gold";
    jetShooterCtx.fill();
    jetShooterCtx.strokeStyle = "#b8860b";
    jetShooterCtx.lineWidth = 2;
    jetShooterCtx.stroke();
    jetShooterCtx.beginPath();
    jetShooterCtx.moveTo(cx - w / 2, cy - h / 4);
    jetShooterCtx.lineTo(cx + w / 2, cy - h / 4);
    jetShooterCtx.lineTo(cx, cy - h / 2);
    jetShooterCtx.closePath();
    jetShooterCtx.fillStyle = "silver";
    jetShooterCtx.fill();
    jetShooterCtx.strokeStyle = "#999";
    jetShooterCtx.stroke();
  });
  jetShooterScoreHolder.textContent = "Score: " + jetShooterScore;
  jetShooterBulletHolder.textContent = "Bullets remaining: " + jetShooterBulletRemaining;
  jetShooterShieldHolder.textContent = "Shields: " + jetShooterHasShield;
  if (jetShooterMessage) {
    jetShooterCtx.save();
    jetShooterCtx.font = "28px Arial";
    jetShooterCtx.fillStyle = "white";
    jetShooterCtx.textAlign = "center";
    const cx = jetShooterCanvas.width / 2;
    const cy = jetShooterCanvas.height / 3;
    jetShooterCtx.fillText(jetShooterMessage, cx, cy);
    jetShooterCtx.restore();
  }
}
function jetShooterCheckCollision(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}
function spawnShield() {
  const size = jetShooterBox * 3;
  const y = -size;
  const speedY = 3 + Math.random() * 4;
  const baseX = Math.random() * (jetShooterCanvas.width - size);
  const amplitude = 100 + (Math.random() * 100);
  const oscillationSpeed = 0.02 + (Math.random() * 0.03);
  const angle = Math.random() * Math.PI / 180;
  const x = baseX + Math.sin(angle) * amplitude;
  jetShooterShields.push({
    x,
    y,
    size,
    speedY,
    baseX,
    angle,
    amplitude,
    oscillationSpeed
  });
}
function spawnBulletBarrel() {
  const size = jetShooterBox * 3;
  const y = -size;
  const speedY = 3 + Math.random() * 4;
  const baseX = Math.random() * (jetShooterCanvas.width - size);
  const amplitude = 30 + (Math.random() * 30);
  const oscillationSpeed = 0.02 + (Math.random() * 0.03);
  const angle = Math.random() * Math.PI / 180;
  const x = baseX + Math.sin(angle) * amplitude;
  jetShooterBulletBarrel.push({
    x,
    y,
    size,
    speedY,
    baseX,
    angle,
    amplitude,
    oscillationSpeed
  });
}
function spawnEnemy() {
  const size = jetShooterBox * 4;
  const x = Math.random() * (jetShooterCanvas.width - size);
  const y = -size;
  const speed = Math.random() * 16 + 4;
  jetShooterEnemies.push({ x, y, size, speed });
}
jetShooterStartBtn.onclick = () => {
  if (jetShooterRunning) jetShooterGameStart();
  else {
    jetShooterGameStart();
    jetShooterStartBtn.textContent = "Restart"
  }
}
jetShooterPauseBtn.onclick = () => {
  if (!jetShooterRunning) return;
  jetShooterPaused = !jetShooterPaused;
  jetShooterPauseBtn.textContent = jetShooterPaused ? "Resume" : "Pause";
};
document.addEventListener("keydown", (e) => {
  if (!jetShooterRunning) return;
  const key = e.key.toLowerCase();
  keys[key] = true;
  if (["arrowleft", "arrowright", "a", "d", " "].includes(key)) e.preventDefault();
  if (!jetShooterPaused) {
    if (key === "arrowleft" || key === "a" || key === "arrowright" || key === "d") lastKeyPressed = key;
    if (lastKeyPressed === "arrowleft" || lastKeyPressed === "a") movement = -1;
    else if (lastKeyPressed === "arrowright" || lastKeyPressed === "d") movement = 1;
    else movement = 0;
  } 
  else movement = 0;
  if (key === " " && !jetShooterPaused) {
    if (jetShooterBulletRemaining === 0) { isShooting = false; noBulletJetShooter(); } 
    else isShooting = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (!jetShooterRunning) return;
  const key = e.key.toLowerCase();
  keys[key] = false;
  if (key === lastKeyPressed) {
    if (keys["arrowright"] || keys["d"]) lastKeyPressed = keys["arrowright"] ? "arrowright" : "d";
    else if (keys["arrowleft"] || keys["a"]) lastKeyPressed = keys["arrowleft"] ? "arrowleft" : "a";
    else lastKeyPressed = null;
  }
  if (!jetShooterPaused) {
    if (lastKeyPressed === "arrowleft" || lastKeyPressed === "a") movement = -1;
    else if (lastKeyPressed === "arrowright" || lastKeyPressed === "d") movement = 1;
    else movement = 0;
  } 
  else movement = 0;
  if (key === " " && isShooting) isShooting = false;
});
jetShooterLeftBtn.addEventListener('mousedown', () => { if (!jetShooterRunning) { return; } jetShooterPaused === true ? movement = 0 : movement = -1; });
jetShooterLeftBtn.addEventListener('mouseup', () => { if (movement === -1) movement = 0; });
jetShooterLeftBtn.addEventListener('mouseleave', () => { if (movement === -1) movement = 0; });
jetShooterRightBtn.addEventListener('mousedown', () => { if (!jetShooterRunning) { return; } jetShooterPaused === true ? movement = 0 : movement = 1; });
jetShooterRightBtn.addEventListener('mouseup', () => { if (movement === 1) movement = 0; });
jetShooterRightBtn.addEventListener('mouseleave', () => { if (movement === 1) movement = 0; });
jetShooterShootBtn.addEventListener('mousedown', () => { if (!jetShooterRunning) { return; } if (jetShooterPaused) isShooting = false; else jetShooterBulletRemaining === 0 ? noBulletJetShooter() : isShooting = true; });
jetShooterShootBtn.addEventListener('mouseup', () => { isShooting = false; });
jetShooterShootBtn.addEventListener('mouseleave', () => { isShooting = false; });
jetShooterLeftBtn.addEventListener('touchstart', (e) => { if (!jetShooterRunning) { return; } e.preventDefault(); jetShooterPaused === true ? movement = 0 : movement = -1; }, { passive: false });
jetShooterLeftBtn.addEventListener('touchend', () => { if (movement === -1) movement = 0; });
jetShooterLeftBtn.addEventListener('touchcancel', () => { if (movement === -1) movement = 0; });
jetShooterRightBtn.addEventListener('touchstart', (e) => { if (!jetShooterRunning) { return; } e.preventDefault(); jetShooterPaused === true ? movement = 0 : movement = 1; }, { passive: false });
jetShooterRightBtn.addEventListener('touchend', () => { if (movement === 1) movement = 0; });
jetShooterRightBtn.addEventListener('touchcancel', () => { if (movement === 1) movement = 0; });
jetShooterShootBtn.addEventListener('touchstart', (e) => { if (!jetShooterRunning) { return; } e.preventDefault(); if (jetShooterPaused) isShooting = false; else jetShooterBulletRemaining === 0 ? noBulletJetShooter() : isShooting = true; }, { passive: false });
jetShooterShootBtn.addEventListener('touchend', () => { isShooting = false; });
jetShooterShootBtn.addEventListener('touchcancel', () => { isShooting = false; });
function gameLoop() {
  if (movement === -1) moveJetShooter(-0.25);
  else if (movement === 1) moveJetShooter(0.25);
  const now = performance.now();
  if (isShooting && (now - lastShotTime > FIRE_RATE)) {
    if (jetShooterBulletRemaining === 0) noBulletJetShooter();
    else {
    shootJetShooter();
    lastShotTime = now;
    }
  }
  gameFrameId = requestAnimationFrame(gameLoop);
}
gameLoop();
function moveJetShooter(dir) {
  const step = jetShooterBox * 3;
  const newX = jetShooter.x + dir * step;
  if (newX >= 0 && newX + jetShooter.size <= jetShooterCanvas.width) {
    jetShooter.x = newX;
  }
}
function shootJetShooter() {
  jetShooterBullets.push({
    x: jetShooter.x + jetShooter.size / 2 - 2,
    y: jetShooter.y - 10,
    size: 4,
    speed: 15,
  });
  jetShooterBulletRemaining--;
  jetShooterBulletHolder.textContent = "Bullets remaining: " + jetShooterBulletRemaining;
}
function jetShooterExtraLife() {
  jetShooterHasShield++;
  jetShooterShieldHolder.textContent = "Shields: " + jetShooterHasShield;
}
function jetShooterAddBullets() {
  jetShooterBulletRemaining += 100;
  jetShooterBulletHolder.textContent = "Bullets remaining: " + jetShooterBulletRemaining;
}
function noBulletJetShooter(duration = 1500) {
  if (jetShooterMessageTimeout) {
    clearTimeout(jetShooterMessageTimeout);
    jetShooterMessageTimeout = null;
  }
  jetShooterMessage = "No bullets remaining! Capture a bullet barrel.";
  jetShooterMessageTimeout = setTimeout(() => {
    jetShooterMessage = "";
    jetShooterMessageTimeout = null;
  }, duration);
}
function jetShooterGameOver() {
  jetShooterRunning = false;
  jetShooterEnemies = [];
  jetShooterBullets = [];
  jetShooterShields = [];
  jetShooterBulletBarrel = [];
  requestAnimationFrame(() => {
    jetShooterCtx.clearRect(0, 0, jetShooterCanvas.width, jetShooterCanvas.height);
    jetShooterCtx.font = "32px Arial";
    jetShooterCtx.fillStyle = "white";
    jetShooterCtx.textAlign = "center";
    const cx = jetShooterCanvas.width / 2;
    const cy = jetShooterCanvas.height / 2;
    if (db && currentUser) {
      let jetPlayerNameValue;
      db.ref(`users/${currentUser.uid}/username`).once('value')
      .then(snapshot => {
        jetPlayerNameValue = snapshot.val();
      });
      db.ref(`highScores/jetShooterGame/${currentUser}`).set({
        name: jetPlayerNameValue,
        score: jetShooterScore
      });
      db.ref(`highScores/jetShooterGame`).once('value').then(snapshot => {
        const scores = snapshot.val() || {};
        const sorted = Object.values(scores)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        const position = sorted.findIndex(entry => entry.name === jetPlayerNameValue && entry.score === snakeScore) + 1;
        if (position > 0 && position <= 10) {
          if (jetShooterScore > jetShooterHighScore) {
            jetShooterHighScore = jetShooterScore;
            localStorage.setItem("jetShooterHighScore", jetShooterHighScore);
            db.ref(`users/${currentUser.uid}/highscores`).set({
              jetShooterHighScore: jetShooterHighScore
            });
            document.getElementById("jetShooterHighScore").textContent = "High score = " + jetShooterHighScore;
            jetShooterCtx.fillText("New High Score: " + jetShooterHighScore + "!", cx, cy + 40);
          }
          else jetShooterCtx.fillText(`Game Over! Score: ${jetShooterScore}`, cx, cy - 40);
          jetShooterCtx.fillText(`Congrats! You're #${position} on the leaderboard!`, cx, cy + 10);
        } 
        else {
          jetShooterCtx.fillText("GAME OVER!", cx, cy - 40);
          if (jetShooterScore > jetShooterHighScore) {
            jetShooterHighScore = jetShooterScore;
            localStorage.setItem("jetShooterHighScore", jetShooterHighScore);
            db.ref(`users/${currentUser.uid}/highscores`).set({
              jetShooterHighScore: jetShooterHighScore
            });
            document.getElementById("jetShooterHighScore").textContent = "High score = " + jetShooterHighScore;
            jetShooterCtx.fillText("New High Score: " + jetShooterHighScore + "!", cx, cy + 40);
          }
          else jetShooterCtx.fillText("Score: " + jetShooterScore, cx, cy);
        }
      });
    }
    else {
      jetShooterCtx.fillText("GAME OVER!", cx, cy - 40);
      if (jetShooterScore > jetShooterHighScore) {
        jetShooterHighScore = jetShooterScore;
        localStorage.setItem("jetShooterHighScore", jetShooterHighScore);
        document.getElementById("jetShooterHighScore").textContent = "High score = " + jetShooterHighScore;
        jetShooterCtx.fillText("New High Score: " + jetShooterHighScore + "!", cx, cy + 40);
      }
      else jetShooterCtx.fillText("Score: " + jetShooterScore, cx, cy);
    }
    jetShooterCtx.font = "20px Arial";
    jetShooterCtx.fillText("Press Restart to Play Again", cx, cy + 90);
  });
}
function showJetShooterLeaderScores() {
  const leaderboard = document.getElementById('jetShooterGameLeaderboard');
  const scoresRef = db.ref(`highScores/jetShooterGame`);
  scoresRef.off('value');
  scoresRef.on('value', snapshot => {
    const scores = snapshot.val() || {};
    const sorted = Object.values(scores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    leaderboard.innerHTML = '';
    sorted.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name}: ${entry.score}`;
      leaderboard.appendChild(li);
    });
  });
}

// ========== UTILITIES =============

// -------- UNIT CONVERTER ----------
const unitGroups = {
  length: `
    <option value="ℓp">Planck length (ℓp)</option>
    <option value="qm">Quecto-meter (qm)</option>
    <option value="rm">Ronto-meter (rm)</option>
    <option value="ym">Yocto-meter (ym)</option>
    <option value="zm">Zepto-meter (zm)</option>
    <option value="am">Atto-meter (am)</option>
    <option value="fm">Femto-meter (fm)</option>
    <option value="pm">Pico-meter (pm)</option>
    <option value="nm">Nano-meter (nm)</option>
    <option value="µm">Micro-meter (µm)</option>
    <option value="mm">Millimeter (mm)</option>
    <option value="cm">Centimeter (cm)</option>
    <option value="dm">Decimeter (dm)</option>
    <option value="m">Meter (m)</option>
    <option value="km">Kilometer (km)</option>
    <option value="Mm">Megameter (Mm)</option>
    <option value="Gm">Gigameter (Gm)</option>
    <option value="Tm">Terameter (Tm)</option>
    <option value="Pm">Petameter (Pm)</option>
    <option value="Em">Exameter (Em)</option>
    <option value="Zm">Zettameter (Zm)</option>
    <option value="Ym">Yottameter (Ym)</option>
    <option value="Rm">Ronnameter (Rm)</option>
    <option value="bohrRadius">Bohr radius</option>
    <option value="classicalElectronRadius">Classical electron radius</option>
    <option value="comptonWavelength">Compton wavelength</option>
    <option value="inch">Inch (in)</option>
    <option value="foot">Foot (ft)</option>
    <option value="yard">Yard (yd)</option>
    <option value="mile">Mile (mi)</option>
    <option value="nauticalMile">Nautical mile (nmi)</option>
    <option value="fathom">Fathom</option>
    <option value="rod">Rod</option>
    <option value="chain">Chain</option>
    <option value="cubit">Cubit</option>
    <option value="span">Span</option>
    <option value="angstrom">Angstrom (Å)</option>
    <option value="au">Astronomical unit (au)</option>
    <option value="ly">Light-year (ly)</option>
    <option value="kly">Kilolight-year (kly)</option>
    <option value="Mly">Megalight-year (Mly)</option>
    <option value="Gly">Gigalight-year (Gly)</option>
    <option value="pc">Parsec (pc)</option>
    <option value="kpc">Kiloparsec (kpc)</option>
    <option value="Mpc">Megaparsec (Mpc)</option>
    <option value="Gpc">Gigaparsec (Gpc)</option>
    <option value="Tpc">Teraparsec (Tpc)</option>
    <option value="Ppc">Petaparsec (Ppc)</option>
    <option value="Epc">Exaparsec (Epc)</option>
    <option value="Zpc">Zettaparsec (Zpc)</option>
    <option value="Ypc">Yottaparsec (Ypc)</option>
  `,
  mass: `
    <option value="qg">Quectogram (qg)</option>
    <option value="rg">Rontogram (rg)</option>
    <option value="yg">Yoctogram (yg)</option>
    <option value="zg">Zeptogram (zg)</option>
    <option value="ag">Attogram (ag)</option>
    <option value="fg">Femtogram (fg)</option>
    <option value="pg">Picogram (pg)</option>
    <option value="ng">Nanogram (ng)</option>
    <option value="µg">Microgram (µg)</option>
    <option value="mg">Milligram (mg)</option>
    <option value="g">Gram (g)</option>
    <option value="dag">Decagram (dag)</option>
    <option value="hg">Hectogram (hg)</option>
    <option value="kg">Kilogram (kg)</option>
    <option value="Mg">Megagram (Mg)</option>
    <option value="Gg">Gigagram (Gg)</option>
    <option value="Tg">Teragram (Tg)</option>
    <option value="Pg">Petagram (Pg)</option>
    <option value="Eg">Exagram (Eg)</option>
    <option value="Zg">Zettagram (Zg)</option>
    <option value="Yg">Yottagram (Yg)</option>
    <option value="Rg">Ronnagram (Rg)</option>
    <option value="Qg">Quettagram (Qg)</option>
    <option value="ounce">Ounce (oz)</option>
    <option value="pound">Pound (lb)</option>
    <option value="stone">Stone (st)</option>
    <option value="quarter">UK Quarter</option>
    <option value="hundredweight">UK Hundredweight</option>
    <option value="tonUK">Ton (UK)</option>
    <option value="tonUS">Ton (US)</option>
    <option value="electronMass">Electron mass</option>
    <option value="protonMass">Proton mass</option>
    <option value="neutronMass">Neutron mass</option>
    <option value="atomicMassUnit">Atomic mass unit (u)</option>
    <option value="earthMass">Earth mass</option>
    <option value="sunMass">Sun mass</option>
    <option value="jupiterMass">Jupiter mass</option>
  `,
  area: `
    <option value="mm2">Square millimeter (mm²)</option>
    <option value="cm2">Square centimeter (cm²)</option>
    <option value="dm2">Square decimeter (dm²)</option>
    <option value="m2">Square meter (m²)</option>
    <option value="km2">Square kilometer (km²)</option>
    <option value="are">Are</option>
    <option value="hectare">Hectare (ha)</option>
    <option value="in2">Square inch (in²)</option>
    <option value="ft2">Square foot (ft²)</option>
    <option value="yd2">Square yard (yd²)</option>
    <option value="mi2">Square mile (mi²)</option>
    <option value="rod2">Square rod</option>
    <option value="chain2">Square chain</option>
    <option value="acre">Acre</option>
    <option value="dunam">Dunam</option>
    <option value="barn">Barn</option>
  `,
  volume: `
    <option value="mm3">Cubic millimeter (mm³)</option>
    <option value="cm3">Cubic centimeter (cm³)</option>
    <option value="dm3">Cubic decimeter (dm³)</option>
    <option value="m3">Cubic meter (m³)</option>
    <option value="km3">Cubic kilometer (km³)</option>
    <option value="milliliter">Milliliter (mL)</option>
    <option value="liter">Liter (L)</option>
    <option value="in3">Cubic inch (in³)</option>
    <option value="ft3">Cubic foot (ft³)</option>
    <option value="yd3">Cubic yard (yd³)</option>
    <option value="cup">Cup</option>
    <option value="tbsp">Tablespoon</option>
    <option value="tsp">Teaspoon</option>
    <option value="pt">Pint (pt)</option>
    <option value="qt">Quart (qt)</option>
    <option value="gal">Gallon (gal)</option>
    <option value="bbl">Barrel (bbl)</option>
    <option value="acre_ft">Acre-foot</option>
    <option value="cord">Cord</option>
    <option value="hogshead">Hogshead</option>
  `,
  angle: `
    <option value="radUnit">Radian (rad)</option>
    <option value="degUnit">Degree (°)</option>
    <option value="arcminUnit">Arcminute (′)</option>
    <option value="arcsecUnit">Arcsecond (″)</option>
    <option value="rev">Revolution (rev)</option>
    <option value="gradUnit">Grad (gon)</option>
    <option value="mradUnit">Milliradian (mrad)</option>
  `,
  temperature: `
    <option value="K">Kelvin (K)</option>
    <option value="C">Celsius (°C)</option>
    <option value="F">Fahrenheit (°F)</option>
    <option value="R">Rankine (°R)</option>
    <option value="Re">Réaumur (°Re)</option>
    <option value="De">Delisle (°De)</option>
    <option value="N">Newton (°N)</option>
    <option value="Ro">Rømer (°Ro)</option>
    <option value="gasMark">Gas mark</option>
    <option value="Leiden">Leiden</option>
    <option value="Planck">Planck temperature</option>
    <option value="triplePointWater">Triple point of water</option>
  `,
  energy: `
    <option value="J">Joule (J)</option>
    <option value="kJ">Kilojoule (kJ)</option>
    <option value="MJ">Megajoule (MJ)</option>
    <option value="GJ">Gigajoule (GJ)</option>
    <option value="TJ">Terajoule (TJ)</option>
    <option value="PJ">Petajoule (PJ)</option>
    <option value="EJ">Exajoule (EJ)</option>
    <option value="ZJ">Zettajoule (ZJ)</option>
    <option value="YJ">Yottajoule (YJ)</option>
    <option value="cal">Calorie (cal)</option>
    <option value="kcal">Kilocalorie (kcal)</option>
    <option value="Wh">Watt-hour (Wh)</option>
    <option value="kWh">Kilowatt-hour (kWh)</option>
    <option value="MWh">Megawatt-hour (MWh)</option>
    <option value="GWh">Gigawatt-hour (GWh)</option>
    <option value="eV">Electronvolt (eV)</option>
    <option value="keV">Kiloelectronvolt (keV)</option>
    <option value="MeV">Megaelectronvolt (MeV)</option>
    <option value="GeV">Gigaelectronvolt (GeV)</option>
    <option value="TeV">Teraelectronvolt (TeV)</option>
    <option value="erg">Erg</option>
    <option value="BTU">BTU (British Thermal Unit)</option>
    <option value="kcal_IT">Kilocalorie IT</option>
    <option value="tonTNT">Ton TNT</option>
    <option value="ft_lb">Foot-pound force</option>
    <option value="in_lb">Inch-pound force</option>
    <option value="hartree">Hartree</option>
    <option value="rydberg">Rydberg energy</option>
    <option value="planckEnergy">Planck energy</option>
  `,
  speed: `
    <option value="mps">Meter/second (m/s)</option>
    <option value="cmps">Centimeter/second (cm/s)</option>
    <option value="kmps">Kilometer/second (km/s)</option>
    <option value="kmph">Kilometer/hour (km/h)</option>
    <option value="mpm">Meter/minute (m/min)</option>
    <option value="mph">Mile/hour (mph)</option>
    <option value="fps">Foot/second (ft/s)</option>
    <option value="knots">Knot (kn)</option>
    <option value="c">Speed of light (c)</option>
    <option value="ly_per_year">Light-year per year</option>
    <option value="au_per_day">Astronomical unit/day</option>
    <option value="mach">Mach</option>
    <option value="planckSpeed">Planck speed</option>
  `,
  frequency: `
    <option value="Hz">Hertz (Hz)</option>
    <option value="kHz">Kilohertz (kHz)</option>
    <option value="MHz">Megahertz (MHz)</option>
    <option value="GHz">Gigahertz (GHz)</option>
    <option value="THz">Terahertz (THz)</option>
    <option value="PHz">Petahertz (PHz)</option>
    <option value="EHz">Exahertz (EHz)</option>
    <option value="ZHz">Zettahertz (ZHz)</option>
    <option value="YHz">Yottahertz (YHz)</option>
    <option value="cyclePerSecond">Cycle per second</option>
    <option value="rpm">Revolutions per minute (rpm)</option>
    <option value="rps">Revolutions per second (rps)</option>
    <option value="THz_light">THz (visible/IR light)</option>
    <option value="GHz_radio">GHz (radio)</option>
    <option value="MHz_radio">MHz (radio)</option>
    <option value="Hz_audio">Hz (audio)</option>
  `,
  pressure: `
    <option value="Pa">Pascal (Pa)</option>
    <option value="kPa">Kilopascal (kPa)</option>
    <option value="MPa">Megapascal (MPa)</option>
    <option value="GPa">Gigapascal (GPa)</option>
    <option value="TPa">Terapascal (TPa)</option>
    <option value="bar">Bar</option>
    <option value="mbar">Millibar</option>
    <option value="atm">Atmosphere (atm)</option>
    <option value="torr">Torr</option>
    <option value="psi">Pound/in² (psi)</option>
    <option value="mmHg">Millimeter mercury (mmHg)</option>
    <option value="cmHg">Centimeter mercury (cmHg)</option>
    <option value="inHg">Inch mercury (inHg)</option>
    <option value="mmH2O">Millimeter water (mmH2O)</option>
    <option value="cmH2O">Centimeter water (cmH2O)</option>
    <option value="inH2O">Inch water (inH2O)</option>
  `,
  time: `
    <option value="planckTime">Planck time</option>
    <option value="yoctosecond">Yoctosecond</option>
    <option value="zeptosecond">Zeptosecond</option>
    <option value="attosecond">Attosecond</option>
    <option value="femtosecond">Femtosecond</option>
    <option value="picosecond">Picosecond</option>
    <option value="nanosecond">Nanosecond</option>
    <option value="microsecond">Microsecond</option>
    <option value="millisecond">Millisecond</option>
    <option value="second">Second</option>
    <option value="decasecond">Decasecond</option>
    <option value="hectosecond">Hectosecond</option>
    <option value="kilosecond">Kilosecond</option>
    <option value="megasecond">Megasecond</option>
    <option value="gigasecond">Gigasecond</option>
    <option value="minute">Minute</option>
    <option value="hour">Hour</option>
    <option value="day">Day</option>
    <option value="week">Week</option>
    <option value="fortnight">Fortnight</option>
    <option value="month">Month</option>
    <option value="year">Year</option>
    <option value="siderealYear">Sidereal year</option>
    <option value="tropicalYear">Tropical year</option>
    <option value="leapYear">Leap year</option>
    <option value="decade">Decade</option>
    <option value="century">Century</option>
    <option value="millennium">Millennium</option>
    <option value="olympiad">Olympiad (4 years)</option>
    <option value="lustrum">Lustrum (5 years)</option>
  `,
  power: `
    <option value="W">Watt (W)</option>
    <option value="kW">Kilowatt (kW)</option>
    <option value="MW">Megawatt (MW)</option>
    <option value="GW">Gigawatt (GW)</option>
    <option value="TW">Terawatt (TW)</option>
    <option value="PW">Petawatt (PW)</option>
    <option value="EW">Exawatt (EW)</option>
    <option value="ZW">Zettawatt (ZW)</option>
    <option value="YW">Yottawatt (YW)</option>
    <option value="hp">Horsepower (mechanical)</option>
    <option value="hpMetric">Horsepower (metric)</option>
    <option value="ft_lb_per_s">Foot-pound/second</option>
    <option value="BTU_per_h">BTU/hour</option>
    <option value="cal_per_s">Calorie/second</option>
    <option value="kcal_per_h">Kilocalorie/hour</option>
    <option value="erg_per_s">Erg/second</option>
    <option value="planckPower">Planck power</option>
  `,
  fuelEconomy: `
    <option value="L_per_100km">Liters/100 km</option>
    <option value="m3_per_km">m³/km</option>
    <option value="m3_per_m">m³/m</option>
    <option value="mpg_US">Miles/gallon (US)</option>
    <option value="mpg_UK">Miles/gallon (UK)</option>
    <option value="km_per_L">Kilometers/liter</option>
  `,
  memory: `
    <option value="bit">Bit</option>
    <option value="kbit">Kilobit</option>
    <option value="Mbit">Megabit</option>
    <option value="Gbit">Gigabit</option>
    <option value="Tbit">Terabit</option>
    <option value="Pbit">Petabit</option>
    <option value="Ebit">Exabit</option>
    <option value="Zbit">Zettabit</option>
    <option value="Ybit">Yottabit</option>
    <option value="B">Byte</option>
    <option value="KB">Kilobyte</option>
    <option value="MB">Megabyte</option>
    <option value="GB">Gigabyte</option>
    <option value="TB">Terabyte</option>
    <option value="PB">Petabyte</option>
    <option value="EB">Exabyte</option>
    <option value="ZB">Zettabyte</option>
    <option value="YB">Yottabyte</option>
    <option value="Kibit">Kibibit</option>
    <option value="Mibit">Mebibit</option>
    <option value="Gibit">Gibibit</option>
    <option value="Tibit">Tebibit</option>
    <option value="Pibit">Pebibit</option>
    <option value="Eibit">Exbibit</option>
    <option value="Zibit">Zebibit</option>
    <option value="Yibit">Yobibit</option>
    <option value="KiB">Kibibyte</option>
    <option value="MiB">Mebibyte</option>
    <option value="GiB">Gibibyte</option>
    <option value="TiB">Tebibyte</option>
    <option value="PiB">Pebibyte</option>
    <option value="EiB">Exbibyte</option>
    <option value="ZiB">Zebibyte</option>
    <option value="YiB">Yobibyte</option>
  `,
  dataTransferUnits: `
    <option value="bit_per_s">Bit/second</option>
    <option value="kbit_per_s">Kilobit/second</option>
    <option value="Mbit_per_s">Megabit/second</option>
    <option value="Gbit_per_s">Gigabit/second</option>
    <option value="Tbit_per_s">Terabit/second</option>
    <option value="Pbit_per_s">Petabit/second</option>
    <option value="Ebit_per_s">Exabit/second</option>
    <option value="Zbit_per_s">Zettabit/second</option>
    <option value="Ybit_per_s">Yottabit/second</option>
    <option value="Kibit_per_s">Kibibit/second</option>
    <option value="Mibit_per_s">Mebibit/second</option>
    <option value="Gibit_per_s">Gibibit/second</option>
    <option value="Tibit_per_s">Tebibit/second</option>
    <option value="Pibit_per_s">Pebibit/second</option>
    <option value="Eibit_per_s">Exbibit/second</option>
    <option value="Zibit_per_s">Zebibit/second</option>
    <option value="Yibit_per_s">Yobibit/second</option>
    <option value="B_per_s">Byte/second</option>
    <option value="KB_per_s">Kilobyte/second</option>
    <option value="MB_per_s">Megabyte/second</option>
    <option value="GB_per_s">Gigabyte/second</option>
    <option value="TB_per_s">Terabyte/second</option>
    <option value="PB_per_s">Petabyte/second</option>
    <option value="EB_per_s">Exabyte/second</option>
    <option value="ZB_per_s">Zettabyte/second</option>
    <option value="YB_per_s">Yottabyte/second</option>
    <option value="KiB_per_s">Kibibyte/second</option>
    <option value="MiB_per_s">Mebibyte/second</option>
    <option value="GiB_per_s">Gibibyte/second</option>
    <option value="TiB_per_s">Tebibyte/second</option>
    <option value="PiB_per_s">Pebibyte/second</option>
    <option value="EiB_per_s">Exbibyte/second</option>
    <option value="ZiB_per_s">Zebibyte/second</option>
    <option value="YiB_per_s">Yobibyte/second</option>
  `
};
const categorySelect = document.getElementById("unitCategory");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
function updateUnits() {
  const selectedCategory = categorySelect.value;
  const options = unitGroups[selectedCategory] || "";
  fromUnit.innerHTML = options;
  toUnit.innerHTML = options;
}
updateUnits();
categorySelect.addEventListener("change", updateUnits);
const conversionRates = {
  length: {
    ℓp: 1.616255e-35,                 // Planck length
    qm: 1e-30,                        // quecto-meter
    rm: 1e-27,                        // ronto-meter
    ym: 1e-24,                        // yocto-meter
    zm: 1e-21,                        // zepto-meter
    am: 1e-18,                        // atto-meter
    fm: 1e-15,                        // femto-meter
    pm: 1e-12,                        // pico-meter
    nm: 1e-9,                         // nano-meter
    µm: 1e-6,                         // micro-meter
    mm: 1e-3,                         // milli-meter
    cm: 1e-2,                         // centi-meter
    dm: 1e-1,                         // deci-meter
    m: 1,                             // meter
    km: 1e3,                          // kilometer
    Mm: 1e6,                          // megameter
    Gm: 1e9,                          // gigameter
    Tm: 1e12,                         // terameter
    Pm: 1e15,                         // petameter
    Em: 1e18,                         // exameter
    Zm: 1e21,                         // zettameter
    Ym: 1e24,                         // yottameter
    Rm: 1e27,                         // ronnameter
    bohrRadius: 5.29177210903e-11,    // Bohr radius
    classicalElectronRadius: 2.8179403262e-15, // electron radius
    comptonWavelength: 2.426310238e-12, // Compton wavelength of electron
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.344,
    nauticalMile: 1852,
    fathom: 1.8288,
    rod: 5.0292,
    chain: 20.1168,
    cubit: 0.4572,
    span: 0.2286,
    angstrom: 1e-10,
    au: 149597870700,          // astronomical unit
    ly: 9.4607304725808e15,    // light-year
    kly: 9.4607304725808e18,   // kilolight-year
    Mly: 9.4607304725808e21,   // megalight-year
    Gly: 9.4607304725808e24,   // gigalight-year
    pc: 3.085677581491367e16,     // parsec
    kpc: 3.085677581491367e19,    // kiloparsec
    Mpc: 3.085677581491367e22,    // megaparsec
    Gpc: 3.085677581491367e25,    // gigaparsec
    Tpc: 3.085677581491367e28,    // teraparsec
    Ppc: 3.085677581491367e31,    // petaparsec
    Epc: 3.085677581491367e34,    // exaparsec
    Zpc: 3.085677581491367e37,    // zettaparsec
    Ypc: 3.085677581491367e40     // yottaparsec
  },
  mass: {
    electronMass: 9.1093837015e-31,    // kg
    protonMass: 1.67262192369e-27,     // kg
    neutronMass: 1.67492749804e-27,    // kg
    atomicMassUnit: 1.66053906660e-27, // 1 u (Dalton)
    qg: 1e-30,    // quectogram
    rg: 1e-27,    // rontogram
    yg: 1e-24,    // yoctogram
    zg: 1e-21,    // zeptogram
    ag: 1e-18,    // attogram
    fg: 1e-15,    // femtogram
    pg: 1e-12,    // picogram
    ng: 1e-9,     // nanogram
    µg: 1e-6,     // microgram
    mg: 1e-3,     // milligram
    g: 1e-3,      // gram
    dag: 0.01,    // decagram
    hg: 0.1,      // hectogram
    kg: 1,        // kilogram (base SI unit)
    Mg: 1e3,      // megagram / tonne
    Gg: 1e6,      // gigagram
    Tg: 1e9,      // teragram
    Pg: 1e12,     // petagram
    Eg: 1e15,     // exagram
    Zg: 1e18,     // zettagram
    Yg: 1e21,     // yottagram
    Rg: 1e24,     // ronnagram
    Qg: 1e27,     // quettagram
    ounce: 0.028349523125,      // oz
    pound: 0.45359237,          // lb
    stone: 6.35029318,          // st
    quarter: 12.70058636,       // UK quarter
    hundredweight: 50.80234544, // UK hundredweight
    tonUK: 1016.0469088,        // long ton
    tonUS: 907.18474,           // short ton
    earthMass: 5.9722e24,       // kg
    sunMass: 1.98847e30,        // kg
    jupiterMass: 1.89813e27,    // kg
  },
  area: {
    mm2: 1e-6,        // square millimeter
    cm2: 1e-4,        // square centimeter
    dm2: 1e-2,        // square decimeter
    m2: 1,            // square meter
    km2: 1e6,         // square kilometer
    are: 100,         // 1 are = 100 m²
    hectare: 10000,   // 1 ha = 10,000 m²
    in2: 0.00064516,  // square inch
    ft2: 0.092903,    // square foot
    yd2: 0.836127,    // square yard
    mi2: 2.58999e6,   // square mile
    rod2: 25.2929,    // square rod
    chain2: 404.686,  // square chain
    acre: 4046.8564224, // acre in m²
    dunam: 1000,      // dunam = 1,000 m²
    barn: 1e-28       // barn (atomic scale)
  },
  volume: {
    mml3: 1e-9,         // cubic millimeter
    cml3: 1e-6,         // cubic centimeter (1 mL)
    dml3: 1e-3,         // cubic decimeter (1 L)
    m3: 1,             // cubic meter
    km3: 1e9,          // cubic kilometer
    liter: 1e-3,       // liter = 1 dm³
    milliliter: 1e-6,  // mL = 1 cm³
    centiliter: 1e-5,  // cL
    deciliter: 1e-4,   // dL
    hectoliter: 0.1,   // hL
    kiloliter: 1,      // kL = 1 m³
    in3: 1.63871e-5,   // cubic inch
    ft3: 0.0283168,    // cubic foot
    yd3: 0.764555,     // cubic yard
    tsp: 4.92892e-6,   // US teaspoon
    tbsp: 1.47868e-5,  // US tablespoon
    fl_oz: 2.9574e-5,  // US fluid ounce
    cup: 0.000236588,  // US cup
    pt: 0.000473176,   // US pint
    qt: 0.000946353,   // US quart
    gal: 0.00378541,   // US gallon
    ft3_us: 0.0283168, // US cubic foot (same as ft3)
    bbl: 0.158987,     // barrel (oil, US)
    acre_ft: 1233.48,  // acre-foot
    cord: 3.62456,     // cord of wood
    hogshead: 0.238481, // wine barrel
  },
  angle: {
    rad: 1,                     // radian
    deg: Math.PI / 180,         // degree
    arcmin: Math.PI / 10800,    // minute of arc
    arcsec: Math.PI / 648000,   // second of arc
    rev: 2 * Math.PI,           // revolution / turn
    grad: Math.PI / 200,        // grad / gon / grade
    mrad: 0.001,                // milliradian
    microrad: 1e-6,             // microradian
    sextant: Math.PI / 12,      // 1/6 of a circle (historical)
    quadrant: Math.PI / 2,      // 1/4 of a circle
    fullCircle: 2 * Math.PI,    // synonym for rev
    turn: 2 * Math.PI,          // synonym for rev
  },
  temperature: {
    K: { factor: 1, offset: 0, type: "absolute" },           // Kelvin
    C: { factor: 1, offset: 273.15, type: "relative" },      // Celsius
    F: { factor: 5 / 9, offset: 255.372222, type: "relative" }, // Fahrenheit
    R: { factor: 5 / 9, offset: 0, type: "absolute" },         // Rankine
    Re: { factor: 1.25, offset: 0, type: "absolute" },       // Réaumur
    De: { factor: -2 / 3, offset: 373.15, type: "relative" },  // Delisle
    N: { factor: 100 / 33, offset: 273.15, type: "relative" }, // Newton
    Ro: { factor: 21 / 40, offset: 273.15, type: "relative" }, // Rømer
    gasMark: { factor: 14, offset: 121, type: "relative" },   // Gas mark
    Leiden: { factor: 1, offset: 0.0001, type: "absolute" }, // Leiden
    Planck: { factor: 1.416784e32, offset: 0, type: "absolute" }, // Planck temperature
    triplePointWater: { factor: 273.16, offset: 0, type: "absolute" },
    microK: { factor: 1e-6, offset: 0, type: "absolute" },   // microkelvin
    milliK: { factor: 1e-3, offset: 0, type: "absolute" },   // millikelvin
  },
  energy: {
    J: 1,
    kJ: 1e3,
    MJ: 1e6,
    GJ: 1e9,
    TJ: 1e12,
    PJ: 1e15,
    EJ: 1e18,
    ZJ: 1e21,
    YJ: 1e24,
    cal: 4.184,          // small calorie
    kcal: 4184,          // kilocalorie / food calorie
    Wh: 3600,            // watt-hour
    kWh: 3.6e6,          // kilowatt-hour
    MWh: 3.6e9,
    GWh: 3.6e12,
    eV: 1.602176634e-19, // electronvolt
    keV: 1.602176634e-16,
    MeV: 1.602176634e-13,
    GeV: 1.602176634e-10,
    TeV: 1.602176634e-7,
    erg: 1e-7,           // CGS unit
    BTU: 1055.05585,         // British Thermal Unit (ISO)
    kcal_IT: 4184,           // IT calorie
    tonTNT: 4.184e9,         // ton of TNT
    ft_lb: 1.3558179483314,  // foot-pound force
    in_lb: 0.112984829,      // inch-pound force
    hartree: 4.3597447222071e-18, // atomic unit of energy
    rydberg: 2.1798723611035e-18, // Rydberg constant energy
    planckEnergy: 1.9561e9,       // Planck energy in joules
  },
  speed: {
    mps: 1,                 // meters per second
    cmps: 0.01,             // centimeters per second
    kmps: 1000,             // kilometers per second
    kmph: 1000 / 3600,      // kilometers per hour
    mpm: 1 / 60,            // meters per minute
    mph: 1609.344 / 3600,   // miles per hour
    fps: 0.3048,            // feet per second
    knots: 1852 / 3600,     // nautical miles per hour
    c: 299792458,           // speed of light in vacuum
    ly_per_year: 299792458, // 1 light-year per year = c (approx)
    au_per_day: 149597870700 / 86400, // astronomical unit per day
    mach: 340.29,           // speed of sound at sea level, 20°C
    planckSpeed: 299792458  // Planck speed = c (upper limit)
  },
  frequency: {
    Hz: 1,          // 1 cycle per second
    kHz: 1e3,       // kilohertz
    MHz: 1e6,       // megahertz
    GHz: 1e9,       // gigahertz
    THz: 1e12,      // terahertz
    PHz: 1e15,      // petahertz
    EHz: 1e18,      // exahertz
    ZHz: 1e21,      // zettahertz
    YHz: 1e24,      // yottahertz
    cyclePerSecond: 1,        // same as Hz
    rpm: 1 / 60,                // revolutions per minute → Hz
    rps: 1,                   // revolutions per second → Hz
    THz_light: 1e12,          // visible/infrared range
    GHz_radio: 1e9,           // typical radio frequency
    MHz_radio: 1e6,
    Hz_audio: 1,               // audible range starts ~20 Hz
  },
  pressure: {
    Pa: 1,                 // pascal
    kPa: 1e3,
    MPa: 1e6,
    GPa: 1e9,
    TPa: 1e12,
    bar: 1e5,
    mbar: 100,
    atm: 101325,
    torr: 101325 / 760,     // mmHg
    psi: 6894.75729,        // pound per square inch
    mmHg: 133.322387,       // millimeter of mercury
    cmHg: 1333.22387,       // centimeter of mercury
    inHg: 3386.389,         // inch of mercury
    mmH2O: 9.80665,         // millimeter of water
    cmH2O: 98.0665,         // centimeter of water
    inH2O: 249.0889,        // inch of water
  },
  time: {
    planckTime: 5.391247e-44,   // seconds
    yoctosecond: 1e-24,
    zeptosecond: 1e-21,
    attosecond: 1e-18,
    femtosecond: 1e-15,
    picosecond: 1e-12,
    nanosecond: 1e-9,
    microsecond: 1e-6,
    millisecond: 1e-3,
    second: 1,
    decasecond: 10,
    hectosecond: 100,
    kilosecond: 1000,
    megasecond: 1e6,
    gigasecond: 1e9,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    fortnight: 1209600,
    year: 31556952,               // Julian year (365.25 days)
    siderealYear: 31558149.764,  // Sidereal year
    tropicalYear: 31556925.216,  // Tropical year
    leapYear: 31622400,           // 366 days
    decade: 315569520,
    century: 3.1556952e9,
    millennium: 3.1556952e10,
    olympiad: 126230400,          // 4 years
    lustrum: 157784760,           // 5 years
  },
  power: {
    W: 1,
    kW: 1e3,
    MW: 1e6,
    GW: 1e9,
    TW: 1e12,
    PW: 1e15,
    EW: 1e18,
    ZW: 1e21,
    YW: 1e24,
    hp: 745.699872,             // mechanical horsepower
    hpMetric: 735.49875,        // metric horsepower
    ft_lb_per_s: 1.3558179483314, // foot-pound per second
    BTU_per_h: 0.29307107,      // BTU per hour
    cal_per_s: 4.184,            // small calorie per second
    kcal_per_h: 1.16222222,      // food kcal per hour
    erg_per_s: 1e-7,             // CGS unit
    planckPower: 3.62831e52       // Planck power (theoretical maximum)
  },
  fuelEconomy: {
    L_per_100km: 0.01,              // liters per km → m³/m (1 L = 0.001 m³, 100 km = 100,000 m)
    m3_per_km: 1e-3,                 // cubic meters per km
    m3_per_m: 1e-3 / 1000,           // cubic meters per meter
    mpg_US: 0.425143707,             // miles per gallon (US) → m³/m
    mpg_UK: 0.35400619,              // miles per gallon (UK)
    km_per_L: 0.001,                 // kilometers per liter → m/m³ (reverse of L/100km)
  },
  memory: {
    nibble: 4,
    bit: 1,
    kbit: 1e3,
    Mbit: 1e6,
    Gbit: 1e9,
    Tbit: 1e12,
    Pbit: 1e15,
    Ebit: 1e18,
    Zbit: 1e21,
    Ybit: 1e24,
    B: 8,
    KB: 8e3,
    MB: 8e6,
    GB: 8e9,
    TB: 8e12,
    PB: 8e15,
    EB: 8e18,
    ZB: 8e21,
    YB: 8e24,
    Kibit: 1024,
    Mibit: 1024 ** 2,
    Gibit: 1024 ** 3,
    Tibit: 1024 ** 4,
    Pibit: 1024 ** 5,
    Eibit: 1024 ** 6,
    Zibit: 1024 ** 7,
    Yibit: 1024 ** 8,
    KiB: 1024 * 8,
    MiB: 1024 ** 2 * 8,
    GiB: 1024 ** 3 * 8,
    TiB: 1024 ** 4 * 8,
    PiB: 1024 ** 5 * 8,
    EiB: 1024 ** 6 * 8,
    ZiB: 1024 ** 7 * 8,
    YiB: 1024 ** 8 * 8
  },
  dataTransferUnits: {
    bit_per_s: 1,
    kbit_per_s: 1e3,
    Mbit_per_s: 1e6,
    Gbit_per_s: 1e9,
    Tbit_per_s: 1e12,
    Pbit_per_s: 1e15,
    Ebit_per_s: 1e18,
    Zbit_per_s: 1e21,
    Ybit_per_s: 1e24,
    Kibit_per_s: 1024,
    Mibit_per_s: 1024 ** 2,
    Gibit_per_s: 1024 ** 3,
    Tibit_per_s: 1024 ** 4,
    Pibit_per_s: 1024 ** 5,
    Eibit_per_s: 1024 ** 6,
    Zibit_per_s: 1024 ** 7,
    Yibit_per_s: 1024 ** 8,
    B_per_s: 8,
    KB_per_s: 8e3,
    MB_per_s: 8e6,
    GB_per_s: 8e9,
    TB_per_s: 8e12,
    PB_per_s: 8e15,
    EB_per_s: 8e18,
    ZB_per_s: 8e21,
    YB_per_s: 8e24,
    KiB_per_s: 1024 * 8,
    MiB_per_s: 1024 ** 2 * 8,
    GiB_per_s: 1024 ** 3 * 8,
    TiB_per_s: 1024 ** 4 * 8,
    PiB_per_s: 1024 ** 5 * 8,
    EiB_per_s: 1024 ** 6 * 8,
    ZiB_per_s: 1024 ** 7 * 8,
    YiB_per_s: 1024 ** 8 * 8,
  }
};
function unitCompute() {
  const category = categorySelect.value;
  const from = fromUnit.value;
  const to = toUnit.value;
  const value = parseFloat(document.getElementById("unitVal").value);
  const outputEl = document.getElementById("unitOut");

  if (isNaN(value)) {
    outputEl.textContent = "Please enter a valid number.";
    return;
  }

  let result;

  if (category === "temperature") {
    result = convertTemperature(value, from, to);
  }
  else {
    const rates = conversionRates[category];
    if (!rates[from] || !rates[to]) {
      outputEl.textContent = "Conversion not defined.";
      return;
    }
    const valueInBase = value * rates[from];
    result = valueInBase / rates[to];
  }

  const fromText = fromUnit.options[fromUnit.selectedIndex].text.match(/\(([^)]+)\)/);
  const toText = toUnit.options[toUnit.selectedIndex].text.match(/\(([^)]+)\)/);

  const fromAbbr = fromText ? fromText[1] : fromUnit.value;
  const toAbbr = toText ? toText[1] : toUnit.value;

  const formatted =
    Math.abs(result) >= 0.0001 && Math.abs(result) < 10000
      ? result.toFixed(4)
      : result.toExponential(4);

  outputEl.textContent = `${value} ${fromAbbr} = ${formatted} ${toAbbr}`;
}
function convertTemperature(value, from, to) {
  if (!from || !to) throw "Unknown unit";
  let K = value * from.factor + from.offset;
  return (K - to.offset) / to.factor;
}
function unitClear() {
  document.getElementById("unitCategory").value = "length";
  document.getElementById("unitVal").value = "";
  document.getElementById("fromUnit").innerHTML = unitGroups.length;
  document.getElementById("toUnit").innerHTML = unitGroups.length;
  document.getElementById("unitOut").textContent = "";
}


// -------- PASSWORD GENERATOR --------
const pwdToggle = document.getElementById('pwdCharacterTypesToggle');
const pwdContent = document.getElementById('pwdCharacterTypesContent');
pwdToggle.addEventListener('click', () => {
  const expanded = pwdToggle.getAttribute('aria-expanded') === 'true';
  pwdToggle.setAttribute('aria-expanded', !expanded);
  pwdContent.style.display = expanded ? 'none' : 'block';
  pwdContent.setAttribute('aria-hidden', expanded);
});
function passwordGenerate() {
  const length = parseInt(document.getElementById('pwdLength').value);
  if (isNaN(length) || length <= 0) {
    ('Please enter a valid password length.');
    return;
  }

  const types = document.querySelectorAll('.characters:checked');
  if (types.length === 0) {
    document.getElementById('pwdOut').textContent = 'Please select at least one character type.';
    return;
  }

  const charSets = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-----=[]{}|;:,.<>?/~`'
  };

  let allChars = '';
  types.forEach(t => allChars += charSets[t.value]);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  document.getElementById('pwdOut').textContent = password;
}
function passwordClear() {
  document.getElementById('pwdOut').textContent = '';
  document.getElementById('pwdLength').value = '';
  document.querySelectorAll('.characters').forEach(c => c.checked = true);
}
function copyPassword() {
  const password = document.getElementById('pwdOut').textContent;
  if (!password) return;
  navigator.clipboard.writeText(password).then(() => {
    alert('Password copied to clipboard!');
  }).catch(() => {
    alert('Failed to copy password.');
  });
}

// // ------- Weekday Calculator -------
// function calculateWeekday() {
//   const dateInput = document.getElementById('weekdayDate').value;
//   if (!dateInput) {
//     document.getElementById('weekdayOut').textContent = 'Please select a date.';
//     return;
//   }
//   const date = new Date(dateInput);
//   const options = { weekday: 'long' };
//   const weekday = new Intl.DateTimeFormat('en-US', options).format(date);
//   document.getElementById('weekdayOut').textContent = `The day is: ${weekday}`;
// }
// function clearWeekday() {
//   document.getElementById('weekdayDate').value = '';
//   document.getElementById('weekdayOut').textContent = '';
// }

// ======== INFO ==========

// ------ Customize -------
const accent1Picker = document.getElementById('accent1Picker');
const accent2Picker = document.getElementById('accent2Picker');
const background1Picker = document.getElementById('background1Picker');
const background2Picker = document.getElementById('background2Picker');
const card1Picker = document.getElementById('card1Picker');
const card2Picker = document.getElementById('card2Picker');
const root = document.documentElement;
const resetBtn = document.getElementById('resetColors');
const themeButtons = document.querySelectorAll('.theme-btn');
const ownThemeNameInput = document.getElementById('ownThemeName');
const ownThemeOut = document.getElementById('ownThemeOut');
const ownThemeSave = document.getElementById('ownThemeSave');
const saveThemeNameBtn = document.getElementById('saveThemeName');
function updateColor(varName, color) {
  root.style.setProperty(varName, color);
}
window.addEventListener('load', () => {
  ['accent1', 'accent2', 'background1', 'background2', 'accent5', 'accent6'].forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      const varName =
        key === 'accent1' ? '--accent1' :
        key === 'accent2' ? '--accent2' :
        key === 'background1' ? '--background1' :
        key === 'background2' ? '--background2' :
        key === 'accent5' ? '--accent5' :
        '--accent6';
      updateColor(varName, value);
      const input = document.getElementById(
        key === 'accent5' ? 'card1Picker' :
        key === 'accent6' ? 'card2Picker' :
        key + 'Picker'
      );
      if (input) input.value = value;
    }
  });
});
[accent1Picker, accent2Picker, background1Picker, background2Picker, card1Picker, card2Picker].forEach(picker => {
  picker.addEventListener('input', e => {
    const id = e.target.id;
    const varName =
      id === 'accent1Picker' ? '--accent1' :
      id === 'accent2Picker' ? '--accent2' :
      id === 'background1Picker' ? '--background1' :
      id === 'background2Picker' ? '--background2' :
      id === 'card1Picker' ? '--accent5' :
      '--accent6';
    const key =
      id === 'card1Picker' ? 'accent5' :
      id === 'card2Picker' ? 'accent6' :
      id.replace('Picker', '');
    updateColor(varName, e.target.value);
    localStorage.setItem(key, e.target.value);
  });
});
accent1Picker.addEventListener('input', (e) => {
  updateColor('--accent1', e.target.value);
  localStorage.setItem('accent1', e.target.value);
});
accent2Picker.addEventListener('input', (e) => {
  updateColor('--accent2', e.target.value);
  localStorage.setItem('accent2', e.target.value);
});
background1Picker.addEventListener('input', (e) => {
  updateColor('--background1', e.target.value);
  localStorage.setItem('background1', e.target.value);
});
background2Picker.addEventListener('input', (e) => {
  updateColor('--background2', e.target.value);
  localStorage.setItem('background2', e.target.value);
});
card1Picker.addEventListener('input', (e) => {
  updateColor('--accent5', e.target.value);
  localStorage.setItem('accent5', e.target.value);
});
card2Picker.addEventListener('input', (e) => {
  updateColor('--accent6', e.target.value);
  localStorage.setItem('accent6', e.target.value);
});
resetBtn.addEventListener('click', () => {
  const defaults = {
    accent1: '#3c78d8',
    accent2: '#9900ff',
    background1: '#172D50',
    background2: '#480A71',
    accent5: '#0c3b83',
    accent6: '#241b77'
  };
  for (const [key, value] of Object.entries(defaults)) {
    const varName =
      key === 'accent1' ? '--accent1' :
      key === 'accent2' ? '--accent2' :
      key === 'background1' ? '--background1' :
      key === 'background2' ? '--background2' :
      key === 'accent5' ? '--accent5' :
      '--accent6';
    updateColor(varName, value);
    localStorage.removeItem(key);
    const input = document.getElementById(
      key === 'accent5' ? 'card1Picker' :
      key === 'accent6' ? 'card2Picker' :
      key + 'Picker'
    );
    if (input) input.value = value;
  }
});
const themes = {
  neutroxity: { accent1: '#3c78d8', accent2: '#9900ff', background1: '#172D50', background2: '#480A71', card1: '#0c3b83', card2: '#241b77' },
  aurora: { accent1: '#2ae9c0', accent2: '#2ea6ab', background1: '#141e30', background2: '#243b55', card1: '#1e6369', card2: '#0072ff' },
  neonDark: { accent1: '#ff00cc', accent2: '#3333ff', background1: '#0f0c29', background2: '#24243e', card1: '#302b63', card2: '#4134a1' },
  cosmicDawn: { accent1: '#ff6f61', accent2: '#ff9966', background1: '#0b0c10', background2: '#1f2833', card1: '#2e3239', card2: '#3d3f45' },
  galacticVoid: { accent1: '#6a11cb', accent2: '#2575fc', background1: '#0a0a23', background2: '#12122b', card1: '#1a1a40', card2: '#2d2d5a' }
};
themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const theme = themes[button.dataset.theme];
    Object.entries(theme).forEach(([key, val]) => {
      const varName =
        key === 'accent1' ? '--accent1' :
        key === 'accent2' ? '--accent2' :
        key === 'background1' ? '--background1' :
        key === 'background2' ? '--background2' :
        key === 'card1' ? '--accent5' :
        '--accent6';
      updateColor(varName, val);
      localStorage.setItem(
        key === 'card1' ? 'accent5' :
        key === 'card2' ? 'accent6' : key, val
      );
    });
    accent1Picker.value = theme.accent1;
    accent2Picker.value = theme.accent2;
    background1Picker.value = theme.background1;
    background2Picker.value = theme.background2;
    card1Picker.value = theme.card1;
    card2Picker.value = theme.card2;
  });
});
function getCurrentThemeData() {
  return {
    name: ownThemeNameInput.value.trim() || 'My Theme',
    accent1: localStorage.getItem('accent1') || '#3c78d8',
    accent2: localStorage.getItem('accent2') || '#9900ff',
    background1: localStorage.getItem('background1') || '#172D50',
    background2: localStorage.getItem('background2') || '#480A71',
    card1: localStorage.getItem('accent5') || '#0c3b83',
    card2: localStorage.getItem('accent6') || '#241b77',
    timestamp: Date.now()
  };
}
function saveThemeSelf() {
  ownThemeSave.classList.remove('hidden');
  saveThemeNameBtn.onclick = () => {
    const themeData = {
      name: ownThemeNameInput.value.trim() || 'My Theme',
      accent1: accent1Picker.value,
      accent2: accent2Picker.value,
      background1: background1Picker.value,
      background2: background2Picker.value,
      card1: card1Picker.value,
      card2: card2Picker.value,
      timestamp: Date.now()
    };
    const myThemes = JSON.parse(localStorage.getItem('myThemes')) || {};
    myThemes[themeData.name] = themeData;
    localStorage.setItem('myThemes', JSON.stringify(myThemes));
    setTimeout (() => {
      ownThemeOut.textContent = `${themeData.name} saved.`;
      ownThemeSave.classList.add('hidden');
    }, 4000);
    addThemeToPreviews(themeData);
    ownThemeNameInput.value = "";
    ownThemeOut.textContent = "";
  };
}
function saveThemePublic() {
  ownThemeSave.classList.remove('hidden');
  ownThemeOut.textContent = "Enter a name and click Save Theme.";
  saveThemeNameBtn.onclick = () => {
    const themeData = getCurrentThemeData();
    if (!window.firebase || !firebase.database) {
      ownThemeOut.textContent = 'Unable to save theme. Try again later.';
      return;
    }
    const db = firebase.database();
    db.ref('publicThemes').push(themeData)
      .then(() => {
        setTimeout (() => {
          ownThemeOut.textContent = `Published ${themeData.name} to public themes!\nWill be reviewed before appearing.`;
          ownThemeSave.classList.add('hidden');
        }, 4000);
      })
      .catch(err => {
        ownThemeOut.textContent = 'Error: ' + err.message;
      });
      ownThemeNameInput.value = "";
      ownThemeOut.textContent = "";
  };
}
function addThemeToPreviews(themeData) {
  const previewsContainer = document.querySelector('.theme-previews');
  if (document.getElementById('theme-' + themeData.name)) return;
  const btn = document.createElement('button');
  btn.className = 'theme-btn';
  btn.id = 'theme-' + themeData.name;
  btn.innerHTML = `
    <div class="preview-box" style="
      --background: linear-gradient(45deg, ${themeData.background1}, ${themeData.background2});
      --card: linear-gradient(45deg, ${themeData.card1}, ${themeData.card2});
      --accent: linear-gradient(45deg, ${themeData.accent1}, ${themeData.accent2});
      background: var(--background);
    "></div>
    <span>${themeData.name}</span>
  `;
  btn.addEventListener('click', () => {
    updateColor('--accent1', themeData.accent1);
    updateColor('--accent2', themeData.accent2);
    updateColor('--background1', themeData.background1);
    updateColor('--background2', themeData.background2);
    updateColor('--accent5', themeData.card1);
    updateColor('--accent6', themeData.card2);
    accent1Picker.value = themeData.accent1;
    accent2Picker.value = themeData.accent2;
    background1Picker.value = themeData.background1;
    background2Picker.value = themeData.background2;
    card1Picker.value = themeData.card1;
    card2Picker.value = themeData.card2;
  });
  previewsContainer.appendChild(btn);
}
window.addEventListener('load', () => {
  const myThemes = JSON.parse(localStorage.getItem('myThemes')) || {};
  Object.values(myThemes).forEach(themeData => addThemeToPreviews(themeData));
});