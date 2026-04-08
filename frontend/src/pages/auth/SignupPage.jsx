import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <h1>Create Your Account</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Join Smart Campus Operations Hub and manage your campus resources
        </p>
        <button 
          onClick={handleGoogleSignup}
          style={{ 
            padding: "12px 24px", 
            fontSize: "16px",
            cursor: "pointer", 
            backgroundColor: "#4285F4",
            color: "white", 
            border: "none", 
            borderRadius: "6px",
            width: "100%",
            marginBottom: "20px"
          }}
        >
          Sign up with Google
        </button>
        <p style={{ color: "#999", fontSize: "14px" }}>
          Already have an account?{" "}
          <button 
            onClick={() => navigate("/login")}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#4285F4",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "14px"
            }}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
