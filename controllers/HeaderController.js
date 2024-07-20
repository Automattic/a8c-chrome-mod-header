class HeaderController {
    static loadHeadersData(callback) {
        chrome.storage.sync.get(['customHeaders'], (data) => {
            if (data.customHeaders) {
                const headers = JSON.parse(data.customHeaders);
                callback(headers || []);
            } else {
                callback([]);
            }
        });
    }

    static saveHeadersData(headersData, callback) {
        chrome.storage.sync.set({ customHeaders: JSON.stringify(headersData) }, () => {
            chrome.runtime.sendMessage({ type: 'updateRules', customHeaders: headersData });
            if (callback) callback();
        });
    }
}

export default HeaderController;
