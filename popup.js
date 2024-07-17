document.getElementById('reloadPage').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
});

// on a8c-delete-all__button click, delete all headers
document.getElementById('a8c-delete-all__button').addEventListener('click', function () {
    chrome.storage.local.clear(function() {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        } else {
          console.log('Local storage cleared.');
        }
      });
    
      chrome.storage.sync.clear(function() {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        } else {
          console.log('Sync storage cleared.');
        }
      });
});

// dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode');
    chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
});

// restore dark mode setting
chrome.storage.sync.get(['darkMode'], (data) => {
    if (data.darkMode) {
        darkModeToggle.checked = data.darkMode;
        document.body.classList.add('dark-mode');
    }
});