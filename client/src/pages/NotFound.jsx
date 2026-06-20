import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/ui/Button.jsx";

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
    <Compass className="h-12 w-12 text-coral" />
    <h1 className="mt-4 font-display text-4xl font-semibold text-ink">Lost your way?</h1>
    <p className="mt-2 max-w-sm text-ink/50">
      We couldn't find the page you were looking for. Let's get you back on track.
    </p>
    <Link to="/" className="mt-6">
      <Button variant="coral">Back to home</Button>
    </Link>
  </div>
);

export default NotFound;
