// options.js

document.addEventListener('DOMContentLoaded', function() {
    const syncCheckbox = document.getElementById('syncCheckbox');

    chrome.storage.sync.get('syncEnabled', function(data) {
        syncCheckbox.checked = data.syncEnabled || false;
    });

    syncCheckbox.addEventListener('change', function() {
        chrome.storage.sync.set({ syncEnabled: syncCheckbox.checked });
    });
});
