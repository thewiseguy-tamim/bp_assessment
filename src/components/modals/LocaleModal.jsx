import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");


const LANGUAGES = [
  { id: "en-US", language: "English", region: "United States" },
  { id: "en-GB", language: "English", region: "United Kingdom" },
  { id: "en-AU", language: "English", region: "Australia" },
  { id: "en-CA", language: "English", region: "Canada" },
  { id: "en-NZ", language: "English", region: "New Zealand" },
  { id: "en-IE", language: "English", region: "Ireland" },
  { id: "en-IN", language: "English", region: "India" },
  { id: "en-SG", language: "English", region: "Singapore" },
  { id: "en-ZA", language: "English", region: "South Africa" },
  { id: "en-PH", language: "English", region: "Philippines" },
  { id: "en-HK", language: "English", region: "Hong Kong" },

  { id: "es-ES", language: "Español", region: "España" },
  { id: "es-MX", language: "Español", region: "México" },
  { id: "es-AR", language: "Español", region: "Argentina" },
  { id: "es-CL", language: "Español", region: "Chile" },
  { id: "es-CO", language: "Español", region: "Colombia" },
  { id: "es-PE", language: "Español", region: "Perú" },
  { id: "es-VE", language: "Español", region: "Venezuela" },
  { id: "es-UY", language: "Español", region: "Uruguay" },
  { id: "es-PY", language: "Español", region: "Paraguay" },
  { id: "es-BO", language: "Español", region: "Bolivia" },
  { id: "es-EC", language: "Español", region: "Ecuador" },
  { id: "es-CR", language: "Español", region: "Costa Rica" },
  { id: "es-PA", language: "Español", region: "Panamá" },
  { id: "es-DO", language: "Español", region: "República Dominicana" },
  { id: "es-GT", language: "Español", region: "Guatemala" },
  { id: "es-HN", language: "Español", region: "Honduras" },
  { id: "es-NI", language: "Español", region: "Nicaragua" },
  { id: "es-SV", language: "Español", region: "El Salvador" },
  { id: "es-PR", language: "Español", region: "Puerto Rico" },

  { id: "fr-FR", language: "Français", region: "France" },
  { id: "fr-CA", language: "Français", region: "Canada" },
  { id: "fr-BE", language: "Français", region: "Belgique" },
  { id: "fr-CH", language: "Français", region: "Suisse" },
  { id: "fr-LU", language: "Français", region: "Luxembourg" },
  { id: "fr-SN", language: "Français", region: "Sénégal" },

  { id: "de-DE", language: "Deutsch", region: "Deutschland" },
  { id: "de-AT", language: "Deutsch", region: "Österreich" },
  { id: "de-CH", language: "Deutsch", region: "Schweiz" },
  { id: "it-IT", language: "Italiano", region: "Italia" },
  { id: "it-CH", language: "Italiano", region: "Svizzera" },

  { id: "pt-BR", language: "Português", region: "Brasil" },
  { id: "pt-PT", language: "Português", region: "Portugal" },
  { id: "pt-AO", language: "Português", region: "Angola" },
  { id: "pt-MZ", language: "Português", region: "Moçambique" },

  { id: "nl-NL", language: "Nederlands", region: "Nederland" },
  { id: "nl-BE", language: "Nederlands", region: "België" },

  { id: "sv-SE", language: "Svenska", region: "Sverige" },
  { id: "no-NO", language: "Norsk", region: "Norge" },
  { id: "da-DK", language: "Dansk", region: "Danmark" },
  { id: "fi-FI", language: "Suomi", region: "Suomi" },
  { id: "is-IS", language: "Íslenska", region: "Ísland" },

  { id: "pl-PL", language: "Polski", region: "Polska" },
  { id: "cs-CZ", language: "Čeština", region: "Česko" },
  { id: "sk-SK", language: "Slovenčina", region: "Slovensko" },
  { id: "hu-HU", language: "Magyar", region: "Magyarország" },
  { id: "ro-RO", language: "Română", region: "România" },
  { id: "bg-BG", language: "Български", region: "България" },
  { id: "el-GR", language: "Ελληνικά", region: "Ελλάδα" },
  { id: "hr-HR", language: "Hrvatski", region: "Hrvatska" },
  { id: "sl-SI", language: "Slovenščina", region: "Slovenija" },
  { id: "sr-RS", language: "Српски", region: "Србија" },
  { id: "bs-BA", language: "Bosanski", region: "Bosna i Hercegovina" },
  { id: "mk-MK", language: "Македонски", region: "Северна Македонија" },
  { id: "sq-AL", language: "Shqip", region: "Shqipëri" },

  { id: "ru-RU", language: "Русский", region: "Россия" },
  { id: "uk-UA", language: "Українська", region: "Україна" },
  { id: "be-BY", language: "Беларуская", region: "Беларусь" },
  { id: "kk-KZ", language: "Қазақ тілі", region: "Қазақстан" },
  { id: "uz-UZ", language: "Oʻzbekcha", region: "Oʻzbekiston" },
  { id: "ky-KG", language: "Кыргызча", region: "Кыргызстан" },
  { id: "tg-TJ", language: "Тоҷикӣ", region: "Тоҷикистон" },
  { id: "hy-AM", language: "Հայերեն", region: "Հայաստան" },
  { id: "ka-GE", language: "ქართული", region: "საქართველო" },
  { id: "az-AZ", language: "Azərbaycanca", region: "Azərbaycan" },
  { id: "tr-TR", language: "Türkçe", region: "Türkiye" },

  { id: "he-IL", language: "עברית", region: "ישראל" },
  { id: "ar-SA", language: "العربية", region: "السعودية" },
  { id: "ar-AE", language: "العربية", region: "الإمارات" },
  { id: "ar-EG", language: "العربية", region: "مصر" },
  { id: "ar-MA", language: "العربية", region: "المغرب" },
  { id: "ar-DZ", language: "العربية", region: "الجزائر" },
  { id: "ar-TN", language: "العربية", region: "تونس" },
  { id: "ar-JO", language: "العربية", region: "الأردن" },
  { id: "ar-KW", language: "العربية", region: "الكويت" },
  { id: "ar-QA", language: "العربية", region: "قطر" },
  { id: "ar-OM", language: "العربية", region: "عُمان" },
  { id: "ar-BH", language: "العربية", region: "البحرين" },
  { id: "fa-IR", language: "فارسی", region: "ایران" },
  { id: "fa-AF", language: "دری", region: "افغانستان" },
  { id: "ps-AF", language: "پښتو", region: "افغانستان" },

  { id: "hi-IN", language: "हिन्दी", region: "भारत" },
  { id: "bn-BD", language: "বাংলা", region: "বাংলাদেশ" },
  { id: "bn-IN", language: "বাংলা", region: "ভারত" },
  { id: "ur-PK", language: "اردو", region: "پاکستان" },
  { id: "ur-IN", language: "اردو", region: "بھارت" },
  { id: "ta-IN", language: "தமிழ்", region: "இந்தியா" },
  { id: "te-IN", language: "తెలుగు", region: "భారతదేశం" },
  { id: "mr-IN", language: "मराठी", region: "भारत" },
  { id: "gu-IN", language: "ગુજરાતી", region: "ભારત" },
  { id: "kn-IN", language: "ಕನ್ನಡ", region: "ಭಾರತ" },
  { id: "ml-IN", language: "മലയാളം", region: "ഇന്ത്യ" },
  { id: "pa-IN", language: "ਪੰਜਾਬੀ", region: "ਭਾਰਤ" },
  { id: "si-LK", language: "සිංහල", region: "ශ්‍රී ලංකා" },
  { id: "ne-NP", language: "नेपाली", region: "नेपाल" },

  { id: "zh-CN", language: "中文", region: "中国" },
  { id: "zh-TW", language: "中文", region: "台灣" },
  { id: "zh-HK", language: "中文", region: "香港" },
  { id: "ja-JP", language: "日本語", region: "日本" },
  { id: "ko-KR", language: "한국어", region: "대한민국" },
  { id: "th-TH", language: "ไทย", region: "ประเทศไทย" },
  { id: "vi-VN", language: "Tiếng Việt", region: "Việt Nam" },
  { id: "id-ID", language: "Bahasa Indonesia", region: "Indonesia" },
  { id: "ms-MY", language: "Bahasa Melayu", region: "Malaysia" },
  { id: "fil-PH", language: "Filipino", region: "Pilipinas" },
  { id: "km-KH", language: "ខ្មែរ", region: "កម្ពុជា" },
  { id: "lo-LA", language: "ລາວ", region: "ລາວ" },
  { id: "my-MM", language: "မြန်မာ", region: "မြန်မာ" },
  { id: "mn-MN", language: "Монгол", region: "Монгол" },

  { id: "sw-KE", language: "Kiswahili", region: "Kenya" },
  { id: "sw-TZ", language: "Kiswahili", region: "Tanzania" },
  { id: "am-ET", language: "አማርኛ", region: "ኢትዮጵያ" },
  { id: "so-SO", language: "Soomaali", region: "Soomaaliya" },
  { id: "ha-NG", language: "Hausa", region: "Nigeria" },
  { id: "yo-NG", language: "Yorùbá", region: "Nigeria" },
  { id: "ig-NG", language: "Igbo", region: "Nigeria" },
  { id: "af-ZA", language: "Afrikaans", region: "Suid-Afrika" },
  { id: "zu-ZA", language: "isiZulu", region: "Ningizimu Afrika" },
  { id: "xh-ZA", language: "isiXhosa", region: "uMzantsi Afrika" },
];

const CURRENCIES = [
  { code: "USD", name: "United States dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Pound sterling", symbol: "£" },
  { code: "JPY", name: "Japanese yen", symbol: "¥" },
  { code: "CNY", name: "Chinese yuan", symbol: "¥" },
  { code: "CHF", name: "Swiss franc", symbol: "CHF" },
  { code: "CAD", name: "Canadian dollar", symbol: "$" },
  { code: "AUD", name: "Australian dollar", symbol: "$" },
  { code: "NZD", name: "New Zealand dollar", symbol: "$" },
  { code: "HKD", name: "Hong Kong dollar", symbol: "$" },
  { code: "TWD", name: "New Taiwan dollar", symbol: "NT$" },
  { code: "KRW", name: "South Korean won", symbol: "₩" },
  { code: "SGD", name: "Singapore dollar", symbol: "$" },
  { code: "MYR", name: "Malaysian ringgit", symbol: "RM" },
  { code: "IDR", name: "Indonesian rupiah", symbol: "Rp" },
  { code: "THB", name: "Thai baht", symbol: "฿" },
  { code: "VND", name: "Vietnamese đồng", symbol: "₫" },
  { code: "PHP", name: "Philippine peso", symbol: "₱" },
  { code: "MMK", name: "Burmese kyat", symbol: "K" },
  { code: "LAK", name: "Lao kip", symbol: "₭" },
  { code: "KHR", name: "Cambodian riel", symbol: "៛" },
  { code: "MNT", name: "Mongolian tögrög", symbol: "₮" },
  { code: "INR", name: "Indian rupee", symbol: "₹" },
  { code: "PKR", name: "Pakistani rupee", symbol: "₨" },
  { code: "BDT", name: "Bangladeshi taka", symbol: "৳" },
  { code: "LKR", name: "Sri Lankan rupee", symbol: "Rs" },
  { code: "NPR", name: "Nepalese rupee", symbol: "Rs" },
  { code: "AED", name: "Emirati dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi riyal", symbol: "ر.س" },
  { code: "QAR", name: "Qatari riyal", symbol: "ر.ق" },
  { code: "KWD", name: "Kuwaiti dinar", symbol: "د.ك" },
  { code: "BHD", name: "Bahraini dinar", symbol: ".د.ب" },
  { code: "OMR", name: "Omani rial", symbol: "ر.ع." },
  { code: "ILS", name: "Israeli new shekel", symbol: "₪" },
  { code: "JOD", name: "Jordanian dinar", symbol: "د.أ" },
  { code: "IRR", name: "Iranian rial", symbol: "﷼" },
  { code: "IQD", name: "Iraqi dinar", symbol: "ع.د" },
  { code: "EGP", name: "Egyptian pound", symbol: "ج.م" },
  { code: "MAD", name: "Moroccan dirham", symbol: "د.م." },
  { code: "DZD", name: "Algerian dinar", symbol: "د.ج" },
  { code: "TND", name: "Tunisian dinar", symbol: "د.ت" },
  { code: "NGN", name: "Nigerian naira", symbol: "₦" },
  { code: "GHS", name: "Ghanaian cedi", symbol: "₵" },
  { code: "KES", name: "Kenyan shilling", symbol: "KSh" },
  { code: "UGX", name: "Ugandan shilling", symbol: "USh" },
  { code: "TZS", name: "Tanzanian shilling", symbol: "TSh" },
  { code: "RWF", name: "Rwandan franc", symbol: "FRw" },
  { code: "ETB", name: "Ethiopian birr", symbol: "Br" },
  { code: "ZMW", name: "Zambian kwacha", symbol: "ZK" },
  { code: "ZAR", name: "South African rand", symbol: "R" },
  { code: "NAD", name: "Namibian dollar", symbol: "$" },
  { code: "BWP", name: "Botswana pula", symbol: "P" },
  { code: "MZN", name: "Mozambican metical", symbol: "MT" },
  { code: "MUR", name: "Mauritian rupee", symbol: "₨" },
  { code: "SCR", name: "Seychellois rupee", symbol: "₨" },
  { code: "LSL", name: "Lesotho loti", symbol: "L" },
  { code: "XOF", name: "West African CFA franc", symbol: "F CFA" },
  { code: "XAF", name: "Central African CFA franc", symbol: "F CFA" },
  { code: "SEK", name: "Swedish krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian krone", symbol: "kr" },
  { code: "DKK", name: "Danish krone", symbol: "kr" },
  { code: "ISK", name: "Icelandic króna", symbol: "kr" },
  { code: "PLN", name: "Polish złoty", symbol: "zł" },
  { code: "CZK", name: "Czech koruna", symbol: "Kč" },
  { code: "HUF", name: "Hungarian forint", symbol: "Ft" },
  { code: "RON", name: "Romanian leu", symbol: "lei" },
  { code: "BGN", name: "Bulgarian lev", symbol: "лв." },
  { code: "RSD", name: "Serbian dinar", symbol: "дин." },
  { code: "BAM", name: "Bosnia and Herzegovina mark", symbol: "KM" },
  { code: "MKD", name: "Macedonian denar", symbol: "ден" },
  { code: "ALL", name: "Albanian lek", symbol: "L" },
  { code: "MDL", name: "Moldovan leu", symbol: "L" },
  { code: "UAH", name: "Ukrainian hryvnia", symbol: "₴" },
  { code: "BYN", name: "Belarusian ruble", symbol: "Br" },
  { code: "RUB", name: "Russian ruble", symbol: "₽" },
  { code: "TRY", name: "Turkish lira", symbol: "₺" },
  { code: "GEL", name: "Georgian lari", symbol: "₾" },
  { code: "AMD", name: "Armenian dram", symbol: "֏" },
  { code: "AZN", name: "Azerbaijani manat", symbol: "₼" },
  { code: "KZT", name: "Kazakhstani tenge", symbol: "₸" },
  { code: "UZS", name: "Uzbekistani soʻm", symbol: "soʻm" },
  { code: "KGS", name: "Kyrgyzstani som", symbol: "сом" },
  { code: "TJS", name: "Tajikistani somoni", symbol: "ЅМ" },
  { code: "MXN", name: "Mexican peso", symbol: "$" },
  { code: "GTQ", name: "Guatemalan quetzal", symbol: "Q" },
  { code: "HNL", name: "Honduran lempira", symbol: "L" },
  { code: "NIO", name: "Nicaraguan córdoba", symbol: "C$" },
  { code: "CRC", name: "Costa Rican colón", symbol: "₡" },
  { code: "PAB", name: "Panamanian balboa", symbol: "B/." },
  { code: "DOP", name: "Dominican peso", symbol: "RD$" },
  { code: "JMD", name: "Jamaican dollar", symbol: "J$" },
  { code: "BBD", name: "Barbadian dollar", symbol: "Bds$" },
  { code: "TTD", name: "Trinidad and Tobago dollar", symbol: "TT$" },
  { code: "BZD", name: "Belize dollar", symbol: "BZ$" },
  { code: "GYD", name: "Guyanese dollar", symbol: "G$" },
  { code: "SRD", name: "Surinamese dollar", symbol: "$" },
  { code: "XCD", name: "Eastern Caribbean dollar", symbol: "EC$" },
  { code: "ARS", name: "Argentine peso", symbol: "$" },
  { code: "BRL", name: "Brazilian real", symbol: "R$" },
  { code: "CLP", name: "Chilean peso", symbol: "$" },
  { code: "COP", name: "Colombian peso", symbol: "$" },
  { code: "PEN", name: "Peruvian sol", symbol: "S/." },
  { code: "PYG", name: "Paraguayan guaraní", symbol: "₲" },
  { code: "UYU", name: "Uruguayan peso", symbol: "$U" },
  { code: "BOB", name: "Bolivian boliviano", symbol: "Bs" },
  { code: "VES", name: "Venezuelan bolívar", symbol: "Bs." },
  { code: "BMD", name: "Bermudian dollar", symbol: "$" },
  { code: "BSD", name: "Bahamian dollar", symbol: "$" },
  { code: "KYD", name: "Cayman Islands dollar", symbol: "CI$" },
  { code: "AWG", name: "Aruban florin", symbol: "Afl." },
  { code: "ANG", name: "Netherlands Antillean guilder", symbol: "ƒ" },
];

const tileClasses = (active) =>
  cls(
    "rounded-xl p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 border",
    active ? "border-black ring-1 ring-black" : "border-transparent hover:border-black/40"
  );

export default function LocaleModal({
  open,
  onClose,
  selectedLanguage = "en-US",
  selectedCurrency = "USD",
  onChangeLanguage,
  onChangeCurrency,
  initialTab = "language",
  translationEnabled = false,
  onToggleTranslation,
  closeOnSelect = true,
}) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState(initialTab);
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => setTab(initialTab), [initialTab]);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  if (!open || !mounted) return null;

  const selectLanguage = (id) => {
    onChangeLanguage?.(id);
    if (closeOnSelect) onClose?.();
  };
  const selectCurrency = (code) => {
    onChangeCurrency?.(code);
    if (closeOnSelect) onClose?.();
  };


  const dialogStyle = {
    width: "clamp(720px, 84vw, 1120px)", 
    aspectRatio: "1.3 / 1",               
    maxHeight: "85vh",                   
  };

  const modal = (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayMouseDown}
      className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Shell with fixed aspect; inner content scrolls if needed */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="locale-modal-title"
        style={dialogStyle}
        className="relative mx-auto flex h-auto flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl ring-1 ring-black/5"
      >
        {/* Header + tabs (non-scrolling) */}
        <div className="flex items-center justify-between border-b border-[#EBEBEB] px-5 py-4 md:px-6 md:py-5">
          <nav className="relative -mb-px flex gap-6" role="tablist" aria-label="Locale">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "language"}
              onClick={() => setTab("language")}
              className={cls(
                "pb-2 text-[15px] font-semibold outline-none",
                tab === "language" ? "text-black border-b-2 border-black" : "text-[#717171] hover:text-black"
              )}
            >
              Language and region
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "currency"}
              onClick={() => setTab("currency")}
              className={cls(
                "pb-2 text-[15px] font-semibold outline-none",
                tab === "currency" ? "text-black border-b-2 border-black" : "text-[#717171] hover:text-black"
              )}
            >
              Currency
            </button>
          </nav>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#222222]" />
          </button>
        </div>

        {/* Scrollable body to preserve the 1:2 shell */}
        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
          {tab === "language" ? (
            <div>
              {/* Translation card like the screenshot */}
              <div className="mb-5 rounded-xl bg-[#F7F7F7] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold text-[#222222]">Translation</div>
                    <div className="text-[13px] text-[#717171]">
                      Automatically translate descriptions and reviews to English.
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      defaultChecked={translationEnabled}
                      onChange={(e) => onToggleTranslation?.(e.target.checked)}
                      className="peer sr-only"
                      aria-label="Automatically translate to English"
                    />
                    <span className="h-7 w-12 rounded-full bg-[#DDDDDD] transition-colors peer-checked:bg-black"></span>
                    <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 transform rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>
              </div>

              <div className="mb-3 text-[20px] font-semibold text-[#222222]" id="locale-modal-title">
                Choose a language and region
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {LANGUAGES.map((l) => {
                  const active = l.id === selectedLanguage;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => selectLanguage(l.id)}
                      className={tileClasses(active)}
                    >
                      <div className="truncate text-[14px] font-semibold text-[#222222]">{l.language}</div>
                      <div className="truncate text-[13px] text-[#717171]">{l.region}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-3 text-[20px] font-semibold text-[#222222]" id="locale-modal-title">
                Choose a currency
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {CURRENCIES.map((c) => {
                  const active = c.code === selectedCurrency;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => selectCurrency(c.code)}
                      className={tileClasses(active)}
                    >
                      <div className="truncate text-[14px] font-semibold text-[#222222]">{c.name}</div>
                      <div className="truncate text-[13px] text-[#717171]">
                        {c.code} — {c.symbol}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}