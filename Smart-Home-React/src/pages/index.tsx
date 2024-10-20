import "../App.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const [Apparaten, setApparaattypes] = useState<
    { id: number; naam: string; slim: boolean; apparaatType: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkJwtToken = () => {
      const cookies = document.cookie.split("; ");
      const jwtTokenCookie = cookies.find((cookie) =>
        cookie.startsWith("jwtToken=")
      );
      if (jwtTokenCookie) {
        console.log("jwtToken cookie found");
        const isSecure = jwtTokenCookie.includes("Secure");
        if (isSecure) {
          console.log("jwtToken cookie is secure");
        } else {
          console.log("jwtToken cookie is not secure");
        }
      } else {
        console.log("jwtToken cookie not found, redirecting to login");
        navigate("/inloggen");
      }
      if (localStorage.getItem("GeselecteerdeWoningsID") === null) {
        navigate("/huizen");
      }
    };

    checkJwtToken();
    fetchApparaten();
  }, [navigate]);

  const fetchApparaten = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];

      if (!token) {
        console.error("JWT token not found in cookies");
        return;
      }
      const huisId = localStorage.getItem("GeselecteerdeWoningsID");
      const response = await fetch(
        `https://localhost:7032/Apparaten?HuisId=${huisId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch apparaten");
        return;
      }

      const data = await response.json();
      setApparaattypes(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredApparaten = Apparaten.filter((apparaat) => {
    const query = searchQuery.toLowerCase();
    return (
      apparaat.naam.toLowerCase().includes(query) ||
      apparaat.apparaatType.toLowerCase().includes(query) ||
      (query === "slim" && apparaat.slim) ||
      (query === "niet slim" && !apparaat.slim)
    );
  });

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="container-fluid">
        <div className="row">
          {filteredApparaten.map((apparaat) => (
            <div key={apparaat.id} className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {apparaat.apparaatType} - {apparaat.naam}
                  </h5>
                  <p className="card-text">
                    {apparaat.slim ? "Slim" : "Niet slim"}
                  </p>
                  <br />
                  <a href="#" className="btn btn-aan">
                    Aan
                  </a>
                  <a href="#" className="btn btn-uit">
                    Uit
                  </a>
                  <a href="#" className="btn btn-slim">
                    Slim
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Index;
