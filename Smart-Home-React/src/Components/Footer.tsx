import Logo from "/HomeFlow1.png";

function Footer() {
  return (
    <div>
      <footer className="footer fixed-bottom bg-black">
        <div className="row no-gutters align-items-center">
          <div className="col d-flex flex-column align-items-start">
            <div className="d-flex flex-column align-items-center">
              <i
                className="bi bi-clock mb-1"
                style={{ fontSize: "1.5rem" }}
              ></i>
              <span>Simuleer tijd</span>
            </div>
          </div>
          <div className="col d-flex flex-column align-items-center">
            <i
              className="bi bi-cloud-lightning mb-1"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span>Temperatuur: 17°C</span>
          </div>
          <div className="col d-flex justify-content-end align-items-center">
            <img
              src={Logo}
              alt="Bedrijfslogo"
              className="mb-2"
              style={{ width: "4rem", height: "3rem" }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
