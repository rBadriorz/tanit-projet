import { useEffect, useState } from "react";
import { StoreProvider, useStore } from "../store";
import { Poster, type Template } from "./Poster";

interface Props {
  shopId: string; kind: "raise" | "successor"; template?: string | undefined;
  headline?: string | undefined; subline?: string | undefined; offers?: string[] | undefined; profiles?: string[] | undefined;
}

/** Standalone A4 page for printing (no phone frame). */
export function PrintPoster(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <StoreProvider initial={{ name: "home" }}>
      <Inner {...props} />
    </StoreProvider>
  );
}

function Inner({ shopId, kind, template, ...rest }: Props) {
  const { shop } = useStore();
  const s = shop(shopId);
  const tpl: Template = template === "bold" || template === "minimal" ? template : "classic";
  if (!s) return <p className="p-8">Shop not found.</p>;
  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="no-print flex items-center justify-center gap-3 p-4">
        <button onClick={() => window.print()} className="press min-h-[48px] rounded-2xl bg-fir px-6 font-semibold text-white">Print (A4)</button>
        <a href="/" className="text-fir underline">Back to the app</a>
      </div>
      <div className="mx-auto w-[794px] print:m-0">
        <Poster shop={s} kind={kind} template={tpl} origin={window.location.origin} {...rest} />
      </div>
    </div>
  );
}
