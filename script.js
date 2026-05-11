const units = {
  length: {
    units: ["Meter", "Kilometer", "Centimeter", "Millimeter", "Mile", "Yard", "Foot", "Inch"],
    toBase: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 }
  },
  weight: {
    units: ["Kilogram", "Gram", "Milligram", "Pound", "Ounce", "Ton"],
    toBase: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.453592, Ounce: 0.0283495, Ton: 1000 }
  },
  temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    toBase: null
  },
  speed: {
    units: ["m/s", "km/h", "mph", "knot", "ft/s"],
    toBase: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, "knot": 0.514444, "ft/s": 0.3048 }
  }
};

let currentTab = 'length';

function switchTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  populateSelects();
  document.getElementById('inputVal').value = '';
  document.getElementById('resultDisplay').textContent = '—';
  document.getElementById('allConversions').innerHTML = '';
}

function populateSelects() {
  const data = units[currentTab];
  const fromSel = document.getElementById('fromUnit');
  const toSel = document.getElementById('toUnit');
  fromSel.innerHTML = '';
  toSel.innerHTML = '';
  data.units.forEach((u, i) => {
    fromSel.innerHTML += `<option value="${u}">${u}</option>`;
    toSel.innerHTML += `<option value="${u}" ${i === 1 ? 'selected' : ''}>${u}</option>`;
  });
}

function convertTemp(val, from, to) {
  let celsius;
  if (from === 'Celsius') celsius = val;
  else if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
  else celsius = val - 273.15;

  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return (celsius * 9/5) + 32;
  return celsius + 273.15;
}

function convert() {
  const val = parseFloat(document.getElementById('inputVal').value);
  const from = document.getElementById('fromUnit').value;
  const to = document.getElementById('toUnit').value;
  const resultEl = document.getElementById('resultDisplay');

  if (isNaN(val)) { resultEl.textContent = '—'; return; }

  let result;
  if (currentTab === 'temperature') {
    result = convertTemp(val, from, to);
  } else {
    const base = val * units[currentTab].toBase[from];
    result = base / units[currentTab].toBase[to];
  }

  const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
  resultEl.textContent = `${formatted} ${to}`;
  showAllConversions(val, from);
}

function showAllConversions(val, from) {
  const data = units[currentTab];
  const container = document.getElementById('allConversions');
  container.innerHTML = `<div class="conv-title">All conversions for ${val} ${from}</div>`;

  data.units.forEach(u => {
    if (u === from) return;
    let result;
    if (currentTab === 'temperature') {
      result = convertTemp(val, from, u);
    } else {
      const base = val * data.toBase[from];
      result = base / data.toBase[u];
    }
    const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
    container.innerHTML += `
      <div class="conv-row">
        <span class="unit-name">${u}</span>
        <span class="unit-val">${formatted}</span>
      </div>`;
  });
}

function swapUnits() {
  const from = document.getElementById('fromUnit');
  const to = document.getElementById('toUnit');
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
  convert();
}

window.onload = () => populateSelects();
