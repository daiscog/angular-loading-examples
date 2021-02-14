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
        interception.sendResponse();
        appComponent.loadingSpinner.should('not.exist');
        appComponent.dataContent.should('be.visible');
      });
    });
  });

  context('with a mock response', () => {
    it('should show then hide the loading spinner', () => {
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
