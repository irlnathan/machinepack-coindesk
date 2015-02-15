module.exports = {
  friendlyName: 'Get CoinDesk Bitcoin Price Index',
  description: 'Display CoinDesk bitcoin price index.',
  extendedDescription: '',
  inputs: {
    currency: {
      example: 'USD',
      description: 'The currency used to calculate the price of the index.'
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: 'Returns the current CoinDesk Bitcoin Price Index.',
      example: {
        code: 'USD',
        symbol: '&#36;',
        rate: '244.0021',
        description: 'United States Dollar',
        rate_float: 244.0021
      }
    }
  },
  fn: function(inputs, exits) {
    var util = require('util');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    Http.sendHttpRequest({
      baseUrl: 'https://api.coindesk.com',
      url: '/v1/bpi/currentprice.json',
      method: 'get',
      params: {}
    }).exec({
      success: function(httpResponse) {
        // Parse response body and build up result.
        var responseBody;
        try {
          responseBody = JSON.parse(httpResponse.body);

          console.log(responseBody);

          if (inputs.currency === 'USD') {
            return exits.success(responseBody.bpi.USD);
          }

          if (inputs.currency === 'GBP') {
            return exits.success(responseBody.bpi.GBP);
          }

          if (inputs.currency === 'EUR') {
            return exits.success(responseBody.bpi.EUR);
          }

          return exits.success(responseBody.bpi.USD);
        } catch (e) {
          return exits.error('Unexpected response from the CoinDesk API:\n' + util.inspect(responseBody, false, null) + '\nParse error:\n' + util.inspect(e));
        }
      },
      // An unexpected error occurred.
      error: function(err) {
        return exits.error(err);
      }
    });
  }
}