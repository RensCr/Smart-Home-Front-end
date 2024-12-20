import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWebSocket } from "../Websocket/websocketcontext.jsx"; // Import WebSocket context

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setUsername: (username: string) => void;
  setUserId: (userId: string) => void;
}

function Header({
  searchQuery,
  setSearchQuery,
  setUsername,
  setUserId,
}: HeaderProps) {
  const [Gebruikersnaam, setGebruikersnaam] = useState<string>("");
  const [GebruikersId, setGebruikersId] = useState<string>("");
  const navigate = useNavigate();
  const { currentUser } = useWebSocket(); // Access currentUser from WebSocket context

  useEffect(() => {
    async function fetchUsername() {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwtToken="))
          ?.split("=")[1];
        const response = await fetch(
          "https://localhost:7032/Gebruiker/GebruikersInfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("t", data);
        setGebruikersnaam(data.naam);
        setGebruikersId(data.id);
        setUsername(data.naam); // Set the username in the parent component
        setUserId(data.id); // Set the userId in the parent component
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    }

    fetchUsername();
  }, [setUsername, setUserId]);

  function uitloggen() {
    document.cookie =
      "jwtToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("GeselecteerdeWoningsID");
    navigate("/inloggen");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          HomeFlow
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to="/toevoegen"
              >
                Apparaat Toevoegen
              </Link>
            </li>
            <li className="nav-item">
              <span className="nav-link">|</span>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to="/plattegrond"
              >
                Plattegrond
              </Link>
            </li>
          </ul>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Zoek apparaat"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="dropdown">
            <a
              href="#"
              className="d-flex align-items-center text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person" style={{ color: "black" }}></i>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownUser1"
            >
              <li>
                <span className="dropdown-item">
                  {currentUser?.username || Gebruikersnaam}
                </span>
              </li>
              <li>
                <a className="dropdown-item" href="/account">
                  instellingen
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="" onClick={uitloggen}>
                  uitloggen
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
