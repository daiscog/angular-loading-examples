/*
 *
 * Cypress 6 introduced a new network stubbing API called `intercept` which
 * is more powerful and flexible than the old `server` & `route` API.
 *
 * Here we take advantage of its ability to await a Promise before emitting
 * a stubbed response so we can delay the response to a network request until
 * _after_ we have asserted the visibility of a loading state.
 *
 * The technique that allows this has been abstracted into the utility function
 * `interceptIndefinitely`, imported from `../support/utils` below.
 *
 */
import { interceptIndefinitely } from '../support/utils';
import { appComponent } from '../support/app.po';

describe('app loading data', () => {
  context('with a real response', () => {
    it('should show then hide the loading spinner', () => {
      const interception = interceptIndefinitely(
        'https://xkcd.com/123/info.0.json'
      );
      cy.visit('/');
      appComponent.loadingSpinner.should('be.visible').then(() => {
        // interception.sendResponse() *must* be called inside a `then` callback
        // after verifying the visibility of the loading spinner in order to
        // avoid potential race conditions that could lead to flakiness
        interception.sendResponse();
        appComponent.loadingSpinner.should('not.exist');
        appComponent.dataContent.should('be.visible');
      });
    });
  });

  context('with a mock response', () => {
    it('should show then hide the loading spinner', () => {
      // Instead of calling the original endpoint, our interceptor can provide
      // a mock response instead:
      const interception = interceptIndefinitely(
        'https://xkcd.com/123/info.0.json',
        {
          body: {
            img: 'https://imgs.xkcd.com/comics/compiling.png',
            alt: 'Compiling',
          },
          statusCode: 200,
        }
      );
      cy.visit('/');
      appComponent.loadingSpinner.should('be.visible').then(() => {
        interception.sendResponse();
        appComponent.loadingSpinner.should('not.exist');
        appComponent.dataContent.should('be.visible');
      });
    });
  });

  context('with an error response', () => {
    it('should show then hide the loading spinner', () => {
      // Or we can send an error response to assert an error message is shown
      const interception = interceptIndefinitely(
        'https://xkcd.com/123/info.0.json',
        {
          body: {
            error: 'Not found',
          },
          statusCode: 404,
        }
      );
      cy.visit('/');
      appComponent.loadingSpinner.should('be.visible').then(() => {
        interception.sendResponse();
        appComponent.loadingSpinner.should('not.exist');
        appComponent.errorMessage.should('be.visible');
      });
    });
  });
});
