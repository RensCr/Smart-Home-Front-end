import "../Css/Home.css"; // Zorg ervoor dat je de juiste CSS-bestand importeert
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [wachtwoord, setWachtwoord] = useState<string>("");
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("https://localhost:7032/login", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          wachtwoord: wachtwoord,
        }),
      });
      const data = await response.json();
      const token = data.token;
      document.cookie = `jwtToken=${token}; Path=/; SameSite=None; secure`;
      console.log(data.token);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Succes",
          text: "U bent ingelogd",
        });
        console.log("U bent ingelogd");
        navigate("/");
      }
    } catch (error) {
      console.error("Probleem opgetreden", error);
    }
  };
  return (
    <div className="page-container">
      <div className="login-box">
        <a href="/Aanmelden" className="small-login-link">
          Creëer account
        </a>
      </div>
      <div className="content-wrap d-flex justify-content-center align-items-center">
        <div className="card p-4 shadow" style={{ width: "20rem" }}>
          <h2 className="text-center mb-4">Log in</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Voer hier uw E-mail in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Voer hier uw wachtwoord in"
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Ingelogd blijven
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
