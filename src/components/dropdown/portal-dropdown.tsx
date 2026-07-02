'use client';

import { useDisclosure } from '@/hooks';
import { AnimatePresence, m } from 'framer-motion';
import {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';

type Align = 'left' | 'right';

type PortalDropdownProps = {
  /** The button/element that triggers the dropdown. Must accept a ref and onClick. */
  trigger: ReactElement;
  /** Menu content rendered inside the dropdown panel. Can be a function that receives the `close` method. */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** Alignment of the dropdown relative to the trigger. Default: 'right' */
  align?: Align;
  /** Vertical offset (px) from the trigger's bottom edge. Default: 4 */
  offsetY?: number;
  /** Horizontal offset (px) applied after alignment. Positive = right, negative = left. Default: 0 */
  offsetX?: number;
  /** Additional className for the dropdown panel. */
  className?: string;
};

type DropdownPos = { top: number; left: number };

// Minimum gap (px) kept between the panel and the viewport edge.
const VIEWPORT_EDGE_MARGIN = 8;

/**
 * A portal-based dropdown that renders its panel into document.body,
 * escaping all stacking contexts. Handles:
 * - Position tracking (scroll + resize)
 * - Click-outside detection (excludes the trigger itself)
 * - Open/close toggle without double-fire
 */
export function PortalDropdown({
  trigger,
  children,
  align = 'right',
  offsetY = 4,
  offsetX = 0,
  className
}: PortalDropdownProps) {
  const { opened, open, close } = useDisclosure();

  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<DropdownPos>({ top: 0, left: 0 });
  // Extra horizontal px applied on top of offsetX to dodge the viewport edge.
  // Folded into transformOrigin so the scale animation still originates from the trigger.
  const [edgeOffset, setEdgeOffset] = useState<number>(0);

  // Click-outside: close only when clicking outside both trigger and panel
  useEffect(() => {
    if (!opened) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [opened, close]);

  // Position tracking: update on open, scroll, resize, and layout shifts
  useEffect(() => {
    if (!opened) return;

    const updatePos = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const panelWidth = panelRef.current?.offsetWidth ?? 0;

      const top = rect.bottom + window.scrollY + offsetY;
      const baseLeft =
        (align === 'right'
          ? rect.right + window.scrollX
          : rect.left + window.scrollX) + offsetX;

      // Nudge the panel inward just enough to clear the viewport edge,
      // without flipping which side it's anchored to.
      let nudge = 0;
      if (panelWidth > 0) {
        const screenLeft =
          baseLeft - window.scrollX - (align === 'right' ? panelWidth : 0);
        const screenRight = screenLeft + panelWidth;

        if (screenLeft < VIEWPORT_EDGE_MARGIN) {
          nudge = VIEWPORT_EDGE_MARGIN - screenLeft;
        } else if (screenRight > window.innerWidth - VIEWPORT_EDGE_MARGIN) {
          nudge = -(screenRight - (window.innerWidth - VIEWPORT_EDGE_MARGIN));
        }
      }

      const left = baseLeft + nudge;

      setEdgeOffset((prev) => (prev === nudge ? prev : nudge));
      setPos((prev) => {
        if (prev.top === top && prev.left === left) return prev;
        return { top, left };
      });
    };

    updatePos();

    let rafId: number;
    const loop = () => {
      updatePos();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener('scroll', updatePos, { passive: true });
    window.addEventListener('resize', updatePos, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updatePos);
      window.removeEventListener('resize', updatePos);
    };
  }, [opened, align, offsetX, offsetY]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Call original onClick if provided
    const triggerProps = trigger.props as { onClick?: React.MouseEventHandler };
    if (isValidElement(trigger) && triggerProps.onClick) {
      triggerProps.onClick(e);
    }
    if (opened) {
      close();
    } else {
      open();
    }
  };

  const clonedTrigger = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        ref: triggerRef,
        onClick: handleTriggerClick
      })
    : trigger;

  return (
    <>
      {clonedTrigger}
      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {opened && (
              <m.div
                ref={panelRef}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.1, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  zIndex: 49,
                  // X: distance from panel's left edge to where the trigger sits.
                  //   align='right' → panel right = trigger right → 100% - (offsetX + edgeOffset)
                  //   align='left'  → panel left  = trigger left  → 0% - (offsetX + edgeOffset)
                  // edgeOffset is the extra shift applied to dodge the viewport edge,
                  // folded in so the origin still tracks the trigger, not the panel box.
                  // Y: trigger bottom is -offsetY above the panel top → ${-offsetY}px
                  transformOrigin: `${align === 'right' ? `calc(100% - ${offsetX + edgeOffset}px)` : `${-(offsetX + edgeOffset)}px`} ${-offsetY}px`,
                  translate: align === 'right' ? '-100% 0' : '0 0'
                }}
                className={className}
              >
                {typeof children === 'function' ? children(close) : children}
              </m.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
