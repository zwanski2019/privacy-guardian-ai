const connectionList = document.getElementById('connection-list');
const analysisSummary = document.getElementById('analysis-summary');
const analysisRisks = document.getElementById('analysis-risks');
const reportStatus = document.getElementById('report-status');
const refreshBtn = document.getElementById('refresh');
const optionsBtn = document.getElementById('open-options');
const reportBtn = document.getElementById('generate-report');

refreshBtn.addEventListener('click', refreshData);
optionsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());
reportBtn.addEventListener('click', generateReport);

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'PGAI_CONNECTION_UPDATE') {
    prependConnection(message.payload);
  }
});

await refreshData();

async function refreshData() {
  toggleLoading(true);
  const [connections, analysis] = await Promise.all([
    fetchConnections(),
    requestAnalysis()
  ]);

  renderConnections(connections ?? []);
  renderAnalysis(analysis);
  toggleLoading(false);
}

async function generateReport() {
  reportStatus.textContent = 'Generating report…';
  reportBtn.disabled = true;
  try {
    const analysis = await requestAnalysis();
    const report = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'PGAI_GENERATE_REPORT', payload: analysis }, (response) => {
        resolve(response?.payload ?? 'Report generation unavailable.');
      });
    });

    reportStatus.textContent = typeof report === 'string' ? report : JSON.stringify(report, null, 2);
  } finally {
    reportBtn.disabled = false;
  }
}

function renderConnections(connections) {
  connectionList.innerHTML = '';
  if (!connections.length) {
    const li = document.createElement('li');
    li.textContent = 'No recent connections logged yet.';
    connectionList.append(li);
    return;
  }

  connections.slice(0, 15).forEach((entry) => prependConnection(entry, false));
}

function prependConnection(entry, addToTop = true) {
  const li = document.createElement('li');
  li.className = 'connection-item';
  li.innerHTML = 
    <strong> → </strong>
    <span>Status:  • Type:  • Initiator: </span>
  ;

  if (addToTop) {
    connectionList.prepend(li);
  } else {
    connectionList.append(li);
  }
}

function renderAnalysis(analysis) {
  if (!analysis) {
    analysisSummary.textContent = 'AI analysis pending…';
    analysisRisks.innerHTML = '';
    return;
  }

  analysisSummary.textContent = analysis.summary;
  analysisRisks.innerHTML = '';
  analysis.risks?.forEach((risk) => {
    const li = document.createElement('li');
    li.innerHTML = <strong></strong><span></span>;
    analysisRisks.append(li);
  });
}

function truncate(text, max = 60) {
  return text.length > max ? ${text.slice(0, max)}… : text;
}

function fetchConnections() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'PGAI_GET_CONNECTIONS' }, (response) => {
      resolve(response?.payload ?? []);
    });
  });
}

function requestAnalysis() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'PGAI_ANALYZE_CONNECTIONS' }, (response) => {
      resolve(response?.payload ?? null);
    });
  });
}

function toggleLoading(isLoading) {
  refreshBtn.disabled = isLoading;
  if (isLoading) {
    analysisSummary.textContent = 'Refreshing analysis…';
  }
}
