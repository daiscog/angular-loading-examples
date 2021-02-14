import {
  HttpResponseInterceptor,
  RouteMatcher,
  StaticResponse,
} from 'cypress/types/net-stubbing';

export function interceptIndefinitely(
  requestMatcher: RouteMatcher,
  response?: StaticResponse | HttpResponseInterceptor
): { sendResponse: () => void } {
  let sendResponse;
  const trigger = new Promise((resolve) => {
    sendResponse = resolve;
  });
  cy.intercept(requestMatcher, (req) => {
    return trigger.then(() => {
      req.reply(response);
    });
  });
  return {
    sendResponse,
  };
}
