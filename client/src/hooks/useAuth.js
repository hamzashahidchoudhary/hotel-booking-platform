import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, isAuthenticated, status, initialCheckDone, error } = useSelector(
    (state) => state.auth
  );
  return { user, isAuthenticated, status, initialCheckDone, error };
};
