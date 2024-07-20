import HeaderController from '../controllers/HeaderController.js';
class TableComponent extends HTMLElement {
    constructor() {
        super();
        this.test = 'test';
        this._headersData = [];
    }

    loadHeadersData() {
        HeaderController.loadHeadersData((headers) => {
            this.headersData = headers;
        });
    }

    saveHeadersData() {
        HeaderController.saveHeadersData(this.headersData);
    }

    // Getter and setter
    get headersData() {
        return this._headersData;
    }

    set headersData(value) {
        this._headersData = value;
        this.render();
    }

    connectedCallback() {
        this.loadHeadersData();
        this.render();
        this.setupEventListeners();
    }

    // Event handling
    setupEventListeners() {
        this.addEventListener('change', this.handleRowEvent.bind(this));
        this.addEventListener('input', this.handleRowEvent.bind(this));
        this.addEventListener('click', this.handleRowEvent.bind(this));
        this.addEventListener('click', this.handleDeleteRow.bind(this));
        this.addEventListener('click', this.handleAddRow.bind(this));
    }

    handleRowEvent(event) {
        if (event.target.classList.contains('enableHeader') || event.target.classList.contains('headerName') || event.target.classList.contains('headerValue')) {
            this.updateHeaderData(event.target);
        }
    }

    handleDeleteRow(event) {
        if (event.target.matches('.deleteHeader, .deleteHeader *')) {
            this.deleteRow(event.target.closest('tr'));
        }
    }

    handleAddRow(event) {
        if (event.target.matches('.a8c-add__button, .a8c-add__button *')) {
            this.render();
        }
    }

    updateHeaderData(target) {
        const tr = target.closest('tr');
        const key = parseInt(tr.id.split('-')[1]);
        const header = this.headersData[key] || { enabled: false, name: '', value: '' };
        header.enabled = tr.querySelector('.enableHeader')?.checked || false;
        header.name = tr.querySelector('.headerName')?.value || '';
        header.value = tr.querySelector('.headerValue')?.value || '';
        this.headersData[key] = header;
        this.saveHeadersData();
    }

    deleteRow(tr) {
        const key = parseInt(tr.id.split('-')[1]);
        this.headersData.splice(key, 1);
        this.saveHeadersData();
        this.render();
    }

    // Utility function for row rendering
    createRow(key = 0, header = { enabled: false, name: '', value: '' }, isAddRow = false) {
        return `
        <tr id="tr-${key}">
            <td>
                <div class="checkbox-wrapper-13">
                    <input id="c1-13" type="checkbox" class="enableHeader" ${header?.enabled ? 'checked' : ''}>
                </div>
            </td>
            <td><input type="text" class="headerName" placeholder="x-your-header" value="${header?.name ? header.name : ''}"/></td>
            <td><input type="text" class="headerValue" placeholder="123" value="${header?.value ? header.value: ''}"/></td>
            <td>
                ${!isAddRow ? `
                    <button class="deleteHeader button--svg" data-row-id="${key}">
                        <!-- svg trash -->
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                        <defs>
                        </defs>
                        <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                            <path d="M 76.777 2.881 H 57.333 V 2.412 C 57.333 1.08 56.253 0 54.921 0 H 35.079 c -1.332 0 -2.412 1.08 -2.412 2.412 v 0.469 H 13.223 c -1.332 0 -2.412 1.08 -2.412 2.412 v 9.526 c 0 1.332 1.08 2.412 2.412 2.412 h 63.554 c 1.332 0 2.412 -1.08 2.412 -2.412 V 5.293 C 79.189 3.961 78.109 2.881 76.777 2.881 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                            <path d="M 73.153 22.119 H 16.847 c -1.332 0 -2.412 1.08 -2.412 2.412 v 63.057 c 0 1.332 1.08 2.412 2.412 2.412 h 56.306 c 1.332 0 2.412 -1.08 2.412 -2.412 V 24.531 C 75.565 23.199 74.485 22.119 73.153 22.119 z M 33.543 81.32 c 0 1.332 -1.08 2.412 -2.412 2.412 h -2.245 c -1.332 0 -2.412 -1.08 -2.412 -2.412 V 30.799 c 0 -1.332 1.08 -2.412 2.412 -2.412 h 2.245 c 1.332 0 2.412 1.08 2.412 2.412 V 81.32 z M 48.535 81.32 c 0 1.332 -1.08 2.412 -2.412 2.412 h -2.245 c -1.332 0 -2.412 -1.08 -2.412 -2.412 V 30.799 c 0 -1.332 1.08 -2.412 2.412 -2.412 h 2.245 c 1.332 0 2.412 1.08 2.412 2.412 V 81.32 z M 63.526 81.32 c 0 1.332 -1.08 2.412 -2.412 2.412 h -2.245 c -1.332 0 -2.412 -1.08 -2.412 -2.412 V 30.799 c 0 -1.332 1.08 -2.412 2.412 -2.412 h 2.245 c 1.332 0 2.412 1.08 2.412 2.412 V 81.32 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                        </g>
                        </svg>
                    </button>
                    ` : `
                    <button id="a8c-add__button" class="a8c-add__button button--svg" data-action="a8c-add__button"
                        data-tooltip="Add custom header" data-row-id="${key}">
                        <!-- svg plus -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    `}
            </td>
        </tr>
        `;
    }

    render() {
        this.innerHTML = `
        <table id="headersTable">
            <thead>
                <tr>
                    <th>Enable</th>
                    <th>Header</th>
                    <th>Value</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${this.headersData.map((header, key) => this.createRow(key, header)).join('')}
                ${this.createRow(this.headersData.length, {}, true)}
            </tbody>
        </table>
        `;
    }
}

customElements.define('table-component', TableComponent);

export default TableComponent;