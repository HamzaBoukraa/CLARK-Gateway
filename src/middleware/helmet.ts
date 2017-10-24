import * as helmet from 'helmet';

// import * as helmet_csp from 'helmet-csp';

/*let csp = helmet_csp({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://maxcdn.bootstrapcdn.com',
      "https://code.jquery.com",
      "https://cdnjs.cloudflare.com"
    ],
    styleSrc: [
      "'unsafe-inline'",
      'https://maxcdn.bootstrapcdn.com'
    ],
    fontSrc: [
      "'self'",
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff",
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2",
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.ttf"
    ],
    imgSrc: ["'self'"],
    connectSrc: ["'self'"],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/api/csp-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true
  }});*/

export function setup(app) {
  app.use(helmet());

  // app.use(csp);
}

