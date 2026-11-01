# Footprints

Choose **Footprints** on the homepage (or open `index.html#footprints`). It changes the lower content area while keeping your profile visible. Wuhan, Nanjing, Shanghai, Ann Arbor, San Francisco, and Boston are marked as Lived, with dates and personal notes. Wuhan uses “Until age 18” without guessed calendar years; Boston’s 2029 completion is labeled estimated. The old `/map/` address redirects to this tab.

## Add your information without editing code

1. Open `map/edit/index.html` in your browser (or visit `/map/edit/` on the hosted website).
2. Choose a city, then fill in its category, date label, optional start/end years, title, and story.
3. Repeat for other cities. Drafts stay in the same browser; they do not update the public site.
4. Click **Download updated map data**.
5. Replace `assets/data/places.js` in the website folder with the downloaded file and publish the website as usual.

The form is a browser-local editing utility, not an authenticated admin service. Visitors can edit their own local copies, but cannot change your published data. Only upload your final intended public content. The editor is excluded from the sitemap and marked noindex.

## Add another place

Add an entry in `assets/data/places.js`. Give it a unique `id`, `city`, `country`, and `coordinates` in **longitude, latitude** order. Category (`type`) can be `place` (uncategorized) or `lived`. Fill `dates` with the exact label to show; `start` and `end` use ISO dates for the year filter. An empty end date means ongoing when a start date exists. `title` and `story` are plain text. The editor automatically includes added places.

## Map controls

Click a pin to open its details. Use + / − to zoom and drag to pan; World view resets the map. With keyboard focus on the map, use + / −, arrow keys, and Home. Pins support Tab and Enter/Space. All places / Lived and years filter the pins. Places without dates appear under All years.

## Map source

Country geometry is derived from Natural Earth’s public-domain 1:110m map:
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
https://www.naturalearthdata.com/about/terms-of-use/

The map is bundled locally in `assets/data/world.js` and uses an equirectangular projection. No map account, API key, tile service, or external JavaScript library is required.
