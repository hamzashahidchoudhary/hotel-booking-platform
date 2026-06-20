import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Upload, X } from "lucide-react";
import { createProperty, updateProperty } from "../../store/propertiesSlice.js";
import { showToast } from "../../store/uiSlice.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import LocationPicker from "../../components/LocationPicker.jsx";
import api from "../../utils/api.js";
import { PageSpinner } from "../../components/ui/Feedback.jsx";

const PROPERTY_TYPES = ["hotel", "apartment", "villa", "guesthouse", "resort", "cabin", "hostel"];
const AMENITIES_LIST = [
  "wifi", "pool", "parking", "air_conditioning", "kitchen", "tv", "washer", "dryer",
  "gym", "breakfast", "pet_friendly", "elevator", "workspace", "heating", "hot_tub",
  "fireplace", "beach_access", "ski_in_out",
];

const emptyForm = {
  title: "",
  description: "",
  propertyType: "apartment",
  pricePerNight: "",
  cleaningFee: "",
  maxGuests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  location: { address: "", city: "", state: "", country: "", zipCode: "" },
  coordinates: null, // [lng, lat]
  amenities: [],
  cancellationPolicy: "moderate",
  houseRules: {
    checkInTime: "15:00",
    checkOutTime: "11:00",
    smokingAllowed: false,
    petsAllowed: false,
    partiesAllowed: false,
    additionalRules: "",
  },
};

const HostPropertyForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        const p = res.data.property;
        setForm({
          title: p.title,
          description: p.description,
          propertyType: p.propertyType,
          pricePerNight: p.pricePerNight,
          cleaningFee: p.cleaningFee,
          maxGuests: p.maxGuests,
          bedrooms: p.bedrooms,
          beds: p.beds,
          bathrooms: p.bathrooms,
          location: { ...p.location },
          coordinates: p.location.coordinates.coordinates,
          amenities: p.amenities,
          cancellationPolicy: p.cancellationPolicy,
          houseRules: p.houseRules,
        });
        setExistingImages(p.images);
      } catch {
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files].slice(0, 10));
  };

  const removeNewImage = (idx) => setNewImages((prev) => prev.filter((_, i) => i !== idx));

  const removeExistingImage = async (publicId) => {
    if (!isEdit) return;
    try {
      await api.delete(`/properties/${id}/images/${publicId}`);
      setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    } catch {
      dispatch(showToast({ message: "Failed to remove image", type: "error" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.coordinates) {
      setError("Please click on the map to set the property's location");
      return;
    }
    if (!isEdit && newImages.length === 0) {
      setError("Please upload at least one photo");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("propertyType", form.propertyType);
    formData.append("pricePerNight", form.pricePerNight);
    formData.append("cleaningFee", form.cleaningFee || 0);
    formData.append("maxGuests", form.maxGuests);
    formData.append("bedrooms", form.bedrooms);
    formData.append("beds", form.beds);
    formData.append("bathrooms", form.bathrooms);
    formData.append("cancellationPolicy", form.cancellationPolicy);
    formData.append(
      "location",
      JSON.stringify({
        ...form.location,
        coordinates: { coordinates: form.coordinates },
      })
    );
    formData.append("amenities", JSON.stringify(form.amenities));
    formData.append("houseRules", JSON.stringify(form.houseRules));
    newImages.forEach((file) => formData.append("images", file));

    setSaving(true);
    const result = isEdit
      ? await dispatch(updateProperty({ id, formData }))
      : await dispatch(createProperty(formData));
    setSaving(false);

    if (result.type.endsWith("/fulfilled")) {
      dispatch(showToast({ message: `Listing ${isEdit ? "updated" : "created"}!`, type: "success" }));
      navigate("/host/properties");
    } else {
      setError(result.payload || "Failed to save listing");
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? "Edit listing" : "Create a new listing"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {error && <p className="rounded-lg bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}

        <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-medium text-ink">Basics</h2>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Sunny Downtown Loft with City Views"
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
              placeholder="Describe what makes this place special..."
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Property type</label>
            <select
              value={form.propertyType}
              onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm capitalize focus:border-ink focus:outline-none"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-medium text-ink">Capacity & pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price per night ($)"
              type="number"
              min="1"
              value={form.pricePerNight}
              onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
              required
            />
            <Input
              label="Cleaning fee ($)"
              type="number"
              min="0"
              value={form.cleaningFee}
              onChange={(e) => setForm({ ...form, cleaningFee: e.target.value })}
            />
            <Input
              label="Max guests"
              type="number"
              min="1"
              value={form.maxGuests}
              onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
              required
            />
            <Input
              label="Bedrooms"
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
              required
            />
            <Input
              label="Beds"
              type="number"
              min="1"
              value={form.beds}
              onChange={(e) => setForm({ ...form, beds: e.target.value })}
              required
            />
            <Input
              label="Bathrooms"
              type="number"
              min="0.5"
              step="0.5"
              value={form.bathrooms}
              onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
              required
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-medium text-ink">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Address"
              value={form.location.address}
              onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
              required
            />
            <Input
              label="City"
              value={form.location.city}
              onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })}
              required
            />
            <Input
              label="State/Province"
              value={form.location.state}
              onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })}
            />
            <Input
              label="Country"
              value={form.location.country}
              onChange={(e) => setForm({ ...form, location: { ...form.location, country: e.target.value } })}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">
              Click on the map to pin the exact location
            </label>
            <LocationPicker
              coordinates={form.coordinates}
              onChange={(coords) => setForm({ ...form, coordinates: coords })}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-medium text-ink">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
                  form.amenities.includes(a)
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 text-ink/60 hover:border-ink/40"
                }`}
              >
                {a.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-medium text-ink">Photos</h2>

          {existingImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {existingImages.map((img) => (
                <div key={img.publicId} className="group relative aspect-square overflow-hidden rounded-lg">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.publicId)}
                    className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-paper opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {newImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {newImages.map((file, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-paper opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 py-8 text-sm text-ink/50 hover:border-coral hover:text-coral">
            <Upload className="h-4 w-4" />
            Click to upload photos (max 10)
            <input type="file" accept="image/*" multiple hidden onChange={handleImageSelect} />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-medium text-ink">House rules & policy</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Check-in time"
              type="time"
              value={form.houseRules.checkInTime}
              onChange={(e) =>
                setForm({ ...form, houseRules: { ...form.houseRules, checkInTime: e.target.value } })
              }
            />
            <Input
              label="Check-out time"
              type="time"
              value={form.houseRules.checkOutTime}
              onChange={(e) =>
                setForm({ ...form, houseRules: { ...form.houseRules, checkOutTime: e.target.value } })
              }
            />
          </div>
          <div className="flex gap-6">
            {["smokingAllowed", "petsAllowed", "partiesAllowed"].map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={form.houseRules[key]}
                  onChange={(e) =>
                    setForm({ ...form, houseRules: { ...form.houseRules, [key]: e.target.checked } })
                  }
                />
                {key.replace("Allowed", "").replace(/([A-Z])/g, " $1")} allowed
              </label>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Cancellation policy</label>
            <select
              value={form.cancellationPolicy}
              onChange={(e) => setForm({ ...form, cancellationPolicy: e.target.value })}
              className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm capitalize focus:border-ink focus:outline-none"
            >
              <option value="flexible">Flexible</option>
              <option value="moderate">Moderate</option>
              <option value="strict">Strict</option>
            </select>
          </div>
        </section>

        <div className="flex gap-3">
          <Button type="submit" variant="coral" loading={saving}>
            {isEdit ? "Save changes" : "Create listing"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/host/properties")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HostPropertyForm;
