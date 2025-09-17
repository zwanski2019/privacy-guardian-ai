import { analyzeWithPromptAPI, generateReport, rewriteForClarity } from './ai/index.js';

const PRIVACY_STORE_KEY = 'pgai:connections';
const MAX_LOG_ENTRIES = 250;

const connectionLog = [];

chrome.runtime.onInstalled.addListener(() => {
  console.info('Privacy Guardian AI installed. Initializing background service worker.');
  chrome.storage.local.set({ [PRIVACY_STORE_KEY]: [] });
});

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const entry = buildConnectionEntry(details);
    connectionLog.unshift(entry);
    if (connectionLog.length > MAX_LOG_ENTRIES) {
      connectionLog.length = MAX_LOG_ENTRIES;
    }

    await chrome.storage.local.set({ [PRIVACY_STORE_KEY]: connectionLog });
    chrome.runtime.sendMessage({ type: 'PGAI_CONNECTION_UPDATE', payload: entry }).catch(() => {
      // Ignore when no listeners are available.
    });
  },
  { urls: ['<all_urls>'] }
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !message.type) {
    return;
  }

  switch (message.type) {
    case 'PGAI_GET_CONNECTIONS':
      sendResponse({ success: true, payload: connectionLog });
      break;
    case 'PGAI_ANALYZE_CONNECTIONS':
      handleAnalysisRequest(message.payload)
        .then((analysis) => sendResponse({ success: true, payload: analysis }))
        .catch((error) => {
          console.error('Analysis error', error);
          sendResponse({ success: false, error: error?.message ?? 'Unknown analysis error' });
        });
      return true;
    case 'PGAI_GENERATE_REPORT':
      handleReportRequest(message.payload)
        .then((report) => sendResponse({ success: true, payload: report }))
        .catch((error) => {
          console.error('Report generation error', error);
          sendResponse({ success: false, error: error?.message ?? 'Writer API unavailable' });
        });
      return true;
    default:
      break;
  }
});

async function handleAnalysisRequest(connections) {
  if (!connections?.length) {
    return { summary: 'No recent connections to analyze.', risks: [] };
  }

  const defaultAnalysis = fallbackAnalysis(connections);

  try {
    const promptResult = await analyzeWithPromptAPI(connections);
    if (promptResult) {
      return normalizePromptResult(promptResult, connections);
    }
  } catch (error) {
    console.warn('Prompt API unavailable, using fallback analysis.', error);
  }

  return defaultAnalysis;
}

async function handleReportRequest(analysis) {
  const report = await generateReport(analysis);
  return rewriteForClarity(report);
}

function buildConnectionEntry(details) {
  return {
    id: crypto.randomUUID(),
    url: details.url,
    method: details.method,
    type: details.type,
    statusCode: details.statusCode,
    timeStamp: details.timeStamp,
    ip: details.ip ?? 'n/a',
    initiator: details.initiator ?? 'unknown'
  };
}

function fallbackAnalysis(connections) {
  const topHosts = summarizeHosts(connections);

  return {
    summary: Analyzed  recent connections. Notable hosts: .,
    risks: connections.slice(0, 5).map((entry) => ({
      id: entry.id,
      url: entry.url,
      risk: 'pending-ai-review',
      notes: 'AI risk analysis placeholder. Replace with Chrome Prompt API call.'
    }))
  };
}

function summarizeHosts(connections) {
  const hostCounts = connections.reduce((acc, entry) => {
    try {
      const host = new URL(entry.url).host;
      acc[host] = (acc[host] ?? 0) + 1;
    } catch (error) {
      acc['invalid-url'] = (acc['invalid-url'] ?? 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(hostCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([host, count]) => ${host} ())
    .join(', ');
}

function normalizePromptResult(result, connections) {
  if (typeof result === 'string') {
    return { summary: result, risks: [] };
  }

  if (result?.risks) {
    return result;
  }

  return {
    summary: result?.summary ?? 'AI analysis completed.',
    risks: (result?.highRiskConnections ?? connections.slice(0, 3)).map((entry) => ({
      id: entry.id,
      url: entry.url,
      risk: entry.risk ?? 'ai-flagged',
      notes: entry.notes ?? 'Highlighted by AI analysis.'
    }))
  };
}
