

export const COLORS = {
  primary: "#FF385C",
  primaryHover: "#E31C5F",
  lightGrayBg: "#F7F7F7",
  gray: "#717171",
  dark: "#222222",
  border: "#DDDDDD",
  white: "#FFFFFF",
  black: "#000000",
};

export const TYPOGRAPHY = {
  fontStack:
    "Circular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const BREAKPOINTS = {
  mobileMax: 639,      
  tabletMin: 640,      
  tabletMax: 1024,     
  desktopMin: 1025,    
};

export const SCROLL = {
  NAVBAR_RESIZE_Y: 50,
  WELCOME_DISMISS_Y: 100,
  SCROLLTOP_SHOW_Y: 500,
};

export const STORAGE_KEYS = {
  WISHLIST: "wishlist",
  WELCOME_MODAL: "welcome_modal_shown",
  PRICE_TOAST: "price_modal_seen",
  SESSION_SEARCH: "session_search_state",
};

export const LOTTIE = {
  home: "/animations/home-icon.json",
  experiences: "/animations/experiences-icon.json",
  services: "/animations/services-icon.json",
};

export const NAV_ITEMS = [
  { key: "homes", label: "Homes", lottie: LOTTIE.home, isNew: false },
  { key: "experiences", label: "Experiences", lottie: LOTTIE.experiences, isNew: true },
  { key: "services", label: "Services", lottie: LOTTIE.services, isNew: true },
];

export const MAX_CONTAINER = 1760;

export const PROPERTY_TYPES = ["apartment", "house", "room", "experience"];

export const CITIES = [
  { id: "kuala-lumpur", city: "Kuala Lumpur", country: "Malaysia", keywords: ["kuala lumpur", "apartment", "city"] },
  { id: "bangkok", city: "Bangkok", country: "Thailand", keywords: ["bangkok", "apartment", "city"] },
  { id: "toronto", city: "Toronto", country: "Canada", keywords: ["toronto", "apartment", "city"] },
  { id: "seoul", city: "Seoul", country: "South Korea", keywords: ["seoul", "apartment", "city"] },
  { id: "tokyo", city: "Tokyo", country: "Japan", keywords: ["tokyo", "apartment", "city"] },
  { id: "osaka", city: "Osaka", country: "Japan", keywords: ["osaka", "apartment", "city"] },
  { id: "melbourne", city: "Melbourne", country: "Australia", keywords: ["melbourne", "apartment", "city"] },
  { id: "sydney", city: "Sydney", country: "Australia", keywords: ["sydney", "apartment", "city"] },
];