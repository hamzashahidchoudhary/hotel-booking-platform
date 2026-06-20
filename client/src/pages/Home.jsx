import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, MapPinned } from "lucide-react";
import { fetchProperties } from "../store/propertiesSlice.js";
import PropertyCard from "../components/PropertyCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { PageSpinner } from "../components/ui/Feedback.jsx";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop";

const Home = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties({ limit: 8, sort: "rating" }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <img
          src={HERO_IMAGE}
          alt="A warmly lit coastal property at golden hour"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />

        <div className="relative mx-auto flex max-w-7xl flex-col px-6 pt-24 pb-32 md:pt-32 md:pb-40">
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-paper text-balance md:text-6xl">
            Find a place that feels like <span className="text-gold">yours</span>
          </h1>
          <p className="mt-4 max-w-md text-paper/70">
            Handpicked stays, transparent pricing, no surprises at checkout.
          </p>
        </div>

        {/* Search bar overlaps the hero image edge, like a boarding pass tucked into a photo */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-12 md:translate-y-12 md:pb-0">
          <SearchBar />
        </div>
      </section>

      <div className="h-12 md:h-12" />

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 flex-shrink-0 text-coral" />
            <div>
              <h3 className="font-display text-base font-medium">Secure payments</h3>
              <p className="text-sm text-ink/60">Every booking is protected end-to-end via Stripe.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-6 w-6 flex-shrink-0 text-coral" />
            <div>
              <h3 className="font-display text-base font-medium">Verified reviews</h3>
              <p className="text-sm text-ink/60">Only guests who actually stayed can leave a review.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPinned className="mt-0.5 h-6 w-6 flex-shrink-0 text-coral" />
            <div>
              <h3 className="font-display text-base font-medium">Explore by map</h3>
              <p className="text-sm text-ink/60">See exactly where you'll be staying before you book.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Top-rated stays</h2>
            <p className="mt-1 text-sm text-ink/50">Loved by guests, vetted by us.</p>
          </div>
          <Link
            to="/search"
            className="flex items-center gap-1 text-sm font-medium text-coral hover:gap-2 transition-all"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {status === "loading" ? (
          <PageSpinner />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Host CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-ink-light px-8 py-14 text-center md:px-20">
          <h2 className="font-display text-3xl font-semibold text-paper">
            Have a place worth sharing?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-paper/60">
            List your property on Wayfare and start earning from guests around the world.
          </p>
          <Link
            to="/become-a-host"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition hover:bg-coral-dark"
          >
            Become a host <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
