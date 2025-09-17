# Privacy Guardian AI

Chrome extension that surfaces real-time privacy insights, detects tracking behaviors, and leverages Chrome's built-in AI APIs for actionable recommendations.

## ✨ Highlights
- Tracks browser connections with the webRequest API and surfaces them in a live dashboard.
- Detects privacy red flags on-page (tracking pixels, fingerprinting scripts, etc.).
- Provides AI-ready scaffolding for Prompt, Summarizer, Translator, Writer, and Rewriter APIs.
- Ships with a planning roadmap, architectural overview, and configurable settings page.

## 🛠️ Project Structure
`
Privacy Guardian AI/
├── background.js          # Service worker: network monitoring + AI requests
├── content.js             # DOM scanner for trackers and fingerprinting signals
├── manifest.json          # Chrome Extension Manifest V3 configuration
├── popup.html/js/css      # Real-time privacy dashboard UI
├── options.html/js        # User preferences & AI toggle management
├── icons/                 # Extension icon assets
└── docs/                  # Roadmap and architecture deep-dives
`

## 🚀 Getting Started
1. Enable Chrome Developer mode (chrome://extensions/).
2. Click **Load unpacked** and select this project folder.
3. Interact with sites to populate the connection log, then open the popup.
4. Use the **Refresh** button to request updated AI analysis and connection data.

## 🧠 AI Integration Checklist
- [ ] Prompt API: Risk analysis for recent connections
- [ ] Summarizer API: TL;DR for detected privacy policies
- [ ] Translator API: Localize insights based on user preference
- [ ] Writer API: Generate privacy reports for export
- [ ] Rewriter API: Simplify technical jargon for end users

Each API call should respect user consent and anonymize data before leaving the device. Use the placeholders in ackground.js as integration starting points.

## 📅 Delivery Roadmap
A detailed, phase-by-phase plan is available in [docs/roadmap.md](docs/roadmap.md). Start there to coordinate hackathon milestones and ensure all deliverables (demo video, documentation, release assets) ship on time.

## 📐 Architecture & Security
Review [docs/architecture.md](docs/architecture.md) for data flow, storage schema, and security considerations. As Chrome's AI APIs stabilize, replace the placeholder analysis logic with real API client calls and add automated regression coverage.

## 🤝 Contributing
1. Fork the repository (or create one with gh repo create privacy-guardian-ai).
2. Create a feature branch and commit changes with conventional commit messages.
3. Submit a PR with screenshots/GIFs of new UI flows.

## 📄 License
MIT License (add LICENSE file before publishing).

## 📺 Next Steps for Submission
- Produce a 3-minute demo showing installation, monitoring, and AI insights.
- Capture dashboard screenshots for the Chrome Web Store listing.
- Publish the built extension (CRX or Web Store draft) ahead of the hackathon deadline.

Happy hacking! 🚀
