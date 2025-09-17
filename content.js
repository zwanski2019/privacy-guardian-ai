const trackingSignals = [];

scanForTrackers();

function scanForTrackers() {
  try {
    detectPixels();
    detectFingerprintingScripts();
    chrome.runtime.sendMessage({ type: 'PGAI_CONTENT_SCAN', payload: trackingSignals }).catch(() => undefined);
  } catch (error) {
    console.error('PGAI content script error', error);
  }
}

function detectPixels() {
  const pixels = [...document.querySelectorAll('img, iframe')].filter((el) => {
    const width = Number.parseInt(el.width || el.style.width || '0', 10);
    const height = Number.parseInt(el.height || el.style.height || '0', 10);
    return (width <= 1 && height <= 1) || el.className?.toLowerCase().includes('pixel');
  });

  pixels.forEach((el) => {
    trackingSignals.push({
      type: 'tracking-pixel',
      src: el.src,
      description: 'Potential tracking pixel detected on the page.'
    });
  });
}

function detectFingerprintingScripts() {
  const suspiciousKeywords = ['fingerprint', 'canvas', 'webrtc'];
  [...document.scripts].forEach((script) => {
    if (!script.src) {
      const text = script.textContent || '';
      const hits = suspiciousKeywords.filter((keyword) => text.includes(keyword));
      if (hits.length) {
        trackingSignals.push({
          type: 'fingerprinting-script',
          src: 'inline',
          description: Inline script references: 
        });
      }
      return;
    }

    const url = script.src;
    if (suspiciousKeywords.some((keyword) => url.includes(keyword))) {
      trackingSignals.push({
        type: 'fingerprinting-script',
        src: url,
        description: 'External fingerprinting-related script detected.'
      });
    }
  });
}
