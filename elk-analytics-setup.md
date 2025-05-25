# ELK Analytics Setup for Backstage

This document outlines how to configure the analytics plugin to send data to your ELK (Elasticsearch, Logstash, Kibana) stack.

## Environment Variables

You need to set the following environment variables:

```bash
# The URL of your ELK HTTP endpoint that will receive analytics events
# Example: https://logstash.example.com:8080/analytics
export ANALYTICS_ELK_HOST=https://your-elk-endpoint.example.com

# Interval in minutes to batch and ship logs (set to 0 for instant streaming)
# Default is 30 minutes if not specified
export ANALYTICS_ELK_INTERVAL=30

# If your ELK endpoint requires basic authentication, provide the token here
# Format: "username:password" encoded in base64
# Example: echo -n "user:pass" | base64
export ANALYTICS_ELK_AUTH=base64encodedtoken
```

## Verifying the Setup

1. Set the environment variables as shown above
2. Restart your Backstage instance
3. If you want to see debug information during development, set `debug: true` in the analyticsGeneric configuration

## Event Format

Events sent to ELK will have the following structure:

```json
{
  "action": "click",
  "subject": "button",
  "context": {
    "location": "/catalog",
    "pluginId": "catalog",
    "extension": "CatalogPage"
  },
  "attributes": {
    "customAttribute": "value"
  },
  "timestamp": "2023-01-01T00:00:00.000Z",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Elasticsearch Index Mapping

You may want to create an index mapping in Elasticsearch to properly handle the analytics data. Here's a suggested mapping:

```json
{
  "mappings": {
    "properties": {
      "action": { "type": "keyword" },
      "subject": { "type": "keyword" },
      "context": {
        "properties": {
          "location": { "type": "keyword" },
          "pluginId": { "type": "keyword" },
          "extension": { "type": "keyword" }
        }
      },
      "attributes": { "type": "object", "dynamic": true },
      "timestamp": { "type": "date" },
      "user": {
        "properties": {
          "name": { "type": "keyword" },
          "email": { "type": "keyword" }
        }
      }
    }
  }
}
```

## Troubleshooting

If you're not seeing data in your ELK stack:

1. Check that the `ANALYTICS_ELK_HOST` is correctly set and accessible from your Backstage instance
2. Set `debug: true` in the configuration to see events in the browser console
3. Check for CORS issues in your browser's developer tools
4. Verify that your ELK endpoint is correctly configured to receive HTTP POST requests 