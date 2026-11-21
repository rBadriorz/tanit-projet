import { useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";
import type { Shop } from "../types";
import { markerSvg } from "./ShopArt";
import { pct } from "../store";

export interface MapTarget { lat: number; lng: number; zoom: number; key: number }

export default function LeafletMap({ shops, selectedId, onSelect, target, me }: {
  shops: Shop[]; selectedId?: string | undefined; onSelect: (id: string) => void; target: MapTarget; me?: { lat: number; lng: number } | null;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const clusterRef = useRef<Leaflet.MarkerClusterGroup | null>(null);
  const markers = useRef(new Map<string, Leaflet.Marker>());
  const meRef = useRef<Leaflet.CircleMarker | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const ready = useRef<Promise<void> | null>(null);

  // Create the map once (client only).
  useEffect(() => {
    let cancelled = false;
    ready.current = (async () => {
      // Leaflet's ESM build has no default export, and the cluster plugin needs a writable global L.
      const mod = (await import("leaflet")) as unknown as typeof Leaflet & { default?: typeof Leaflet };
      const L = (mod.default ?? { ...mod }) as typeof Leaflet;
      (window as unknown as { L: typeof Leaflet }).L = L;
      try {
        await import("leaflet.markercluster");
      } catch (e) {
        console.warn("[map] marker clustering unavailable", e);
      }
      if (cancelled || !el.current) return;
      LRef.current = L;
      const map = L.map(el.current, { zoomControl: false, attributionControl: true, maxZoom: 19, minZoom: 4 }).setView([target.lat, target.lng], target.zoom);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap contributors © CARTO", subdomains: "abcd", maxZoom: 19,
      }).addTo(map);
      const g = (window as unknown as { L: typeof Leaflet }).L;
      const cluster = (typeof g.markerClusterGroup === "function"
        ? g.markerClusterGroup({ maxClusterRadius: 40, disableClusteringAtZoom: 15, showCoverageOnHover: false })
        : (L.featureGroup() as unknown as Leaflet.MarkerClusterGroup));
      map.addLayer(cluster);
      mapRef.current = map;
      clusterRef.current = cluster;
      setTimeout(() => map.invalidateSize(), 300);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers with the filtered shops.
  useEffect(() => {
    void ready.current?.then(() => {
      const L = LRef.current, cluster = clusterRef.current;
      if (!L || !cluster) return;
      cluster.clearLayers();
      markers.current.clear();
      const list = shops.map((s) => {
        const p = s.raise ? pct(s) : undefined;
        const pulse = s.status === "raising" && s.id.startsWith("new-");
        const icon = L.divIcon({
          className: "bt-marker",
          html: `<div style="position:relative;width:34px;height:34px" class="${pulse ? "bt-pulse" : ""}" title="${s.name.replace(/"/g, "")}">${markerSvg(s.type, s.status, p)}</div>`,
          iconSize: [34, 34], iconAnchor: [17, 30],
        });
        const m = L.marker([s.lat, s.lng], { icon, title: s.name, alt: s.name, zIndexOffset: s.status === "open" ? 0 : s.status === "closed" ? -100 : 500 });
        m.on("click", () => onSelectRef.current(s.id));
        markers.current.set(s.id, m);
        return m;
      });
      list.forEach((m) => cluster.addLayer(m));
    });
  }, [shops]);

  // Fly to target (town switch, card swipe, locate me).
  useEffect(() => {
    void ready.current?.then(() => {
      mapRef.current?.flyTo([target.lat, target.lng], target.zoom, { duration: 0.8 });
    });
  }, [target.key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bounce the selected marker.
  useEffect(() => {
    if (!selectedId) return;
    void ready.current?.then(() => {
      const m = markers.current.get(selectedId);
      const node = m?.getElement();
      if (!node) return;
      node.classList.remove("bounce");
      void node.offsetWidth;
      node.classList.add("bounce");
      setTimeout(() => node.classList.remove("bounce"), 700);
    });
  }, [selectedId]);

  // Fake "me" dot.
  useEffect(() => {
    void ready.current?.then(() => {
      const L = LRef.current, map = mapRef.current;
      if (!L || !map) return;
      meRef.current?.remove();
      meRef.current = me ? L.circleMarker([me.lat, me.lng], { radius: 8, color: "#fff", weight: 3, fillColor: "#2f6fed", fillOpacity: 1 }).addTo(map) : null;
    });
  }, [me]);

  return <div ref={el} className="absolute inset-0" aria-label="Map of local shops" />;
}
