
import { CITIES, PROPERTY_TYPES } from "./constants.js";
import { buildImageSet, getUnsplashUrl, seededRandom, randRange, uid } from "./helpers.js";

/* ---------------------- Suggested destinations ---------------------- */

export const SUGGESTED_DESTINATIONS = [
  { id: "nearby",   name: "Nearby",                tagline: "Find what’s around you",      icon: "nearby" },
  { id: "toronto",  name: "Toronto, Canada",       tagline: "For sights like CN Tower",    icon: "building" },
  { id: "bangkok",  name: "Bangkok, Thailand",     tagline: "For its bustling nightlife",  icon: "temple" },
  { id: "london",   name: "London, United Kingdom",tagline: "For its stunning architecture",icon: "bridge" },
  { id: "nyc",      name: "New York, NY",          tagline: "For its top-notch dining",    icon: "statue" },
  { id: "vancouver",name: "Vancouver, Canada",     tagline: "For nature-lovers",           icon: "mountain" },
  { id: "calgary",  name: "Calgary, Canada",       tagline: "Known for its skiing",        icon: "ski" },
];

/* ------------------------ Inspiration categories -------------------- */
export const INSPIRATION_CATEGORIES = [
  { id: "family-hub", title: "Family travel hub", subtitle: "Tips and inspiration", link: "#" },
  { id: "family-budget", title: "Family budget travel", subtitle: "Get there for less", link: "#" },
  { id: "vacation-budget", title: "Vacation ideas for any budget", subtitle: "Make it special without making it spendy", link: "#" },
  { id: "europe-budget", title: "Travel Europe on a budget", subtitle: "How to take the kids to Europe for less", link: "#" },
  { id: "outdoor", title: "Outdoor adventure", subtitle: "Explore nature with the family", link: "#" },
  { id: "bucket-parks", title: "Bucket list national parks", subtitle: "Must-see parks for family travel", link: "#" },
  { id: "kid-state-parks", title: "Kid-friendly state parks", subtitle: "Check out these family-friendly hikes", link: "#" },
];

/* --------------------------- Category cards ------------------------- */

export const CATEGORY_LIST = [
  { id: "amazing-views", title: "Amazing views", subtitle: "Skyline and ocean vistas", imageSrc: getUnsplashUrl("city,view,skyline", { seed: 11 }) },
  { id: "design", title: "Design", subtitle: "Architect-designed stays", imageSrc: getUnsplashUrl("interior,design,modern", { seed: 12 }) },
  { id: "cabins", title: "Cabins", subtitle: "Cozy nature escapes", imageSrc: getUnsplashUrl("cabin,forest", { seed: 13 }) },
  { id: "tiny-homes", title: "Tiny homes", subtitle: "Small and stylish", imageSrc: getUnsplashUrl("tiny home,small house", { seed: 14 }) },
  { id: "cityscapes", title: "Cityscapes", subtitle: "Urban apartments", imageSrc: getUnsplashUrl("apartment,city", { seed: 15 }) },
  { id: "countryside", title: "Countryside", subtitle: "Rural hideaways", imageSrc: getUnsplashUrl("countryside,field", { seed: 16 }) },
];

/* ------------------------------ Properties ------------------------- */

const NEIGHBORHOODS = {
  "kuala-lumpur": ["Bukit Bintang", "Cheras", "Kepong", "Setapak", "Ampang", "Mont Kiara"],
  bangkok: ["Sukhumvit", "Silom", "Sathorn", "Ratchada", "Thonglor", "Ari"],
  toronto: ["Downtown", "Kensington Market", "Yorkville", "Queen West", "The Annex", "Distillery District"],
  seoul: ["Hongdae", "Myeongdong", "Gangnam", "Itaewon", "Jongno", "Yeouido"],
  tokyo: ["Shinjuku", "Shibuya", "Asakusa", "Ginza", "Akihabara", "Meguro"],
  osaka: ["Namba", "Umeda", "Shinsekai", "Nishi", "Tennoji", "Kita"],
  melbourne: ["CBD", "Fitzroy", "St Kilda", "South Yarra", "Carlton", "Southbank"],
  sydney: ["Surry Hills", "Newtown", "Bondi", "CBD", "Manly", "Parramatta"],
};

const TITLES = [
  (n) => `Apartment in ${n}`,
  (n) => `Room in ${n}`,
  (n, c) => `Guesthouse in ${c.city}`,
  (n) => `Condo in ${n}`,
  (n, c) => `Apartment in ${c.city}`,
];

function buildProperty(cityMeta, idx) {
  const cityId = cityMeta.id;
  const rng = seededRandom(`${cityId}-${idx}`);
  const nb = NEIGHBORHOODS[cityId] || [cityMeta.city];
  const n = nb[idx % nb.length];

  const type = PROPERTY_TYPES[Math.floor(rng() * PROPERTY_TYPES.length)];
  const nights = randRange(rng, 1, 5);
  const price = randRange(rng, 45, 250);
  const rating = (4.5 + rng() * 0.5).toFixed(2);
  const isGuestFavorite = rng() > 0.65;

  const titleMaker = TITLES[idx % TITLES.length];
  const title = titleMaker(n, cityMeta);

  const keywords = [...cityMeta.keywords, "interior"];
  const images = buildImageSet(keywords, 4, idx * 10 + 1);

  return {
    id: `${cityId}-${idx + 1}`,
    title,
    location: n,
    city: cityMeta.city,
    country: cityMeta.country,
    images,
    price,
    nights,
    rating: Number(rating),
    isGuestFavorite,
    type,
  };
}

export function generatePropertiesForCity(cityMeta, count = 10) {
  return Array.from({ length: count }, (_, i) => buildProperty(cityMeta, i));
}

export const PROPERTIES_BY_CITY = Object.fromEntries(
  CITIES.map((c) => [c.id, generatePropertiesForCity(c, 10)])
);

// Flattened list (all cities)
export const PROPERTIES = Object.values(PROPERTIES_BY_CITY).flat();

/* --------------------------- Convenience ---------------------------- */

export const POPULAR_CITY_SECTIONS = [
  { id: "kuala-lumpur", title: "Popular homes in Kuala Lumpur", cityId: "kuala-lumpur" },
  { id: "bangkok", title: "Available next month in Bangkok", cityId: "bangkok" },
  { id: "toronto", title: "Available next month in Toronto", cityId: "toronto" },
  { id: "seoul", title: "Homes in Seoul", cityId: "seoul" },
  { id: "tokyo", title: "Available next month in Tokyo", cityId: "tokyo" },
  { id: "osaka", title: "Places to stay in Osaka", cityId: "osaka" },
  { id: "melbourne", title: "Check out homes in Melbourne", cityId: "melbourne" },
  { id: "sydney", title: "Popular homes in Sydney", cityId: "sydney" },
];

export function getPropertiesByCityId(id) {
  return PROPERTIES_BY_CITY[id] || [];
}

export function getSectionData() {
  return POPULAR_CITY_SECTIONS.map((s) => ({
    ...s,
    items: getPropertiesByCityId(s.cityId),
  }));
}