/**
 * Scrape all properties from governmentlandsales.us and generate lots.json
 * Usage: node scripts/scrape-gls.mjs
 */

const BASE = "https://www.governmentlandsales.us";
const MARKUP = 1.10;
const PER_PAGE = 15;
const CONTACT_EMAIL = "info@lotoftheday.com";

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  copy: '©', reg: '®', trade: '™',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  ndash: '–', mdash: '—', hellip: '…',
};

function decodeEntities(str) {
  if (!str) return str;
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] ?? m);
}

const STATES = {
  'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California',
  'CO':'Colorado','ID':'Idaho','MT':'Montana','NE':'Nebraska','NV':'Nevada',
  'NM':'New Mexico','OR':'Oregon','TX':'Texas','UT':'Utah','WA':'Washington','WY':'Wyoming'
};

async function fetchPage(page) {
  const url = `${BASE}/properties?page=${page}`;
  console.log(`Fetching page ${page}...`);
  const res = await fetch(url);
  return await res.text();
}

function extractPropertyUrls(html) {
  const matches = [...html.matchAll(/href="(\/properties\/[^"?]+)"/g)];
  return [...new Set(matches.map(m => m[1]))];
}

async function fetchProperty(path) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url);
    const html = await res.text();

    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

    // ---- STATE, COUNTY, CITY from structured property details ----
    // Pattern: <li><strong>State:</strong> Oregon</li>
    const stateMatch = html.match(/<strong>State:<\/strong>\s*([^<]+)/i);
    const countyMatch = html.match(/<strong>County:<\/strong>\s*([^<]+)/i);
    const cityMatch = html.match(/<strong>City:<\/strong>\s*([^<]+)/i);
    const addrMatch = html.match(/<strong>Property Address:<\/strong>\s*([^<]+)/i);

    let stateFull = stateMatch ? decodeEntities(stateMatch[1].trim()) : '';
    let county = countyMatch ? decodeEntities(countyMatch[1].replace(/\s*County\s*/i, '').trim()) : '';
    let city = cityMatch ? decodeEntities(cityMatch[1].trim()) : '';
    let zip = '';

    // Get zip from address: "300 Ibex St, Sumpter, OR, 97877"
    if (addrMatch) {
      const zipMatch = addrMatch[1].match(/(\d{5})/);
      if (zipMatch) zip = zipMatch[1];
      // Also get city from address if not found
      if (!city) {
        const parts = addrMatch[1].split(',').map(s => s.trim());
        if (parts.length >= 2) city = parts[1];
      }
    }

    // Get state abbreviation for later use
    let stateAbbr = '';
    for (const [abbr, name] of Object.entries(STATES)) {
      if (name === stateFull) { stateAbbr = abbr; break; }
    }

    // ---- PRICE ----
    const priceMatch = text.match(/\$\s*([\d,]+)/);
    let rawPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
    if (rawPrice === 299) rawPrice = 0; // doc fee
    const price = Math.round(rawPrice * MARKUP);
    if (price === 0) return null;

    // ---- ACREAGE ----
    const acreMatch = text.match(/([\d.]+)\s*(?:acres?|Acres?)/i);
    const acreage = acreMatch ? parseFloat(acreMatch[1]) : 0;

    // ---- GPS ----
    const gpsMatch = text.match(/(?:Center|GPS)[:\s]*([-\d.]+)[,\s]+([-\d.]+)/i);
    const lat = gpsMatch ? parseFloat(gpsMatch[1]) : 0;
    const lng = gpsMatch ? parseFloat(gpsMatch[2]) : 0;

    // ---- APN ----
    const apnMatch = text.match(/APN[:\s]*([\w-]+)/i);
    const apn = apnMatch ? apnMatch[1] : '';

    // ---- DIMENSIONS ----
    const dimMatch = text.match(/([\d,.']+)\s*[''′]?\s*[xX×]\s*([\d,.']+)/);
    const dimensions = dimMatch ? `${dimMatch[1]}' x ${dimMatch[2]}'` : '';

    // ---- TAXES ----
    const taxMatch = text.match(/(?:Annual\s*)?Taxes?[:\s]*\$?\s*([\d,]+)/i);
    const annualTaxes = taxMatch ? parseInt(taxMatch[1].replace(/,/g, '')) : 0;

    // ---- TITLE ----
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const title = titleMatch ? decodeEntities(titleMatch[1].replace(/<[^>]+>/g, '').trim()) : '';
    if (!title) return null;

    // ---- IMAGES ----
    const heroMatch = html.match(/\/storage\/property-images\/[^"]+\/800x440\/[^"]+\.jpg/);
    const galleryMatches = [...html.matchAll(/\/storage\/property-images\/([^"\/]+)\/400x220\/([^"]+\.jpg)/g)];
    const poster = heroMatch ? `${BASE}${heroMatch[0]}` : '';
    const photos = galleryMatches.slice(0, 4).map(m => ({
      url: `${BASE}/storage/property-images/${m[1]}/400x220/${m[2]}`,
      alt: title,
      caption: ""
    }));
    const finalPoster = poster || (photos[0]?.url?.replace('/400x220/', '/800x440/') || '');
    if (!finalPoster) return null;

    // ---- FEATURES ----
    const features = [];
    if (acreage >= 5) features.push(`${acreage}+ acres`);
    else if (acreage >= 1) features.push(`${acreage} acres`);
    if (/paved/i.test(text)) features.push('Paved road');
    else if (/gravel/i.test(text)) features.push('Gravel road');
    if (/power\s*(available|installed|at|close)/i.test(text)) features.push('Power available');
    if (/(?:city\s+)?water\s*(available|installed|at)/i.test(text)) features.push('Water available');
    if (/sewer\s*(available|installed|at)/i.test(text)) features.push('Sewer available');
    if (/corner\s*lot/i.test(text)) features.push('Corner lot');
    if (/no\s*(?:ccrs?|hoa|restrictions|association)/i.test(text)) features.push('No restrictions');
    if (/\brv\b/i.test(text)) features.push('RV allowed');
    if (/view|vista|scenic/i.test(text)) features.push('Great views');
    if (annualTaxes > 0 && annualTaxes <= 200) features.push(`$${annualTaxes}/yr taxes`);

    // ---- DESCRIPTION ----
    let description = title;
    const descParagraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    for (const p of descParagraphs) {
      const clean = decodeEntities(p[1].replace(/<[^>]+>/g, '').trim());
      if (clean.length > 80 && !/document preparation|credit check/i.test(clean)) {
        description = clean;
        break;
      }
    }

    // ---- ROAD/UTILITIES ----
    let roadConditions = '';
    if (/paved/i.test(text)) roadConditions = 'Paved';
    else if (/good\s*gravel/i.test(text)) roadConditions = 'Good gravel';
    else if (/gravel/i.test(text)) roadConditions = 'Gravel';

    const utilParts = [];
    if (/power\s*(available|installed|at|close)/i.test(text)) utilParts.push('Power');
    if (/water\s*(available|installed|at)/i.test(text)) utilParts.push('Water');
    if (/sewer\s*(available|installed|at)/i.test(text)) utilParts.push('Sewer');
    const utilities = utilParts.length ? utilParts.join(', ') + ' available' : '';

    // ---- STATUS CHECK ----
    const statusBadge = html.match(/<span[^>]*class="[^"]*badge[^"]*"[^>]*>([\s\S]*?)<\/span>/gi);
    if (statusBadge) {
      const badgeText = statusBadge.join(' ').toLowerCase();
      if (badgeText.includes('hold') || badgeText.includes('sold') || badgeText.includes('pending')) {
        return null;
      }
    }

    return {
      title, price, acreage, dimensions, apn, lat, lng,
      city, county, state: stateFull, zip,
      poster: finalPoster, photos, annualTaxes,
      features: features.slice(0, 6), description,
      roadConditions, utilities
    };
  } catch (e) {
    console.error(`\n  Error: ${path}: ${e.message}`);
    return null;
  }
}

async function main() {
  const firstPage = await fetchPage(1);
  const totalMatch = firstPage.match(/of\s+(\d+)\s+Results/);
  const total = totalMatch ? parseInt(totalMatch[1]) : 165;
  const pages = Math.ceil(total / PER_PAGE);
  console.log(`Found ${total} properties across ${pages} pages`);

  let allUrls = extractPropertyUrls(firstPage);
  for (let p = 2; p <= pages; p++) {
    const html = await fetchPage(p);
    allUrls = [...allUrls, ...extractPropertyUrls(html)];
    await new Promise(r => setTimeout(r, 200));
  }
  allUrls = [...new Set(allUrls)];
  console.log(`\n${allUrls.length} unique property URLs`);

  const properties = [];
  for (let i = 0; i < allUrls.length; i += 5) {
    const batch = allUrls.slice(i, i + 5);
    const results = await Promise.all(batch.map(fetchProperty));
    for (const r of results) {
      if (r) properties.push(r);
    }
    process.stdout.write(`\r  ${Math.min(i + 5, allUrls.length)}/${allUrls.length}`);
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n\n${properties.length} active properties`);

  // Sort by price descending
  properties.sort((a, b) => b.price - a.price);

  const startDate = new Date('2026-03-04');
  const lots = properties.map((p, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const taglineParts = [];
    if (p.acreage) taglineParts.push(`${p.acreage} Acres`);
    if (p.county) taglineParts.push(`${p.county} County`);
    if (p.state) taglineParts.push(p.state);
    const tagline = taglineParts.join(', ');

    return {
      id: `lot-${String(i + 1).padStart(3, '0')}`,
      date: dateStr,
      name: p.title,
      tagline: tagline || p.title,
      location: {
        city: p.city, county: p.county, state: p.state, zip: p.zip,
        coordinates: { lat: p.lat, lng: p.lng }
      },
      price: p.price,
      acreage: p.acreage,
      dimensions: p.dimensions,
      apn: p.apn,
      features: p.features,
      description: p.description,
      details: {
        roadConditions: p.roadConditions,
        utilities: p.utilities,
        water: '', sewer: '',
        zoning: 'Residential / Recreational',
        annualTaxes: p.annualTaxes,
        terrain: '',
        restrictions: ''
      },
      media: { poster: p.poster, photos: p.photos },
      contact: {
        email: CONTACT_EMAIL,
        listingUrl: ''
      }
    };
  });

  const fs = await import('fs');
  fs.writeFileSync(
    new URL('../src/data/lots.json', import.meta.url),
    JSON.stringify(lots, null, 2)
  );

  const states = [...new Set(lots.map(l => l.location.state).filter(Boolean))].sort();
  console.log(`Wrote ${lots.length} lots to src/data/lots.json`);
  console.log(`Date range: ${lots[0]?.date} to ${lots[lots.length - 1]?.date}`);
  console.log(`States: ${states.join(', ')}`);
  console.log(`Price range: $${Math.min(...lots.map(l=>l.price)).toLocaleString()} — $${Math.max(...lots.map(l=>l.price)).toLocaleString()}`);
}

main().catch(console.error);
