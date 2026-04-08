const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center",
                  alignItems: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Smart Campus Operations Hub</h1>
        <p>Sign in to continue</p>
        <button onClick={handleGoogleLogin}
          style={{ padding: "12px 24px", fontSize: "16px",
                   cursor: "pointer", backgroundColor: "#4285F4",
                   color: "white", border: "none", borderRadius: "6px" }}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;