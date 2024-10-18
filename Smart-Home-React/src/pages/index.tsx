import "../App.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/Home.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

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
    };

    checkJwtToken();
  }, [navigate]);

  return (
    <>
      <Header></Header>
      <div className="container-fluid ">
        <div className="row mb-4">
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Slim licht - Slaapkamer jantje</h5>
                <p className="card-text">Toestand : Aan</p>
                <br></br>
                <a href="#" className="btn btn-aan">
                  Aan
                </a>
                <a href="#" className="btn btn-uit">
                  Uit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Index;
