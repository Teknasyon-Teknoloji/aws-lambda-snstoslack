const https = require('https');
const url = require('url');
var CONFIG = require("./config.json");

exports.handler = function(event, context) {
    (event.Records || []).forEach(function (rec) {
        if (rec.Sns) {
            var slackUrl = CONFIG[rec.Sns.TopicArn];
            if (slackUrl) {
                var slackReqOpts = url.parse(slackUrl);
                slackReqOpts.method = 'POST';
                slackReqOpts.headers = {'Content-Type': 'application/json'};
                var req = https.request(slackReqOpts, function (res) {
                    if (res.statusCode === 200) {
                        context.succeed('posted to slack');
                    } else {
                        context.fail('status code: ' + res.statusCode);
                    }
                });

                req.on('error', function(e) {
                    console.log('problem with request: ' + e.message);
                    context.fail(e.message);
                });
                req.write(JSON.stringify({text: JSON.stringify(rec.Sns.Message, null, '  ').replace(/<br\s*\/?>/mg,"\n")}));
                req.end();
            } else {
                context.fail('Slack url not found! TopicARN' + rec.Sns.TopicArn);
            }
        }
    });
};
