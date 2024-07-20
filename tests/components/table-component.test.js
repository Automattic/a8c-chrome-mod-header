import '../../test-setup.js';
import TableComponent from '../../components/table-component.js';
import HeaderController from '../../controllers/HeaderController.js';

// mock HeaderController
jest.mock('../../controllers/HeaderController.js', () => ({
    loadHeadersData: jest.fn().mockImplementation((callback) => {
        callback([{"enabled":true,"name":"x-test-header","value":"123"},{"enabled":false,"name":"x-test-header-2","value":"321"}]);
    }),
    saveHeadersData: jest.fn().mockImplementation((data, callback) => {
        if ( callback ) callback();
    })
}));

describe('TableComponent', () => {

    let tableComponentEl;

    // Setup
    beforeEach(() => {
        tableComponentEl = document.createElement('table-component');
        document.body.appendChild(tableComponentEl);
    });

    // Cleanup
    afterEach(() => {
        // Remove the custom element
        document.body.innerHTML = '';
    });

    test('should load headers data on instantiation', () => {
        expect(HeaderController.loadHeadersData).toHaveBeenCalled();
        expect( tableComponentEl.headersData ).toEqual([{"enabled":true,"name":"x-test-header","value":"123"},{"enabled":false,"name":"x-test-header-2","value":"321"}]);
    });

    test('should save headers data', () => {
        tableComponentEl.headersData = [{"enabled":true,"name":"x-test-header","value":"123"},{"enabled":false,"name":"x-test-header-2","value":"321"}];
        tableComponentEl.saveHeadersData();

        expect(HeaderController.saveHeadersData).toHaveBeenCalled();
    });

    test('should render the table', () => {
        tableComponentEl.headersData = [{"enabled":true,"name":"x-test-header","value":"123"},{"enabled":false,"name":"x-test-header-2","value":"321"}];

        const table = tableComponentEl.querySelector('table');
        expect(table).not.toBeNull();

        const rows = table.querySelectorAll('tr');
        expect(rows.length).toBe(4); // 2 rows + 1 header row + 1 add row
    });

    test('should update header data', () => {

        // headersData is already loaded. Let's update the first row.
        const input = tableComponentEl.querySelector('#tr-0 .headerName');
        input.value = 'new-header';
        input.dispatchEvent(new Event('input'));

        expect(tableComponentEl.headersData[0].name).toBe('new-header');
    });

    test('should delete a row', () => {

        // headersData is already loaded. Let's delete the first row.
        const deleteButton = tableComponentEl.querySelector('#tr-0 .deleteHeader');
        deleteButton.click();

        expect(tableComponentEl.headersData.length).toBe(1);
    });

    test('should add a row', () => {

        // headersData is already loaded. Let's add a row.
        const addButton = tableComponentEl.querySelector('.a8c-add__button');
        addButton.click();

        expect(tableComponentEl.headersData.length).toBe(3);
    });

});