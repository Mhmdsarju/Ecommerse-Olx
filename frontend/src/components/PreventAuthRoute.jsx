import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PreventAuthRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? <Navigate to="/home" replace /> : children;
};

export default PreventAuthRoute;
