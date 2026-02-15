'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';

interface ChartContainerProps {
  height: number;
  render: (opts: { width: number; isRTL: boolean }) => HTMLElement | SVGElement;
  className?: string;
}

export function ChartContainer({ height, render, className }: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const locale = useLocale();
  const isRTL = locale === 'he';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stableRender = useCallback(render, [render]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || width === 0) return;

    const chart = stableRender({ width, isRTL });
    el.replaceChildren(chart);

    return () => {
      el.replaceChildren();
    };
  }, [width, isRTL, stableRender]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={className}
    />
  );
}
