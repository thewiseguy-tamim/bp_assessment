

/* --------------------- String / Class utilities --------------------- */

export function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}

/* ------------------------ Currency / Text --------------------------- */

export function formatCurrency(amount, opts = {}) {
  const {
    currency = "USD",
    locale = undefined, 
    maximumFractionDigits = 0,
  } = opts;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits,
    }).format(amount);
  } catch {
    return `$${Number(amount).toFixed(0)}`;
  }
}

export function formatPriceForNights(price, nights, opts) {
  const p = formatCurrency(price, opts);
  const n = `${nights} ${pluralize("night", nights)}`;
  return `${p} for ${n}`;
}

export function formatRating(rating) {
  const r = Number(rating || 0).toFixed(2);
  return `★ ${r}`;
}

export function formatGuestsLabel(guests) {
  const { adults = 0, children = 0, infants = 0, pets = 0 } = guests || {};
  const total = adults + children;
  const parts = [];
  if (total > 0) parts.push(`${total} ${pluralize("guest", total)}`);
  if (infants > 0) parts.push(`${infants} ${pluralize("infant", infants)}`);
  if (pets > 0) parts.push(`${pets} ${pluralize("pet", pets)}`);
  return parts.length ? parts.join(", ") : "Add guests";
}

/* -------------------------- Numbers / Misc -------------------------- */

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const uid = (prefix = "id") =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

/* ----------------------- Debounce / Throttle ------------------------ */

export function debounce(fn, wait = 300) {
  let t;
  const debounced = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
  debounced.cancel = () => clearTimeout(t);
  debounced.flush = (...args) => {
    clearTimeout(t);
    fn(...args);
  };
  return debounced;
}

export function throttle(fn, wait = 200) {
  let last = 0;
  let timer;
  return (...args) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer);
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

/* ---------------------------- Dates -------------------------------- */

export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const isBetween = (x, s, e) =>
  s && e && x.getTime() > s.getTime() && x.getTime() < e.getTime();
export const toISODate = (d) => startOfDay(d).toISOString().slice(0, 10);
export const parseISODate = (s) => (s ? new Date(s + "T00:00:00") : null);

/* ------------------------ Seeded randomness ------------------------- */

// Hash a string to a 32-bit integer
export function hashString(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t |= 0;
    t = (t + 0x6D2B79F5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRandom(seedStr) {
  return mulberry32(hashString(seedStr));
}

export const randRange = (rng, min, max) =>
  Math.floor(rng() * (max - min + 1)) + min;

/* ------------------------ Unsplash helpers -------------------------- */

export function getUnsplashUrl(query, { width, height, seed } = {}) {
  const q = encodeURIComponent(query);
  const base = `https://source.unsplash.com/featured${width && height ? `/${width}x${height}` : ""}/?${q}`;
  return typeof seed === "number" ? `${base}&sig=${seed}` : base;
}

export function buildImageSet(keywords = [], count = 4, seedBase = 1) {
  const joined = keywords.join(",");
  return Array.from({ length: count }).map((_, i) =>
    getUnsplashUrl(joined, { seed: seedBase + i })
  );
}

/* --------------------- Arrays / Collections ------------------------- */

export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function uniqBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ---------------------------- Env ---------------------------------- */

export const isClient = () => typeof window !== "undefined";