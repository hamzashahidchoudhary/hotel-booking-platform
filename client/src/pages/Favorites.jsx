import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartCrack } from "lucide-react";
import api from "../utils/api.js";
import PropertyCard from "../components/PropertyCard.jsx";
import { PageSpinner, EmptyState } from "../components/ui/Feedback.jsx";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/favorites");
        setFavorites(res.data.favorites);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Saved stays</h1>

      <div className="mt-6">
        {loading ? (
          <PageSpinner />
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={HeartCrack}
            title="No saved stays yet"
            description="Tap the heart icon on any property to save it here."
            action={
              <Link to="/search" className="text-sm font-medium text-coral">
                Explore stays
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((property) => (
              <PropertyCard key={property._id} property={property} initiallyFavorited />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
