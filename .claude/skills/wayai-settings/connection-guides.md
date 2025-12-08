# Connection Setup Guides

Connections contain credentials and require browser-based setup. Guide users through these steps.

## WhatsApp Business

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "WhatsApp Business"
3. You'll be redirected to Meta Business
4. Log in with your Meta Business account
5. Select or create a WhatsApp Business Account
6. Authorize WayAI to send messages
7. Return to WayAI - connection should show as "Active"
```

**Troubleshooting:**
- Ensure you have a Meta Business account
- WhatsApp Business API requires a verified business
- Phone number must not be registered with regular WhatsApp

## Webhook

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "Webhook"
3. Enter a display name (e.g., "POS System")
4. Enter the base URL (e.g., "https://api.yourpos.com")
5. Add any required headers (API keys, auth tokens)
6. Click "Save"
```

**Custom tools using webhooks:**
```yaml
tools:
  custom:
    - name: "create_order"
      description: "Creates order in POS"
      method: POST
      connection_type: webhook
      endpoint_path: "/orders"  # Appended to base URL
```

## Google Calendar

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "Google Calendar"
3. Sign in with your Google account
4. Authorize WayAI to access your calendar
5. Select which calendars to use
6. Return to WayAI
```

## Email (Gmail)

```
1. Go to wayai.pro → Your Hub → Settings → Connections
2. Click "Add Connection" → "Gmail"
3. Sign in with your Google account
4. Authorize WayAI to send emails on your behalf
5. Return to WayAI
```

**Note:** For business email, ensure your Google Workspace admin allows third-party app access.
