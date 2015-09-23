var fs = require('fs');
var OAuth = require('oauth').OAuth;

exports.handler = function(event, context) {
    var configJSON;
    var config;
    
    configJSON = fs.readFileSync('config.json', {encoding: 'utf-8'});
    config = JSON.parse(configJSON);

    if (!config) return context.fail('Failed to read configuration');
    
    var oauth = new OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      config.consumer_key,
      config.consumer_secret,
      "1.0",
      config.callbackURI,
      "HMAC-SHA1"
    );

    if (event.type == 'request_token') {
        oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
            if (error) {
              return context.fail(error);
            }
            else {
              context.succeed({
                token: oauth_token,
                token_secret: oauth_token_secret
              });
            }
          });
    }   
    else if (event.type == 'auth_token') {
        oauth.getOAuthAccessToken(
          event.token,
          event.token_secret,
          event.verifier,
          function(error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
              return context.fail(error);
            }
            else {
                context.succeed({
                    access_token: oauth_access_token,
                    access_token_secret: oauth_access_token_secret
                });
            }
          }
        );
    }
    else if (event.type == 'user_data') {
        oauth.get(
          "https://api.twitter.com/1.1/account/verify_credentials.json",
          event.access_token, event.access_secret,
          function(error, data) {
            if(error) {
                return context.fail("FAILURE: " + require('sys').inspect(error))
            }
            else {
                context.succeed(data);
            }
          }
        );
    }
    else {
        return context.fail("type not recognized ( request_token or auth_token )");
    }
};

