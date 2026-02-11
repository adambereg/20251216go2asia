'use client';

/**
 * StableMapContainer
 *
 * Why this exists:
 * react-leaflet@4.2.1 MapContainer can leak a Leaflet map in React 18 StrictMode dev cycle:
 * - map is created synchronously in ref callback
 * - cleanup relies on `context` state being set
 * - if the component unmounts before setContext flushes, cleanup doesn't run -> container keeps _leaflet_id
 * - next mount on same DOM node throws: "Map container is already initialized."
 *
 * This wrapper guarantees cleanup even if `context` was never committed.
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { LeafletProvider, createLeafletContext } from '@react-leaflet/core';
import { Map as LeafletMap, type FitBoundsOptions, type LatLngBoundsExpression, type MapOptions } from 'leaflet';

export interface StableMapContainerProps extends MapOptions {
  bounds?: LatLngBoundsExpression;
  boundsOptions?: FitBoundsOptions;
  children?: ReactNode;
  className?: string;
  id?: string;
  placeholder?: ReactNode;
  style?: CSSProperties;
  whenReady?: () => void;
  center?: [number, number];
  zoom?: number;
}

function clearLeafletId(container: HTMLElement | null | undefined) {
  if (!container) return;
  if ((container as any)._leaflet_id) {
    (container as any)._leaflet_id = null;
  }
}

function StableMapContainerComponent(
  {
    bounds,
    boundsOptions,
    center,
    children,
    className,
    id,
    placeholder,
    style,
    whenReady,
    zoom,
    ...options
  }: StableMapContainerProps,
  forwardedRef: React.ForwardedRef<LeafletMap | null>
) {
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [context, setContext] = useState<ReturnType<typeof createLeafletContext> | null>(null);

  // React's ref type allows null, but TS libdefs for useImperativeHandle are stricter.
  // Cast is safe: consumers must handle a possibly-null ref at runtime.
  useImperativeHandle(forwardedRef as any, () => mapInstanceRef.current, []);

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        // Pre-clear dev leftovers (Fast Refresh / StrictMode)
        clearLeafletId(node);

        if (mapInstanceRef.current) return;

        const map = new LeafletMap(node, options);
        mapInstanceRef.current = map;

        if (center != null && zoom != null) {
          map.setView(center, zoom);
        } else if (bounds != null) {
          map.fitBounds(bounds, boundsOptions);
        }

        if (whenReady != null) {
          map.whenReady(whenReady);
        }

        setContext(createLeafletContext(map));
        return;
      }

      // node === null => unmount: always cleanup map even if context never committed
      const map = mapInstanceRef.current;
      if (!map) return;

      let container: HTMLElement | null = null;
      try {
        container = map.getContainer();
      } catch {
        container = (map as any)?._container ?? null;
      }

      try {
        map.remove();
      } catch {
        // ignore
      }

      clearLeafletId(container);
      mapInstanceRef.current = null;
      setContext(null);
    },
    // Intentionally empty deps (same as react-leaflet MapContainer):
    // MapOptions/center/bounds are treated as "init-only".
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Safety: if React unmounts without ref-callback firing (rare), still try cleanup.
  useEffect(() => {
    return () => {
      const map = mapInstanceRef.current;
      if (!map) return;
      try {
        const container = map.getContainer();
        map.remove();
        clearLeafletId(container);
      } catch {
        // ignore
      } finally {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const contents = context ? (
    <LeafletProvider value={context!}>{children}</LeafletProvider>
  ) : (
    placeholder ?? null
  );

  return (
    <div ref={containerRef} className={className} id={id} style={style}>
      {contents}
    </div>
  );
}

export const StableMapContainer = forwardRef(StableMapContainerComponent);

