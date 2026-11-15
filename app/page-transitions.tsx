"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

const NavigationContext = createContext(false);
const routes = new Set(["/", "/platform", "/about", "/contact"]);

export function useInternalNavigation() {
  return useContext(NavigationContext);
}

export default function PageTransitions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigating = useRef(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [phase, setPhase] = useState<"idle" | "leaving" | "entering">("idle");

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    navigating.current = false;
    if (timer.current) clearTimeout(timer.current);
    setHasNavigated(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(reducedMotion ? "idle" : "entering");
    document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
    if (!reducedMotion) timer.current = setTimeout(() => setPhase("idle"), 420);
  }, [pathname]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function navigate(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin || !routes.has(destination.pathname) || destination.hash) return;
    if (destination.pathname === pathname && destination.search === window.location.search) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    if (navigating.current) return;
    navigating.current = true;
    if (timer.current) clearTimeout(timer.current);
    setHasNavigated(true);
    const href = destination.pathname + destination.search;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(reducedMotion ? "idle" : "leaving");
    timer.current = setTimeout(() => {
      router.push(href);
      // Restore the current view if a navigation cannot complete.
      timer.current = setTimeout(() => {
        navigating.current = false;
        setPhase("idle");
      }, 8000);
    }, reducedMotion ? 0 : 180);
  }

  return <NavigationContext.Provider value={hasNavigated}>
    <div className="page-transition" data-phase={phase} onClickCapture={navigate}>{children}</div>
  </NavigationContext.Provider>;
}
