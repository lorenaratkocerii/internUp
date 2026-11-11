import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router';
import { FaqPanel } from '../features/faq/components/FaqPanel';
import { Footer } from '../features/home/components/Footer';
import { Navbar } from '../features/home/components/Navbar';

const MAX_SCROLL_ATTEMPTS = 60;

function useRouteScroll(mainRef) {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [pathname, mainRef]);

  useEffect(() => {
    if (!hash) {
      if (navigationType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' });
      return undefined;
    }

    let frame = 0;
    let attempts = 0;
    const scrollToTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => target.scrollIntoView());
        });
      } else if (attempts < MAX_SCROLL_ATTEMPTS) {
        attempts += 1;
        frame = requestAnimationFrame(scrollToTarget);
      }
    };
    scrollToTarget();
    return () => cancelAnimationFrame(frame);
  }, [key, hash, navigationType]);
}

export function AppLayout() {
  const mainRef = useRef(null);
  useRouteScroll(mainRef);

  return (
    <>
      <a
        href="#permbajtja"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-cream focus:px-4 focus:py-2 focus:font-semibold focus:text-charcoal"
      >
        Kalo te përmbajtja
      </a>
      <Navbar />
      <main ref={mainRef} id="permbajtja" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <FaqPanel />
    </>
  );
}
