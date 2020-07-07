/* eslint-disable */
/* esri-leaflet - v2.2.4 - Wed Mar 20 2019 16:03:22 GMT-0700 (Pacific Daylight Time)
 * Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
!(function (t, e) { typeof exports === 'object' && typeof module !== 'undefined' ? e(exports, require('leaflet')) : typeof define === 'function' && define.amd ? define(['exports', 'leaflet'], e) : e((t.L = t.L || {}, t.L.esri = {}), t.L); }(this, (t, e) => {
  const i = window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest(); const s = document.documentElement.style.pointerEvents === '';


  const r = { cors: i, pointerEvents: s };


  const n = { attributionWidthOffset: 55 };


  let o = 0; function a(t) { let e = ''; for (const i in t.f = t.f || 'json', t) if (t.hasOwnProperty(i)) { var s; const r = t[i]; const n = Object.prototype.toString.call(r); e.length && (e += '&'), s = n === '[object Array]' ? Object.prototype.toString.call(r[0]) === '[object Object]' ? JSON.stringify(r) : r.join(',') : n === '[object Object]' ? JSON.stringify(r) : n === '[object Date]' ? r.valueOf() : r, e += `${encodeURIComponent(i)}=${encodeURIComponent(s)}`; } return e; } function u(t, i) { const s = new window.XMLHttpRequest(); return s.onerror = function (r) { s.onreadystatechange = e.Util.falseFn, t.call(i, { error: { code: 500, message: 'XMLHttpRequest error' } }, null); }, s.onreadystatechange = function () { let r; let n; if (s.readyState === 4) { try { r = JSON.parse(s.responseText); } catch (t) { r = null, n = { code: 500, message: 'Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.' }; }!n && r.error && (n = r.error, r = null), s.onerror = e.Util.falseFn, t.call(i, n, r); } }, s.ontimeout = function () { this.onerror(); }, s; } function l(t, e, i, s) { const r = u(i, s); return r.open('POST', t), void 0 !== s && s !== null && void 0 !== s.options && (r.timeout = s.options.timeout), r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'), r.send(a(e)), r; } function h(t, e, i, s) { const r = u(i, s); return r.open('GET', `${t}?${a(e)}`, !0), void 0 !== s && s !== null && void 0 !== s.options && (r.timeout = s.options.timeout), r.send(null), r; } function c(t, e, i, s) { const n = a(e); const o = u(i, s); const l = (`${t}?${n}`).length; if (l <= 2e3 && r.cors ? o.open('GET', `${t}?${n}`) : l > 2e3 && r.cors && (o.open('POST', t), o.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')), void 0 !== s && s !== null && void 0 !== s.options && (o.timeout = s.options.timeout), l <= 2e3 && r.cors)o.send(null); else { if (!(l > 2e3 && r.cors)) return l <= 2e3 && !r.cors ? p(t, e, i, s) : void M(`a request to ${t} was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html`); o.send(n); } return o; } function p(t, i, s, r) { window._EsriLeafletCallbacks = window._EsriLeafletCallbacks || {}; const n = `c${o}`; i.callback = `window._EsriLeafletCallbacks.${n}`, window._EsriLeafletCallbacks[n] = function (t) { if (!0 !== window._EsriLeafletCallbacks[n]) { let e; const i = Object.prototype.toString.call(t); i !== '[object Object]' && i !== '[object Array]' && (e = { error: { code: 500, message: 'Expected array or object as JSONP response' } }, t = null), !e && t.error && (e = t, t = null), s.call(r, e, t), window._EsriLeafletCallbacks[n] = !0; } }; const u = e.DomUtil.create('script', null, document.body); return u.type = 'text/javascript', u.src = `${t}?${a(i)}`, u.id = n, u.onerror = function (t) { if (t && !0 !== window._EsriLeafletCallbacks[n]) { s.call(r, { error: { code: 500, message: 'An unknown error occurred' } }), window._EsriLeafletCallbacks[n] = !0; } }, e.DomUtil.addClass(u, 'esri-leaflet-jsonp'), o++, { id: n, url: u.src, abort() { window._EsriLeafletCallbacks._callback[n]({ code: 0, message: 'Request aborted.' }); } }; } const d = r.cors ? h : p; d.CORS = h, d.JSONP = p; const m = { request: c, get: d, post: l }; function f(t) { return (function (t, e) { for (let i = 0; i < t.length; i++) if (t[i] !== e[i]) return !1; return !0; }(t[0], t[t.length - 1])) || t.push(t[0]), t; } function y(t) { for (var e, i = 0, s = 0, r = t.length, n = t[s]; s < r - 1; s++)i += ((e = t[s + 1])[0] - n[0]) * (e[1] + n[1]), n = e; return i >= 0; } function g(t, e, i, s) { const r = (s[0] - i[0]) * (t[1] - i[1]) - (s[1] - i[1]) * (t[0] - i[0]); const n = (e[0] - t[0]) * (t[1] - i[1]) - (e[1] - t[1]) * (t[0] - i[0]); const o = (s[1] - i[1]) * (e[0] - t[0]) - (s[0] - i[0]) * (e[1] - t[1]); if (o !== 0) { const a = r / o; const u = n / o; if (a >= 0 && a <= 1 && u >= 0 && u <= 1) return !0; } return !1; } function _(t, e) { for (let i = 0; i < t.length - 1; i++) for (let s = 0; s < e.length - 1; s++) if (g(t[i], t[i + 1], e[s], e[s + 1])) return !0; return !1; } function v(t, e) { const i = _(t, e); const s = (function (t, e) { for (var i = !1, s = -1, r = t.length, n = r - 1; ++s < r; n = s)(t[s][1] <= e[1] && e[1] < t[n][1] || t[n][1] <= e[1] && e[1] < t[s][1]) && e[0] < (t[n][0] - t[s][0]) * (e[1] - t[s][1]) / (t[n][1] - t[s][1]) + t[s][0] && (i = !i); return i; }(t, e[0])); return !(i || !s); } function b(t) { const e = []; const i = t.slice(0); const s = f(i.shift().slice(0)); if (s.length >= 4) { y(s) || s.reverse(), e.push(s); for (let r = 0; r < i.length; r++) { const n = f(i[r].slice(0)); n.length >= 4 && (y(n) && n.reverse(), e.push(n)); } } return e; } function x(t) { const e = {}; for (const i in t)t.hasOwnProperty(i) && (e[i] = t[i]); return e; } function S(t, e) { let i = {}; if (t.features) { i.type = 'FeatureCollection', i.features = []; for (let s = 0; s < t.features.length; s++)i.features.push(S(t.features[s], e)); } if (typeof t.x === 'number' && typeof t.y === 'number' && (i.type = 'Point', i.coordinates = [t.x, t.y], typeof t.z === 'number' && i.coordinates.push(t.z)), t.points && (i.type = 'MultiPoint', i.coordinates = t.points.slice(0)), t.paths && (t.paths.length === 1 ? (i.type = 'LineString', i.coordinates = t.paths[0].slice(0)) : (i.type = 'MultiLineString', i.coordinates = t.paths.slice(0))), t.rings && (i = (function (t) { for (var e, i, s = [], r = [], n = 0; n < t.length; n++) { const o = f(t[n].slice(0)); if (!(o.length < 4)) if (y(o)) { const a = [o.slice().reverse()]; s.push(a); } else r.push(o.slice().reverse()); } for (var u = []; r.length;) { i = r.pop(); let l = !1; for (e = s.length - 1; e >= 0; e--) if (v(s[e][0], i)) { s[e].push(i), l = !0; break; }l || u.push(i); } for (;u.length;) { i = u.pop(); let h = !1; for (e = s.length - 1; e >= 0; e--) if (_(s[e][0], i)) { s[e].push(i), h = !0; break; }h || s.push([i.reverse()]); } return s.length === 1 ? { type: 'Polygon', coordinates: s[0] } : { type: 'MultiPolygon', coordinates: s }; }(t.rings.slice(0)))), typeof t.xmin === 'number' && typeof t.ymin === 'number' && typeof t.xmax === 'number' && typeof t.ymax === 'number' && (i.type = 'Polygon', i.coordinates = [[[t.xmax, t.ymax], [t.xmin, t.ymax], [t.xmin, t.ymin], [t.xmax, t.ymin], [t.xmax, t.ymax]]]), (t.geometry || t.attributes) && (i.type = 'Feature', i.geometry = t.geometry ? S(t.geometry) : null, i.properties = t.attributes ? x(t.attributes) : null, t.attributes)) try { i.id = (function (t, e) { for (let i = e ? [e, 'OBJECTID', 'FID'] : ['OBJECTID', 'FID'], s = 0; s < i.length; s++) { const r = i[s]; if (r in t && (typeof t[r] === 'string' || typeof t[r] === 'number')) return t[r]; } throw Error('No valid id attribute found'); }(t.attributes, e)); } catch (t) {} return JSON.stringify(i.geometry) === JSON.stringify({}) && (i.geometry = null), t.spatialReference && t.spatialReference.wkid && t.spatialReference.wkid !== 4326 && console.warn(`Object converted in non-standard crs - ${JSON.stringify(t.spatialReference)}`), i; } function L(t, e) { e = e || 'OBJECTID'; let i; const s = { wkid: 4326 }; let r = {}; switch (t.type) { case 'Point': r.x = t.coordinates[0], r.y = t.coordinates[1], r.spatialReference = s; break; case 'MultiPoint': r.points = t.coordinates.slice(0), r.spatialReference = s; break; case 'LineString': r.paths = [t.coordinates.slice(0)], r.spatialReference = s; break; case 'MultiLineString': r.paths = t.coordinates.slice(0), r.spatialReference = s; break; case 'Polygon': r.rings = b(t.coordinates.slice(0)), r.spatialReference = s; break; case 'MultiPolygon': r.rings = (function (t) { for (var e = [], i = 0; i < t.length; i++) for (let s = b(t[i]), r = s.length - 1; r >= 0; r--) { const n = s[r].slice(0); e.push(n); } return e; }(t.coordinates.slice(0))), r.spatialReference = s; break; case 'Feature': t.geometry && (r.geometry = L(t.geometry, e)), r.attributes = t.properties ? x(t.properties) : {}, t.id && (r.attributes[e] = t.id); break; case 'FeatureCollection': for (r = [], i = 0; i < t.features.length; i++)r.push(L(t.features[i], e)); break; case 'GeometryCollection': for (r = [], i = 0; i < t.geometries.length; i++)r.push(L(t.geometries[i], e)); } return r; } function I(t, e) { return L(t, e); } function A(t, e) { return S(t, e); } function T(t) { if (t.xmin !== 'NaN' && t.ymin !== 'NaN' && t.xmax !== 'NaN' && t.ymax !== 'NaN') { const i = e.latLng(t.ymin, t.xmin); const s = e.latLng(t.ymax, t.xmax); return e.latLngBounds(i, s); } return null; } function w(t) {
    return {
      xmin: (t = e.latLngBounds(t)).getSouthWest().lng, ymin: t.getSouthWest().lat, xmax: t.getNorthEast().lng, ymax: t.getNorthEast().lat, spatialReference: { wkid: 4326 },
    };
  } const R = /^(OBJECTID|FID|OID|ID)$/i; function O(t) { let e; if (t.objectIdFieldName)e = t.objectIdFieldName; else if (t.fields) { for (var i = 0; i <= t.fields.length - 1; i++) if (t.fields[i].type === 'esriFieldTypeOID') { e = t.fields[i].name; break; } if (!e) for (i = 0; i <= t.fields.length - 1; i++) if (t.fields[i].name.match(R)) { e = t.fields[i].name; break; } } return e; } function P(t) { for (const e in t.attributes) if (e.match(R)) return e; } function C(t, e) { let i; const s = t.features || t.results; const r = s.length; i = e || O(t); const n = { type: 'FeatureCollection', features: [] }; if (r) for (let o = s.length - 1; o >= 0; o--) { const a = A(s[o], i || P(s[o])); n.features.push(a); } return n; } function F(t) { return (t = e.Util.trim(t))[t.length - 1] !== '/' && (t += '/'), t; } function k(t) { if (t.url.indexOf('?') !== -1) { t.requestParams = t.requestParams || {}; const e = t.url.substring(t.url.indexOf('?') + 1); t.url = t.url.split('?')[0], t.requestParams = JSON.parse(`{"${decodeURI(e).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`); } return t.url = F(t.url.split('?')[0]), t; } function U(t) { return /^(?!.*utility\.arcgis\.com).*\.arcgis\.com.*FeatureServer/i.test(t); } function G(t) { let e; switch (t) { case 'Point': e = 'esriGeometryPoint'; break; case 'MultiPoint': e = 'esriGeometryMultipoint'; break; case 'LineString': case 'MultiLineString': e = 'esriGeometryPolyline'; break; case 'Polygon': case 'MultiPolygon': e = 'esriGeometryPolygon'; } return e; } function M() { console && console.warn && console.warn(...arguments); } function q(t) { return `${t.getSize().x - n.attributionWidthOffset}px`; } function D(t) { if (t.attributionControl && !t.attributionControl._esriAttributionAdded) { t.attributionControl.setPrefix('<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | Powered by <a href="https://www.esri.com">Esri</a>'); const i = document.createElement('style'); i.type = 'text/css', i.innerHTML = '.esri-truncated-attribution:hover {white-space: normal;}', document.getElementsByTagName('head')[0].appendChild(i), e.DomUtil.addClass(t.attributionControl._container, 'esri-truncated-attribution:hover'); const s = document.createElement('style'); s.type = 'text/css', s.innerHTML = `.esri-truncated-attribution {vertical-align: -3px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;transition: 0s white-space;transition-delay: 1s;max-width: ${q(t)};}`, document.getElementsByTagName('head')[0].appendChild(s), e.DomUtil.addClass(t.attributionControl._container, 'esri-truncated-attribution'), t.on('resize', (e) => { t.attributionControl._container.style.maxWidth = q(e.target); }), t.attributionControl._esriAttributionAdded = !0; } } function E(t) { const i = { geometry: null, geometryType: null }; return t instanceof e.LatLngBounds ? (i.geometry = w(t), i.geometryType = 'esriGeometryEnvelope', i) : (t.getLatLng && (t = t.getLatLng()), t instanceof e.LatLng && (t = { type: 'Point', coordinates: [t.lng, t.lat] }), t instanceof e.GeoJSON && (t = t.getLayers()[0].feature.geometry, i.geometry = I(t), i.geometryType = G(t.type)), t.toGeoJSON && (t = t.toGeoJSON()), t.type === 'Feature' && (t = t.geometry), t.type === 'Point' || t.type === 'LineString' || t.type === 'Polygon' || t.type === 'MultiPolygon' ? (i.geometry = I(t), i.geometryType = G(t.type), i) : void M('invalid geometry passed to spatial query. Should be L.LatLng, L.LatLngBounds, L.Marker or a GeoJSON Point, Line, Polygon or MultiPolygon object')); } function B(t, i) {
    r.cors && c(t, {}, e.Util.bind((t, s) => {
      if (!t) {
        i._esriAttributions = []; for (let r = 0; r < s.contributors.length; r++) {
          for (let n = s.contributors[r], o = 0; o < n.coverageAreas.length; o++) {
            const a = n.coverageAreas[o]; const u = e.latLng(a.bbox[0], a.bbox[1]); const l = e.latLng(a.bbox[2], a.bbox[3]); i._esriAttributions.push({
              attribution: n.attribution, score: a.score, bounds: e.latLngBounds(u, l), minZoom: a.zoomMin, maxZoom: a.zoomMax,
            });
          }
        }i._esriAttributions.sort((t, e) => e.score - t.score), z({ target: i });
      }
    }, this));
  } function z(t) { const i = t.target; const s = i._esriAttributions; if (i && i.attributionControl) { const r = i.attributionControl._container.querySelector('.esri-dynamic-attribution'); if (r && s) { for (var n = '', o = i.getBounds(), a = e.latLngBounds(o.getSouthWest().wrap(), o.getNorthEast().wrap()), u = i.getZoom(), l = 0; l < s.length; l++) { const h = s[l]; const c = h.attribution; !n.match(c) && h.bounds.intersects(a) && u >= h.minZoom && u <= h.maxZoom && (n += `, ${c}`); }n = n.substr(2), r.innerHTML = n, r.style.maxWidth = q(i), i.fire('attributionupdated', { attribution: n }); } } } const N = {
    warn: M, cleanUrl: F, getUrlParams: k, isArcgisOnline: U, geojsonTypeToArcGIS: G, responseToFeatureCollection: C, geojsonToArcGIS: I, arcgisToGeoJSON: A, boundsToExtent: w, extentToBounds: T, calcAttributionWidth: q, setEsriAttribution: D, _setGeometry: E, _getAttributionData: B, _updateMapAttribution: z, _findIdAttributeFromFeature: P, _findIdAttributeFromResponse: O,
  }; const Z = e.Class.extend({
    options: { proxy: !1, useCors: i }, generateSetter(t, i) { return e.Util.bind(function (e) { return this.params[t] = e, this; }, i); }, initialize(t) { if (t.request && t.options ? (this._service = t, e.Util.setOptions(this, t.options)) : (e.Util.setOptions(this, t), this.options.url = F(t.url)), this.params = e.Util.extend({}, this.params || {}), this.setters) for (const i in this.setters) { const s = this.setters[i]; this[i] = this.generateSetter(s, this); } }, token(t) { return this._service ? this._service.authenticate(t) : this.params.token = t, this; }, format(t) { return this.params.returnUnformattedValues = !t, this; }, request(t, i) { return this.options.requestParams && e.Util.extend(this.params, this.options.requestParams), this._service ? this._service.request(this.path, this.params, t, i) : this._request('request', this.path, this.params, t, i); }, _request(t, e, i, s, r) { const n = this.options.proxy ? `${this.options.proxy}?${this.options.url}${e}` : this.options.url + e; return t !== 'get' && t !== 'request' || this.options.useCors ? m[t](n, i, s, r) : m.get.JSONP(n, i, s, r); },
  }); const j = Z.extend({
    setters: {
      offset: 'resultOffset', limit: 'resultRecordCount', fields: 'outFields', precision: 'geometryPrecision', featureIds: 'objectIds', returnGeometry: 'returnGeometry', returnM: 'returnM', transform: 'datumTransformation', token: 'token',
    },
    path: 'query',
    params: {
      returnGeometry: !0, where: '1=1', outSr: 4326, outFields: '*',
    },
    within(t) { return this._setGeometryParams(t), this.params.spatialRel = 'esriSpatialRelContains', this; },
    intersects(t) { return this._setGeometryParams(t), this.params.spatialRel = 'esriSpatialRelIntersects', this; },
    contains(t) { return this._setGeometryParams(t), this.params.spatialRel = 'esriSpatialRelWithin', this; },
    crosses(t) { return this._setGeometryParams(t), this.params.spatialRel = 'esriSpatialRelCrosses', this; },
    touches(t) { return this._setGeometryParams(t), this.params.spatialRel = 'esriSpatialRelTouches', this; },
    overlaps(t) { return this._setGeometryParams(t), this.params.spatialRel = 'esriSpatialRelOverlaps', this; },
    bboxIntersects(t) { return this._setGeometryParams(t), this.params.spatialRel = 'esriSpatialRelEnvelopeIntersects', this; },
    indexIntersects(t) { return this._setGeometryParams(t), this.params.spatialRel = 'esriSpatialRelIndexIntersects', this; },
    nearby(t, i) { return t = e.latLng(t), this.params.geometry = [t.lng, t.lat], this.params.geometryType = 'esriGeometryPoint', this.params.spatialRel = 'esriSpatialRelIntersects', this.params.units = 'esriSRUnit_Meter', this.params.distance = i, this.params.inSr = 4326, this; },
    where(t) { return this.params.where = t, this; },
    between(t, e) { return this.params.time = [t.valueOf(), e.valueOf()], this; },
    simplify(t, e) { const i = Math.abs(t.getBounds().getWest() - t.getBounds().getEast()); return this.params.maxAllowableOffset = i / t.getSize().y * e, this; },
    orderBy(t, e) { return e = e || 'ASC', this.params.orderByFields = this.params.orderByFields ? `${this.params.orderByFields},` : '', this.params.orderByFields += [t, e].join(' '), this; },
    run(t, e) { return this._cleanParams(), this.options.isModern || U(this.options.url) ? (this.params.f = 'geojson', this.request(function (i, s) { this._trapSQLerrors(i), t.call(e, i, s, s); }, this)) : this.request(function (i, s) { this._trapSQLerrors(i), t.call(e, i, s && C(s), s); }, this); },
    count(t, e) { return this._cleanParams(), this.params.returnCountOnly = !0, this.request(function (e, i) { t.call(this, e, i && i.count, i); }, e); },
    ids(t, e) { return this._cleanParams(), this.params.returnIdsOnly = !0, this.request(function (e, i) { t.call(this, e, i && i.objectIds, i); }, e); },
    bounds(t, e) { return this._cleanParams(), this.params.returnExtentOnly = !0, this.request((i, s) => { s && s.extent && T(s.extent) ? t.call(e, i, T(s.extent), s) : (i = { message: 'Invalid Bounds' }, t.call(e, i, null, s)); }, e); },
    distinct() { return this.params.returnGeometry = !1, this.params.returnDistinctValues = !0, this; },
    pixelSize(t) { const i = e.point(t); return this.params.pixelSize = [i.x, i.y], this; },
    layer(t) { return this.path = `${t}/query`, this; },
    _trapSQLerrors(t) { t && t.code === '400' && M('one common syntax error in query requests is encasing string values in double quotes instead of single quotes'); },
    _cleanParams() { delete this.params.returnIdsOnly, delete this.params.returnExtentOnly, delete this.params.returnCountOnly; },
    _setGeometryParams(t) { this.params.inSr = 4326; const e = E(t); this.params.geometry = e.geometry, this.params.geometryType = e.geometryType; },
  }); function W(t) { return new j(t); } const J = Z.extend({
    setters: {
      contains: 'contains', text: 'searchText', fields: 'searchFields', spatialReference: 'sr', sr: 'sr', layers: 'layers', returnGeometry: 'returnGeometry', maxAllowableOffset: 'maxAllowableOffset', precision: 'geometryPrecision', dynamicLayers: 'dynamicLayers', returnZ: 'returnZ', returnM: 'returnM', gdbVersion: 'gdbVersion', token: 'token',
    },
    path: 'find',
    params: {
      sr: 4326, contains: !0, returnGeometry: !0, returnZ: !0, returnM: !1,
    },
    layerDefs(t, e) { return this.params.layerDefs = this.params.layerDefs ? `${this.params.layerDefs};` : '', this.params.layerDefs += [t, e].join(':'), this; },
    simplify(t, e) { const i = Math.abs(t.getBounds().getWest() - t.getBounds().getEast()); return this.params.maxAllowableOffset = i / t.getSize().y * e, this; },
    run(t, e) { return this.request((i, s) => { t.call(e, i, s && C(s), s); }, e); },
  }); function Q(t) { return new J(t); } const V = Z.extend({ path: 'identify', between(t, e) { return this.params.time = [t.valueOf(), e.valueOf()], this; } }); const H = V.extend({
    setters: {
      layers: 'layers', precision: 'geometryPrecision', tolerance: 'tolerance', returnGeometry: 'returnGeometry',
    },
    params: {
      sr: 4326, layers: 'all', tolerance: 3, returnGeometry: !0,
    },
    on(t) { const e = w(t.getBounds()); const i = t.getSize(); return this.params.imageDisplay = [i.x, i.y, 96], this.params.mapExtent = [e.xmin, e.ymin, e.xmax, e.ymax], this; },
    at(t) { return t.length === 2 && (t = e.latLng(t)), this._setGeometryParams(t), this; },
    layerDef(t, e) { return this.params.layerDefs = this.params.layerDefs ? `${this.params.layerDefs};` : '', this.params.layerDefs += [t, e].join(':'), this; },
    simplify(t, e) { const i = Math.abs(t.getBounds().getWest() - t.getBounds().getEast()); return this.params.maxAllowableOffset = i / t.getSize().y * e, this; },
    run(t, e) { return this.request((i, s) => { if (i)t.call(e, i, void 0, s); else { const r = C(s); s.results = s.results.reverse(); for (let n = 0; n < r.features.length; n++) { r.features[n].layerId = s.results[n].layerId; }t.call(e, void 0, r, s); } }); },
    _setGeometryParams(t) { const e = E(t); this.params.geometry = e.geometry, this.params.geometryType = e.geometryType; },
  }); function K(t) { return new H(t); } const X = V.extend({
    setters: {
      setMosaicRule: 'mosaicRule', setRenderingRule: 'renderingRule', setPixelSize: 'pixelSize', returnCatalogItems: 'returnCatalogItems', returnGeometry: 'returnGeometry',
    },
    params: { returnGeometry: !1 },
    at(t) { return t = e.latLng(t), this.params.geometry = JSON.stringify({ x: t.lng, y: t.lat, spatialReference: { wkid: 4326 } }), this.params.geometryType = 'esriGeometryPoint', this; },
    getMosaicRule() { return this.params.mosaicRule; },
    getRenderingRule() { return this.params.renderingRule; },
    getPixelSize() { return this.params.pixelSize; },
    run(t, e) { return this.request(function (i, s) { t.call(e, i, s && this._responseToGeoJSON(s), s); }, this); },
    _responseToGeoJSON(t) {
      const e = t.location; const i = t.catalogItems; const s = t.catalogItemVisibilities; const r = {
        pixel: {
          type: 'Feature', geometry: { type: 'Point', coordinates: [e.x, e.y] }, crs: { type: 'EPSG', properties: { code: e.spatialReference.wkid } }, properties: { OBJECTID: t.objectId, name: t.name, value: t.value }, id: t.objectId,
        },
      }; if (t.properties && t.properties.Values && (r.pixel.properties.values = t.properties.Values), i && i.features && (r.catalogItems = C(i), s && s.length === r.catalogItems.features.length)) for (let n = s.length - 1; n >= 0; n--)r.catalogItems.features[n].properties.catalogItemVisibility = s[n]; return r;
    },
  }); function $(t) { return new X(t); } const Y = e.Evented.extend({
    options: { proxy: !1, useCors: i, timeout: 0 },
    initialize(t) { t = t || {}, this._requestQueue = [], this._authenticating = !1, e.Util.setOptions(this, t), this.options.url = F(this.options.url); },
    get(t, e, i, s) { return this._request('get', t, e, i, s); },
    post(t, e, i, s) { return this._request('post', t, e, i, s); },
    request(t, e, i, s) { return this._request('request', t, e, i, s); },
    metadata(t, e) { return this._request('get', '', {}, t, e); },
    authenticate(t) { return this._authenticating = !1, this.options.token = t, this._runQueue(), this; },
    getTimeout() { return this.options.timeout; },
    setTimeout(t) { this.options.timeout = t; },
    _request(t, i, s, r, n) { this.fire('requeststart', { url: this.options.url + i, params: s, method: t }, !0); const o = this._createServiceCallback(t, i, s, r, n); if (this.options.token && (s.token = this.options.token), this.options.requestParams && e.Util.extend(s, this.options.requestParams), !this._authenticating) { const a = this.options.proxy ? `${this.options.proxy}?${this.options.url}${i}` : this.options.url + i; return t !== 'get' && t !== 'request' || this.options.useCors ? m[t](a, s, o, n) : m.get.JSONP(a, s, o, n); } this._requestQueue.push([t, i, s, r, n]); },
    _createServiceCallback(t, i, s, r, n) {
      return e.Util.bind(function (o, a) {
        !o || o.code !== 499 && o.code !== 498 || (this._authenticating = !0, this._requestQueue.push([t, i, s, r, n]), this.fire('authenticationrequired', { authenticate: e.Util.bind(this.authenticate, this) }, !0), o.authenticate = e.Util.bind(this.authenticate, this)), r.call(n, o, a), o ? this.fire('requesterror', {
          url: this.options.url + i, params: s, message: o.message, code: o.code, method: t,
        }, !0) : this.fire('requestsuccess', {
          url: this.options.url + i, params: s, response: a, method: t,
        }, !0), this.fire('requestend', { url: this.options.url + i, params: s, method: t }, !0);
      }, this);
    },
    _runQueue() { for (let t = this._requestQueue.length - 1; t >= 0; t--) { const e = this._requestQueue[t]; this[e.shift()].apply(this, e); } this._requestQueue = []; },
  }); const tt = Y.extend({ identify() { return K(this); }, find() { return Q(this); }, query() { return W(this); } }); function et(t) { return new tt(t); } const it = Y.extend({ query() { return W(this); }, identify() { return $(this); } }); function st(t) { return new it(t); } const rt = Y.extend({
    options: { idAttribute: 'OBJECTID' }, query() { return W(this); }, addFeature(t, e, i) { this.addFeatures(t, e, i); }, addFeatures(t, e, i) { for (var s = t.features ? t.features : [t], r = s.length - 1; r >= 0; r--) delete s[r].id; return t = I(t), t = s.length > 1 ? t : [t], this.post('addFeatures', { features: t }, (t, s) => { const r = s && s.addResults ? s.addResults.length > 1 ? s.addResults : s.addResults[0] : void 0; e && e.call(i, t || s.addResults[0].error, r); }, i); }, updateFeature(t, e, i) { this.updateFeatures(t, e, i); }, updateFeatures(t, e, i) { const s = t.features ? t.features : [t]; return t = I(t, this.options.idAttribute), t = s.length > 1 ? t : [t], this.post('updateFeatures', { features: t }, (t, s) => { const r = s && s.updateResults ? s.updateResults.length > 1 ? s.updateResults : s.updateResults[0] : void 0; e && e.call(i, t || s.updateResults[0].error, r); }, i); }, deleteFeature(t, e, i) { this.deleteFeatures(t, e, i); }, deleteFeatures(t, e, i) { return this.post('deleteFeatures', { objectIds: t }, (t, s) => { const r = s && s.deleteResults ? s.deleteResults.length > 1 ? s.deleteResults : s.deleteResults[0] : void 0; e && e.call(i, t || s.deleteResults[0].error, r); }, i); },
  }); function nt(t) { return new rt(t); } const ot = window.location.protocol !== 'https:' ? 'http:' : 'https:';


  var at = e.TileLayer.extend({
    statics: {
      TILES: {
        Streets: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 19, subdomains: ['server', 'services'], attribution: 'USGS, NOAA', attributionUrl: 'https://static.arcgis.com/attribution/World_Street_Map',
          },
        },
        Topographic: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 19, subdomains: ['server', 'services'], attribution: 'USGS, NOAA', attributionUrl: 'https://static.arcgis.com/attribution/World_Topo_Map',
          },
        },
        Oceans: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 16, subdomains: ['server', 'services'], attribution: 'USGS, NOAA', attributionUrl: 'https://static.arcgis.com/attribution/Ocean_Basemap',
          },
        },
        OceansLabels: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 16, subdomains: ['server', 'services'], pane: s ? 'esri-labels' : 'tilePane', attribution: '',
          },
        },
        NationalGeographic: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 16, subdomains: ['server', 'services'], attribution: 'National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.',
          },
        },
        DarkGray: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 16, subdomains: ['server', 'services'], attribution: 'HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors',
          },
        },
        DarkGrayLabels: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 16, subdomains: ['server', 'services'], pane: s ? 'esri-labels' : 'tilePane', attribution: '',
          },
        },
        Gray: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 16, subdomains: ['server', 'services'], attribution: 'HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors',
          },
        },
        GrayLabels: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 16, subdomains: ['server', 'services'], pane: s ? 'esri-labels' : 'tilePane', attribution: '',
          },
        },
        Imagery: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 19, subdomains: ['server', 'services'], attribution: 'DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community', attributionUrl: 'https://static.arcgis.com/attribution/World_Imagery',
          },
        },
        ImageryLabels: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 19, subdomains: ['server', 'services'], pane: s ? 'esri-labels' : 'tilePane', attribution: '',
          },
        },
        ImageryTransportation: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 19, subdomains: ['server', 'services'], pane: s ? 'esri-labels' : 'tilePane', attribution: '',
          },
        },
        ShadedRelief: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 13, subdomains: ['server', 'services'], attribution: 'USGS',
          },
        },
        ShadedReliefLabels: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 12, subdomains: ['server', 'services'], pane: s ? 'esri-labels' : 'tilePane', attribution: '',
          },
        },
        Terrain: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 13, subdomains: ['server', 'services'], attribution: 'USGS, NOAA',
          },
        },
        TerrainLabels: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 13, subdomains: ['server', 'services'], pane: s ? 'esri-labels' : 'tilePane', attribution: '',
          },
        },
        USATopo: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 15, subdomains: ['server', 'services'], attribution: 'USGS, National Geographic Society, i-cubed',
          },
        },
        ImageryClarity: { urlTemplate: `${ot}//clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`, options: { minZoom: 1, maxZoom: 19, attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community' } },
        Physical: {
          urlTemplate: `${ot}//{s}.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 8, subdomains: ['server', 'services'], attribution: 'U.S. National Park Service',
          },
        },
        ImageryFirefly: {
          urlTemplate: `${ot}//fly.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Firefly/MapServer/tile/{z}/{y}/{x}`,
          options: {
            minZoom: 1, maxZoom: 19, attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community', attributionUrl: 'https://static.arcgis.com/attribution/World_Imagery',
          },
        },
      },
    },
    initialize(t, i) { let s; if (typeof t === 'object' && t.urlTemplate && t.options)s = t; else { if (typeof t !== 'string' || !at.TILES[t]) throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Physical", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ImageryClarity", "ImageryFirefly", ShadedRelief", "ShadedReliefLabels", "Terrain", "TerrainLabels" or "USATopo"'); s = at.TILES[t]; } const r = e.Util.extend(s.options, i); e.Util.setOptions(this, r), this.options.token && s.urlTemplate.indexOf('token=') === -1 && (s.urlTemplate += `?token=${this.options.token}`), this.options.proxy && (s.urlTemplate = `${this.options.proxy}?${s.urlTemplate}`), e.TileLayer.prototype.initialize.call(this, s.urlTemplate, r); },
    onAdd(t) { D(t), this.options.pane === 'esri-labels' && this._initPane(), this.options.attributionUrl && B((this.options.proxy ? `${this.options.proxy}?` : '') + this.options.attributionUrl, t), t.on('moveend', z), e.TileLayer.prototype.onAdd.call(this, t); },
    onRemove(t) { t.off('moveend', z), e.TileLayer.prototype.onRemove.call(this, t); },
    _initPane() { if (!this._map.getPane(this.options.pane)) { const t = this._map.createPane(this.options.pane); t.style.pointerEvents = 'none', t.style.zIndex = 500; } },
    getAttribution() { if (this.options.attribution) var t = `<span class="esri-dynamic-attribution">${this.options.attribution}</span>`; return t; },
  }); var ut = e.TileLayer.extend({
    options: { zoomOffsetAllowance: 0.1, errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEABAMAAACuXLVVAAAAA1BMVEUzNDVszlHHAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAAAAAAAAAB6mUWpAAAADZJREFUeJztwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7waBAAABw08RwAAAAABJRU5ErkJggg==' },
    statics: {
      MercatorZoomLevels: {
        0: 156543.033928, 1: 78271.5169639999, 2: 39135.7584820001, 3: 19567.8792409999, 4: 9783.93962049996, 5: 4891.96981024998, 6: 2445.98490512499, 7: 1222.99245256249, 8: 611.49622628138, 9: 305.748113140558, 10: 152.874056570411, 11: 76.4370282850732, 12: 38.2185141425366, 13: 19.1092570712683, 14: 9.55462853563415, 15: 4.77731426794937, 16: 2.38865713397468, 17: 1.19432856685505, 18: 0.597164283559817, 19: 0.298582141647617, 20: 0.14929107082381, 21: 0.07464553541191, 22: 0.0373227677059525, 23: 0.0186613838529763,
      },
    },
    initialize(t) { t = k(t = e.Util.setOptions(this, t)), this.tileUrl = `${(t.proxy ? `${t.proxy}?` : '') + t.url}tile/{z}/{y}/{x}${t.requestParams && Object.keys(t.requestParams).length > 0 ? e.Util.getParamString(t.requestParams) : ''}`, t.url.indexOf('{s}') !== -1 && t.subdomains && (t.url = t.url.replace('{s}', t.subdomains[0])), this.service = et(t), this.service.addEventParent(this), new RegExp(/tiles.arcgis(online)?\.com/g).test(t.url) && (this.tileUrl = this.tileUrl.replace('://tiles', '://tiles{s}'), t.subdomains = ['1', '2', '3', '4']), this.options.token && (this.tileUrl += `?token=${this.options.token}`), e.TileLayer.prototype.initialize.call(this, this.tileUrl, t); },
    getTileUrl(t) {
      const i = this._getZoomForUrl(); return e.Util.template(this.tileUrl, e.Util.extend({
        s: this._getSubdomain(t), x: t.x, y: t.y, z: this._lodMap && this._lodMap[i] ? this._lodMap[i] : i,
      }, this.options));
    },
    createTile(t, i) { const s = document.createElement('img'); return e.DomEvent.on(s, 'load', e.Util.bind(this._tileOnLoad, this, i, s)), e.DomEvent.on(s, 'error', e.Util.bind(this._tileOnError, this, i, s)), this.options.crossOrigin && (s.crossOrigin = ''), s.alt = '', !this._lodMap || this._lodMap && this._lodMap[this._getZoomForUrl()] ? s.src = this.getTileUrl(t) : this.once('lodmap', function () { s.src = this.getTileUrl(t); }, this), s; },
    onAdd(t) { D(t), this._lodMap || this.metadata(function (i, s) { if (!i && s.spatialReference) { const r = s.spatialReference.latestWkid || s.spatialReference.wkid; if (!this.options.attribution && t.attributionControl && s.copyrightText && (this.options.attribution = s.copyrightText, t.attributionControl.addAttribution(this.getAttribution())), t.options.crs !== e.CRS.EPSG3857 || r !== 102100 && r !== 3857)t.options.crs && t.options.crs.code && t.options.crs.code.indexOf(r) > -1 || M('L.esri.TiledMapLayer is using a non-mercator spatial reference. Support may be available through Proj4Leaflet http://esri.github.io/esri-leaflet/examples/non-mercator-projection.html'); else { this._lodMap = {}; for (let n = s.tileInfo.lods, o = ut.MercatorZoomLevels, a = 0; a < n.length; a++) { const u = n[a]; for (const l in o) { const h = o[l]; if (this._withinPercentage(u.resolution, h, this.options.zoomOffsetAllowance)) { this._lodMap[l] = u.level; break; } } } this.fire('lodmap'); } } }, this), e.TileLayer.prototype.onAdd.call(this, t); },
    metadata(t, e) { return this.service.metadata(t, e), this; },
    identify() { return this.service.identify(); },
    find() { return this.service.find(); },
    query() { return this.service.query(); },
    authenticate(t) { const e = `?token=${t}`; return this.tileUrl = this.options.token ? this.tileUrl.replace(/\?token=(.+)/g, e) : this.tileUrl + e, this.options.token = t, this.service.authenticate(t), this; },
    _withinPercentage(t, e, i) { return Math.abs(t / e - 1) < i; },
  }); const lt = e.ImageOverlay.extend({ onAdd(t) { this._topLeft = t.getPixelBounds().min, e.ImageOverlay.prototype.onAdd.call(this, t); }, _reset() { this._map.options.crs === e.CRS.EPSG3857 ? e.ImageOverlay.prototype._reset.call(this) : e.DomUtil.setPosition(this._image, this._topLeft.subtract(this._map.getPixelOrigin())); } }); const ht = e.Layer.extend({
    options: {
      opacity: 1, position: 'front', f: 'image', useCors: i, attribution: null, interactive: !1, alt: '',
    },
    onAdd(t) { D(t), this.options.zIndex && (this.options.position = null), this._update = e.Util.throttle(this._update, this.options.updateInterval, this), t.on('moveend', this._update, this), this._currentImage && this._currentImage._bounds.equals(this._map.getBounds()) ? t.addLayer(this._currentImage) : this._currentImage && (this._map.removeLayer(this._currentImage), this._currentImage = null), this._update(), this._popup && (this._map.on('click', this._getPopupData, this), this._map.on('dblclick', this._resetPopupState, this)), this.metadata(function (e, i) { !e && !this.options.attribution && t.attributionControl && i.copyrightText && (this.options.attribution = i.copyrightText, t.attributionControl.addAttribution(this.getAttribution())); }, this); },
    onRemove(t) { this._currentImage && this._map.removeLayer(this._currentImage), this._popup && (this._map.off('click', this._getPopupData, this), this._map.off('dblclick', this._resetPopupState, this)), this._map.off('moveend', this._update, this); },
    bindPopup(t, i) { return this._shouldRenderPopup = !1, this._lastClick = !1, this._popup = e.popup(i), this._popupFunction = t, this._map && (this._map.on('click', this._getPopupData, this), this._map.on('dblclick', this._resetPopupState, this)), this; },
    unbindPopup() { return this._map && (this._map.closePopup(this._popup), this._map.off('click', this._getPopupData, this), this._map.off('dblclick', this._resetPopupState, this)), this._popup = !1, this; },
    bringToFront() { return this.options.position = 'front', this._currentImage && (this._currentImage.bringToFront(), this._setAutoZIndex(Math.max)), this; },
    bringToBack() { return this.options.position = 'back', this._currentImage && (this._currentImage.bringToBack(), this._setAutoZIndex(Math.min)), this; },
    setZIndex(t) { return this.options.zIndex = t, this._currentImage && this._currentImage.setZIndex(t), this; },
    _setAutoZIndex(t) { if (this._currentImage) { for (var e, i = this._currentImage.getPane().children, s = -t(-1 / 0, 1 / 0), r = 0, n = i.length; r < n; r++)e = i[r].style.zIndex, i[r] !== this._currentImage._image && e && (s = t(s, +e)); isFinite(s) && (this.options.zIndex = s + t(-1, 1), this.setZIndex(this.options.zIndex)); } },
    getAttribution() { return this.options.attribution; },
    getOpacity() { return this.options.opacity; },
    setOpacity(t) { return this.options.opacity = t, this._currentImage && this._currentImage.setOpacity(t), this; },
    getTimeRange() { return [this.options.from, this.options.to]; },
    setTimeRange(t, e) { return this.options.from = t, this.options.to = e, this._update(), this; },
    metadata(t, e) { return this.service.metadata(t, e), this; },
    authenticate(t) { return this.service.authenticate(t), this; },
    redraw() { this._update(); },
    _renderImage(t, e, i) {
      if (this._map) {
        if (i && (t = `data:${i};base64,${t}`), !t) return; const s = new lt(t, e, {
          opacity: 0, crossOrigin: this.options.useCors, alt: this.options.alt, pane: this.options.pane || this.getPane(), interactive: this.options.interactive,
        }).addTo(this._map); var r = function (t) { if (s.off('error', r, this), this._map) { const i = t.target; const n = this._currentImage; i._bounds.equals(e) && i._bounds.equals(this._map.getBounds()) ? (this._currentImage = i, this.options.position === 'front' ? this.bringToFront() : this.options.position === 'back' && this.bringToBack(), this.options.zIndex && this.setZIndex(this.options.zIndex), this._map && this._currentImage._map ? this._currentImage.setOpacity(this.options.opacity) : this._currentImage._map.removeLayer(this._currentImage), n && this._map && this._map.removeLayer(n), n && n._map && n._map.removeLayer(n)) : this._map.removeLayer(i); } this.fire('load', { bounds: e }); }; s.once('error', function () { this._map.removeLayer(s), this.fire('error'), s.off('load', r, this); }, this), s.once('load', r, this), this.fire('loading', { bounds: e });
      }
    },
    _update() { if (this._map) { const t = this._map.getZoom(); const i = this._map.getBounds(); if (!(this._animatingZoom || this._map._panTransition && this._map._panTransition._inProgress)) if (t > this.options.maxZoom || t < this.options.minZoom) this._currentImage && (this._currentImage._map.removeLayer(this._currentImage), this._currentImage = null); else { const s = this._buildExportParams(); e.Util.extend(s, this.options.requestParams), s ? this._requestExport(s, i) : this._currentImage && (this._currentImage._map.removeLayer(this._currentImage), this._currentImage = null); } } },
    _renderPopup(t, i, s, r) { if (t = e.latLng(t), this._shouldRenderPopup && this._lastClick.equals(t)) { const n = this._popupFunction(i, s, r); n && this._popup.setLatLng(t).setContent(n).openOn(this._map); } },
    _resetPopupState(t) { this._shouldRenderPopup = !1, this._lastClick = t.latlng; },
    _calculateBbox() { const t = this._map.getPixelBounds(); const i = this._map.unproject(t.getBottomLeft()); const s = this._map.unproject(t.getTopRight()); const r = this._map.options.crs.project(s); const n = this._map.options.crs.project(i); const o = e.bounds(r, n); return [o.getBottomLeft().x, o.getBottomLeft().y, o.getTopRight().x, o.getTopRight().y].join(','); },
    _calculateImageSize() { const t = this._map.getPixelBounds(); const e = this._map.getSize(); const i = this._map.unproject(t.getBottomLeft()); const s = this._map.unproject(t.getTopRight()); const r = this._map.latLngToLayerPoint(s).y; const n = this._map.latLngToLayerPoint(i).y; return (r > 0 || n < e.y) && (e.y = n - r), `${e.x},${e.y}`; },
  }); const ct = ht.extend({
    options: {
      updateInterval: 150, format: 'jpgpng', transparent: !0, f: 'image',
    },
    query() { return this.service.query(); },
    identify() { return this.service.identify(); },
    initialize(t) { t = k(t), this.service = st(t), this.service.addEventParent(this), e.Util.setOptions(this, t); },
    setPixelType(t) { return this.options.pixelType = t, this._update(), this; },
    getPixelType() { return this.options.pixelType; },
    setBandIds(t) { return e.Util.isArray(t) ? this.options.bandIds = t.join(',') : this.options.bandIds = t.toString(), this._update(), this; },
    getBandIds() { return this.options.bandIds; },
    setNoData(t, i) { return e.Util.isArray(t) ? this.options.noData = t.join(',') : this.options.noData = t.toString(), i && (this.options.noDataInterpretation = i), this._update(), this; },
    getNoData() { return this.options.noData; },
    getNoDataInterpretation() { return this.options.noDataInterpretation; },
    setRenderingRule(t) { this.options.renderingRule = t, this._update(); },
    getRenderingRule() { return this.options.renderingRule; },
    setMosaicRule(t) { this.options.mosaicRule = t, this._update(); },
    getMosaicRule() { return this.options.mosaicRule; },
    _getPopupData(t) { const i = e.Util.bind(function (i, s, r) { i || setTimeout(e.Util.bind(function () { this._renderPopup(t.latlng, i, s, r); }, this), 300); }, this); const s = this.identify().at(t.latlng); this.options.mosaicRule && s.setMosaicRule(this.options.mosaicRule), s.run(i), this._shouldRenderPopup = !0, this._lastClick = t.latlng; },
    _buildExportParams() {
      const t = parseInt(this._map.options.crs.code.split(':')[1], 10); const e = {
        bbox: this._calculateBbox(), size: this._calculateImageSize(), format: this.options.format, transparent: this.options.transparent, bboxSR: t, imageSR: t,
      }; return this.options.from && this.options.to && (e.time = `${this.options.from.valueOf()},${this.options.to.valueOf()}`), this.options.pixelType && (e.pixelType = this.options.pixelType), this.options.interpolation && (e.interpolation = this.options.interpolation), this.options.compressionQuality && (e.compressionQuality = this.options.compressionQuality), this.options.bandIds && (e.bandIds = this.options.bandIds), (this.options.noData === 0 || this.options.noData) && (e.noData = this.options.noData), this.options.noDataInterpretation && (e.noDataInterpretation = this.options.noDataInterpretation), this.service.options.token && (e.token = this.service.options.token), this.options.renderingRule && (e.renderingRule = JSON.stringify(this.options.renderingRule)), this.options.mosaicRule && (e.mosaicRule = JSON.stringify(this.options.mosaicRule)), e;
    },
    _requestExport(t, i) { this.options.f === 'json' ? this.service.request('exportImage', t, function (t, e) { t || (this.options.token && (e.href += `?token=${this.options.token}`), this.options.proxy && (e.href = `${this.options.proxy}?${e.href}`), this._renderImage(e.href, i)); }, this) : (t.f = 'image', this._renderImage(`${this.options.url}exportImage${e.Util.getParamString(t)}`, i)); },
  }); const pt = ht.extend({
    options: {
      updateInterval: 150, layers: !1, layerDefs: !1, timeOptions: !1, format: 'png24', transparent: !0, f: 'json',
    },
    initialize(t) { t = k(t), this.service = et(t), this.service.addEventParent(this), (t.proxy || t.token) && t.f !== 'json' && (t.f = 'json'), e.Util.setOptions(this, t); },
    getDynamicLayers() { return this.options.dynamicLayers; },
    setDynamicLayers(t) { return this.options.dynamicLayers = t, this._update(), this; },
    getLayers() { return this.options.layers; },
    setLayers(t) { return this.options.layers = t, this._update(), this; },
    getLayerDefs() { return this.options.layerDefs; },
    setLayerDefs(t) { return this.options.layerDefs = t, this._update(), this; },
    getTimeOptions() { return this.options.timeOptions; },
    setTimeOptions(t) { return this.options.timeOptions = t, this._update(), this; },
    query() { return this.service.query(); },
    identify() { return this.service.identify(); },
    find() { return this.service.find(); },
    _getPopupData(t) { let i; const s = e.Util.bind(function (i, s, r) { i || setTimeout(e.Util.bind(function () { this._renderPopup(t.latlng, i, s, r); }, this), 300); }, this); if ((i = this.options.popup ? this.options.popup.on(this._map).at(t.latlng) : this.identify().on(this._map).at(t.latlng)).params.maxAllowableOffset || i.simplify(this._map, 0.5), this.options.popup && this.options.popup.params && this.options.popup.params.layers || (this.options.layers ? i.layers(`visible:${this.options.layers.join(',')}`) : i.layers('visible')), this.options.layerDefs && typeof this.options.layerDefs !== 'string' && !i.params.layerDefs) for (const r in this.options.layerDefs) this.options.layerDefs.hasOwnProperty(r) && i.layerDef(r, this.options.layerDefs[r]); i.run(s), this._shouldRenderPopup = !0, this._lastClick = t.latlng; },
    _buildExportParams() {
      const t = parseInt(this._map.options.crs.code.split(':')[1], 10); const e = {
        bbox: this._calculateBbox(), size: this._calculateImageSize(), dpi: 96, format: this.options.format, transparent: this.options.transparent, bboxSR: t, imageSR: t,
      }; if (this.options.dynamicLayers && (e.dynamicLayers = this.options.dynamicLayers), this.options.layers) { if (this.options.layers.length === 0) return; e.layers = `show:${this.options.layers.join(',')}`; } return this.options.layerDefs && (e.layerDefs = typeof this.options.layerDefs === 'string' ? this.options.layerDefs : JSON.stringify(this.options.layerDefs)), this.options.timeOptions && (e.timeOptions = JSON.stringify(this.options.timeOptions)), this.options.from && this.options.to && (e.time = `${this.options.from.valueOf()},${this.options.to.valueOf()}`), this.service.options.token && (e.token = this.service.options.token), this.options.proxy && (e.proxy = this.options.proxy), this.options.disableCache && (e._ts = Date.now()), e;
    },
    _requestExport(t, i) { this.options.f === 'json' ? this.service.request('export', t, function (t, e) { t || (this.options.token && (e.href += `?token=${this.options.token}`), this.options.proxy && (e.href = `${this.options.proxy}?${e.href}`), e.href ? this._renderImage(e.href, i) : this._renderImage(e.imageData, i, e.contentType)); }, this) : (t.f = 'image', this._renderImage(`${this.options.url}export${e.Util.getParamString(t)}`, i)); },
  }); const dt = e.Layer.extend({
    options: { cellSize: 512, updateInterval: 150 }, initialize(t) { t = e.setOptions(this, t), this._zooming = !1; }, onAdd(t) { this._map = t, this._update = e.Util.throttle(this._update, this.options.updateInterval, this), this._reset(), this._update(); }, onRemove() { this._map.removeEventListener(this.getEvents(), this), this._removeCells(); }, getEvents() { return { moveend: this._update, zoomstart: this._zoomstart, zoomend: this._reset }; }, addTo(t) { return t.addLayer(this), this; }, removeFrom(t) { return t.removeLayer(this), this; }, _zoomstart() { this._zooming = !0; }, _reset() { this._removeCells(), this._cells = {}, this._activeCells = {}, this._cellsToLoad = 0, this._cellsTotal = 0, this._cellNumBounds = this._getCellNumBounds(), this._resetWrap(), this._zooming = !1; }, _resetWrap() { const t = this._map; const e = t.options.crs; if (!e.infinite) { const i = this._getCellSize(); e.wrapLng && (this._wrapLng = [Math.floor(t.project([0, e.wrapLng[0]]).x / i), Math.ceil(t.project([0, e.wrapLng[1]]).x / i)]), e.wrapLat && (this._wrapLat = [Math.floor(t.project([e.wrapLat[0], 0]).y / i), Math.ceil(t.project([e.wrapLat[1], 0]).y / i)]); } }, _getCellSize() { return this.options.cellSize; }, _update() { if (this._map) { const t = this._map.getPixelBounds(); const i = this._getCellSize(); const s = e.bounds(t.min.divideBy(i).floor(), t.max.divideBy(i).floor()); this._removeOtherCells(s), this._addCells(s), this.fire('cellsupdated'); } }, _addCells(t) { let i; let s; let r; const n = []; const o = t.getCenter(); const a = this._map.getZoom(); for (i = t.min.y; i <= t.max.y; i++) for (s = t.min.x; s <= t.max.x; s++)(r = e.point(s, i)).z = a, this._isValidCell(r) && n.push(r); const u = n.length; if (u !== 0) for (this._cellsToLoad += u, this._cellsTotal += u, n.sort((t, e) => t.distanceTo(o) - e.distanceTo(o)), s = 0; s < u; s++) this._addCell(n[s]); }, _isValidCell(t) { const i = this._map.options.crs; if (!i.infinite) { const s = this._cellNumBounds; if (!s) return !1; if (!i.wrapLng && (t.x < s.min.x || t.x > s.max.x) || !i.wrapLat && (t.y < s.min.y || t.y > s.max.y)) return !1; } if (!this.options.bounds) return !0; const r = this._cellCoordsToBounds(t); return e.latLngBounds(this.options.bounds).intersects(r); }, _cellCoordsToBounds(t) { const i = this._map; const s = this.options.cellSize; const r = t.multiplyBy(s); const n = r.add([s, s]); const o = i.wrapLatLng(i.unproject(r, t.z)); const a = i.wrapLatLng(i.unproject(n, t.z)); return e.latLngBounds(o, a); }, _cellCoordsToKey(t) { return `${t.x}:${t.y}`; }, _keyToCellCoords(t) { const i = t.split(':'); const s = parseInt(i[0], 10); const r = parseInt(i[1], 10); return e.point(s, r); }, _removeOtherCells(t) { for (const e in this._cells)t.contains(this._keyToCellCoords(e)) || this._removeCell(e); }, _removeCell(t) { const e = this._activeCells[t]; e && (delete this._activeCells[t], this.cellLeave && this.cellLeave(e.bounds, e.coords), this.fire('cellleave', { bounds: e.bounds, coords: e.coords })); }, _removeCells() { for (const t in this._cells) { const e = this._cells[t].bounds; const i = this._cells[t].coords; this.cellLeave && this.cellLeave(e, i), this.fire('cellleave', { bounds: e, coords: i }); } }, _addCell(t) { this._wrapCoords(t); const e = this._cellCoordsToKey(t); let i = this._cells[e]; i && !this._activeCells[e] && (this.cellEnter && this.cellEnter(i.bounds, t), this.fire('cellenter', { bounds: i.bounds, coords: t }), this._activeCells[e] = i), i || (i = { coords: t, bounds: this._cellCoordsToBounds(t) }, this._cells[e] = i, this._activeCells[e] = i, this.createCell && this.createCell(i.bounds, t), this.fire('cellcreate', { bounds: i.bounds, coords: t })); }, _wrapCoords(t) { t.x = this._wrapLng ? e.Util.wrapNum(t.x, this._wrapLng) : t.x, t.y = this._wrapLat ? e.Util.wrapNum(t.y, this._wrapLat) : t.y; }, _getCellNumBounds() { const t = this._map.getPixelWorldBounds(); const i = this._getCellSize(); return t ? e.bounds(t.min.divideBy(i).floor(), t.max.divideBy(i).ceil().subtract([1, 1])) : null; },
  }); function mt(t) { this.values = [].concat(t || []); }mt.prototype.query = function (t) { const e = this.getIndex(t); return this.values[e]; }, mt.prototype.getIndex = function (t) { this.dirty && this.sort(); for (var e, i, s = 0, r = this.values.length - 1; s <= r;) if (e = (s + r) / 2 | 0, +(i = this.values[Math.round(e)]).value < +t)s = e + 1; else { if (!(+i.value > +t)) return e; r = e - 1; } return Math.abs(~r); }, mt.prototype.between = function (t, e) { let i = this.getIndex(t); let s = this.getIndex(e); if (i === 0 && s === 0) return []; for (;this.values[i - 1] && this.values[i - 1].value === t;)i--; for (;this.values[s + 1] && this.values[s + 1].value === e;)s++; return this.values[s] && this.values[s].value === e && this.values[s + 1] && s++, this.values.slice(i, s); }, mt.prototype.insert = function (t) { return this.values.splice(this.getIndex(t.value), 0, t), this; }, mt.prototype.bulkAdd = function (t, e) { return this.values = this.values.concat([].concat(t || [])), e ? this.sort() : this.dirty = !0, this; }, mt.prototype.sort = function () { return this.values.sort((t, e) => +e.value - +t.value).reverse(), this.dirty = !1, this; }; const ft = dt.extend({
    options: {
      attribution: null, where: '1=1', fields: ['*'], from: !1, to: !1, timeField: !1, timeFilterMode: 'server', simplifyFactor: 0, precision: 6,
    },
    initialize(t) { if (dt.prototype.initialize.call(this, t), t = k(t), t = e.Util.setOptions(this, t), this.service = nt(t), this.service.addEventParent(this), this.options.fields[0] !== '*') { for (var i = !1, s = 0; s < this.options.fields.length; s++) this.options.fields[s].match(/^(OBJECTID|FID|OID|ID)$/i) && (i = !0); !1 === i && M('no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.'); } this.options.timeField.start && this.options.timeField.end ? (this._startTimeIndex = new mt(), this._endTimeIndex = new mt()) : this.options.timeField && (this._timeIndex = new mt()), this._cache = {}, this._currentSnapshot = [], this._activeRequests = 0; },
    onAdd(t) { return D(t), this.service.metadata(function (e, i) { if (!e) { const s = i.supportedQueryFormats; let r = !1; !1 === this.service.options.isModern && (r = !0), !r && s && s.indexOf('geoJSON') !== -1 && (this.service.options.isModern = !0), i.objectIdField && (this.service.options.idAttribute = i.objectIdField), !this.options.attribution && t.attributionControl && i.copyrightText && (this.options.attribution = i.copyrightText, t.attributionControl.addAttribution(this.getAttribution())); } }, this), t.on('zoomend', this._handleZoomChange, this), dt.prototype.onAdd.call(this, t); },
    onRemove(t) { return t.off('zoomend', this._handleZoomChange, this), dt.prototype.onRemove.call(this, t); },
    getAttribution() { return this.options.attribution; },
    createCell(t, e) { this._visibleZoom() && this._requestFeatures(t, e); },
    _requestFeatures(t, i, s) { return this._activeRequests++, this._activeRequests === 1 && this.fire('loading', { bounds: t }, !0), this._buildQuery(t).run(function (r, n, o) { o && o.exceededTransferLimit && this.fire('drawlimitexceeded'), !r && n && n.features.length && e.Util.requestAnimFrame(e.Util.bind(function () { this._addFeatures(n.features, i), this._postProcessFeatures(t); }, this)), r || !n || n.features.length || this._postProcessFeatures(t), r && this._postProcessFeatures(t), s && s.call(this, r, n); }, this); },
    _postProcessFeatures(t) { this._activeRequests--, this._activeRequests <= 0 && this.fire('load', { bounds: t }); },
    _cacheKey(t) { return `${t.z}:${t.x}:${t.y}`; },
    _addFeatures(t, e) { const i = this._cacheKey(e); this._cache[i] = this._cache[i] || []; for (let s = t.length - 1; s >= 0; s--) { const r = t[s].id; this._currentSnapshot.indexOf(r) === -1 && this._currentSnapshot.push(r), this._cache[i].indexOf(r) === -1 && this._cache[i].push(r); } this.options.timeField && this._buildTimeIndexes(t), this.createLayers(t); },
    _buildQuery(t) {
      const i = this.service.query().intersects(t).where(this.options.where).fields(this.options.fields)
        .precision(this.options.precision); return this.options.requestParams && e.Util.extend(i.params, this.options.requestParams), this.options.simplifyFactor && i.simplify(this._map, this.options.simplifyFactor), this.options.timeFilterMode === 'server' && this.options.from && this.options.to && i.between(this.options.from, this.options.to), i;
    },
    setWhere(t, i, s) { this.options.where = t && t.length ? t : '1=1'; for (var r = [], n = [], o = 0, a = null, u = e.Util.bind(function (t, u) { if (t && (a = t), u) for (let l = u.features.length - 1; l >= 0; l--)n.push(u.features[l].id); --o <= 0 && this._visibleZoom() && (this._currentSnapshot = n, e.Util.requestAnimFrame(e.Util.bind(function () { this.removeLayers(r), this.addLayers(n), i && i.call(s, a); }, this))); }, this), l = this._currentSnapshot.length - 1; l >= 0; l--)r.push(this._currentSnapshot[l]); for (const h in this._activeCells) { o++; const c = this._keyToCellCoords(h); const p = this._cellCoordsToBounds(c); this._requestFeatures(p, h, u); } return this; },
    getWhere() { return this.options.where; },
    getTimeRange() { return [this.options.from, this.options.to]; },
    setTimeRange(t, i, s, r) { const n = this.options.from; const o = this.options.to; let a = 0; let u = null; const l = e.Util.bind(function (e) { e && (u = e), this._filterExistingFeatures(n, o, t, i), a--, s && a <= 0 && s.call(r, u); }, this); if (this.options.from = t, this.options.to = i, this._filterExistingFeatures(n, o, t, i), this.options.timeFilterMode === 'server') for (const h in this._activeCells) { a++; const c = this._keyToCellCoords(h); const p = this._cellCoordsToBounds(c); this._requestFeatures(p, h, l); } return this; },
    refresh() { for (const t in this._activeCells) { const e = this._keyToCellCoords(t); const i = this._cellCoordsToBounds(e); this._requestFeatures(i, t); } this.redraw && this.once('load', function () { this.eachFeature(function (t) { this._redraw(t.feature.id); }, this); }, this); },
    _filterExistingFeatures(t, i, s, r) { const n = t && i ? this._getFeaturesInTimeRange(t, i) : this._currentSnapshot; const o = this._getFeaturesInTimeRange(s, r); if (o.indexOf) for (let a = 0; a < o.length; a++) { const u = n.indexOf(o[a]); u >= 0 && n.splice(u, 1); }e.Util.requestAnimFrame(e.Util.bind(function () { this.removeLayers(n), this.addLayers(o); }, this)); },
    _getFeaturesInTimeRange(t, e) { let i; const s = []; if (this.options.timeField.start && this.options.timeField.end) { const r = this._startTimeIndex.between(t, e); const n = this._endTimeIndex.between(t, e); i = r.concat(n); } else i = this._timeIndex.between(t, e); for (let o = i.length - 1; o >= 0; o--)s.push(i[o].id); return s; },
    _buildTimeIndexes(t) { let e; let i; if (this.options.timeField.start && this.options.timeField.end) { const s = []; const r = []; for (e = t.length - 1; e >= 0; e--)i = t[e], s.push({ id: i.id, value: new Date(i.properties[this.options.timeField.start]) }), r.push({ id: i.id, value: new Date(i.properties[this.options.timeField.end]) }); this._startTimeIndex.bulkAdd(s), this._endTimeIndex.bulkAdd(r); } else { const n = []; for (e = t.length - 1; e >= 0; e--)i = t[e], n.push({ id: i.id, value: new Date(i.properties[this.options.timeField]) }); this._timeIndex.bulkAdd(n); } },
    _featureWithinTimeRange(t) { if (!this.options.from || !this.options.to) return !0; const e = +this.options.from.valueOf(); const i = +this.options.to.valueOf(); if (typeof this.options.timeField === 'string') { const s = +t.properties[this.options.timeField]; return s >= e && s <= i; } if (this.options.timeField.start && this.options.timeField.end) { const r = +t.properties[this.options.timeField.start]; const n = +t.properties[this.options.timeField.end]; return r >= e && r <= i || n >= e && n <= i; } },
    _visibleZoom() { if (!this._map) return !1; const t = this._map.getZoom(); return !(t > this.options.maxZoom || t < this.options.minZoom); },
    _handleZoomChange() { if (this._visibleZoom()) for (const t in this._activeCells) { const e = this._activeCells[t].coords; const i = this._cacheKey(e); this._cache[i] && this.addLayers(this._cache[i]); } else this.removeLayers(this._currentSnapshot), this._currentSnapshot = []; },
    authenticate(t) { return this.service.authenticate(t), this; },
    metadata(t, e) { return this.service.metadata(t, e), this; },
    query() { return this.service.query(); },
    _getMetadata(t) { this._metadata ? t(void 0, this._metadata) : this.metadata(e.Util.bind(function (e, i) { this._metadata = i, t(e, this._metadata); }, this)); },
    addFeature(t, e, i) { this.addFeatures(t, e, i); },
    addFeatures(t, i, s) { this._getMetadata(e.Util.bind(function (r, n) { if (r)i && i.call(this, r, null); else { const o = t.features ? t.features : [t]; this.service.addFeatures(t, e.Util.bind(function (t, e) { if (!t) { for (let r = o.length - 1; r >= 0; r--)o[r].properties[n.objectIdField] = o.length > 1 ? e[r].objectId : e.objectId, o[r].id = o.length > 1 ? e[r].objectId : e.objectId; this.createLayers(o); }i && i.call(s, t, e); }, this)); } }, this)); },
    updateFeature(t, e, i) { this.updateFeatures(t, e, i); },
    updateFeatures(t, e, i) { const s = t.features ? t.features : [t]; this.service.updateFeatures(t, function (t, r) { if (!t) { for (let n = s.length - 1; n >= 0; n--) this.removeLayers([s[n].id], !0); this.createLayers(s); }e && e.call(i, t, r); }, this); },
    deleteFeature(t, e, i) { this.deleteFeatures(t, e, i); },
    deleteFeatures(t, e, i) { return this.service.deleteFeatures(t, function (t, s) { const r = s.length ? s : [s]; if (!t && r.length > 0) for (let n = r.length - 1; n >= 0; n--) this.removeLayers([r[n].objectId], !0); e && e.call(i, t, s); }, this); },
  }); const yt = ft.extend({
    options: { cacheLayers: !0 }, initialize(t) { ft.prototype.initialize.call(this, t), this._originalStyle = this.options.style, this._layers = {}; }, onRemove(t) { for (const e in this._layers)t.removeLayer(this._layers[e]), this.fire('removefeature', { feature: this._layers[e].feature, permanent: !1 }, !0); return ft.prototype.onRemove.call(this, t); }, createNewLayer(t) { const i = e.GeoJSON.geometryToLayer(t, this.options); return i && (i.defaultOptions = i.options), i; }, _updateLayer(t, i) { let s = []; const r = this.options.coordsToLatLng || e.GeoJSON.coordsToLatLng; switch (i.properties && (t.feature.properties = i.properties), i.geometry.type) { case 'Point': s = e.GeoJSON.coordsToLatLng(i.geometry.coordinates), t.setLatLng(s); break; case 'LineString': s = e.GeoJSON.coordsToLatLngs(i.geometry.coordinates, 0, r), t.setLatLngs(s); break; case 'MultiLineString': case 'Polygon': s = e.GeoJSON.coordsToLatLngs(i.geometry.coordinates, 1, r), t.setLatLngs(s); break; case 'MultiPolygon': s = e.GeoJSON.coordsToLatLngs(i.geometry.coordinates, 2, r), t.setLatLngs(s); } }, createLayers(t) { for (let e = t.length - 1; e >= 0; e--) { var i; const s = t[e]; const r = this._layers[s.id]; this._visibleZoom() && r && !this._map.hasLayer(r) && (this._map.addLayer(r), this.fire('addfeature', { feature: r.feature }, !0)), r && this.options.simplifyFactor > 0 && (r.setLatLngs || r.setLatLng) && this._updateLayer(r, s), r || ((i = this.createNewLayer(s)) ? (i.feature = s, i.addEventParent(this), this.options.onEachFeature && this.options.onEachFeature(i.feature, i), this._layers[i.feature.id] = i, this.setFeatureStyle(i.feature.id, this.options.style), this.fire('createfeature', { feature: i.feature }, !0), this._visibleZoom() && (!this.options.timeField || this.options.timeField && this._featureWithinTimeRange(s)) && this._map.addLayer(i)) : M('invalid GeoJSON encountered')); } }, addLayers(t) { for (let e = t.length - 1; e >= 0; e--) { const i = this._layers[t[e]]; i && this._map.addLayer(i); } }, removeLayers(t, e) { for (let i = t.length - 1; i >= 0; i--) { const s = t[i]; const r = this._layers[s]; r && (this.fire('removefeature', { feature: r.feature, permanent: e }, !0), this._map.removeLayer(r)), r && e && delete this._layers[s]; } }, cellEnter(t, i) { this._visibleZoom() && !this._zooming && this._map && e.Util.requestAnimFrame(e.Util.bind(function () { const t = this._cacheKey(i); const e = this._cellCoordsToKey(i); const s = this._cache[t]; this._activeCells[e] && s && this.addLayers(s); }, this)); }, cellLeave(t, i) { this._zooming || e.Util.requestAnimFrame(e.Util.bind(function () { if (this._map) { const t = this._cacheKey(i); const e = this._cellCoordsToKey(i); const s = this._cache[t]; const r = this._map.getBounds(); if (!this._activeCells[e] && s) { for (var n = !0, o = 0; o < s.length; o++) { const a = this._layers[s[o]]; a && a.getBounds && r.intersects(a.getBounds()) && (n = !1); }n && this.removeLayers(s, !this.options.cacheLayers), !this.options.cacheLayers && n && (delete this._cache[t], delete this._cells[e], delete this._activeCells[e]); } } }, this)); }, resetStyle() { return this.options.style = this._originalStyle, this.eachFeature(function (t) { this.resetFeatureStyle(t.feature.id); }, this), this; }, setStyle(t) { return this.options.style = t, this.eachFeature(function (e) { this.setFeatureStyle(e.feature.id, t); }, this), this; }, resetFeatureStyle(t) { const i = this._layers[t]; const s = this._originalStyle || e.Path.prototype.options; return i && (e.Util.extend(i.options, i.defaultOptions), this.setFeatureStyle(t, s)), this; }, setFeatureStyle(t, e) { const i = this._layers[t]; return typeof e === 'function' && (e = e(i.feature)), i.setStyle && i.setStyle(e), this; }, eachActiveFeature(t, e) { if (this._map) { const i = this._map.getBounds(); for (const s in this._layers) this._currentSnapshot.indexOf(this._layers[s].feature.id) !== -1 && (typeof this._layers[s].getLatLng === 'function' && i.contains(this._layers[s].getLatLng()) ? t.call(e, this._layers[s]) : typeof this._layers[s].getBounds === 'function' && i.intersects(this._layers[s].getBounds()) && t.call(e, this._layers[s])); } return this; }, eachFeature(t, e) { for (const i in this._layers)t.call(e, this._layers[i]); return this; }, getFeature(t) { return this._layers[t]; }, bringToBack() { this.eachFeature((t) => { t.bringToBack && t.bringToBack(); }); }, bringToFront() { this.eachFeature((t) => { t.bringToFront && t.bringToFront(); }); }, redraw(t) { return t && this._redraw(t), this; }, _redraw(t) { const i = this._layers[t]; const s = i.feature; if (i && i.setIcon && this.options.pointToLayer && this.options.pointToLayer) { const r = this.options.pointToLayer(s, e.latLng(s.geometry.coordinates[1], s.geometry.coordinates[0])).options.icon; i.setIcon(r); } if (i && i.setStyle && this.options.pointToLayer) { const n = this.options.pointToLayer(s, e.latLng(s.geometry.coordinates[1], s.geometry.coordinates[0])).options; this.setFeatureStyle(s.id, n); }i && i.setStyle && this.options.style && this.resetStyle(s.id); },
  }); t.VERSION = '2.2.4', t.Support = r, t.options = n, t.Util = N, t.get = d, t.post = l, t.request = c, t.Task = Z, t.task = function (t) { return t = k(t), new Z(t); }, t.Query = j, t.query = W, t.Find = J, t.find = Q, t.Identify = V, t.identify = function (t) { return new V(t); }, t.IdentifyFeatures = H, t.identifyFeatures = K, t.IdentifyImage = X, t.identifyImage = $, t.Service = Y, t.service = function (t) { return t = k(t), new Y(t); }, t.MapService = tt, t.mapService = et, t.ImageService = it, t.imageService = st, t.FeatureLayerService = rt, t.featureLayerService = nt, t.BasemapLayer = at, t.basemapLayer = function (t, e) { return new at(t, e); }, t.TiledMapLayer = ut, t.tiledMapLayer = function (t, e) { return new ut(t, e); }, t.RasterLayer = ht, t.ImageMapLayer = ct, t.imageMapLayer = function (t, e) { return new ct(t, e); }, t.DynamicMapLayer = pt, t.dynamicMapLayer = function (t, e) { return new pt(t, e); }, t.FeatureManager = ft, t.FeatureLayer = yt, t.featureLayer = function (t) { return new yt(t); }, Object.defineProperty(t, '__esModule', { value: !0 });
}));
// # sourceMappingURL=esri-leaflet.js.map
