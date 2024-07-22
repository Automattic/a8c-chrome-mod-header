document.getElementById('reload-page').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
});

// on a8c-delete-all-button click, delete all headers
document.getElementById('a8c-delete-all-button').addEventListener('click', function () {
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

// restore settings from storage on popup open.
chrome.storage.sync.get(['darkMode', 'disablePlugin'], (data) => {
  if (data.darkMode) {
      darkModeToggle.checked = data.darkMode;
      document.body.classList.add('dark-mode');
  }

  if (data.disablePlugin) {
      disablePluginToggle.checked = data.disablePlugin;
  }

});

// dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode');
    chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
});

// on #disable-plugin change, disable the plugin
const disablePluginToggle = document.getElementById('disable-plugin');
disablePluginToggle.addEventListener('change', function (e) {
    chrome.storage.sync.set({ disablePlugin: disablePluginToggle.checked }, function () {
        chrome.runtime.sendMessage({ type: 'updateRules', disablePlugin: disablePluginToggle.checked });
    } );
});
