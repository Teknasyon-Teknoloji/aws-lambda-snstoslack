# AWS Lambda : Send SNS Message to Slack 
Pair SNS topic arn with Slack hook url and send sns message to configured slack channel.

## Config
You should edit config.json

```
{
  "topic1-arn":
  {
    "slackHookUrl":"slack-hook1",
    "messageType":"json"
  },
  "topic2-arn":
  {
    "slackHookUrl":"slack-hook2",
    "messageType":"txt"
  }
}
```

If you give "messageType" as "json", Sns message will be parsed wtih ***JSON.parse()***

## Contributing
You can contribute by forking the repo and creating pull requests. You can also create issues or feature requests.

## Disclaimer
Your AWS Lambda and SNS usage my be charged. Please check AWS pricing pages.

## License
This project is licensed under the MIT license. `LICENSE` file can be found in this repository.
