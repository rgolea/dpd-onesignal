/**
 * Module dependencies
 */

var Resource = require('deployd/lib/resource'),
  util = require('util'),
  OneSignal = require('onesignal-node');

/**
 * Module setup.
 */

function Onesignal() {

  Resource.apply(this, arguments);

  this.transport.use('compile', htmlToText({}));
  this.client = Onesignal.Client(this.config.appId, this.confg.apiKey);

}

util.inherits(Onesignal, Resource);

OneSignal.prototype.clientGeneration = true;

OneSignal.basicDashboard = {
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

OneSignal.prototype.handle = function (ctx, next) {

  if (ctx.req && ctx.req.method !== 'POST') {
    return next();
  }

  if (!ctx.req.internal && this.config.internalOnly) {
    return ctx.done({ statusCode: 403, message: 'Forbidden' });
  }

  const options = ctx.body || {};



  this.client.sendMessage(options).then(function (response) {
    ctx.done(null, response);
  }).catch(function (err) {
    ctx.done(err);
  });

}

/**
 * Module export
 */

module.exports = Onesignal;
