function Login() {
  return (
    <div style={{ maxWidth: "420px", margin: "40px auto", padding: "20px" }}>
      <h1>Login to VEYID</h1>

      <p>Welcome back! Sign in to access your VEYID account.</p>

      <br />

      <input
        type="text"
        placeholder="Email, Phone Number or VEYID"
        style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
      />

      <input
        type="password"
        placeholder="Password"
        style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
      />

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <a href="/forgot-password">Forgot Password?</a>
      </div>

      <button
        style={{
          width: "100%",
          padding: "12px",
          cursor: "pointer"
        }}
      >
        Login
      </button>

      <br />
      <br />

<p>
  <a href="/get-verified">Get Verified</a>
</p>
    </div>
  );
}

export default Login;
