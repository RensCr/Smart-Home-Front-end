import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../Css/Home.css"; // Zorg ervoor dat je de juiste CSS-bestand importeert

interface StadOption {
  value: string;
  label: string;
}

const Aanmaak = () => {
  const navigate = useNavigate();
  const steden: StadOption[] = [
    { value: "Amsterdam", label: "Amsterdam" },
    { value: "Rotterdam", label: "Rotterdam" },
    { value: "Utrecht", label: "Utrecht" },
    { value: "Den Haag", label: "Den Haag" },
    { value: "Eindhoven", label: "Eindhoven" },
  ];

  const [selectedStad, setSelectedStad] =
    useState<SingleValue<StadOption>>(null);
  const [naam, setNaam] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [wachtwoord, setWachtwoord] = useState<string>("");
  const [herhaalwachtwoord, setHerhaalwachtwoord] = useState<string>("");

  const handleStadChange = (selectedOption: SingleValue<StadOption>) => {
    setSelectedStad(selectedOption);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (wachtwoord !== herhaalwachtwoord) {
      Swal.fire({
        icon: "error",
        title: "Fout",
        text: "Wachtwoorden komen niet overeen",
      });
      setWachtwoord("");
      setHerhaalwachtwoord("");
    } else {
      try {
        const response = await fetch("https://localhost:7032/Register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            naam: naam,
            email: email,
            wachtwoord: wachtwoord,
            woonPlaats: selectedStad?.value,
          }),
        });
        if (response.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Fout",
            text: "Email is al in gebruik",
          });
          setEmail("");
          return;
        }
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Succes",
            text: "Account succesvol aangemaakt",
          });
          navigate("/Inloggen");
        } else {
          Swal.fire({
            icon: "error",
            title: "Fout",
            text: "Er is iets misgegaan bij het aanmaken van het account",
          });
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Fout",
          text: "Er is iets misgegaan bij het aanmaken van het account",
        });
      }
    }
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <a href="/Inloggen" className="small-login-link">
          Inloggen
        </a>
      </div>
      <div className="content-wrap d-flex justify-content-center align-items-center">
        <div className="card p-4 shadow" style={{ width: "20rem" }}>
          <h2 className="text-center mb-4">Account aanmaken</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="text" className="form-label">
                Naam
              </label>
              <input
                type="Text"
                className="form-control"
                id="Naam"
                placeholder="Voer hier uw naam in"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                required
              />
            </div>
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
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Wachtwoord
              </label>
              <input
                type="password"
                className="form-control"
                id="wachtwoord"
                placeholder="Voer hier uw wachtwoord in"
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Herhaalwachtwoord" className="form-label">
                Herhaal wachtwoord
              </label>
              <input
                type="password"
                className="form-control"
                id="herhaalwachtwoord"
                placeholder="Herhaal wachtwoord"
                value={herhaalwachtwoord}
                onChange={(e) => setHerhaalwachtwoord(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="stad" className="form-label">
                Kies een stad
              </label>
              <Select
                id="stad"
                options={steden}
                value={selectedStad}
                onChange={handleStadChange}
                placeholder="Zoek stad"
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Account aanmaken
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Aanmaak;
