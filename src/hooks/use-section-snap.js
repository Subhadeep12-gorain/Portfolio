/**
 * useSectionSnap — firstvillage-style full-viewport section snapping
 *
 * Works WITH Lenis (not CSS scroll-snap, which conflicts with Lenis).
 * Intercepts wheel/touch events and calls lenis.scrollTo(sectionTop)
 * to snap the nearest section into view.
 *
 * Usage:
 *   useSectionSnap(lenisRef, { freeScrollIds: ['bento'] })
 *
 * - lenisRef: ref to the Lenis instance (from useLenis hook)
 * - freeScrollIds: section IDs that should NOT snap (they scroll freely)
 */

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

const SNAP_SECTION_ATTR = 'data-snap-section';
const DEBOUNCE_MS = 900; // min ms between snaps

export function useSectionSnap({ freeScrollIds = [] } = {}) {
  const lenis = useLenis();
  const isSnapping = useRef(false);
  const lastSnapTime = useRef(0);
  const accDelta = useRef(0);
  const THRESHOLD = 30; // wheel delta threshold before triggering snap

  useEffect(() => {
    if (!lenis) return;

    // Get all snap sections in DOM order (excluding free-scroll ones)
    const getSnapSections = () =>
      Array.from(document.querySelectorAll(`[${SNAP_SECTION_ATTR}]`)).filter(
        (el) => !freeScrollIds.includes(el.id)
      );

    // Find which section to snap to based on scroll direction
    const snapTo = (direction) => {
      const now = Date.now();
      if (isSnapping.current || now - lastSnapTime.current < DEBOUNCE_MS) return;

      const sections = getSnapSections();
      if (!sections.length) return;

      const scrollY = lenis.scroll;
      const viewH = window.innerHeight;

      // Find current section index (section whose top is closest to scrollY)
      let currentIdx = 0;
      let minDist = Infinity;
      sections.forEach((s, i) => {
        const top = s.getBoundingClientRect().top + scrollY;
        const dist = Math.abs(top - scrollY);
        if (dist < minDist) { minDist = dist; currentIdx = i; }
      });

      // Which section are we actually "in"? If already past 40% of current, go to next
      const currentSection = sections[currentIdx];
      const currentTop = currentSection.getBoundingClientRect().top + scrollY;
      const inProgress = (scrollY - currentTop) / viewH;

      const targetIdx = Math.max(
        0,
        Math.min(
          sections.length - 1,
          direction > 0
            ? currentIdx + 1
            : inProgress < 0.4 ? currentIdx - 1 : currentIdx
        )
      );

      const target = sections[targetIdx];
      const targetTop = target.getBoundingClientRect().top + scrollY;

      isSnapping.current = true;
      lastSnapTime.current = now;

      lenis.scrollTo(targetTop, {
        duration: 1.05,
        easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, // ease-in-out-cubic
        onComplete: () => { isSnapping.current = false; }
      });
    };

    // Wheel handler — accumulate delta, snap when threshold met
    const onWheel = (e) => {
      if (isSnapping.current) { e.preventDefault(); return; }

      // Check if the scroll is inside a free-scroll section
      const target = e.target;
      const inFreeSection = freeScrollIds.some(id => {
        const el = document.getElementById(id);
        return el && el.contains(target);
      });
      if (inFreeSection) return;

      // Accumulate delta
      accDelta.current += e.deltaY;
      if (Math.abs(accDelta.current) < THRESHOLD) return;

      const direction = accDelta.current > 0 ? 1 : -1;
      accDelta.current = 0;

      snapTo(direction);
    };

    // Touch snap
    let touchStartY = 0;
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      snapTo(dy > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [lenis, freeScrollIds]);
}
