import "../Css/instellingenbar.css";
import { useNavigate } from "react-router-dom";
function Instellingen() {
  const navigate = useNavigate();
  function uitloggen() {
    document.cookie =
      "jwtToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("GeselecteerdeWoningsID");
    navigate("/inloggen");
  }
  return (
    <div className="instellingen-container">
      <div className="container-fluid mt-1">
        <div className="row">
          <div className="col-md-2 p-flex flex-column">
            <div className="list-group no-border-list">
              <a href="#" className="list-group-item">
                HomeFlow
              </a>
              <a href="/account" className="list-group-item">
                Account
              </a>
              <a href="/SlimmeApparaten" className="list-group-item">
                Slimme apparaten
              </a>
              <a href="/Huizen" className="list-group-item">
                Huizen
              </a>
              <a
                className="list-group-item list-group-item-action fixed-bottom uitlogKnop"
                onClick={uitloggen}
              >
                <i className="bi bi-box-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Instellingen;
