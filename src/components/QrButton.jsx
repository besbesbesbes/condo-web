import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

export default function QrButton() {
  const readerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const handleScanClick = async () => {
    if (scanning) return;
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = html5QrCode;
    setScanning(true);

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await html5QrCode.stop();
          setScanning(false);
          window.location.href = decodedText;
        },
        (error) => {
          // optionally handle scan errors here
        }
      );
    } catch (err) {
      console.error("Camera access failed", err);
      setScanning(false);
    }
  };

  useEffect(() => {
    // Cleanup if user navigates away
    return () => {
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().catch(console.warn);
      }
    };
  }, []);

  return (
    <div>
      <button onClick={handleScanClick} className="btn btn-primary">
        Open Camera & Scan
      </button>
      <div
        id="qr-reader"
        ref={readerRef}
        style={{ width: "300px", marginTop: "1rem" }}
      ></div>
    </div>
  );
}
