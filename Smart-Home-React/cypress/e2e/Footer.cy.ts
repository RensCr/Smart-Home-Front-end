describe("Footer Component", () => {
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
      cy.visit("http://localhost:5173"); // Pas de URL aan naar je applicatie URL
      cy.wait("@userInfoRequest");
    });
  });

  it("renders the footer correctly", () => {
    cy.get("footer.footer").should("exist");
    cy.get("footer.footer .bi-clock").should("exist");
    cy.get("footer.footer").contains("Simuleer tijd").should("exist");
    cy.get("footer.footer .bi-cloud-lightning").should("exist");
    cy.get("footer.footer").contains("Temperatuur: 17°C").should("exist");
    cy.get("footer.footer img").should("exist");
  });
});
