import {handlePreflight, authenticate, respond, verify, ingest} from '../../modules/ingest-log-item';

let bodyParser = require('body-parser');

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({extended: false}));

Picker.route('/api/v1/logs/ingest', function(params, request, response) {
  if (request.method === 'OPTIONS') {
    handlePreflight(response);
  } else {
    let applicationId = request.headers['x-application-id'];

    if (!applicationId || !authenticate(applicationId)) {
      respond(response, 403, '[403] Invalid Application ID.')
    } else {
      let body = request.body;
      body.applicationId = applicationId;

      if (body && verify(body)) {
        ingest(body);
        respond(response, 200, '[200] Log item received!');
      } else {
        respond(response, 200, '[403] Invalid log item. Check your parameters.');
      }
    }
  }
})

Picker.route('/api/v1/contact', function(params, request, response) {
  if (request.method != 'GET') {
    respond(response, 403, '[403] Method not Supported')
  } else {
    respond(response, 200, Meteor.settings.private.applicationId);
  }
})
