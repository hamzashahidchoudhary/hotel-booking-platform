import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`flex w-full flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl shadow-ink/20 md:flex-row md:items-stretch md:gap-0 md:rounded-full md:p-2 ${className}`}
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-2.5 md:border-r md:border-ink/10">
        <MapPin className="h-4 w-4 flex-shrink-0 text-coral" />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Where to?"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-2.5 md:border-r md:border-ink/10">
        <Calendar className="h-4 w-4 flex-shrink-0 text-coral" />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full bg-transparent text-sm text-ink focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-2.5 md:border-r md:border-ink/10">
        <Calendar className="h-4 w-4 flex-shrink-0 text-coral" />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || new Date().toISOString().split("T")[0]}
          className="w-full bg-transparent text-sm text-ink focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-2.5">
        <Users className="h-4 w-4 flex-shrink-0 text-coral" />
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Guests"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white transition hover:bg-coral-dark md:rounded-full"
      >
        <Search className="h-4 w-4" />
        <span className="md:hidden">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
