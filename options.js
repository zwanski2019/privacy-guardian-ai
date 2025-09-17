const STORAGE_KEY = 'pgai:settings';
const status = document.getElementById('status');
const controls = {
  risk: document.getElementById('enable-risk-scoring'),
  translate: document.getElementById('auto-translate'),
  reports: document.getElementById('weekly-reports')
};

document.getElementById('save').addEventListener('click', saveSettings);

init();

async function init() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const settings = stored[STORAGE_KEY] ?? {};
  controls.risk.checked = Boolean(settings.risk);
  controls.translate.checked = Boolean(settings.translate);
  controls.reports.checked = Boolean(settings.reports);
}

async function saveSettings() {
  const payload = {
    risk: controls.risk.checked,
    translate: controls.translate.checked,
    reports: controls.reports.checked
  };

  await chrome.storage.local.set({ [STORAGE_KEY]: payload });
  status.textContent = 'Settings saved. AI integrations will activate when APIs are available.';
  setTimeout(() => {
    status.textContent = '';
  }, 4000);
}
