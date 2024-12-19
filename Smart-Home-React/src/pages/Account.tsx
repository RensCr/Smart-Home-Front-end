import Instellingen from "../Components/instellingen";
import { useEffect, useState } from "react";
interface Accountinformatie {
  naam: string;
  email: string;
  woonPlaats: string;
  aangemaakt: string;
  laatstIngelogd: string;
}

function Account() {
  const [accountInfo, setAccountInfo] = useState<Accountinformatie | null>(
    null
  );
  useEffect(() => {
    async function fetchGebruikerInfo() {
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
        setAccountInfo(data);
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
            <h3 className="card-title">Persoonlijke gegevens</h3>
            <div className="form-group mb-3 w-75">
              <label>Naam</label>
              <input
                type="text"
                className="form-control"
                value={accountInfo?.naam}
                readOnly
              />
            </div>
            <div className="form-group mb-3 w-75">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                value={accountInfo?.email}
                readOnly
              />
            </div>
            <div className="form-group mb-3 w-75">
              <label>Stad</label>
              <input
                type="text"
                className="form-control"
                value={accountInfo?.woonPlaats}
                readOnly
              />
            </div>
            <div className="form-group mb-3 w-75">
              <label>Account aangemaakt</label>
              <input
                type="text"
                className="form-control"
                value={accountInfo?.aangemaakt}
                readOnly
              />
            </div>
            <div className="form-group mb-3 w-75">
              <label>Laatst ingelogd</label>
              <input
                type="text"
                className="form-control"
                value={accountInfo?.laatstIngelogd}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
