/*
 *
 * If you're not yet using Cypress 6, you can still use the old cy.route API
 * to test loading states, but it's a little more complicated.
 *
 * (Note: If you are using Cypress 6, see an approach using the new intercept
 * API in `testing-loading-state-with-intercept.spec.ts` instead)
 */
import { appComponent } from '../support/app.po';

describe('app loading data', () => {
  context('the flaky way', () => {
    /*
     * We can use cy.route to delay a response from an XHR long enough for us to
     * verify the visibility of the loading spinner, so you may initially write
     * something like this:
     */
    it('should show then hide the loading spinner when loading data', () => {
      cy.server();
      cy.route('https://xkcd.com/123/info.0.json', {
        delay: 500,
      }).as('getImageInfo');
      cy.visit('/');
      appComponent.loadingSpinner.should('be.visible');
      cy.wait('@getImageInfo');
      appComponent.loadingSpinner.should('not.exist');
      appComponent.dataContent.should('be.visible');
    });
    /*
     * However, if the delay we choose is too short, we create a race condition
     * where on a slow or heavily-loaded system, Cypress may not start to look
     * for the loading spinner until after the delay has timed out and the
     * spinner has been removed, in which case the loading spinner visibility
     * assertion will fail, giving us a false negative.
     *
     * Conversely, if the delay is too long, we'll end up wasting time in our
     * tests waiting for the delayed response after we've already verified the
     * existence of the spinner and are ready to move on to our next test.
     */
  });

  context('a better way?', () => {
    /*
     * Alternatively, we could split the test in two and drop the need to wait
     * for the data load after we've verified the existence of the spinner
     * during the loading state.
     *
     * The downside of this approach is it requires two `cy.visit` calls, which
     * may be expensive in large SPAs as they involve a full page reload.
     */
    it('should show the loading spinner when waiting for a response', () => {
      cy.server();
      cy.route('https://xkcd.com/123/info.0.json', {
        // Don't be scared of this long delay; as we're not calling cy.wait,
        // it doesn't really matter how long this is - Cypress will not wait
        // for it and instead will immediately move on to the next test as
        // soon as the loading spinner visibility is confirmed below
        delay: 15000,
      });
      cy.visit('/');
      appComponent.loadingSpinner.should('be.visible');
    });

    // Now, instead of waiting for the previous request to finish loading,
    // just revisit the page, this time with no artificial delay to the
    // XHR response.
    it('should hide the loading spinner after a response has been received and show the data', () => {
      cy.server();
      cy.route('https://xkcd.com/123/info.0.json').as('getImageInfo');
      // wait for the response to be sure we're not verifying the spinner
      // doesn't exist before we've even started loading the data (i.e.,
      // eliminate a race condition that could give a false-positive)
      cy.visit('/');
      cy.wait('@getImageInfo');
      appComponent.loadingSpinner.should('not.exist');
      appComponent.dataContent.should('be.visible');
    });
  });
});
