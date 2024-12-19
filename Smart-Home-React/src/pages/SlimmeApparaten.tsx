import Instellingen from "../Components/instellingen";
import { useEffect, useState } from "react";
interface ApparatenInformatie {
  slimmeApparatenHuis: number;
  slimmeApparatenGebruiker: number;
  stad: string;
  beschrijving: string;
}

function SlimmeApparaten() {
  const [ApparatenInfo, setApparatenInfo] =
    useState<ApparatenInformatie | null>(null);
  useEffect(() => {
    async function fetchGebruikerInfo() {
      try {
        const HuisId = localStorage.getItem("GeselecteerdeWoningsID");
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwtToken="))
          ?.split("=")[1];
        const response = await fetch(
          `https://localhost:7032/Apparaat/${HuisId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setApparatenInfo(data);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    }
    fetchGebruikerInfo();
  }, []);
  return (
    <div className="container-fluid mt-1">
      <div className="row">
        {/* Sidebar with InstellingenBar */}
        <div className="col-md-2">
          <Instellingen />
        </div>

        {/* Main content with personal information */}
        <div className="col-md-9">
          <div className="card p-4">
            <h3 className="card-title">Slimme Apparaten</h3>
            <div className="form-group mb-3 w-75">
              <label>
                Slimme apparaten {ApparatenInfo?.beschrijving} (
                {ApparatenInfo?.stad})
              </label>
              <input
                type="text"
                className="form-control"
                value={ApparatenInfo?.slimmeApparatenHuis}
                readOnly
              />
            </div>
            <div className="form-group mb-3 w-75">
              <label>Slimme apparaten alle huizen</label>
              <input
                type="text"
                className="form-control"
                value={ApparatenInfo?.slimmeApparatenGebruiker}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlimmeApparaten;
