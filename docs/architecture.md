# Privacy Guardian AI · Architecture Overview

## High-Level Components
- **Background Service Worker (ackground.js)**: Aggregates network telemetry via chrome.webRequest, manages storage, and dispatches updates.
- **Content Script (content.js)**: Performs in-page scanning for tracking pixels, fingerprinting scripts, and other DOM-based privacy signals.
- **Popup Dashboard (popup.html / popup.js)**: Offers real-time snapshot of recent connections and AI-generated privacy insights.
- **Options Page (options.html / options.js)**: Persists user preferences, feature toggles, and AI integration settings.

## Data Flow
1. webRequest events trigger connection parsing in the background worker.
2. Connection entries are persisted to chrome.storage.local and broadcast to the popup via runtime messages.
3. Popup requests AI analysis, which currently returns placeholder data until the Prompt API becomes available.
4. Content script pushes DOM privacy signals back to the background worker for consolidation (future work).

## AI Integration Plan
- **Prompt API**: Map aggregated connection data to prompt templates for risk assessment.
- **Summarizer API**: Supply detected privacy policies or terms pages from the active tab.
- **Translator API**: Offer localized insights for the user-selected language in options.
- **Writer & Rewriter APIs**: Generate shareable reports and simplify technical jargon.

## Storage Schema
`
chrome.storage.local
├── pgai:connections -> ConnectionEntry[]
└── pgai:settings    -> UserPreference
`

## Security Considerations
- Limit permissions to required surfaces once APIs stabilize.
- Anonymize user data before any cloud-bound requests.
- Provide transparent consent messaging in options UI and documentation.

## Future Enhancements
- Replace placeholder AI functions with real API client modules once available.
- Implement privacy score gamification and timeline visualization in popup.
- Add automated tests (Jest + Puppeteer) for regression coverage.
