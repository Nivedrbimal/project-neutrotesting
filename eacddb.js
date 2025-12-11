function getId() {
    // ---------- Supporter ----------
    const isNum = v => v !== null && v !== '' && !Number.isNaN(Number(v));
    const toNum = v => isNum(v) ? Number(v) : null;
    const known = x => x !== null && x !== undefined && !isNaN(x);
    const deg2rad = d => d * Math.PI / 180;
    const rad2deg = r => r * 180 / Math.PI;
    function fmt(v) { v = Number(v); if (isNaN(v)) return 0; return Number(v.toFixed(6)); }

    // ------- Element Defining -------
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const favicon = document.querySelector('link[rel="icon"]');
    const faviconApple = document.querySelector('link[rel="apple-touch-icon"]');
    const topLinks = document.querySelectorAll(".top-link");

    const elementData = [
        { "Z": 1, "Symbol": "H", "Name": "Hydrogen" },
        { "Z": 2, "Symbol": "He", "Name": "Helium" },
        { "Z": 3, "Symbol": "Li", "Name": "Lithium" },
        { "Z": 4, "Symbol": "Be", "Name": "Beryllium" },
        { "Z": 5, "Symbol": "B", "Name": "Boron" },
        { "Z": 6, "Symbol": "C", "Name": "Carbon" },
        { "Z": 7, "Symbol": "N", "Name": "Nitrogen" },
        { "Z": 8, "Symbol": "O", "Name": "Oxygen" },
        { "Z": 9, "Symbol": "F", "Name": "Fluorine" },
        { "Z": 10, "Symbol": "Ne", "Name": "Neon" },
        { "Z": 11, "Symbol": "Na", "Name": "Sodium" },
        { "Z": 12, "Symbol": "Mg", "Name": "Magnesium" },
        { "Z": 13, "Symbol": "Al", "Name": "Aluminum" },
        { "Z": 14, "Symbol": "Si", "Name": "Silicon" },
        { "Z": 15, "Symbol": "P", "Name": "Phosphorus" },
        { "Z": 16, "Symbol": "S", "Name": "Sulfur" },
        { "Z": 17, "Symbol": "Cl", "Name": "Chlorine" },
        { "Z": 18, "Symbol": "Ar", "Name": "Argon" },
        { "Z": 19, "Symbol": "K", "Name": "Potassium" },
        { "Z": 20, "Symbol": "Ca", "Name": "Calcium" },
        { "Z": 21, "Symbol": "Sc", "Name": "Scandium" },
        { "Z": 22, "Symbol": "Ti", "Name": "Titanium" },
        { "Z": 23, "Symbol": "V", "Name": "Vanadium" },
        { "Z": 24, "Symbol": "Cr", "Name": "Chromium" },
        { "Z": 25, "Symbol": "Mn", "Name": "Manganese" },
        { "Z": 26, "Symbol": "Fe", "Name": "Iron" },
        { "Z": 27, "Symbol": "Co", "Name": "Cobalt" },
        { "Z": 28, "Symbol": "Ni", "Name": "Nickel" },
        { "Z": 29, "Symbol": "Cu", "Name": "Copper" },
        { "Z": 30, "Symbol": "Zn", "Name": "Zinc" },
        { "Z": 31, "Symbol": "Ga", "Name": "Gallium" },
        { "Z": 32, "Symbol": "Ge", "Name": "Germanium" },
        { "Z": 33, "Symbol": "As", "Name": "Arsenic" },
        { "Z": 34, "Symbol": "Se", "Name": "Selenium" },
        { "Z": 35, "Symbol": "Br", "Name": "Bromine" },
        { "Z": 36, "Symbol": "Kr", "Name": "Krypton" },
        { "Z": 37, "Symbol": "Rb", "Name": "Rubidium" },
        { "Z": 38, "Symbol": "Sr", "Name": "Strontium" },
        { "Z": 39, "Symbol": "Y", "Name": "Yttrium" },
        { "Z": 40, "Symbol": "Zr", "Name": "Zirconium" },
        { "Z": 41, "Symbol": "Nb", "Name": "Niobium" },
        { "Z": 42, "Symbol": "Mo", "Name": "Molybdenum" },
        { "Z": 43, "Symbol": "Tc", "Name": "Technetium" },
        { "Z": 44, "Symbol": "Ru", "Name": "Ruthenium" },
        { "Z": 45, "Symbol": "Rh", "Name": "Rhodium" },
        { "Z": 46, "Symbol": "Pd", "Name": "Palladium" },
        { "Z": 47, "Symbol": "Ag", "Name": "Silver" },
        { "Z": 48, "Symbol": "Cd", "Name": "Cadmium" },
        { "Z": 49, "Symbol": "In", "Name": "Indium" },
        { "Z": 50, "Symbol": "Sn", "Name": "Tin" },
        { "Z": 51, "Symbol": "Sb", "Name": "Antimony" },
        { "Z": 52, "Symbol": "Te", "Name": "Tellurium" },
        { "Z": 53, "Symbol": "I", "Name": "Iodine" },
        { "Z": 54, "Symbol": "Xe", "Name": "Xenon" },
        { "Z": 55, "Symbol": "Cs", "Name": "Cesium" },
        { "Z": 56, "Symbol": "Ba", "Name": "Barium" },
        { "Z": 57, "Symbol": "La", "Name": "Lanthanum" },
        { "Z": 58, "Symbol": "Ce", "Name": "Cerium" },
        { "Z": 59, "Symbol": "Pr", "Name": "Praseodymium" },
        { "Z": 60, "Symbol": "Nd", "Name": "Neodymium" },
        { "Z": 61, "Symbol": "Pm", "Name": "Promethium" },
        { "Z": 62, "Symbol": "Sm", "Name": "Samarium" },
        { "Z": 63, "Symbol": "Eu", "Name": "Europium" },
        { "Z": 64, "Symbol": "Gd", "Name": "Gadolinium" },
        { "Z": 65, "Symbol": "Tb", "Name": "Terbium" },
        { "Z": 66, "Symbol": "Dy", "Name": "Dysprosium" },
        { "Z": 67, "Symbol": "Ho", "Name": "Holmium" },
        { "Z": 68, "Symbol": "Er", "Name": "Erbium" },
        { "Z": 69, "Symbol": "Tm", "Name": "Thulium" },
        { "Z": 70, "Symbol": "Yb", "Name": "Ytterbium" },
        { "Z": 71, "Symbol": "Lu", "Name": "Lutetium" },
        { "Z": 72, "Symbol": "Hf", "Name": "Hafnium" },
        { "Z": 73, "Symbol": "Ta", "Name": "Tantalum" },
        { "Z": 74, "Symbol": "W", "Name": "Tungsten" },
        { "Z": 75, "Symbol": "Re", "Name": "Rhenium" },
        { "Z": 76, "Symbol": "Os", "Name": "Osmium" },
        { "Z": 77, "Symbol": "Ir", "Name": "Iridium" },
        { "Z": 78, "Symbol": "Pt", "Name": "Platinum" },
        { "Z": 79, "Symbol": "Au", "Name": "Gold" },
        { "Z": 80, "Symbol": "Hg", "Name": "Mercury" },
        { "Z": 81, "Symbol": "Tl", "Name": "Thallium" },
        { "Z": 82, "Symbol": "Pb", "Name": "Lead" },
        { "Z": 83, "Symbol": "Bi", "Name": "Bismuth" },
        { "Z": 84, "Symbol": "Po", "Name": "Polonium" },
        { "Z": 85, "Symbol": "At", "Name": "Astatine" },
        { "Z": 86, "Symbol": "Rn", "Name": "Radon" },
        { "Z": 87, "Symbol": "Fr", "Name": "Francium" },
        { "Z": 88, "Symbol": "Ra", "Name": "Radium" },
        { "Z": 89, "Symbol": "Ac", "Name": "Actinium" },
        { "Z": 90, "Symbol": "Th", "Name": "Thorium" },
        { "Z": 91, "Symbol": "Pa", "Name": "Protactinium" },
        { "Z": 92, "Symbol": "U", "Name": "Uranium" },
        { "Z": 93, "Symbol": "Np", "Name": "Neptunium" },
        { "Z": 94, "Symbol": "Pu", "Name": "Plutonium" },
        { "Z": 95, "Symbol": "Am", "Name": "Americium" },
        { "Z": 96, "Symbol": "Cm", "Name": "Curium" },
        { "Z": 97, "Symbol": "Bk", "Name": "Berkelium" },
        { "Z": 98, "Symbol": "Cf", "Name": "Californium" },
        { "Z": 99, "Symbol": "Es", "Name": "Einsteinium" },
        { "Z": 100, "Symbol": "Fm", "Name": "Fermium" },
        { "Z": 101, "Symbol": "Md", "Name": "Mendelevium" },
        { "Z": 102, "Symbol": "No", "Name": "Nobelium" },
        { "Z": 103, "Symbol": "Lr", "Name": "Lawrencium" },
        { "Z": 104, "Symbol": "Rf", "Name": "Rutherfordium" },
        { "Z": 105, "Symbol": "Db", "Name": "Dubnium" },
        { "Z": 106, "Symbol": "Sg", "Name": "Seaborgium" },
        { "Z": 107, "Symbol": "Bh", "Name": "Bohrium" },
        { "Z": 108, "Symbol": "Hs", "Name": "Hassium" },
        { "Z": 109, "Symbol": "Mt", "Name": "Meitnerium" },
        { "Z": 110, "Symbol": "Ds", "Name": "Darmstadtium" },
        { "Z": 111, "Symbol": "Rg", "Name": "Roentgenium" },
        { "Z": 112, "Symbol": "Cn", "Name": "Copernicium" },
        { "Z": 113, "Symbol": "Nh", "Name": "Nihonium" },
        { "Z": 114, "Symbol": "Fl", "Name": "Flerovium" },
        { "Z": 115, "Symbol": "Mc", "Name": "Moscovium" },
        { "Z": 116, "Symbol": "Lv", "Name": "Livermorium" },
        { "Z": 117, "Symbol": "Ts", "Name": "Tennessine" },
        { "Z": 118, "Symbol": "Og", "Name": "Oganesson" }
    ]
    let elementDataDB = [];
    const ptOut = document.getElementById('ptOut');

    const piGamePi = '141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141';
    let piIndex = 0;
    let mistakesAllowed = 3;


    let fg2_state = null;
    const opsToggle = document.getElementById('opsToggle');
    const opsContent = document.getElementById('opsContent');
    let ng_secret = null, ng_tries = 0;

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

    const pwdToggle = document.getElementById('pwdCharacterTypesToggle');
    const pwdContent = document.getElementById('pwdCharacterTypesContent');

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
    let snakeBox = Math.floor(snakeSize / 25);
    let snake, snakeDirection, snakeFood, snakeScore, snakeFoodsEaten;
    let snakeSpecialFood = null;
    let snakeHighScore;
    let snakeSpecialFoodTimer = null;
    let snakeSpecialFoodTime = 5000;
    let snakePaused = false;
    let snakeLastFrameTime = 0;
    let snakeMoveDelay = 100;
    let snakeAccumulatedTime = 0;
    let snakeRunning = false;

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
    const themes = {
        neutroxity: { accent1: '#3c78d8', accent2: '#9900ff', background1: '#172D50', background2: '#480A71', card1: '#0c3b83', card2: '#241b77' },
        aurora: { accent1: '#2ae9c0', accent2: '#2ea6ab', background1: '#141e30', background2: '#243b55', card1: '#1e6369', card2: '#0072ff' },
        neonDark: { accent1: '#ff00cc', accent2: '#3333ff', background1: '#0f0c29', background2: '#24243e', card1: '#302b63', card2: '#4134a1' },
        cosmicDawn: { accent1: '#ff6f61', accent2: '#ff9966', background1: '#0b0c10', background2: '#1f2833', card1: '#2e3239', card2: '#3d3f45' },
        galacticVoid: { accent1: '#6a11cb', accent2: '#2575fc', background1: '#0a0a23', background2: '#12122b', card1: '#1a1a40', card2: '#2d2d5a' }
    };

    // ------------ Firebase Required -------------
    const firebaseConfig = {
        apiKey: "AIzaSyDaQEkGy2NYGlEUjAXs5GKkqPRjAfVnqNs",
        authDomain: "neutrotech-backup.firebaseapp.com",
        projectId: "neutrotech-backup",
        storageBucket: "neutrotech-backup.firebasestorage.app",
        messagingSenderId: "577271578104",
        appId: "1:577271578104:web:9d000cd7fc1d54f001aa0d",
        measurementId: "G-ZX3T3TSGZZ"
    };
    let db = null;
    let currentUser = null;
    let currentUserName = null;
    const signUpLoginScreen = document.getElementById('signUpLoginScreen');
    const profileScreen = document.getElementById('profileScreen');


    const neutropolisGame = document.getElementById('neutropolisGame');
    const ngmi = document.getElementById('ngmi');
    const jngr = document.getElementById('jngr');
    const cngr = document.getElementById('cngr');
    const ngrc = document.getElementById('ngrc');

    return {
        isNum, toNum, known, deg2rad, rad2deg, fmt,
        darkMode, favicon, faviconApple, topLinks,
        elementData, ptOut,
        piGamePi, piIndex, mistakesAllowed,
        fg2_state, opsToggle, opsContent, ng_secret, ng_tries,
        unitGroups, categorySelect, fromUnit, toUnit, conversionRates,
        pwdToggle, pwdContent,
        snakeCanvas, snakeCtx, snakeScoreHolder, snakeLeftBtn, snakeUpBtn, snakeRightBtn, snakeDownBtn, snakeStartBtn, snakePauseBtn, snakeSize, snakeBox, snake, snakeDirection, snakeFood, snakeScore, snakeFoodsEaten, snakeSpecialFood, snakeHighScore, snakeSpecialFoodTimer, snakeSpecialFoodTime, snakePaused, snakeLastFrameTime, snakeMoveDelay, snakeAccumulatedTime, snakeRunning,
        jetShooterCanvas, jetShooterCtx, jetShooterScoreHolder, jetShooterShieldHolder, jetShooterBulletHolder, jetShooterLeftBtn, jetShooterRightBtn, jetShooterShootBtn, jetShooterStartBtn, jetShooterPauseBtn, jetShooterSize, jetShooterBox, jetShooterFrameId, gameFrameId, jetShooterMessage, jetShooterMessageTimeout, movement, keys, lastKeyPressed, jetShooterHighScore, jetShooter, jetShooterBullets, jetShooterEnemies, jetShooterShields, jetShooterBulletBarrel, jetShooterScore, jetShooterPaused, jetShooterRunning, isShooting, jetShooterLastFrameTime, lastShotTime, FIRE_RATE, jetShooterEnemyTimer, jetShooterShieldTimer, jetShooterBulletTimer, jetShooterEnemySpawnRate, jetShooterBulletBarrelRate, jetShooterShieldSpawnRate, jetShooterHasShield, jetShooterBulletRemaining,

        firebaseConfig, db, currentUser, currentUserName, elementDataDB,
        signUpLoginScreen, profileScreen,
        neutropolisGame, ngmi, jngr, cngr, ngrc,
        accent1Picker, accent2Picker, background1Picker, background2Picker, card1Picker, card2Picker, root, resetBtn, themeButtons, ownThemeNameInput, ownThemeOut, ownThemeSave, saveThemeNameBtn, themes
    }
}
const def = getId();