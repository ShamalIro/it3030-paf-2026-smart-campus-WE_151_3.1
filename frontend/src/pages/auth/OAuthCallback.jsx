import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("Current URL:", window.location.href);
    console.log("Token found:", token);

    if (token) {
      login(token);
      navigate("/notifications");
    } else {
      console.error("No token in URL — redirecting to login");
      navigate("/login");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Authenticating...</h2>
      <p>Please wait</p>
    </div>
  );
};

export default OAuthCallback;