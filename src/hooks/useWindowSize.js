import { useEffect, useState } from "react";


export default function useWindowSize() {
  const get = () => {
    if (typeof window === "undefined") {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        breakpoint: "tablet",
        orientation: "landscape",
      };
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width <= 1024;
    const isDesktop = width > 1024;
    const breakpoint = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    const orientation = width >= height ? "landscape" : "portrait";
    return { width, height, isMobile, isTablet, isDesktop, breakpoint, orientation };
  };

  const [state, setState] = useState(get);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setState(get());
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return state;
}