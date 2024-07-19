chrome.runtime.onInstalled.addListener(() => {
    updateRules();
    console.log('Extension installed.');
});

// on activate plugin, update rules.
chrome.runtime.onStartup.addListener(() => {
    updateRules();
    console.log('Extension started.');
});

// on update plugin, update rules.
chrome.runtime.onUpdateAvailable.addListener(() => {
    updateRules();
    console.log('Extension updated.');
});

// on click, set icon and popup. Click twice to open popup. Activates exisiting rules on first click. see: https://developer.chrome.com/docs/extensions/reference/action/#onClicked
chrome.action.onClicked.addListener(() => {
    chrome.action.setIcon({ path: 'icons/icon-active48.png' });
    chrome.action.setPopup({ popup: 'popup.html' });
});

// on storage change, update rules.
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.disablePlugin && changes.disablePlugin.newValue === false) {
        chrome.action.setIcon({ path: 'icons/icon-active48.png' });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateRules') {
        updateRules(message.customHeaders);
    }
});

function updateRules(customHeaders) {
    console.log('Updating rules...');

    chrome.storage.sync.get(['customHeaders', 'disablePlugin'], (data) => {

        try {

            // Check if the plugin is disabled.
            if (data.disablePlugin) {
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [1], // Ensure this matches the IDs you intend to remove
                    addRules: []
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error updating rules:", chrome.runtime.lastError);
                    } else {
                        console.log("Rules updated successfully.");
                    }
                });

                // set icon to disabled.
                chrome.action.setIcon({ path: 'icons/icon-disabled48.png' });
            } else {
                // Create headers array.
                const headers = data.customHeaders ? JSON.parse(data.customHeaders) : [];
                const requestHeaders = headers
                    .filter(header => header.enabled)
                    .map(header => ({ "header": header.name.trim(), "operation": "set", "value": header.value }));

                // Clear existing rules and set new ones.
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [1], // Ensure this matches the IDs you intend to remove
                    addRules: requestHeaders.length ? [{
                        "id": 1,
                        "priority": 1,
                        "action": {
                            "type": "modifyHeaders",
                            "requestHeaders": requestHeaders
                        },
                        "condition": {
                            "urlFilter": "|http*://*/*", // Matches all HTTP and HTTPS URLs
                            "resourceTypes": ["main_frame", "sub_frame", "xmlhttprequest"]
                        }
                    }] : []
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error updating rules:" + chrome.runtime.lastError);
                    } else {
                        console.log("Rules updated successfully.");
                    }
                });

            }

        } catch (error) {
            console.error("Error parsing custom headers:", error);
        }

    });
}
