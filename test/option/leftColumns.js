describe('fixedColumns - leftColumns', function() {
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
		it('Single column set by default', function() {
			expect($.fn.dataTable.FixedColumns.defaults.left).toBe(1);
		});

		it('None specified', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: true
			});

			checkElements(1, 0);
		});
	});

	// deprecated options
	describe('Check the defaults', function() {
		dt.html('basic');
		it('Cycle through all columns', function() {
			for (let i = 1; i <= 6; i++) {
				table = $('#example').DataTable({
					destroy: true,
					scrollX: true,
					fixedColumns: {
						leftColumns: i
					}
				});

				checkElements(i, 0);
			}
		});

		dt.html('basic');
		it('Ensure sensible when right columns also used', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					leftColumns: 2,
					rightColumns: 1
				}
			});

			checkElements(2, 1);
		});
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Cycle through all columns', function() {
			for (let i = 1; i <= 6; i++) {
				table = $('#example').DataTable({
					destroy: true,
					scrollX: true,
					fixedColumns: {
						left: i
					}
				});

				checkElements(i, 0);
			}
		});

		dt.html('basic');
		it('Ensure sensible when right columns also used', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					left: 2,
					right: 1
				}
			});

			checkElements(2, 1);
		});
	});
});
