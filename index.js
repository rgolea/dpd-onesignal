/**
 * Module dependencies
 */

var Resource = require('deployd/lib/resource'),
  util = require('util'),
  Signal = require('onesignal-node'),
  Client = Signal.Client;

/**
 * Module setup.
 */

function Onesignal() {

  Resource.apply(this, arguments);

  this.client = new Client(this.config.appId, this.config.apiKey);

}

util.inherits(Onesignal, Resource);

Onesignal.prototype.clientGeneration = true;

Onesignal.basicDashboard = {
  settings: [
    {
      name: 'appId',
      type: 'text',
      description: 'Your OneSignal appId.'
    }, {
      name: 'apiKey',
      type: 'text',
      description: 'Your OneSignal apiKey.'
    }, {
      name: 'internalOnly',
      type: 'checkbox',
      description: 'Only allow internal scripts to send notifications'
    }]
};

/**
 * Module methodes
 */

Onesignal.prototype.handle = function (ctx, next) {

  if (ctx.req && ctx.req.method !== 'POST') {
    return next();
  }

  if (!ctx.req.internal && this.config.internalOnly) {
    return ctx.done({ statusCode: 403, message: 'Forbidden' });
  }

  const options = ctx.body || {};



  this.client.createNotification(options).then(function (response) {
    ctx.done(null, {
      body: JSON.stringify(response.body),
      status: response.statusCode
    });
  }).catch(function (err) {
    console.log(err);
    ctx.done(err);
  });

}

/**
 * Module export
 */

module.exports = Onesignal;
