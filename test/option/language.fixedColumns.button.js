describe('fixedColumns - language.fixedColumns.button', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'fixedcolumns'],
		css: ['datatables', 'buttons', 'fixedcolumns']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check the defaults', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				scrollX: true,
				buttons: ['fixedColumns']
			});

			expect($('.dt-buttons button').text()).toBe('FixedColumns');
		});

		dt.html('basic');
		it('Change language setting', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				scrollX: true,
				language: {
					buttons: {
						fixedColumns: 'test1'
					}
				},
				buttons: ['fixedColumns']
			});

			expect($('.dt-buttons button').text()).toBe('test1');
		});

		// DD-2157
		dt.html('basic');
		it('TK COLIN - see who wins between language and button', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				scrollX: true,
				language: {
					buttons: {
						fixedColumns: 'language'
					}
				},
				buttons: [{
					extend: 'fixedColumns',
					text: 'button'
				}]
			});

			expect($('.dt-buttons button').text()).toBe('button');
		});
	});
});
