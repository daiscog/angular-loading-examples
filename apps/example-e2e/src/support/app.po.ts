export const appComponent = {
  get loadingSpinner(): Cypress.Chainable<JQuery> {
    return cy.get('[data-cy="loading"]');
  },
  get dataContent(): Cypress.Chainable<JQuery> {
    return cy.get('[data-cy="data"]');
  },
  get errorMessage(): Cypress.Chainable<JQuery> {
    return cy.get('[data-cy="error"]');
  },
};
