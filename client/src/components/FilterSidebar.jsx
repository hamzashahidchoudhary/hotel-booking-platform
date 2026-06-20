import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const AMENITIES = [
  { value: "wifi", label: "WiFi" },
  { value: "pool", label: "Pool" },
  { value: "parking", label: "Parking" },
  { value: "air_conditioning", label: "AC" },
  { value: "kitchen", label: "Kitchen" },
  { value: "pet_friendly", label: "Pet friendly" },
  { value: "hot_tub", label: "Hot tub" },
  { value: "gym", label: "Gym" },
];

const PROPERTY_TYPES = ["hotel", "apartment", "villa", "guesthouse", "resort", "cabin", "hostel"];

const FilterSidebar = ({ filters, onChange }) => {
  const [local, setLocal] = useState(filters);

  const apply = () => onChange(local);

  const toggleAmenity = (value) => {
    setLocal((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter((a) => a !== value)
        : [...prev.amenities, value],
    }));
  };

  return (
    <aside className="w-full rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-coral" />
        <h3 className="font-display text-base font-medium">Filters</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink/40">
            Price per night
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={local.minPrice}
              onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
            <span className="text-ink/30">–</span>
            <input
              type="number"
              placeholder="Max"
              value={local.maxPrice}
              onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink/40">
            Property type
          </label>
          <select
            value={local.propertyType}
            onChange={(e) => setLocal({ ...local, propertyType: e.target.value })}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm capitalize focus:border-ink focus:outline-none"
          >
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink/40">
            Guests
          </label>
          <input
            type="number"
            min="1"
            value={local.guests}
            onChange={(e) => setLocal({ ...local, guests: e.target.value })}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink/40">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => toggleAmenity(a.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  local.amenities.includes(a.value)
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 text-ink/60 hover:border-ink/40"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={apply}
          className="w-full rounded-full bg-coral py-2.5 text-sm font-medium text-white transition hover:bg-coral-dark"
        >
          Apply filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
