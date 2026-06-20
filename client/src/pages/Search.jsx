import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Map, Grid3x3 } from "lucide-react";
import { fetchProperties, setFilters, setPage } from "../store/propertiesSlice.js";
import PropertyCard from "../components/PropertyCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import SearchMap from "../components/SearchMap.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { PageSpinner } from "../components/ui/Feedback.jsx";
import { EmptyState } from "../components/ui/Feedback.jsx";
import { SearchX } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list, total, pages, filters, status } = useSelector((state) => state.properties);
  const [view, setView] = useState("grid");

  // Seed filters from URL query params on first load (from homepage search bar)
  useEffect(() => {
    const initial = {};
    ["city", "checkIn", "checkOut", "guests"].forEach((key) => {
      const value = searchParams.get(key);
      if (value) initial[key] = value;
    });
    if (Object.keys(initial).length) dispatch(setFilters(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = { ...filters, amenities: filters.amenities.join(",") };
    dispatch(fetchProperties(params));
  }, [filters, dispatch]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <SearchBar className="mb-8" />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {status === "loading" ? "Searching..." : `${total} stay${total !== 1 ? "s" : ""} found`}
        </p>
        <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              view === "grid" ? "bg-ink text-paper" : "text-ink/60"
            }`}
          >
            <Grid3x3 className="h-3.5 w-3.5" /> Grid
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              view === "map" ? "bg-ink text-paper" : "text-ink/60"
            }`}
          >
            <Map className="h-3.5 w-3.5" /> Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar filters={filters} onChange={(f) => dispatch(setFilters(f))} />

        <div>
          {status === "loading" ? (
            <PageSpinner />
          ) : list.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No stays match your search"
              description="Try adjusting your filters or searching a different location."
            />
          ) : view === "grid" ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => dispatch(setPage(p))}
                      className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                        filters.page === p ? "bg-ink text-paper" : "text-ink/60 hover:bg-ink/5"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-[600px]">
              <SearchMap properties={list} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
