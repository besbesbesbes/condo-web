import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_VERSION } from "../config/version";

export default function VersionChecker() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function checkVersion() {
      try {
        const res = await fetch("/version.json", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data?.version && data.version !== APP_VERSION) {
          const shouldReload = window.confirm(
            "A new version is available. Reload to update?",
          );
          if (shouldReload) {
            window.location.reload();
          }
        }
      } catch (err) {
        // ignore fetch errors
      }
    }

    checkVersion();

    return () => {
      cancelled = true;
    };
  }, [location]);

  return null;
}
