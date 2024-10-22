import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
interface StadOption {
  value: string;
  label: string;
}
function Huizen() {
  const navigate = useNavigate();
  const steden: StadOption[] = [
    { value: "Amsterdam", label: "Amsterdam" },
    { value: "Rotterdam", label: "Rotterdam" },
    { value: "Utrecht", label: "Utrecht" },
    { value: "Den Haag", label: "Den Haag" },
    { value: "Eindhoven", label: "Eindhoven" },
  ];
  const [houses, setHouses] = useState<
    {
      id: number;
      locatie: String;
      GebruikersId: number;
      beschrijving: String;
    }[]
  >([]);
  const [newHouse, setNewHouse] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedStad, setSelectedStad] =
    useState<SingleValue<StadOption>>(null);

  const fetchHouses = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];
      const response = await fetch("https://localhost:7032/Huis", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setHouses(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching apparaattypes:", error);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleAddHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    const nieuwhuis = newHouse;
    const stad = selectedStad?.value;
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];

      const response = await fetch("https://localhost:7032/Huis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          beschrijving: nieuwhuis,
          locatie: stad,
        }),
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Succes",
          text: "Huis is toegevoegd",
        });
        setIsAdding(false);
        fetchHouses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardClick = (id: number) => {
    localStorage.setItem("GeselecteerdeWoningsID", id.toString());
    navigate("/");
  };
  const handleStadChange = (selectedOption: SingleValue<StadOption>) => {
    setSelectedStad(selectedOption);
  };

  return (
    <div className="container mt-4">
      <h1>Huizen</h1>
      <div className="row">
        {houses.map((house, index) => (
          <div key={index} className="col-md-4 mb-3">
            <button
              className="card w-100"
              onClick={() => handleCardClick(house.id)}
            >
              <div className="card-body">
                <h5 className="card-title">Locatie: {house.locatie}</h5>
                <p className="card-text">Beschrijving: {house.beschrijving}</p>
              </div>
            </button>
          </div>
        ))}
        <div className="col-md-4 mb-3">
          <div className="card add-card">
            <div className="card-body d-flex justify-content-center align-items-center">
              <Button variant="primary" onClick={() => setIsAdding(true)}>
                Voeg huis toe
              </Button>
            </div>
          </div>
        </div>
        <Modal show={isAdding} onHide={() => setIsAdding(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Voeg huis toe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddHouse}>
              <div className="mb-3">
                <label htmlFor="house" className="form-label">
                  Huis beschrijving
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newHouse}
                  onChange={(e) => setNewHouse(e.target.value)}
                  placeholder="Geef huisbeschrijving"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="stad" className="form-label">
                  Selecteer een stad
                </label>
                <Select
                  id="stad"
                  options={steden}
                  value={selectedStad}
                  onChange={handleStadChange}
                  placeholder="Zoek een stad"
                  required
                />
              </div>
              <div className="mt-3">
                <Button variant="secondary" onClick={() => setIsAdding(false)}>
                  Annuleer
                </Button>
                <Button type="submit" variant="primary" className="ms-2">
                  Voeg toe
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Huizen;
