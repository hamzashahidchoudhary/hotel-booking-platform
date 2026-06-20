import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Star, Heart, MapPin } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { showToast } from "../store/uiSlice.js";
import api from "../utils/api.js";
import { useState } from "react";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%231F2A44' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%23E8B86D' font-family='sans-serif' font-size='16' text-anchor='middle' dy='.3em'%3EWayfare%3C/text%3E%3C/svg%3E";

const PropertyCard = ({ property, initiallyFavorited = false }) => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [busy, setBusy] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      dispatch(showToast({ message: "Log in to save stays you love", type: "info" }));
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const res = await api.patch(`/users/favorites/${property._id}`);
      setFavorited(res.data.isFavorited);
    } catch {
      dispatch(showToast({ message: "Couldn't update favorites", type: "error" }));
    } finally {
      setBusy(false);
    }
  };

  const imageUrl = property.images?.[0]?.url || PLACEHOLDER_IMG;

  return (
    <Link to={`/properties/${property._id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-ink-light/5">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={handleFavorite}
            aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 ${favorited ? "fill-coral text-coral" : "text-ink/60"}`}
            />
          </button>
          {property.propertyType && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-ink backdrop-blur-sm">
              {property.propertyType}
            </span>
          )}
        </div>
      </div>

      {/* Ticket-stub detail card: the notch on the left edge evokes a torn travel ticket */}
      <div className="ticket-notch relative mt-[-1px] rounded-b-2xl border-t border-dashed border-ink/15 bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-medium text-ink">
              {property.title}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/50">
              <MapPin className="h-3 w-3" />
              {property.location?.city}, {property.location?.country}
            </p>
          </div>
          {property.ratingsCount > 0 && (
            <div className="flex flex-shrink-0 items-center gap-1 text-sm text-ink">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              {property.ratingsAverage?.toFixed(1)}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-display text-lg font-semibold text-ink">
            ${property.pricePerNight}
          </span>
          <span className="text-xs text-ink/50">/ night</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
