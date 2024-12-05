describe("Instellingen Component", () => {
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

    // Stel de HuisId in de localStorage in
    localStorage.setItem("GeselecteerdeWoningsID", "5");

    // Log in to the application
    cy.visit("http://localhost:5173/inloggen"); // Pas de URL aan naar je login pagina
    cy.get("input[id='email']").type("Test@test"); // Pas de selector en waarde aan
    cy.get("input[id='password']").type("T"); // Pas de selector en waarde aan
    cy.get("button[type='submit']").click(); // Pas de selector aan indien nodig

    // Wacht tot de login voltooid is en de gebruiker doorgestuurd wordt
    cy.wait("@loginRequest").then(() => {
      // Bezoek de instellingenpagina
      cy.visit("http://localhost:5173/account"); // Pas de URL aan naar je instellingenpagina URL
      cy.wait("@userInfoRequest");
    });
  });

  it("renders the instellingen page correctly", () => {
    cy.get(".instellingen-container").should("exist");
    cy.get(".list-group-item").should("have.length", 5);
    cy.get(".list-group-item").eq(0).should("contain", "HomeFlow");
    cy.get(".list-group-item").eq(1).should("contain", "Account");
    cy.get(".list-group-item").eq(2).should("contain", "Slimme apparaten");
    cy.get(".list-group-item").eq(3).should("contain", "Huizen");
  });

  it("logout works", () => {
    cy.get(".uitlogKnop").click();
    cy.url().should("include", "/inloggen");
  });
});
