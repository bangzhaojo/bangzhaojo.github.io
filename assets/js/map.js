(() => {
  const places = window.PLACES || [];
  const svg = document.querySelector('#world-map');
  const pins = document.querySelector('#map-pins');
  const detail = document.querySelector('#place-detail');
  const list = document.querySelector('#place-list');
  const yearSelect = document.querySelector('#map-year');
  const labels = { place: 'Place', lived: 'Lived', study: 'Studied', visited: 'Visited' };
  const ns = 'http://www.w3.org/2000/svg';
  const project = ([lon, lat]) => [(lon + 180) * 1000 / 360, (85 - lat) * 1000 / 360];
  let selected = places[0]?.id;
  let filter = 'all';
  let visible = places;
  let zoom = 1;
  let center = [500, 220];
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function svgEl(tag, attrs) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }
  const countries = new Set(places.map(p => p.country));
  for (const feature of window.WORLD_MAP || []) {
    const recorded = countries.has(feature.name) || (feature.name === 'United States of America' && countries.has('United States'));
    document.querySelector('#map-land').append(svgEl('path', { d: feature.path, class: recorded ? 'recorded' : '' }));
  }
  for (let lon = -150; lon < 180; lon += 30) {
    const [x] = project([lon, 0]);
    document.querySelector('#map-grid').append(svgEl('path', { d: `M${x},0V440` }));
  }
  for (let lat = -60; lat < 90; lat += 30) {
    const [, y] = project([0, lat]);
    document.querySelector('#map-grid').append(svgEl('path', { d: `M0,${y}H1000` }));
  }
  const currentYear = new Date().getFullYear();
  const years = new Set();
  places.forEach(p => {
    if (!p.start) return;
    const first = Number(p.start.slice(0, 4));
    const last = p.end ? Number(p.end.slice(0, 4)) : currentYear;
    for (let year = first; year <= last && year <= currentYear + 20; year++) years.add(year);
  });
  [...years].sort((a, b) => b - a).forEach(year => yearSelect.add(new Option(String(year), String(year))));
  document.querySelector('#map-summary').textContent = `${places.length} places · ${countries.size} countries`;
  function showDetail(place) {
    detail.replaceChildren();
    if (!place) {
      detail.append(el('h2', '', 'More to come'), el('p', 'place-story', 'No places match these filters yet. Try another category or year.'));
      return;
    }
    detail.append(el('p', 'eyebrow', labels[place.type] || 'Place'), el('h2', '', place.city), el('p', 'place-country', place.country));
    if (place.dates) detail.append(el('p', 'place-dates', place.dates));
    if (place.title) detail.append(el('h3', '', place.title));
    if (place.story) detail.append(el('p', 'place-story', place.story));
    if (!place.dates && !place.title && !place.story) detail.append(el('p', 'place-placeholder', 'A story to come.'));
    const [lon, lat] = place.coordinates;
    detail.append(el('small', 'place-coordinate', `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'} / ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`));
  }
  function select(id) {
    selected = id;
    pins.querySelectorAll('[data-place]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.place === id)));
    list.querySelectorAll('[data-place]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.place === id)));
    showDetail(visible.find(place => place.id === id));
    // Keep a selection visible when exploring a zoomed map.
    if (zoom > 1) {
      const place = visible.find(p => p.id === id);
      if (place) { center = project(place.coordinates); updateView(); }
    }
  }
  function updateView() {
    const width = 1000 / zoom, height = 440 / zoom;
    center[0] = Math.max(width / 2, Math.min(1000 - width / 2, center[0]));
    center[1] = Math.max(height / 2, Math.min(440 - height / 2, center[1]));
    svg.setAttribute('viewBox', `${center[0] - width / 2} ${center[1] - height / 2} ${width} ${height}`);
    pins.querySelectorAll('.pin-symbol').forEach(node => node.setAttribute('transform', `scale(${1 / zoom})`));
    document.querySelector('#zoom-in').disabled = zoom >= 8;
    document.querySelector('#zoom-out').disabled = zoom <= 1;
  }
  function render() {
    const year = yearSelect.value;
    visible = places.filter(p => (filter === 'all' || p.type === filter) && (year === 'all' || (p.start && Number(p.start.slice(0, 4)) <= Number(year) && Number(p.end?.slice(0, 4) || currentYear) >= Number(year))));
    pins.replaceChildren(); list.replaceChildren();
    if (!visible.some(p => p.id === selected)) selected = visible[0]?.id;
    for (const place of visible) {
      const [x, y] = project(place.coordinates);
      const marker = svgEl('g', { class: 'map-pin', transform: `translate(${x},${y})`, role: 'button', tabindex: '0', 'aria-label': `${place.city}, ${place.dates || 'details to come'}`, 'aria-pressed': String(selected === place.id), 'data-place': place.id, 'data-type': place.type });
      const symbol = svgEl('g', { class: 'pin-symbol', transform: `scale(${1 / zoom})` });
      symbol.append(svgEl('circle', { r: 12, class: 'pin-halo' }), svgEl('circle', { r: 5, class: 'pin-dot' }));
      const left = ['ann-arbor', 'wuhan'].includes(place.id);
      const label = svgEl('text', { x: left ? -12 : 12, y: place.id === 'wuhan' ? 20 : -10, 'text-anchor': left ? 'end' : 'start' });
      label.textContent = place.city; symbol.append(label); marker.append(symbol);
      marker.addEventListener('click', () => select(place.id));
      marker.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(place.id); }
      });
      pins.append(marker);
      const button = el('button', 'place-card');
      button.type = 'button'; button.dataset.place = place.id;
      button.setAttribute('aria-pressed', String(selected === place.id));
      button.setAttribute('aria-controls', 'place-detail');
      button.append(el('span', 'place-card-type', labels[place.type] || 'Place'), el('strong', '', place.city), el('span', '', place.country), el('span', '', place.dates || 'Details to come'));
      button.addEventListener('click', () => select(place.id)); list.append(button);
    }
    document.querySelector('#map-empty').hidden = visible.length > 0;
    document.querySelector('#place-count').textContent = `${visible.length} ${visible.length === 1 ? 'place' : 'places'} shown`;
    showDetail(visible.find(p => p.id === selected));
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    render();
  }));
  yearSelect.addEventListener('change', render);
  function changeZoom(factor) { zoom = Math.max(1, Math.min(8, zoom * factor)); updateView(); }
  document.querySelector('#zoom-in').addEventListener('click', () => changeZoom(1.6));
  document.querySelector('#zoom-out').addEventListener('click', () => changeZoom(1 / 1.6));
  document.querySelector('#zoom-reset').addEventListener('click', () => { zoom = 1; center = [500, 220]; updateView(); });
  svg.addEventListener('keydown', event => {
    if (event.target !== svg) return;
    const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (moves[event.key]) { event.preventDefault(); center = center.map((v, i) => v + moves[event.key][i] * 60 / zoom); updateView(); }
    if (['+', '=', '-'].includes(event.key)) { event.preventDefault(); changeZoom(event.key === '-' ? 1 / 1.6 : 1.6); }
    if (event.key === 'Home') { event.preventDefault(); zoom = 1; center = [500, 220]; updateView(); }
  });
  let drag;
  svg.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('.map-pin')) return;
    drag = { x: event.clientX, y: event.clientY, center: [...center] };
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove', event => {
    if (!drag) return;
    const scale = Math.min(svg.clientWidth / (1000 / zoom), svg.clientHeight / (440 / zoom));
    center = [drag.center[0] - (event.clientX - drag.x) / scale, drag.center[1] - (event.clientY - drag.y) / scale]; updateView();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name => svg.addEventListener(name, () => { drag = null; }));
  render(); updateView();
})();
