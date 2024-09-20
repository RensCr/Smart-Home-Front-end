import "../App.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
function Toevoegen() {
  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Voeg apparaat toe</h5>
            <form>
              <div className="mb-3">
                <label htmlFor="apparaatNaam" className="form-label">
                  Apparaat naam
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="apparaatNaam"
                  placeholder="Voer apparaat naam in"
                />
              </div>
              {/* Apparaat type */}
              <div className="mb-3">
                <label htmlFor="apparaatType" className="form-label">
                  Apparaat type
                </label>
                <select className="form-select" id="apparaatType">
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
              <div className="d-flex">
                <div className="mb-3 form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="slimApparaat"
                  />
                  <label className="form-check-label" htmlFor="slimApparaat">
                    Slim
                  </label>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="nietslimApparaat"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="nietslimApparaat"
                  >
                    Niet slim
                  </label>
                </div>
              </div>

              <Link className="btn btn-success" to="/">
                Apparaat toevoegen
              </Link>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Toevoegen;
