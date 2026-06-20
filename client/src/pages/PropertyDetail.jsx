import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Wifi,
  Waves,
  Car,
  Wind,
  ChefHat,
  Tv,
  WashingMachine,
  Dumbbell,
  Coffee,
  PawPrint,
  ArrowUpDown,
  Laptop,
  Flame,
  Sparkles,
  Mountain,
  Snowflake,
  Users,
  BedDouble,
  Bath,
  Star,
} from "lucide-react";
import { fetchPropertyById, clearCurrentProperty } from "../store/propertiesSlice.js";
import { PageSpinner } from "../components/ui/Feedback.jsx";
import ImageGallery from "../components/ImageGallery.jsx";
import BookingWidget from "../components/BookingWidget.jsx";
import ReviewsList from "../components/ReviewsList.jsx";
import SearchMap from "../components/SearchMap.jsx";

const AMENITY_ICONS = {
  wifi: Wifi,
  pool: Waves,
  parking: Car,
  air_conditioning: Wind,
  kitchen: ChefHat,
  tv: Tv,
  washer: WashingMachine,
  dryer: WashingMachine,
  gym: Dumbbell,
  breakfast: Coffee,
  pet_friendly: PawPrint,
  elevator: ArrowUpDown,
  workspace: Laptop,
  heating: Flame,
  hot_tub: Sparkles,
  fireplace: Flame,
  beach_access: Waves,
  ski_in_out: Mountain,
};

const AMENITY_LABELS = {
  wifi: "WiFi",
  pool: "Pool",
  parking: "Free parking",
  air_conditioning: "Air conditioning",
  kitchen: "Kitchen",
  tv: "TV",
  washer: "Washer",
  dryer: "Dryer",
  gym: "Gym",
  breakfast: "Breakfast included",
  pet_friendly: "Pet friendly",
  elevator: "Elevator",
  workspace: "Dedicated workspace",
  heating: "Heating",
  hot_tub: "Hot tub",
  fireplace: "Fireplace",
  beach_access: "Beach access",
  ski_in_out: "Ski-in/ski-out",
};

const PropertyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: property, unavailableRanges, status } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchPropertyById(id));
    return () => dispatch(clearCurrentProperty());
  }, [id, dispatch]);

  if (status === "loading" || !property) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-display text-3xl font-semibold text-ink">{property.title}</h1>
      <div className="mt-2 flex items-center gap-3 text-sm text-ink/60">
        {property.ratingsCount > 0 && (
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-gold text-gold" />
            {property.ratingsAverage.toFixed(1)} ({property.ratingsCount} reviews)
          </span>
        )}
        <span>·</span>
        <span>
          {property.location.city}, {property.location.country}
        </span>
      </div>

      <div className="mt-6">
        <ImageGallery images={property.images} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-center justify-between border-b border-ink/10 pb-6">
            <div>
              <h2 className="font-display text-xl font-medium text-ink">
                {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} hosted
                by {property.host.name}
              </h2>
              <div className="mt-2 flex items-center gap-4 text-sm text-ink/60">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {property.maxGuests} guests
                </span>
                <span className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" /> {property.bedrooms} bedroom
                  {property.bedrooms !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" /> {property.bathrooms} bath
                  {property.bathrooms !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-lg font-semibold text-paper">
              {property.host.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink/70">
            {property.description}
          </p>

          <div className="mt-8 border-t border-ink/10 pt-8">
            <h3 className="font-display text-lg font-medium text-ink">What this place offers</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {property.amenities.map((a) => {
                const Icon = AMENITY_ICONS[a] || Snowflake;
                return (
                  <div key={a} className="flex items-center gap-2 text-sm text-ink/70">
                    <Icon className="h-4 w-4 text-coral" />
                    {AMENITY_LABELS[a] || a}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-ink/10 pt-8">
            <h3 className="font-display text-lg font-medium text-ink">Where you'll be</h3>
            <p className="mt-1 text-sm text-ink/60">
              {property.location.address}, {property.location.city}, {property.location.country}
            </p>
            <div className="mt-4 h-80">
              <SearchMap properties={[property]} />
            </div>
          </div>

          <div className="mt-8 border-t border-ink/10 pt-8">
            <h3 className="font-display text-lg font-medium text-ink">House rules</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-ink/70 sm:grid-cols-4">
              <div>
                <p className="text-xs uppercase text-ink/40">Check-in</p>
                <p>{property.houseRules.checkInTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-ink/40">Check-out</p>
                <p>{property.houseRules.checkOutTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-ink/40">Pets</p>
                <p>{property.houseRules.petsAllowed ? "Allowed" : "Not allowed"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-ink/40">Smoking</p>
                <p>{property.houseRules.smokingAllowed ? "Allowed" : "Not allowed"}</p>
              </div>
            </div>
            {property.houseRules.additionalRules && (
              <p className="mt-3 text-sm text-ink/60">{property.houseRules.additionalRules}</p>
            )}
          </div>

          <div className="mt-8 border-t border-ink/10 pt-8">
            <h3 className="mb-4 font-display text-lg font-medium text-ink">Reviews</h3>
            <ReviewsList
              propertyId={property._id}
              ratingsAverage={property.ratingsAverage}
              ratingsCount={property.ratingsCount}
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget property={property} unavailableRanges={unavailableRanges} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
