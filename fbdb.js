firebase.initializeApp(def.firebaseConfig);
firebase.appCheck().activate('6LdfYCgsAAAAAPxZOhlX_AbnHt8otzs3lY9c3cD1',true);
const auth = firebase.auth();
auth.onAuthStateChanged(user => {
  if (user) {
    def.currentUser = user;
    def.db = firebase.database();
    console.log("Signed in as:", user.email);
    showScreen(def.profileScreen);
    startApp(user);
  } 
  else {
    def.currentUser = null;
    def.db = firebase.database();
    console.log("No user signed in");
    showScreen(def.signUpLoginScreen);
  }
  showSnakeLeaderScores();
  showJetShooterLeaderScores();
});
function showScreen(screenToShow) {
  const screens = [def.signUpLoginScreen, def.profileScreen];
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
  if (username.length < 3 || username.length > 10) {
    signUpOut.textContent = "Username must be between 3 and 10 characters.";
    return;
  }
  const email = username + "@neutroxity.com";
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;
    def.currentUser = user;
    def.db = firebase.database();
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
    await def.db.ref(`users/${user.uid}`).set(userData);
    startApp(user);
    signUpOut.textContent = `User created: ${user.email}`;
    await wait(4000);
    showScreen(def.profileScreen);
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
    def.currentUser = result.user;
    def.db = firebase.database();
    startApp(result.user);
    loginOut.textContent = `User signed in: ${result.user.email}`;
    await wait(4000);
    showScreen(def.profileScreen);
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
    def.currentUser = null;
    def.db = null;
    profileOut.textContent = "Successfully signed out";
    await wait(4000);
    showScreen(def.signUpLoginScreen);
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
      def.db.ref(`users/${user.uid}/test`).set({ message: "Hello!" })
        .then(() => console.log("Data written successfully!"))
        .catch(err => console.error("Write failed:", err));
        loadElementData();
        def.neutropolisGame.classList.remove('hidden');
      def.db.ref(`users/${user.uid}/username`).on("value", snapshot => {
        console.log("Username:", snapshot.val());
        def.currentUserName = snapshot.val();
      });
      def.db.ref(`users/${user.uid}/test`).on("value", snapshot => {
        console.log("Database value:", snapshot.val());
      });
    })
    .catch(err => {
      if (err) console.error("App Check failed, unidentified domain")
    });
}
function addUserData(newData) {
  if (!def.db || !def.currentUser) return console.error("Database or user not initialized!");
  def.db.ref(`users/${def.currentUser.uid}`).update(newData)
    .then(() => console.log("Data updated successfully!"))
    .catch(err => console.error("Failed to update data:", err));
}
function getUserData() {
  if (!def.db || !def.currentUser) return console.error("Database or user not initialized!");
  def.db.ref(`users/${def.currentUser.uid}`).once("value")
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


// ======== CHEMISTRY ========
function highlightElementGroup(type) {
  const elements = document.querySelectorAll(`.${type}`);
  const alreadyHighlighted = Array.from(elements).some(el => el.classList.contains('highlighted'));
  document.querySelectorAll('.element-box').forEach(el => el.classList.remove('highlighted'));
  if (!alreadyHighlighted) {
    elements.forEach(el => el.classList.add('highlighted'));
  }
}
document.querySelectorAll('.element-box').forEach(box => {
  box.addEventListener('click', () => {
    const symbol = box.getAttribute('data-symbol');
    if (!def.db || !def.currentUser) {
      def.ptOut.textContent = `Sign in to see more detailed info on ${symbol}`;
      setTimeout(() => def.ptOut.textContent = '', 4000);
    }
    else showElementInfo(symbol);
  });
});
function searchElement() {
  const searchedElement = document.getElementById('ptSearch').value.trim().toLowerCase();
  const element = def.elementData.find(el =>
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
      def.ptOut.textContent = `Element found, but no HTML element with ID "${elementId}" exists.`;
    }
  } 
  else {
    def.ptOut.textContent = 'Invalid input. Please enter a valid element name, symbol, or atomic number.';
  }
}
document.getElementById('ptSearch').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchElement();
  }
});
function showElementInfoOut(button) {
  if (!def.db || !def.currentUser) return;
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
  if (!def.db || !def.currentUser) {
    console.error("Firebase DB not initialized yet!");
    return;
  }
  def.db.ref("elementData").once("value")
    .then(snapshot => {
      elementDataDB = Object.values(snapshot.val());
      console.log("Element data loaded:", elementDataDB.length, "elements");
    })
    .catch(err => console.error("Error loading elementData from Firebase:", err));
}
function showElementInfo(symbol) {
  if (!def.db || !def.currentUser) return;
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

// ----------- Test Maker Taker -----------

if (!def.db || !def.currentUser) document.getElementById('tMTcard').style.display = "none";
document.getElementById('tMTTM').style.display = "none";
document.getElementById('tMTTT').style.display = "none";
const tMT = document.getElementById('tMT');
function tMTms() {
  const tMTMoT = document.getElementById('tMTMoT').value;
  if (tMTMoT === 'tMTM') {
    tMTMoT.value = 'tMTs';
    tMT.style.display = "none";
    document.getElementById('tMTTM').style.display = "flex";
  }
  else if (tMTMoT === 'tMTT') {
    tMTMoT.value = 'tMTs';
    tMT.style.display = "none";
    document.getElementById('tMTTT').style.display = "flex";
  }
}
function tMTB() {
  tMT.style.display = "block";
  document.getElementById('tMTTM').style.display = "none";
  document.getElementById('tMTTT').style.display = "none";
}

// ------------- Monopoly -------------
// if (!def.db || !def.currentUser) def.neutropolisGame.classList.add('hidden');
[def.jngr, def.cngr, def.ngrc].forEach(el => {
  if (el) {
    el.classList.remove('visible');
    el.classList.add('hidden');
  }
});
function changengr() {
  const mngr = document.getElementById('mngr').value;
  if (mngr === 'jngr') {
    def.ngmi.classList.add('hidden');
    def.jngr.classList.remove('hidden');
    mngr.value = 'selectngr';
  }
  else if (mngr === 'cngr') {
    def.ngmi.classList.add('hidden');
    def.cngr.classList.remove('hidden');
    mngr.value = 'selectngr';
  }
}
function backngr() {
  [def.jngr, def.cngr, def.ngrc].forEach(el => {
    if (el) {
      el.classList.remove('visible');
      el.classList.add('hidden');
    }
  });
  def.ngmi.classList.remove('hidden');
}
async function crngr() {
  if (!def.db || !def.currentUser) return;
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  const roomData = {
    public: document.getElementById('ngrRoomPublic').checked,
    maxPlayers: Number(document.getElementById('ngrMaxPlayers').value),
    allowMortgage: document.getElementById('ngrAllowMortgage').checked,
    allowPrisonRent: document.getElementById('ngrAllowPrisonRent').checked,
    allowAuction: document.getElementById('ngrAllowAuction').checked,
    allowVacationCash: document.getElementById('ngrAllowVacationCash').checked,
    allowDoubleRentSet: document.getElementById('ngrAllowDoubleRentSet').checked,
    allowEvenBuild: document.getElementById('ngrAllowEvenBuild').checked,
    allowRandomOrder: document.getElementById('ngrAllowRandomPlayerOrder').checked,
    createdBy: def.currentUserName,
    players: {
      [def.currentUserName]: {
        name: def.currentUserName || "Player",
        money: 1500,
        position: 0, 
        turn: 0,
        color: "red",
        properties: {}
      }
    },
    gameState: {
      started: false,
      ended: false,
      turn: 0,
      log: [`Room created ${code} by ${def.currentUserName}`],
      chat: []
    }
  };
  def.db.ref(`rooms/${code}`).set(roomData);
  window.ngrRoomCode = code;
  def.cngr.classList.add('hidden');
  def.ngrc.classList.remove('hidden');
  def.ngrc.classList.add('visible');
  document.getElementById("ngbj").innerText = code;
  loadRoom(window.ngrRoomCode);
}
async function joinngr() {
  if (!def.db || !def.currentUser) return;
  const ngrJoinCode = document.getElementById('ngrJoinCode').value.trim().toUpperCase();
  const roomSnap = await def.db.ref(`rooms/${ngrJoinCode}`).once('value');
  const room = roomSnap.val();
  const jngrOut = document.getElementById('jngrOut');
  if (!room) {
    jngrOut.textContent = "Room not found!";
    return;
  }
  if (def.currentUserName === room.players[def.currentUserName]) 
    jngrOut.textContent = "Rejoining room.";
  else if (Object.keys(room.players).length >= room.maxPlayers) {
    jngrOut.textContent = "Room is full!";
    return;
  }
  if(def.currentUserName != room.players[def.currentUserName]) {
    room.players[def.currentUserName] = {
      name: def.currentUserName || "Player",
      money: 1500,
      position: 0,
      turn: 2, 
      color: "blue",
      properties: {}
    };
  }
  await def.db.ref(`rooms/${ngrJoinCode}/players`).set(room.players);
  if (def.currentUserName != room.players[def.currentUserName]) addGameLog(ngrJoinCode, `${def.currentUserName} rejoined the room`);
  else addGameLog(ngrJoinCode, `${def.currentUserName} joined the room`);
  window.ngrRoomCode = ngrJoinCode;
  def.jngr.classList.add('hidden');
  def.ngrc.classList.remove('hidden');
  def.ngrc.classList.add('visible');
  loadRoom(window.ngrRoomCode);
}
function loadRoom(code) {
  def.db.ref(`rooms/${code}`).on('value', snap => {
    const room = snap.val();
    if (!room) return;
    ngrcplu(room.players);
    ngrcgu(room.gameState.log);
    ngrcgcu(room.gameState.chat);
    ngrcpmu(room.players);
    // ngrcppu(room.players[def.currentUserName], room.gameState);
  });
}
function addGameLog(code, msg) {
  def.db.ref(`rooms/${code}/gameState/log`).transaction(log => {
    if (!log) log = [];
    log.push(msg);
    return log;
  });
}
function addChatMsg(code, sender, msg) {
  const chatMsg = {sender, msg};
  def.db.ref(`rooms/${code}/gameState/chat`).transaction(chat => {
    if (!chat) chat = [];
    chat.push(chatMsg);
    return chat;
  });
}
function ngrcplu(players) {
  const container = document.getElementById("ngrcplc");
  container.innerHTML = "";
  Object.entries(players).forEach(([id, p]) => {
    const div = document.createElement("div");
    div.className = "ngrcplp";
    div.innerHTML = `
      <span class="ngrcplpn muted">${p.name}</span>
      <span class="ngrcplpm muted">₦${p.money}</span>
    `;
    container.appendChild(div);
  });
}
function ngrcpmu(players) {
  document.querySelectorAll('.ngbcpp').forEach(el => el.remove());
  Object.values(players).forEach((player) => {
    const wrapper = document.createElement("div");
    wrapper.className = "ngbcpp-wrapper";
    const playerCharacter = document.createElement("div");
    playerCharacter.className = `ngbcpp ${player.color}`;
    wrapper.append(playerCharacter);
    const targetDiv = document.getElementById(`ngbpp${player.position}`);
    if (targetDiv) {
      targetDiv.append(wrapper);
      if (player.position < 10) wrapper.style.transform = "rotate(-90deg)";
      else if (player.position < 20) wrapper.style.transform = "rotate(0deg)";
      else if (player.position < 30) wrapper.style.transform = "rotate(90deg)";
      else if (player.position < 40) wrapper.style.transform = "rotate(180deg)";
    }
    else {
      console.warn(`Board position element #${player.position} not found.`);
    }
  });
}
function ngrcgu(gamelog) {
  const ngrcglm = document.getElementById('ngrcglm');
  ngrcglm.innerHTML = "";
  gamelog.forEach(line => {
    const div = document.createElement("div");
    div.className = "ngrcglml muted";
    div.innerText = line;
    ngrcglm.appendChild(div);
  });
}
function ngrcgcu(gameChat) {
  if (!gameChat || !Array.isArray(gameChat)) return;
  const ngrccm = document.getElementById("ngrccm");
  ngrccm.innerHTML = "";
  gameChat.forEach((chat) => {
    const div = document.createElement("div");
    div.className = "ngrccml";
    if (chat.sender === def.currentUserName) div.className = "ngrccml player";
    else div.className = "ngrccml opponent";
      div.innerHTML = `
      <span class="ngrccml muted">${chat.sender}: ${chat.msg}</span>
    `;
    ngrccm.appendChild(div);
  });
}
const ngrccis = document.getElementById('ngrccis');
const ngrccit = document.getElementById('ngrccit');
const ngrccm = document.getElementById('ngrccm');
ngrccis.addEventListener('click', () => {
  const msg = ngrccit.value.trim();
  addChatMsg(window.ngrRoomCode, def.currentUserName, msg);
  ngrccit.value = '';
  ngrccm.scrollTop = ngrccm.scrollHeight;
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
const NGB_BOARD = [
  { type: "go", name: "WhiteHole" },
  { type: "property", name: "Vesta", price: 60, color: "brown", rent: [2,10,30,90,160,250] },
  { type: "chance", name: "Wormhole" },
  { type: "property", name: "Pallas", price: 60, color: "brown", rent: [4,20,60,180,320,450] },        // 3
  { type: "tax", amount: 0.10, name: "Cosmo Tax" },        // 4
  { type: "railroad", name: "NASA", price: 200, rent: [25,50,100,200] },                              // 5
  { type: "property", name: "Ceres", price: 100, color: "lightblue", rent: [6,30,90,270,400,550] },    // 6
  { type: "community", name: "Rift" },                     // 7
  { type: "property", name: "Haumea", price: 100, color: "lightblue", rent: [6,30,90,270,400,550] },   // 8
  { type: "property", name: "Eris", price: 120, color: "lightblue", rent: [8,40,100,300,450,600] },     // 9
  { type: "jail_visit", name: "Event Horizon" },           // 10
  { type: "property", name: "Europa", price: 140, color: "pink", rent: [10,50,150,450,625,750] },      // 11
  { type: "utility", name: "SpaceX Grid", price: 150 },    // 12
  { type: "property", name: "Enceladus", price: 140, color: "pink", rent: [10,50,150,450,625,750] },   // 13
  { type: "property", name: "Titan", price: 160, color: "pink", rent: [12,60,180,500,700,900] },       // 14
  { type: "railroad", name: "JAXA", price: 200, rent: [25,50,100,200] },                              // 15
  { type: "property", name: "Halley", price: 180, color: "orange", rent: [14,70,200,550,750,950] },    // 16
  { type: "chance", name: "Wormhole" },                    // 17
  { type: "property", name: "Swift", price: 180, color: "orange", rent: [14,70,200,550,750,950] },     // 18
  { type: "property", name: "Encke", price: 200, color: "orange", rent: [16,80,220,600,800,1000] },    // 19
  { type: "free", name: "Neutron" },                       // 20
  { type: "property", name: "Mercury", price: 220, color: "red", rent: [18,90,250,700,875,1050] },
  { type: "community", name: "Rift" },                     // 22
  { type: "property", name: "Venus", price: 220, color: "red", rent: [18,90,250,700,875,1050] },
  { type: "property", name: "Earth", price: 240, color: "red", rent: [20,100,300,750,925,1100] },
  { type: "railroad", name: "ESA", price: 200, rent: [25,50,100,200] },
  { type: "property", name: "Mars", price: 260, color: "yellow", rent: [22,110,330,800,975,1150] },
  { type: "property", name: "Jupiter", price: 260, color: "yellow", rent: [22,110,330,800,975,1150] },
  { type: "utility", name: "Hydro Core", price: 150 },     // 28
  { type: "property", name: "Saturn", price: 280, color: "yellow", rent: [24,120,360,850,1025,1200] },
  { type: "go_to_jail", name: "BlackHole" },               // 30
  { type: "property", name: "Uranus", price: 300, color: "green", rent: [26,130,390,900,1100,1275] },
  { type: "property", name: "Neptune", price: 300, color: "green", rent: [26,130,390,900,1100,1275] },
  { type: "chance", name: "Wormhole" },                    // 33
  { type: "property", name: "PlanetX", price: 320, color: "green", rent: [28,150,450,1000,1200,1400] },
  { type: "railroad", name: "ISRO", price: 200, rent: [25,50,100,200] },
  { type: "community", name: "Rift" },                     // 36
  { type: "property", name: "Sun", price: 350, color: "darkblue", rent: [35,175,500,1100,1300,1500] },
  { type: "tax", amount: 75, name: "Prisma Tax" },
  { type: "property", name: "Neutrox", price: 400, color: "darkblue", rent: [50,200,600,1400,1700,2000] }
];

// function ngrcppu(player, gameState) {
//   while(gameState.turn === player.turn) {
//     if(gameState.turn === player.turn) {
//       dices.forEach((dice, i) => {
//         dice.addEventListener("click", () => {
//           dices.forEach((d, idx) => {
//             const result = rollDice(d);
//             if (idx === 0) currentDiceValue1 = result;
//             if (idx === 1) currentDiceValue2 = result;
//           });
//           const lastDice = dices[dices.length - 1];
//           const onEnd = (ev) => {
//             if (ev.propertyName && ev.propertyName.includes("transform")) {
//               console.log(`Dice 1 value: ${currentDiceValue1}\nDice 2 value: ${currentDiceValue2}`);
//               lastDice.removeEventListener("transitionend", onEnd);
//             }
//           };
//           lastDice.addEventListener("transitionend", onEnd);
//           // handleDiceResult(window.ngrRoomCode, def.currentUserName, currentDiceValue1, currentDiceValue2);
//         });
//       });
//       player.position+= (currentDiceValue1 + currentDiceValue2);
//       if (currentDiceValue1 != currentDiceValue2) gameState.turn+=1;
//     }
//   }
// }
// async function handleDiceResult(roomCode, playerName, d1, d2) {
//   const snap = await def.db.ref(`rooms/${roomCode}`).once("value");
//   const room = snap.val();
//   if (!room) return;
//   const player = room.players[playerName];
//   const doubles = d1 === d2;
//   player.doubles = (player.doubles || 0);
//   if (doubles) {
//     player.doubles++;
//     if (player.doubles >= 3) {
//       player.position = 11;
//       player.inJail = true;
//       player.doubles = 0;
//       room.gameState.turn++;
//       await savePlayer(roomCode, playerName, player);
//       addGameLog(roomCode, `${playerName} rolled 3 doubles and went to Jail`);
//       return;
//     }
//   } else {
//     player.doubles = 0;
//   }
//   let newPos = player.position + d1 + d2;
//   if (newPos >= 40) {
//     newPos -= 40;
//     player.money += 200;
//     addGameLog(roomCode, `${playerName} passed GO and collected $200`);
//   }
//   player.position = newPos;
//   await savePlayer(roomCode, playerName, player);
//   await handleTileEffect(roomCode, playerName, newPos);
//   if (!doubles) {
//     room.gameState.turn++;
//     await def.db.ref(`rooms/${roomCode}/gameState/turn`).set(room.gameState.turn);
//   }
// }
// async function savePlayer(roomCode, playerName, player) {
//   await def.db.ref(`rooms/${roomCode}/players/${playerName}`).set(player);
// }
// function handleTileEffect(roomCode, player, tileIndex) {
//   const tile = NGB_BOARD[tileIndex];
//   if (tile.type === "go") {
//     addGameLog(roomCode, `${player.name} landed on GO`);
//     return;
//   }
//   if (tile.type === "jail_visit") {
//     addGameLog(roomCode, `${player.name} is just visiting Event Horizon`);
//     return;
//   }
//   if (tile.type === "go_to_jail") {
//     player.position = 11;
//     player.inJail = true;
//     addGameLog(roomCode, `${player.name} was sucked into the BlackHole and sent to Jail`);
//     return savePlayer(roomCode, player.name, player);
//   }
//   if (tile.type === "chance") {
//     drawChanceCard(roomCode, player);
//     return;
//   }
//   if (tile.type === "community") {
//     drawCommunityCard(roomCode, player);
//     return;
//   }
//   if (tile.type === "tax") {
//     const amount = tile.amount < 1 ? Math.floor(player.money * tile.amount) : tile.amount;
//     player.money -= amount;
//     addGameLog(roomCode, `${player.name} paid ₦${amount} in taxes`);
//     return savePlayer(roomCode, player.name, player);
//   }
//   if (tile.type === "railroad" || tile.type === "property" || tile.type === "utility") {
//     return checkProperty(roomCode, player, tileIndex);
//   }
// }

// async function applyCard(roomCode, playerName, card) {
//   addGameLog(roomCode, `${playerName} drew: ${card.message}`);
//   const snap = await def.db.ref(`rooms/${roomCode}`).once("value");
//   const room = snap.val();
//   const player = room.players[playerName];
//   if (card.type === "money") {
//     player.money += card.amount;
//     return savePlayer(roomCode, playerName, player);
//   }
//   if (card.type === "move") {
//     player.position = card.to;
//     await savePlayer(roomCode, playerName, player);
//     return handleTileEffect(roomCode, playerName, card.to);
//   }
//   if (card.type === "jail") {
//     player.position = 11;
//     player.inJail = true;
//     return savePlayer(roomCode, playerName, player);
//   }
//   if (card.type === "jailfree") {
//     player.jailFree = true;
//     return savePlayer(roomCode, playerName, player);
//   }
// }
// async function startPurchaseFlow(roomCode, playerName, pos, tile) {
//   // Here you show your UI buttons
//   // "Buy" → buyProperty(...)
//   // "Auction" → startAuction(...)
// }

// async function buyProperty(roomCode, playerName, pos, tile) {
//   const snap = await def.db.ref(`rooms/${roomCode}`).once("value");
//   const room = snap.val();
//   const player = room.players[playerName];
//   if (player.money < tile.price) {
//     addGameLog(roomCode, `${playerName} cannot afford ${tile.name}`);
//     return;
//   }
//   player.money -= tile.price;
//   tile.owner = playerName;
//   await def.db.ref(`rooms/${roomCode}/players/${playerName}`).set(player);
//   await def.db.ref(`rooms/${roomCode}/board/${pos}`).set(tile);
//   addGameLog(roomCode, `${playerName} bought ${tile.name}`);
// }


// -------------- Snake Game -------------
def.snakeCanvas.width = 25 * Math.floor(def.snakeSize / 25);
def.snakeCanvas.height = 25 * Math.floor(def.snakeSize / 25);
def.snakeCanvas.width = 25 * def.snakeBox;
def.snakeCanvas.height = 25 * def.snakeBox;
if (def.db && def.currentUser) {
  def.db.ref(`users/${def.currentUser.uid}/highscores/snakeHighScore`).once('value')
    .then(snapshot => {
      def.snakeHighScore = snapshot.val();
    });
}
else def.snakeHighScore = parseInt(localStorage.getItem("snakeHighScore")) || 0;
document.getElementById("snakeHighScore").textContent = "High score = " + def.snakeHighScore;
function startSnakeGame() {
  def.snakeMoveDelay = 200;
  def.snake = [{ x: 3 * def.snakeBox, y: 3 * def.snakeBox }];
  def.snakeDirection = "RIGHT";
  def.snakeFood = randomFood();
  def.snakeScore = 0;
  def.snakeFoodsEaten = 0;
  def.snakeSpecialFood = null;
  def.snakePaused = false;
  def.snakeRunning = true;
  def.snakeLastFrameTime = 0;
  def.snakeAccumulatedTime = 0;
  def.snakePauseBtn.textContent = "Pause";
  def.snakeCanvas.focus();
  requestAnimationFrame(snakeGameLoop);
}
function randomFood() {
  return {
    x: Math.floor(Math.random() * 25) * def.snakeBox,
    y: Math.floor(Math.random() * 25) * def.snakeBox
  };
}
function spawnSpecialFood() {
  def.snakeSpecialFood = {
    x: Math.floor(Math.random() * 25) * def.snakeBox,
    y: Math.floor(Math.random() * 25) * def.snakeBox
  };
  clearTimeout(def.snakeSpecialFoodTimer);
  def.snakeSpecialFoodTimer = setTimeout(() => (def.snakeSpecialFood = null), def.snakeSpecialFoodTime);
}
function hitSpecialFood(snakeX, snakeY) {
  if (!def.snakeSpecialFood) return false;
  return (
    snakeX < def.snakeSpecialFood.x + def.snakeBox * 2 &&
    snakeX + def.snakeBox > def.snakeSpecialFood.x &&
    snakeY < def.snakeSpecialFood.y + def.snakeBox * 2 &&
    snakeY + def.snakeBox > def.snakeSpecialFood.y
  );
}
function snakeGameCheckCollision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}
def.snakeStartBtn.onclick = () => {
  if (def.snakeRunning) startSnakeGame();
  else {
    startSnakeGame();
    def.snakeStartBtn.textContent = "Restart"
  }
}
def.snakePauseBtn.addEventListener("click", () => {
  if (!def.snakeRunning) return;
  def.snakePaused = !def.snakePaused;
  def.snakePauseBtn.textContent = def.snakePaused ? "Resume" : "Pause";
  if (!def.snakePaused) requestAnimationFrame(snakeGameLoop);
});
function drawGame() {
  def.snakeCtx.fillStyle = "#000";
  def.snakeCtx.fillRect(0, 0, 25 * def.snakeBox, 25 * def.snakeBox);
  def.snakeCtx.beginPath();
  def.snakeCtx.arc(def.snakeFood.x + def.snakeBox / 2, def.snakeFood.y + def.snakeBox / 2, def.snakeBox / 2, 0, Math.PI * 2);
  def.snakeCtx.fillStyle = "#ac2727ff";
  def.snakeCtx.fill();
  if (def.snakeSpecialFood) {
    def.snakeCtx.beginPath();
    def.snakeCtx.arc(def.snakeSpecialFood.x + def.snakeBox, def.snakeSpecialFood.y + def.snakeBox, def.snakeBox, 0, Math.PI * 2);
    def.snakeCtx.fillStyle = "gold";
    def.snakeCtx.fill();
  }
  def.snake.forEach((segment, index) => {
    def.snakeCtx.fillStyle = index === 0 ? "rgba(13, 55, 128, 1)" : "rgba(53, 127, 208, 1)";
    def.snakeCtx.fillRect(segment.x, segment.y, def.snakeBox, def.snakeBox);
  });
}
function updateGame() {
  def.snakeLeftBtn.addEventListener("click", () => { if (def.snakeDirection !== "RIGHT") def.snakeDirection = "LEFT"; });
  def.snakeUpBtn.addEventListener("click", () => { if (def.snakeDirection !== "DOWN") def.snakeDirection = "UP"; });
  def.snakeRightBtn.addEventListener("click", () => { if (def.snakeDirection !== "LEFT") def.snakeDirection = "RIGHT"; });
  def.snakeDownBtn.addEventListener("click", () => { if (def.snakeDirection !== "UP") def.snakeDirection = "DOWN"; });
  document.addEventListener("keydown",
    event => {
      if (!def.snakeRunning) return;
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        event.preventDefault();
      }
      if ((key === "a" || key === "arrowleft") && def.snakeDirection !== "RIGHT") def.snakeDirection = "LEFT";
      else if ((key === "w" || key === "arrowup") && def.snakeDirection !== "DOWN") def.snakeDirection = "UP";
      else if ((key === "d" || key === "arrowright") && def.snakeDirection !== "LEFT") def.snakeDirection = "RIGHT";
      else if ((key === "s" || key === "arrowdown") && def.snakeDirection !== "UP") def.snakeDirection = "DOWN";
    },
    { passive: false }
  );
  let snakeX = def.snake[0].x;
  let snakeY = def.snake[0].y;
  if (def.snakeDirection === "LEFT") snakeX -= def.snakeBox;
  if (def.snakeDirection === "UP") snakeY -= def.snakeBox;
  if (def.snakeDirection === "RIGHT") snakeX += def.snakeBox;
  if (def.snakeDirection === "DOWN") snakeY += def.snakeBox;
  if (snakeX === def.snakeFood.x && snakeY === def.snakeFood.y) {
    def.snakeScore += 5;
    def.snakeFoodsEaten++;
    def.snakeMoveDelay -= 2.5;
    def.snakeFood = randomFood();
    if (def.snakeFoodsEaten % 10 === 0) spawnSpecialFood();
  } else {
    def.snake.pop();
  }
  if (def.snakeSpecialFood && hitSpecialFood(snakeX, snakeY)) {
    def.snakeScore += 50;
    def.snakeSpecialFood = null;
    clearTimeout(def.snakeSpecialFoodTimer);
  }
  const newHead = { x: snakeX, y: snakeY };
  if (
    snakeX < 0 || snakeY < 0 ||
    snakeX >= def.snakeCanvas.width || snakeY >= def.snakeCanvas.height ||
    snakeGameCheckCollision(newHead, def.snake)
  ) {
    gameOver();
    return;
  }
  def.snake.unshift(newHead);
  def.snakeScoreHolder.textContent = "Score: " + def.snakeScore;
}
function gameOver() {
  def.snakeRunning = false;
  clearTimeout(def.snakeSpecialFoodTimer);
  def.snake = [];
  def.snakeFood = null;
  def.snakeCtx.clearRect(0, 0, def.snakeCanvas.width, def.snakeCanvas.height);
  def.snakeCtx.fillStyle = "#000";
  def.snakeCtx.fillRect(0, 0, def.snakeCanvas.width, def.snakeCanvas.height);
  def.snakeCtx.font = "32px Arial";
  def.snakeCtx.fillStyle = "white";
  def.snakeCtx.textAlign = "center";
  const cx = def.snakeCanvas.width / 2;
  const cy = def.snakeCanvas.height / 2;
  if (def.db && def.currentUser) {
    def.db.ref(`highScores/snakeGame/${def.currentUserName}`).set({
      name: def.currentUserName,
      score: def.snakeScore
    });
    def.db.ref(`highScores/snakeGame`).once('value').then(snapshot => {
      const scores = snapshot.val() || {};
      const sorted = Object.values(scores)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      const position = sorted.findIndex(entry => entry.name === def.currentUserName && entry.score === def.snakeScore) + 1;
      if (position > 0 && position <= 10) {
        if (def.snakeScore > def.snakeHighScore) {
          def.snakeHighScore = def.snakeScore;
          localStorage.setItem("snakeHighScore", def.snakeHighScore);
          def.db.ref(`users/${def.currentUser.uid}/highscores`).set({
            snakeHighscore: def.snakeHighScore
          });
          document.getElementById("snakeHighScore").textContent = "High score = " + def.snakeHighScore;
          def.snakeCtx.fillStyle = "white";
          def.snakeCtx.fillText("New High Score: " + def.snakeHighScore + "!", cx, cy - 40);
        }
        else {
          def.snakeCtx.fillStyle = "white";
          def.snakeCtx.fillText(`Game Over! Score: ${def.snakeScore}`, cx, cy - 40);
        }
        def.snakeCtx.fillText(`Congrats! You're #${position} on the leaderboard!`, cx, cy + 10);
      } 
      else {
        if (def.snakeScore > def.snakeHighScore) {
          def.snakeHighScore = def.snakeScore;
          localStorage.setItem("snakeHighScore", def.snakeHighScore);
          def.db.ref(`users/${def.currentUser.uid}/highscores`).set({
            snakeHighscore: def.snakeHighScore
          });
          document.getElementById("snakeHighScore").textContent = "High score = " + def.snakeHighScore;
          def.snakeCtx.fillStyle = "white";
          def.snakeCtx.fillText("New High Score: " + def.snakeHighScore + "!", cx, cy - 20);
        }
        else {
          def.snakeCtx.fillStyle = "white";
          def.snakeCtx.fillText("Game Over!", cx, cy - 20);
        }
        def.snakeCtx.fillStyle = "white";
        def.snakeCtx.fillText(`Score: ${def.snakeScore}`, cx, cy + 20);
      }
    });
  }
  else {
    if (def.snakeScore > def.snakeHighScore) {
      def.snakeHighScore = def.snakeScore;
      localStorage.setItem("snakeHighScore", def.snakeHighScore);
      document.getElementById("snakeHighScore").textContent = "High score = " + def.snakeHighScore;
      def.snakeCtx.fillStyle = "white";
      def.snakeCtx.fillText("New High Score: " + def.snakeHighScore + "!", cx, cy - 20);
    }
    else {
      def.snakeCtx.fillStyle = "white";
      def.snakeCtx.fillText("Game Over!", cx, cy - 20);
    }
    def.snakeCtx.fillStyle = "white";
    def.snakeCtx.fillText(`Score: ${def.snakeScore}`, cx, cy + 20);
  }
  def.snakeCtx.font = "20px Arial";
  def.snakeCtx.fillStyle = "white";
  def.snakeCtx.fillText("Press Restart to Play Again", cx, cy + 90);
}
function showSnakeLeaderScores() {
  const leaderboard = document.getElementById('snakeGameLeaderboard');
  const scoresRef = def.db.ref(`highScores/snakeGame`);
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
  if (!def.snakeRunning) return;
  if (def.snakePaused) {
    def.snakeLastFrameTime = timestamp;
    requestAnimationFrame(snakeGameLoop);
    return;
  }
  if (!def.snakeLastFrameTime) def.snakeLastFrameTime = timestamp;
  const snakeDeltaTime = timestamp - def.snakeLastFrameTime;
  def.snakeLastFrameTime = timestamp;
  def.snakeAccumulatedTime += snakeDeltaTime;
  if (def.snakeAccumulatedTime >= def.snakeMoveDelay) {
    updateGame();
    def.snakeAccumulatedTime = 0;
  }
  if (!def.snakeRunning) return;
  drawGame();
  requestAnimationFrame(snakeGameLoop);
}
def.snakeStartBtn.addEventListener("click", startSnakeGame);

// --------- Jet Shooter Game ----------
if (def.db && def.currentUser) {
  def.db.ref(`users/${def.currentUser.uid}/highscores/jetShooterHighScore`).once('value')
    .then(snapshot => {
      def.jetShooterHighScore = snapshot.val();
    });
}
else def.jetShooterHighScore = parseInt(localStorage.getItem("jetShooterHighScore")) || 0;
document.getElementById("jetShooterHighScore").textContent = "High score = " + def.jetShooterHighScore;
function jetShooterGameStart() {
  if (def.jetShooterFrameId) cancelAnimationFrame(def.jetShooterFrameId);
  if (def.gameFrameId) cancelAnimationFrame(def.gameFrameId);
  def.jetShooterLastFrameTime = 0;
  def.jetShooterPaused = false;
  def.jetShooterRunning = true;
  def.jetShooter = { x: 50 * def.jetShooterBox, y: 95 * def.jetShooterBox, size: def.jetShooterBox * 4 };
  def.jetShooterBullets = [];
  def.jetShooterEnemies = [];
  def.jetShooterShields = [];
  def.jetShooterBulletBarrel = [];
  def.jetShooterScore = 0;
  def.jetShooterEnemyTimer = 0;
  def.jetShooterShieldTimer = 0;
  def.jetShooterBulletTimer = 0;
  def.jetShooterHasShield = 0;
  def.jetShooterBulletRemaining = 100;
  def.jetShooterPauseBtn.textContent = "Pause";
  def.jetShooterCanvas.focus();
  def.jetShooterLastFrameTime = performance.now();
  def.jetShooterFrameId = requestAnimationFrame(jetShooterGameLoop);
  def.gameFrameId = requestAnimationFrame(gameLoop);
}
function jetShooterGameLoop(timestamp) {
  if (!def.jetShooterRunning) return;
  if (def.jetShooterPaused) {
    def.jetShooterFrameId = requestAnimationFrame(jetShooterGameLoop);
    return;
  }
  const delta = timestamp - def.jetShooterLastFrameTime;
  def.jetShooterLastFrameTime = timestamp;
  updateJetShooter(delta);
  drawJetShooter();
  def.jetShooterFrameId = requestAnimationFrame(jetShooterGameLoop);
}
function updateJetShooter(delta) {
  def.jetShooterBullets.forEach(b => (b.y -= b.speed));
  def.jetShooterBullets = def.jetShooterBullets.filter(b => b.y + b.size > 0);
  def.jetShooterEnemyTimer += delta;
  if (def.jetShooterEnemyTimer > def.jetShooterEnemySpawnRate) {
    spawnEnemy();
    def.jetShooterEnemyTimer = 0;
  }
  def.jetShooterShieldTimer += delta;
  if (def.jetShooterShieldTimer > def.jetShooterShieldSpawnRate) {
    spawnShield();
    def.jetShooterShieldTimer = 0;
  }
  def.jetShooterBulletTimer += delta;
  if (def.jetShooterBulletTimer > def.jetShooterBulletBarrelRate) {
    spawnBulletBarrel();
    def.jetShooterBulletTimer = 0;
  }
  def.jetShooterEnemies.forEach(e => (e.y += e.speed));
  def.jetShooterEnemies = def.jetShooterEnemies.filter(e => e.y < def.jetShooterCanvas.height);
  def.jetShooterShields.forEach(s => {
    s.y += s.speedY;
    s.angle += s.oscillationSpeed;
    s.x = s.baseX + Math.sin(s.angle) * s.amplitude;
  });
  def.jetShooterBulletBarrel.forEach(b => {
    b.y += b.speedY;
    b.angle += b.oscillationSpeed;
    b.x = b.baseX + Math.sin(b.angle) * b.amplitude;
  });
  def.jetShooterShields = def.jetShooterShields.filter(s => s.y < def.jetShooterCanvas.height);
  for (let i = def.jetShooterEnemies.length - 1; i >= 0; i--) {
    for (let j = def.jetShooterBullets.length - 1; j >= 0; j--) {
      if (jetShooterCheckCollision(def.jetShooterEnemies[i], def.jetShooterBullets[j])) {
        def.jetShooterEnemies.splice(i, 1);
        def.jetShooterBullets.splice(j, 1);
        def.jetShooterScore += 10;
        break;
      }
    }
  }
  for (let i = 0; i < def.jetShooterEnemies.length; i++) {
    if (jetShooterCheckCollision(def.jetShooterEnemies[i], def.jetShooter)) {
      if (def.jetShooterHasShield >= 1) {
        def.jetShooterHasShield--;
        def.jetShooterShieldHolder.textContent = "Shields: " + def.jetShooterHasShield;
        def.jetShooterEnemies.splice(i, 1);
        break;
      } else {
        jetShooterGameOver();
        return;
      }
    }
    if (def.jetShooterEnemies[i].y + def.jetShooterEnemies[i].size >= def.jetShooterCanvas.height) {
      def.jetShooterScoreHolder.textContent = "Score: " + def.jetShooterScore;
      def.jetShooterEnemies.splice(i, 1);
    }
  }
  for (let i = 0; i < def.jetShooterShields.length; i++) {
    if (jetShooterCheckCollision(def.jetShooterShields[i], def.jetShooter)) {
      jetShooterExtraLife();
      def.jetShooterShields.splice(i, 1);
      break;
    }
  }
  for (let i = 0; i < def.jetShooterBulletBarrel.length; i++) {
    if (jetShooterCheckCollision(def.jetShooterBulletBarrel[i], def.jetShooter)) {
      jetShooterAddBullets();
      def.jetShooterBulletBarrel.splice(i, 1);
      break;
    }
  }
}
function drawJetShooter() {
  def.jetShooterCtx.clearRect(0, 0, def.jetShooterCanvas.width, def.jetShooterCanvas.height);
  const jx = def.jetShooter.x + def.jetShooter.size / 2;
  const jy = def.jetShooter.y + def.jetShooter.size / 2;
  def.jetShooterCtx.beginPath();
  def.jetShooterCtx.moveTo(jx, def.jetShooter.y - def.jetShooter.size * 0.3);
  def.jetShooterCtx.lineTo(jx - def.jetShooter.size * 0.35, def.jetShooter.y + def.jetShooter.size * 0.9);
  def.jetShooterCtx.lineTo(jx + def.jetShooter.size * 0.35, def.jetShooter.y + def.jetShooter.size * 0.9);
  def.jetShooterCtx.closePath();
  def.jetShooterCtx.fillStyle = def.jetShooterHasShield >= 1 ? "#6aff91" : "cyan";
  def.jetShooterCtx.fill();
  def.jetShooterCtx.strokeStyle = "#00bcd4";
  def.jetShooterCtx.lineWidth = 2;
  def.jetShooterCtx.stroke();
  def.jetShooterCtx.beginPath();
  def.jetShooterCtx.ellipse(
    jx,
    def.jetShooter.y + def.jetShooter.size * 0.25,
    def.jetShooter.size * 0.15,
    def.jetShooter.size * 0.25,
    0,
    0,
    Math.PI * 2
  );
  def.jetShooterCtx.fillStyle = "rgba(0, 150, 255, 0.6)";
  def.jetShooterCtx.fill();
  def.jetShooterCtx.strokeStyle = "white";
  def.jetShooterCtx.lineWidth = 1.5;
  def.jetShooterCtx.stroke();
  def.jetShooterCtx.beginPath();
  def.jetShooterCtx.moveTo(jx - def.jetShooter.size * 0.6, def.jetShooter.y + def.jetShooter.size * 0.4);
  def.jetShooterCtx.lineTo(jx + def.jetShooter.size * 0.6, def.jetShooter.y + def.jetShooter.size * 0.4);
  def.jetShooterCtx.lineTo(jx + def.jetShooter.size * 0.3, def.jetShooter.y + def.jetShooter.size * 0.7);
  def.jetShooterCtx.lineTo(jx - def.jetShooter.size * 0.3, def.jetShooter.y + def.jetShooter.size * 0.7);
  def.jetShooterCtx.closePath();
  def.jetShooterCtx.fillStyle = def.jetShooterHasShield >= 1 ? "#7affb2" : "#00bcd4";
  def.jetShooterCtx.fill();
  def.jetShooterCtx.strokeStyle = "#007bff";
  def.jetShooterCtx.stroke();
  const gradient = def.jetShooterCtx.createRadialGradient(jx, def.jetShooter.y + def.jetShooter.size * 0.95, 2, jx, def.jetShooter.y + def.jetShooter.size * 0.95, 20);
  gradient.addColorStop(0, "rgba(255, 150, 0, 0.9)");
  gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
  def.jetShooterCtx.beginPath();
  def.jetShooterCtx.fillStyle = gradient;
  def.jetShooterCtx.arc(jx, def.jetShooter.y + def.jetShooter.size * 0.95, def.jetShooter.size * 0.25, 0, Math.PI * 2);
  def.jetShooterCtx.fill();

  def.jetShooterCtx.fillStyle = "yellow";
  def.jetShooterBullets.forEach(b => {
    def.jetShooterCtx.fillRect(b.x, b.y, b.size, b.size * 2);
  });
  def.jetShooterEnemies.forEach(e => {
    const cx = e.x + e.size / 2;
    const cy = e.y + e.size / 2;
    def.jetShooterCtx.fillStyle = "silver";
    def.jetShooterCtx.beginPath();
    def.jetShooterCtx.moveTo(cx, e.y + e.size);
    def.jetShooterCtx.lineTo(e.x, e.y);
    def.jetShooterCtx.lineTo(e.x + e.size, e.y);
    def.jetShooterCtx.closePath();
    def.jetShooterCtx.fill();
    def.jetShooterCtx.fillStyle = "cyan";
    def.jetShooterCtx.beginPath();
    def.jetShooterCtx.arc(cx, e.y + e.size * 0.55, e.size * 0.15, 0, Math.PI * 2);
    def.jetShooterCtx.fill();
    def.jetShooterCtx.fillStyle = "orange";
    def.jetShooterCtx.beginPath();
    def.jetShooterCtx.moveTo(cx - e.size * 0.15, e.y);
    def.jetShooterCtx.lineTo(cx + e.size * 0.15, e.y);
    def.jetShooterCtx.lineTo(cx, e.y - e.size * 0.3);
    def.jetShooterCtx.closePath();
    def.jetShooterCtx.fill();
  });
  def.jetShooterShields.forEach(s => {
    def.jetShooterCtx.beginPath();
    def.jetShooterCtx.moveTo(s.x + s.size / 2, s.y);
    def.jetShooterCtx.lineTo(s.x, s.y + s.size * 0.4);
    def.jetShooterCtx.quadraticCurveTo(
      s.x + s.size * 0.1,
      s.y + s.size * 0.9,
      s.x + s.size / 2,
      s.y + s.size
    );
    def.jetShooterCtx.quadraticCurveTo(
      s.x + s.size * 0.9,
      s.y + s.size * 0.9,
      s.x + s.size,
      s.y + s.size * 0.4
    );
    def.jetShooterCtx.closePath();
    def.jetShooterCtx.fillStyle = "lightgreen";
    def.jetShooterCtx.fill();
    def.jetShooterCtx.strokeStyle = "white";
    def.jetShooterCtx.lineWidth = 2;
    def.jetShooterCtx.stroke();
  });
  def.jetShooterBulletBarrel.forEach(b => {
    const cx = b.x + b.size / 2;
    const cy = b.y + b.size / 2;
    const w = b.size * 0.6;
    const h = b.size * 1.4;
    def.jetShooterCtx.beginPath();
    def.jetShooterCtx.moveTo(cx - w / 2, cy - h / 4);
    def.jetShooterCtx.lineTo(cx - w / 2, cy + h / 2);
    def.jetShooterCtx.lineTo(cx + w / 2, cy + h / 2);
    def.jetShooterCtx.lineTo(cx + w / 2, cy - h / 4);
    def.jetShooterCtx.closePath();
    def.jetShooterCtx.fillStyle = "gold";
    def.jetShooterCtx.fill();
    def.jetShooterCtx.strokeStyle = "#b8860b";
    def.jetShooterCtx.lineWidth = 2;
    def.jetShooterCtx.stroke();
    def.jetShooterCtx.beginPath();
    def.jetShooterCtx.moveTo(cx - w / 2, cy - h / 4);
    def.jetShooterCtx.lineTo(cx + w / 2, cy - h / 4);
    def.jetShooterCtx.lineTo(cx, cy - h / 2);
    def.jetShooterCtx.closePath();
    def.jetShooterCtx.fillStyle = "silver";
    def.jetShooterCtx.fill();
    def.jetShooterCtx.strokeStyle = "#999";
    def.jetShooterCtx.stroke();
  });
  def.jetShooterScoreHolder.textContent = "Score: " + def.jetShooterScore;
  def.jetShooterBulletHolder.textContent = "Bullets remaining: " + def.jetShooterBulletRemaining;
  def.jetShooterShieldHolder.textContent = "Shields: " + def.jetShooterHasShield;
  if (def.jetShooterMessage) {
    def.jetShooterCtx.save();
    def.jetShooterCtx.font = "28px Arial";
    def.jetShooterCtx.fillStyle = "white";
    def.jetShooterCtx.textAlign = "center";
    const cx = def.jetShooterCanvas.width / 2;
    const cy = def.jetShooterCanvas.height / 3;
    def.jetShooterCtx.fillText(def.jetShooterMessage, cx, cy);
    def.jetShooterCtx.restore();
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
  const size = def.jetShooterBox * 3;
  const y = -size;
  const speedY = 3 + Math.random() * 4;
  const baseX = Math.random() * (def.jetShooterCanvas.width - size);
  const amplitude = 100 + (Math.random() * 100);
  const oscillationSpeed = 0.02 + (Math.random() * 0.03);
  const angle = Math.random() * Math.PI / 180;
  const x = baseX + Math.sin(angle) * amplitude;
  def.jetShooterShields.push({
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
  const size = def.jetShooterBox * 3;
  const y = -size;
  const speedY = 3 + Math.random() * 4;
  const baseX = Math.random() * (def.jetShooterCanvas.width - size);
  const amplitude = 30 + (Math.random() * 30);
  const oscillationSpeed = 0.02 + (Math.random() * 0.03);
  const angle = Math.random() * Math.PI / 180;
  const x = baseX + Math.sin(angle) * amplitude;
  def.jetShooterBulletBarrel.push({
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
  const size = def.jetShooterBox * 4;
  const x = Math.random() * (def.jetShooterCanvas.width - size);
  const y = -size;
  const speed = Math.random() * 16 + 4;
  def.jetShooterEnemies.push({ x, y, size, speed });
}
def.jetShooterStartBtn.onclick = () => {
  if (def.jetShooterRunning) jetShooterGameStart();
  else {
    jetShooterGameStart();
    def.jetShooterStartBtn.textContent = "Restart"
  }
}
def.jetShooterPauseBtn.onclick = () => {
  if (!def.jetShooterRunning) return;
  def.jetShooterPaused = !def.jetShooterPaused;
  def.jetShooterPauseBtn.textContent = def.jetShooterPaused ? "Resume" : "Pause";
};
document.addEventListener("keydown", (e) => {
  if (!def.jetShooterRunning) return;
  const key = e.key.toLowerCase();
  def.keys[key] = true;
  if (["arrowleft", "arrowright", "a", "d", " "].includes(key)) e.preventDefault();
  if (!def.jetShooterPaused) {
    if (key === "arrowleft" || key === "a" || key === "arrowright" || key === "d") def.lastKeyPressed = key;
    if (def.lastKeyPressed === "arrowleft" || def.lastKeyPressed === "a") def.movement = -1;
    else if (def.lastKeyPressed === "arrowright" || def.lastKeyPressed === "d") def.movement = 1;
    else def.movement = 0;
  } 
  else def.movement = 0;
  if (key === " " && !def.jetShooterPaused) {
    if (def.jetShooterBulletRemaining === 0) { def.isShooting = false; noBulletJetShooter(); } 
    else def.isShooting = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (!def.jetShooterRunning) return;
  const key = e.key.toLowerCase();
  def.keys[key] = false;
  if (key === def.lastKeyPressed) {
    if (def.keys["arrowright"] || def.keys["d"]) def.lastKeyPressed = def.keys["arrowright"] ? "arrowright" : "d";
    else if (def.keys["arrowleft"] || def.keys["a"]) def.lastKeyPressed = def.keys["arrowleft"] ? "arrowleft" : "a";
    else def.lastKeyPressed = null;
  }
  if (!def.jetShooterPaused) {
    if (def.lastKeyPressed === "arrowleft" || def.lastKeyPressed === "a") def.movement = -1;
    else if (def.lastKeyPressed === "arrowright" || def.lastKeyPressed === "d") def.movement = 1;
    else def.movement = 0;
  } 
  else def.movement = 0;
  if (key === " " && def.isShooting) def.isShooting = false;
});
def.jetShooterLeftBtn.addEventListener('mousedown', () => { if (!def.jetShooterRunning) { return; } def.jetShooterPaused === true ? def.movement = 0 : def.movement = -1; });
def.jetShooterLeftBtn.addEventListener('mouseup', () => { if (def.movement === -1) def.movement = 0; });
def.jetShooterLeftBtn.addEventListener('mouseleave', () => { if (def.movement === -1) def.movement = 0; });
def.jetShooterRightBtn.addEventListener('mousedown', () => { if (!def.jetShooterRunning) { return; } def.jetShooterPaused === true ? def.movement = 0 : def.movement = 1; });
def.jetShooterRightBtn.addEventListener('mouseup', () => { if (def.movement === 1) def.movement = 0; });
def.jetShooterRightBtn.addEventListener('mouseleave', () => { if (def.movement === 1) def.movement = 0; });
def.jetShooterShootBtn.addEventListener('mousedown', () => { if (!def.jetShooterRunning) { return; } if (def.jetShooterPaused) def.isShooting = false; else def.jetShooterBulletRemaining === 0 ? noBulletJetShooter() : def.isShooting = true; });
def.jetShooterShootBtn.addEventListener('mouseup', () => { def.isShooting = false; });
def.jetShooterShootBtn.addEventListener('mouseleave', () => { def.isShooting = false; });
def.jetShooterLeftBtn.addEventListener('touchstart', (e) => { if (!def.jetShooterRunning) { return; } e.preventDefault(); def.jetShooterPaused === true ? def.movement = 0 : def.movement = -1; }, { passive: false });
def.jetShooterLeftBtn.addEventListener('touchend', () => { if (def.movement === -1) def.movement = 0; });
def.jetShooterLeftBtn.addEventListener('touchcancel', () => { if (def.movement === -1) def.movement = 0; });
def.jetShooterRightBtn.addEventListener('touchstart', (e) => { if (!def.jetShooterRunning) { return; } e.preventDefault(); def.jetShooterPaused === true ? def.movement = 0 : def.movement = 1; }, { passive: false });
def.jetShooterRightBtn.addEventListener('touchend', () => { if (def.movement === 1) def.movement = 0; });
def.jetShooterRightBtn.addEventListener('touchcancel', () => { if (def.movement === 1) def.movement = 0; });
def.jetShooterShootBtn.addEventListener('touchstart', (e) => { if (!def.jetShooterRunning) { return; } e.preventDefault(); if (def.jetShooterPaused) def.isShooting = false; else def.jetShooterBulletRemaining === 0 ? noBulletJetShooter() : def.isShooting = true; }, { passive: false });
def.jetShooterShootBtn.addEventListener('touchend', () => { def.isShooting = false; });
def.jetShooterShootBtn.addEventListener('touchcancel', () => { def.isShooting = false; });
function gameLoop() {
  if (def.movement === -1) moveJetShooter(-0.25);
  else if (def.movement === 1) moveJetShooter(0.25);
  const now = performance.now();
  if (def.isShooting && (now - def.lastShotTime > def.FIRE_RATE)) {
    if (def.jetShooterBulletRemaining === 0) noBulletJetShooter();
    else {
    shootJetShooter();
    def.lastShotTime = now;
    }
  }
  def.gameFrameId = requestAnimationFrame(gameLoop);
}
gameLoop();
function moveJetShooter(dir) {
  const step = def.jetShooterBox * 3;
  const newX = def.jetShooter.x + dir * step;
  if (newX >= 0 && newX + def.jetShooter.size <= def.jetShooterCanvas.width) {
    def.jetShooter.x = newX;
  }
}
function shootJetShooter() {
  def.jetShooterBullets.push({
    x: def.jetShooter.x + def.jetShooter.size / 2 - 2,
    y: def.jetShooter.y - 10,
    size: 4,
    speed: 15,
  });
  def.jetShooterBulletRemaining--;
  def.jetShooterBulletHolder.textContent = "Bullets remaining: " + def.jetShooterBulletRemaining;
}
function jetShooterExtraLife() {
  def.jetShooterHasShield++;
  def.jetShooterShieldHolder.textContent = "Shields: " + def.jetShooterHasShield;
}
function jetShooterAddBullets() {
  def.jetShooterBulletRemaining += 100;
  def.jetShooterBulletHolder.textContent = "Bullets remaining: " + def.jetShooterBulletRemaining;
}
function noBulletJetShooter(duration = 1500) {
  if (def.jetShooterMessageTimeout) {
    clearTimeout(def.jetShooterMessageTimeout);
    def.jetShooterMessageTimeout = null;
  }
  def.jetShooterMessage = "No bullets remaining! Capture a bullet barrel.";
  def.jetShooterMessageTimeout = setTimeout(() => {
    def.jetShooterMessage = "";
    def.jetShooterMessageTimeout = null;
  }, duration);
}
function jetShooterGameOver() {
  def.jetShooterRunning = false;
  def.jetShooterEnemies = [];
  def.jetShooterBullets = [];
  def.jetShooterShields = [];
  def.jetShooterBulletBarrel = [];
  requestAnimationFrame(() => {
    def.jetShooterCtx.clearRect(0, 0, def.jetShooterCanvas.width, def.jetShooterCanvas.height);
    def.jetShooterCtx.font = "32px Arial";
    def.jetShooterCtx.fillStyle = "white";
    def.jetShooterCtx.textAlign = "center";
    const cx = def.jetShooterCanvas.width / 2;
    const cy = def.jetShooterCanvas.height / 2;
    if (def.db && def.currentUser) {
      def.db.ref(`highScores/jetShooterGame/${def.currentUserName}`).set({
        name: def.currentUserName,
        score: def.jetShooterScore
      });
      def.db.ref(`highScores/jetShooterGame`).once('value').then(snapshot => {
        const scores = snapshot.val() || {};
        const sorted = Object.values(scores)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        const position = sorted.findIndex(entry => entry.name === def.currentUserName && entry.score === def.jetShooterScore) + 1;
        if (position > 0 && position <= 10) {
          if (def.jetShooterScore > def.jetShooterHighScore) {
            def.jetShooterHighScore = def.jetShooterScore;
            localStorage.setItem("jetShooterHighScore", def.jetShooterHighScore);
            def.db.ref(`users/${def.currentUser.uid}/highscores`).set({
              jetShooterHighScore: def.jetShooterHighScore
            });
            document.getElementById("jetShooterHighScore").textContent = "High score = " + def.jetShooterHighScore;
            def.jetShooterCtx.fillText("New High Score: " + def.jetShooterHighScore + "!", cx, cy + 40);
          }
          else def.jetShooterCtx.fillText(`Game Over! Score: ${def.jetShooterScore}`, cx, cy - 40);
          def.jetShooterCtx.fillText(`Congrats! You're #${position} on the leaderboard!`, cx, cy + 10);
        } 
        else {
          def.jetShooterCtx.fillText("GAME OVER!", cx, cy - 40);
          if (def.jetShooterScore > def.jetShooterHighScore) {
            def.jetShooterHighScore = def.jetShooterScore;
            localStorage.setItem("jetShooterHighScore", def.jetShooterHighScore);
            def.db.ref(`users/${def.currentUser.uid}/highscores`).set({
              jetShooterHighScore: def.jetShooterHighScore
            });
            document.getElementById("jetShooterHighScore").textContent = "High score = " + def.jetShooterHighScore;
            def.jetShooterCtx.fillText("New High Score: " + def.jetShooterHighScore + "!", cx, cy + 40);
          }
          else def.jetShooterCtx.fillText("Score: " + def.jetShooterScore, cx, cy);
        }
      });
    }
    else {
      def.jetShooterCtx.fillText("GAME OVER!", cx, cy - 40);
      if (def.jetShooterScore > def.jetShooterHighScore) {
        def.jetShooterHighScore = def.jetShooterScore;
        localStorage.setItem("jetShooterHighScore", def.jetShooterHighScore);
        document.getElementById("jetShooterHighScore").textContent = "High score = " + def.jetShooterHighScore;
        def.jetShooterCtx.fillText("New High Score: " + def.jetShooterHighScore + "!", cx, cy + 40);
      }
      else def.jetShooterCtx.fillText("Score: " + def.jetShooterScore, cx, cy);
    }
    def.jetShooterCtx.font = "20px Arial";
    def.jetShooterCtx.fillText("Press Restart to Play Again", cx, cy + 90);
  });
}
function showJetShooterLeaderScores() {
  const leaderboard = document.getElementById('jetShooterGameLeaderboard');
  const scoresRef = def.db.ref(`highScores/jetShooterGame`);
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

// ======== INFO ==========

// ------ Customize -------
def.resetBtn.addEventListener('click', () => {
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
def.themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const theme = def.themes[button.dataset.theme];
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
    name: def.ownThemeNameInput.value.trim() || 'My Theme',
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
  def.ownThemeSave.classList.remove('hidden');
  def.saveThemeNameBtn.onclick = () => {
    const themeData = {
      name: def.ownThemeNameInput.value.trim() || 'My Theme',
      accent1: def.accent1Picker.value,
      accent2: def.accent2Picker.value,
      background1: def.background1Picker.value,
      background2: def.background2Picker.value,
      card1: def.card1Picker.value,
      card2: def.card2Picker.value,
      timestamp: Date.now()
    };
    const myThemes = JSON.parse(localStorage.getItem('myThemes')) || {};
    myThemes[themeData.name] = themeData;
    localStorage.setItem('myThemes', JSON.stringify(myThemes));
    addThemeToPreviews(themeData);
    def.ownThemeOut.textContent = `${themeData.name} saved.`;
    setTimeout (() => {
      def.ownThemeSave.classList.add('hidden');
      def.ownThemeNameInput.value = "";
      def.ownThemeOut.textContent = "";
    }, 4000);
  };
}
function saveThemePublic() {
  def.ownThemeSave.classList.remove('hidden');
  def.ownThemeOut.textContent = "Enter a name and click Save Theme.";
  def.saveThemeNameBtn.onclick = () => {
    const themeData = getCurrentThemeData();
    if (!window.firebase || !firebase.database) {
      def.ownThemeOut.textContent = 'Unable to save theme. Try again later.';
      return;
    }
    def.db.ref('publicThemes').push(themeData)
      .then(() => {
        setTimeout (() => {
          def.ownThemeOut.textContent = `Published ${themeData.name} to public themes!\nWill be reviewed before appearing.`;
          def.ownThemeSave.classList.add('hidden');
        }, 4000);
      })
      .catch(err => {
        def.ownThemeOut.textContent = 'Error: ' + err.message;
      });
      def.ownThemeNameInput.value = "";
      def.ownThemeOut.textContent = "";
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
    def.accent1Picker.value = themeData.accent1;
    def.accent2Picker.value = themeData.accent2;
    def.background1Picker.value = themeData.background1;
    def.background2Picker.value = themeData.background2;
    def.card1Picker.value = themeData.card1;
    def.card2Picker.value = themeData.card2;
  });
  previewsContainer.appendChild(btn);
}
window.addEventListener('load', () => {
  const myThemes = JSON.parse(localStorage.getItem('myThemes')) || {};
  Object.values(myThemes).forEach(themeData => addThemeToPreviews(themeData));
});
