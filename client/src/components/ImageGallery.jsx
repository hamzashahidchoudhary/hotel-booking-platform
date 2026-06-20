import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%231F2A44' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' fill='%23E8B86D' font-family='sans-serif' font-size='24' text-anchor='middle' dy='.3em'%3EWayfare%3C/text%3E%3C/svg%3E";

const ImageGallery = ({ images = [] }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const imgs = images.length > 0 ? images : [{ url: PLACEHOLDER }];

  const next = () => setLightboxIndex((i) => (i + 1) % imgs.length);
  const prev = () => setLightboxIndex((i) => (i - 1 + imgs.length) % imgs.length);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl" style={{ height: "420px" }}>
        <button
          onClick={() => setLightboxIndex(0)}
          className="col-span-2 row-span-2 overflow-hidden"
        >
          <img src={imgs[0].url} alt="" className="h-full w-full object-cover transition hover:scale-105" />
        </button>
        {imgs.slice(1, 5).map((img, i) => (
          <button key={i} onClick={() => setLightboxIndex(i + 1)} className="overflow-hidden">
            <img src={img.url} alt="" className="h-full w-full object-cover transition hover:scale-105" />
          </button>
        ))}
        {Array.from({ length: Math.max(0, 4 - (imgs.length - 1)) }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-ink-light/10" />
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/95 p-6">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-6 top-6 text-paper/70 hover:text-paper"
          >
            <X className="h-7 w-7" />
          </button>
          <button onClick={prev} className="absolute left-6 text-paper/70 hover:text-paper">
            <ChevronLeft className="h-9 w-9" />
          </button>
          <img
            src={imgs[lightboxIndex].url}
            alt=""
            className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
          />
          <button onClick={next} className="absolute right-6 text-paper/70 hover:text-paper">
            <ChevronRight className="h-9 w-9" />
          </button>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
