// Import the necessary libraries for testing
const fs = require('fs');
const { JSDOM } = require('jsdom');

// Setup the DOM environment for the custom element
const html = fs.readFileSync('./popup.html', 'utf8'); // Update with the correct path to your HTML file
const dom = new JSDOM(html);
global.window = dom.window;
global.document = window.document;
global.customElements = window.customElements;
global.HTMLElement = window.HTMLElement;
global.Event = window.Event;
