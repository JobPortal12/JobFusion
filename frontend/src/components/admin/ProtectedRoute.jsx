import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      navigate("/");
    }
  }, [user, navigate]); // ✅ Added dependencies to prevent infinite re-renders

  return <>{children}</>;
};

export default ProtectedRoute;
