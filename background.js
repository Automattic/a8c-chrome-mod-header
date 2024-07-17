chrome.runtime.onInstalled.addListener(() => {
    updateRules();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateRules') {
        updateRules(message.customHeaders);
    }
});

function updateRules(customHeaders) {
    chrome.storage.sync.get(['customHeaders'], (data) => {
        try {
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
                    console.error("Error updating rules:", chrome.runtime.lastError);
                } else {
                    console.log("Rules updated successfully.");
                }
            });
        } catch (error) {
            console.error("Error parsing custom headers:", error);
        }
    });
}
