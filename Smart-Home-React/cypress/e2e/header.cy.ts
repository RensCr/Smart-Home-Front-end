describe("Header Component", () => {
  let userToken = "fake-jwt-token";

  beforeEach(() => {
    // Mock de login API response
    cy.intercept("POST", "https://localhost:7032/login", (req) => {
      expect(req.body).to.deep.equal({
        email: "Test@test",
        wachtwoord: "T",
      });
      req.reply({
        statusCode: 200,
        body: {
          token: userToken,
        },
      });
    }).as("loginRequest");

    // Mock de gebruikersinfo API response
    cy.intercept("GET", "https://localhost:7032/Gebruiker/GebruikersInfo", {
      statusCode: 200,
      body: {
        naam: "TestGebruiker",
      },
    }).as("userInfoRequest");

    // Mock de apparaten API response met token
    cy.intercept("POST", "https://localhost:7032/Apparaten?HuisId=5", (req) => {
      expect(req.headers).to.have.property(
        "authorization",
        `Bearer ${userToken}`
      );
      req.reply({
        statusCode: 200,
        body: [
          {
            id: 9,
            naam: "WandLamp",
            slim: false,
            apparaatType: "Tv",
            huisId: 5,
            status: true,
          },
          {
            id: 10,
            naam: "TestLampHuis5",
            slim: true,
            apparaatType: "Lamp",
            huisId: 5,
            status: false,
          },
          {
            id: 17,
            naam: "LampTest",
            slim: true,
            apparaatType: "Rolluik",
            huisId: 5,
            status: false,
          },
          {
            id: 25,
            naam: "Lamp slaapkamer jantje",
            slim: true,
            apparaatType: "Lamp",
            huisId: 5,
            status: false,
          },
        ],
      });
    }).as("apparatenRequest");

    // Stel de HuisId in de localStorage in
    localStorage.setItem("GeselecteerdeWoningsID", "5");

    // Log in to the application
    cy.visit("http://localhost:5173/inloggen"); // Pas de URL aan naar je login pagina
    cy.get("input[id='email']").type("Test@test"); // Pas de selector en waarde aan
    cy.get("input[id='password']").type("T"); // Pas de selector en waarde aan
    cy.get("button[type='submit']").click(); // Pas de selector aan indien nodig

    // Wacht tot de login voltooid is en de gebruiker doorgestuurd wordt
    cy.wait("@loginRequest").then(() => {
      // Bezoek de pagina die je wilt testen
      cy.visit("http://localhost:5173"); // Pas de URL aan naar je applicatie URL
      cy.wait("@userInfoRequest");
      cy.wait("@apparatenRequest");
    });
  });

  it("renders the header correctly", () => {
    cy.get("nav").should("exist");
    cy.get(".navbar-brand").should("contain", "HomeFlow");
  });

  it("search input works", () => {
    cy.get("input[type='search']").type("test query");
    cy.get("input[type='search']").should("have.value", "test query");
  });

  it("dropdown menu works", () => {
    cy.get("#dropdownUser1").click();
    cy.get(".dropdown-menu").should("be.visible");
    cy.get(".dropdown-item").contains("instellingen").should("exist");
  });

  it("logout works", () => {
    cy.get("#dropdownUser1").click();
    cy.get(".dropdown-item").contains("uitloggen").click();
    cy.url().should("include", "/inloggen");
  });

  it("displays the list of apparaten", () => {
    cy.get(".card").should("have.length", 4);
    cy.get(".card").eq(0).should("contain", "WandLamp");
    cy.get(".card").eq(1).should("contain", "TestLampHuis5");
    cy.get(".card").eq(2).should("contain", "LampTest");
    cy.get(".card").eq(3).should("contain", "Lamp slaapkamer jantje");
  });
});
