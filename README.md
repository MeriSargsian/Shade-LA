# ShadeLA Dashboard (Simple Embed Page)

## Files

- `index.html` — the page layout
- `styles.css` — styling
- `app.js` — where you paste your embed URLs

## Add your embeds

Open `app.js` and paste URLs into the `EMBEDS` object.

### Power BI

- In Power BI, get the iframe `src` from **Publish to web** (or your org’s embed option).
- Paste it here:

```js
powerbi: {
  type: "iframe",
  src: "PASTE_POWER_BI_IFRAME_SRC_HERE",
},
```

### Area Map

- If you have an ArcGIS / Mapbox / Google My Maps / other map that provides an iframe URL, paste it here:

```js
areaMap: {
  type: "iframe",
  src: "PASTE_MAP_IFRAME_SRC_HERE",
},
```

### Unreal Engine

If you have **Pixel Streaming** (or another hosted experience):

- If it works in an iframe:

```js
unreal: {
  type: "iframe",
  src: "PASTE_UNREAL_URL_HERE",
},
```

- If it does **not** allow iframes, use a link button:

```js
unreal: {
  type: "link",
  src: "PASTE_UNREAL_URL_HERE",
  label: "Open Unreal Experience",
},
```

### Grasshopper

- If you’re using ShapeDiver or another hosted viewer that provides an iframe URL:

```js
grasshopper: {
  type: "iframe",
  src: "PASTE_GRASSHOPPER_IFRAME_SRC_HERE",
},
```

## Preview locally

Any static server works.

If you have Python:

```bash
python -m http.server 8080
```

Then open:

- http://localhost:8080
