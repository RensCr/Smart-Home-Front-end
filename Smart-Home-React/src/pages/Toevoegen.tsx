import "../App.css";
import Header from "../Components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Toevoegen = () => {
  const navigate = useNavigate();
  const [apparaattypes, setApparaattypes] = useState<
    { id: number; type: string }[]
  >([]);
  const [apparaatNaam, setApparaatNaam] = useState<string>("");
  const [ApparaatTypeId, SetappattypeID] = useState<number>(-1);
  const [isSlim, setIsSlim] = useState<boolean>(false);

  useEffect(() => {
    // Fetch apparaattypes from the API
    const fetchApparaattypes = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwtToken="))
          ?.split("=")[1];

        const response = await fetch("https://localhost:7032/ApparaatType", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setApparaattypes(data);
      } catch (error) {
        console.error("Error fetching apparaattypes:", error);
      }
    };

    fetchApparaattypes();
  }, []);
  const addApparaat = async (event: React.FormEvent) => {
    event.preventDefault();

    // Zorg dat alle waarden definitief vastgelegd worden
    const naam = apparaatNaam;
    const typeId = ApparaatTypeId;
    const slim = isSlim;
    const huisId = localStorage.getItem("GeselecteerdeWoningsID");

    try {
      console.log(naam, typeId, slim);

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];

      const response = await fetch("https://localhost:7032/Apparaat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Naam: naam,
          ApparaatTypeId: typeId,
          Slim: slim, // Slim wordt hier definitief verstuurd
          HuisId: Number(huisId),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error adding apparaat: ${errorText}`);
      }
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Succes",
          text: "Apparaat toegevoegd",
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Fout opgetreden",
        });
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header
        searchQuery=""
        setSearchQuery={() => {}}
        setUsername={() => {}}
        setUserId={() => {}}
      />
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Voeg apparaat toe</h5>
            <form onSubmit={addApparaat}>
              <div className="mb-3">
                <label htmlFor="apparaatNaam" className="form-label">
                  Apparaat naam
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="apparaatNaam"
                  placeholder="Voer apparaat naam in"
                  value={apparaatNaam}
                  onChange={(e) => setApparaatNaam(e.target.value)}
                  required
                />
              </div>

              {/* Apparaat type */}
              <div className="mb-3">
                <label htmlFor="apparaatType" className="form-label">
                  Apparaat type
                </label>
                <select
                  className="form-select"
                  id="apparaatType"
                  value={ApparaatTypeId}
                  onChange={(e) => SetappattypeID(Number(e.target.value))}
                  required
                >
                  <option value="">Selecteer apparaat type</option>
                  {apparaattypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex">
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="slimApparaat"
                    checked={isSlim}
                    onChange={(e) => setIsSlim(e.target.checked)}
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
                    checked={!isSlim}
                    onChange={(e) => setIsSlim(!e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="nietslimApparaat"
                  >
                    Niet slim
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-success">
                Apparaat toevoegen
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toevoegen;
