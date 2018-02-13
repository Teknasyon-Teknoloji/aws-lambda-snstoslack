const https = require('https');
const url = require('url');
var CONFIG = require("./config.json");

exports.handler = function (event, context) {
    (event.Records || []).forEach(function (rec) {
        if (rec.Sns) {
            var topicConfig = CONFIG[rec.Sns.TopicArn];
            if (topicConfig) {
                var slackUrl = topicConfig['slackHookUrl'];
                var slackReqOpts = url.parse(slackUrl);
                var slackText = '';
                if (topicConfig['messageType'] === 'json') {
                    slackText = JSON.stringify(JSON.parse(rec.Sns.Message), null, '  ').replace(/<br\s*\/?>/mg, "\n");
                } else {
                    slackText = JSON.stringify(rec.Sns.Message, null, '  ').replace(/<br\s*\/?>/mg, "\n");
                }
                slackReqOpts.method = 'POST';
                slackReqOpts.headers = {'Content-Type': 'application/json'};
                var req = https.request(slackReqOpts, function (res) {
                    if (res.statusCode === 200) {
                        context.succeed('posted to slack');
                    } else {
                        context.fail('status code: ' + res.statusCode);
                    }
                });

                req.on('error', function (e) {
                    console.log('problem with request: ' + e.message);
                    context.fail(e.message);
                });
                req.write(JSON.stringify({text: slackText}));
                req.end();
            } else {
                context.fail('Slack url not found! TopicARN' + rec.Sns.TopicArn);
            }
        }
    });
};
