describe('fixedColumns - rightColumns', function() {
	// TK COLIN need to add test to confirm user interaction
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'fixedcolumns'],
		css: ['datatables', 'fixedcolumns']
	});

	function _checkElements(side, expected) {
		expect($('td.dtfc-fixed-' + side).length).toBe(expected * 10);
	}

	function checkElements(left, right) {
		_checkElements('left', left);
		_checkElements('right', right);
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('No column set by default', function() {
			expect($.fn.dataTable.FixedColumns.defaults.right).toBe(0);
		});

		it('None specified', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: true
			});

			checkElements(1, 0);
		});
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Cycle through all columns', function() {
			for (let i = 0; i <= 5; i++) {
				table = $('#example').DataTable({
					destroy: true,
					scrollX: true,
					fixedColumns: {
						rightColumns: i
					}
				});

				checkElements(1, i);
			}
		});

		dt.html('basic');
		it('Ensure sensible when left columns disabled', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					leftColumns: 0,
					rightColumns: 2
				}
			});

			checkElements(0, 2);
		});
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Cycle through all columns', function() {
			for (let i = 0; i <= 5; i++) {
				table = $('#example').DataTable({
					destroy: true,
					scrollX: true,
					fixedColumns: {
						right: i
					}
				});

				checkElements(1, i);
			}
		});

		dt.html('basic');
		it('Ensure sensible when left columns disabled', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					left: 0,
					right: 2
				}
			});

			checkElements(0, 2);
		});
	});
});
