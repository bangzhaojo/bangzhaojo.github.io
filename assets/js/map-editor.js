(() => {
  const original = window.PLACES || [];
  const key = 'bangzhao-map-draft-v1';
  let places = JSON.parse(JSON.stringify(original));
  let restored = false;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(saved) && saved.some(s => s && original.some(p => p.id === s.id))) {
      // Keep trusted coordinates and IDs; restore only fields this form can edit.
      places = original.map(p => {
        const s = saved.find(s => s?.id === p.id);
        if (!s) return { ...p };
        const next = { ...p };
        ['type', 'dates', 'start', 'end', 'title', 'story'].forEach(field => { if (typeof s[field] === 'string') next[field] = s[field]; });
        if (!['place', 'lived'].includes(next.type)) next.type = 'place';
        return next;
      });
      restored = true;
    }
  } catch (_) { /* Editing and downloads also work without browser storage. */ }
  const select = document.querySelector('#editor-place');
  const form = document.querySelector('#place-form');
  const status = document.querySelector('#editor-status');
  const fields = form.elements;
  let current = 0;
  places.forEach((p, i) => select.add(new Option(`${p.city}, ${p.country}`, String(i))));
  function load() {
    const p = places[current];
    document.querySelector('#editor-heading').textContent = p.city;
    ['type', 'dates', 'title', 'story'].forEach(name => { fields[name].value = p[name] || ''; });
    fields.startYear.value = p.start?.slice(0, 4) || '';
    fields.endYear.value = p.end?.slice(0, 4) || '';
    validateYears();
  }
  function validateYears() {
    const start = fields.startYear.value, end = fields.endYear.value;
    fields.endYear.setCustomValidity(end && (!start || Number(end) < Number(start)) ? 'Add a start year no later than the end year.' : '');
  }
  function save() {
    const p = places[current];
    ['type', 'dates', 'title', 'story'].forEach(name => { p[name] = fields[name].value; });
    p.start = fields.startYear.value ? `${fields.startYear.value}-01-01` : '';
    p.end = fields.endYear.value ? `${fields.endYear.value}-12-31` : '';
    validateYears();
    try { localStorage.setItem(key, JSON.stringify(places)); status.textContent = 'Draft saved in this browser. Download it when you’re ready to publish.'; }
    catch (_) { status.textContent = 'Browser storage is unavailable. Download your changes before leaving this page.'; }
  }
  form.addEventListener('input', save);
  select.addEventListener('change', () => { save(); current = Number(select.value); load(); });
  form.addEventListener('submit', event => {
    event.preventDefault(); save();
    // Check all records, including cities that are not currently selected.
    const invalid = places.findIndex(p => p.end && (!p.start || p.end < p.start));
    if (invalid >= 0) { current = invalid; select.value = String(invalid); load(); form.reportValidity(); return; }
    const blob = new Blob(['// Personal map data. Updated with the map editor.\nwindow.PLACES = ', JSON.stringify(places, null, 2), ';\n'], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'places.js'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Downloaded places.js. Replace assets/data/places.js in your website folder, then publish to update the live map.';
  });
  load();
  status.textContent = restored ? 'Your saved draft has been restored.' : 'No changes yet. Select a city to start.';
})();
