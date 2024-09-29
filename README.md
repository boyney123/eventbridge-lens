<div align="center">

<h1>EventBridgeLens</h1>
<p>A VSCode extension for Amazon EventBridge. Making your life easier.</p>

<img src="https://img.shields.io/github/actions/workflow/status/boyney123/eventbridge-lens/lint-and-test.yml"/>
[<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" height="20px" />](https://www.linkedin.com/in/david-boyne/) [![blog](https://img.shields.io/badge/blog-EDA--Visuals-brightgreen)](https://eda-visuals.boyney.io/?utm_source=event-catalog-gihub) 

<img alt="header" src="https://github.com/boyney123/eventbridge-lens/blob/main/images/cover.png?raw=true" />

<h4>Features: Visualize your Event Bus and Rules. 1 click open in AWS console, view rules and copy them. Explore archives and targets, and more...</h4>

</div>

# Features

## Amazon EventBridge

Unlock the potential of Amazon EventBridge. Gain instant insights with a single click, visualizing your event bus, rules, and targets effortlessly.

Dive deeper into your architecture and effortlessly get an understand of your producers, consumers and transformations of events.

### Visualize EventBridge Bus

- Visualize your event bus, rules, targets and input transformers
- Custom nodes per target, dive deeper into your architecture
- Visualize target dead-letter queues
- Visualize retry policies on targets

![Demo of extension](https://github.com/boyney123/eventbridge-lens/blob/main/images/eventbridge-rule.png?raw=true)

### Visualize EventBridge Rules

- Visualize your EventBridge rule and targets.
- See if rules are enabled/disabled
- Visualize dead-letter queues
- Visualize retry policies on targets.

![Visualize EventBridge Rule](https://github.com/boyney123/eventbridge-lens/blob/main/images/eventbridge.png?raw=true)

## Using the VSCode Extension

1. Install the extension from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=serverlessland.serverlessland-toolkit)
2. Load the extension, 
    - Authentication
        - Configure the extension (go to VS Code settings and search `eventbridgelens`)
            - Set the credentials path `eventbridgelens.credentialsPath`
            - Set the credentials profile `eventbridgelens.credentialsProfile`
            - Set the region `eventbridgelens.region`
    - Restart VS Code
3. Use the navigation pane to start exploring your EventBridge resources.
    - Expand resources
    - Click on Event Buses or Rules to visualise them
    - Right-click on any node to get more options.

### Future features

- Ability to raise events directly into your Event bus from VS Code
- Ability to share events between your teams, store in Git and replay

---

# Document your event-driven architectures

If you want to dive deeper and start to document your event-driven architecture check out this other project I'm working on called [EventCatalog](https://www.eventcatalog.dev/). [EventBridge integration coming soon](https://www.eventcatalog.dev/integrations).

![](https://github.com/event-catalog/eventcatalog/blob/main/images/example.png?raw=true)


### Contribuing

If you have any questions, features or issues please raise any issue or pull requests you like. We will try my best to get back to you.

_Note: Most of my free time is spent on EventCatalog. Please be patience if you have any issues_


### By me a coffee / Sponsor this project

If you like this extension and it helps you, feel free to sponsor my open source work https://github.com/sponsors/event-catalog.

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
