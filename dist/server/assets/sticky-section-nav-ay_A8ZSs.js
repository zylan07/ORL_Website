import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
const getThemeClasses = (theme = "teal", isActive) => {
  const mapping = {
    sky: {
      active: "border-sky-500 bg-sky-500/20 text-sky-700 dark:text-sky-300 font-extrabold shadow-sm",
      inactive: "border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400 hover:bg-sky-500/15"
    },
    indigo: {
      active: "border-indigo-500 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-extrabold shadow-sm",
      inactive: "border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15"
    },
    teal: {
      active: "border-teal-500 bg-teal-500/20 text-teal-700 dark:text-teal-300 font-extrabold shadow-sm",
      inactive: "border-teal-500/20 bg-teal-500/5 text-teal-600 dark:text-teal-400 hover:bg-teal-500/15"
    },
    emerald: {
      active: "border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-sm",
      inactive: "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15"
    },
    cyan: {
      active: "border-cyan-500 bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-extrabold shadow-sm",
      inactive: "border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/15"
    },
    blue: {
      active: "border-blue-500 bg-blue-500/20 text-blue-700 dark:text-blue-300 font-extrabold shadow-sm",
      inactive: "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15"
    },
    violet: {
      active: "border-violet-500 bg-violet-500/20 text-violet-700 dark:text-violet-300 font-extrabold shadow-sm",
      inactive: "border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400 hover:bg-violet-500/15"
    },
    slate: {
      active: "border-slate-500 bg-slate-500/20 text-slate-700 dark:text-slate-300 font-extrabold shadow-sm",
      inactive: "border-slate-500/20 bg-slate-500/5 text-slate-600 dark:text-slate-400 hover:bg-slate-500/15"
    },
    primary: {
      active: "border-primary bg-primary/20 text-primary font-extrabold shadow-sm",
      inactive: "border-primary/20 bg-primary/5 text-foreground/80 hover:bg-primary/10"
    }
  };
  const key = mapping[theme] ? theme : "primary";
  return isActive ? mapping[key].active : mapping[key].inactive;
};
function StickySectionNav({
  items,
  onItemClick
}) {
  const [activeId, setActiveId] = useState("");
  const navRef = useRef(null);
  useEffect(() => {
    if (items.length === 0) return;
    setActiveId(items[0].id);
    const observerOptions = {
      root: null,
      rootMargin: "-120px 0px -60% 0px",
      // triggers when section is near the top
      threshold: 0.1
    };
    const handleIntersection = (entries) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        setActiveId(visibleEntry.target.id);
      }
    };
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => {
      observer.disconnect();
    };
  }, [items]);
  const handleScroll = (id) => {
    if (onItemClick) {
      onItemClick(id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 110;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  useEffect(() => {
    if (!activeId || !navRef.current) return;
    const container = navRef.current.querySelector(".overflow-x-auto");
    const activeButton = navRef.current.querySelector(`[data-nav-id="${activeId}"]`);
    if (container && activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const isLeftOutOfView = buttonRect.left < containerRect.left;
      const isRightOutOfView = buttonRect.right > containerRect.right;
      if (isLeftOutOfView || isRightOutOfView) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  }, [activeId]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: navRef,
      className: "sticky top-[56px] z-30 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-3 shadow-sm transition-all duration-300",
      children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl flex items-center justify-start lg:justify-center gap-3 overflow-x-auto flex-nowrap whitespace-nowrap scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2", children: items.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        const themeClasses = getThemeClasses(item.theme, isActive);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            "data-nav-id": item.id,
            onClick: () => handleScroll(item.id),
            className: `shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition duration-300 cursor-pointer select-none ${themeClasses}`,
            children: [
              Icon && /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
              item.label,
              item.count !== void 0 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] opacity-75 font-mono", children: [
                "(",
                item.count,
                ")"
              ] })
            ]
          },
          item.id
        );
      }) })
    }
  );
}
export {
  StickySectionNav as S
};
