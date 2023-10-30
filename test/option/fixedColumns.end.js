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
		_checkElements('start', left);
		_checkElements('end', right);
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('No column set by default', function() {
			expect($.fn.dataTable.FixedColumns.defaults.end).toBe(0);
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
						end: i
					}
				});

				checkElements(1, i);
			}
		});

		dt.html('basic');
		it('Ensure sensible when start columns disabled', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					start: 0,
					end: 2
				}
			});

			checkElements(0, 2);
		});
	});

	describe('Direction check', function() {
		dt.html('basic');

		it('Start with ltr is right', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					start: 0,
					end: 1
				}
			});

			let el = $('td.dtfc-fixed-end').eq(0);
			
			expect(el.css('left')).toBe('auto');
			expect(el.css('right')).toBe('0px');
		});

		dt.html('basic');

		it('Start with rtl is left', function() {
			$('html').attr('dir', 'rtl');

			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					start: 0,
					end: 1
				}
			});

			let el = $('td.dtfc-fixed-end').eq(0);
			
			expect(el.css('left')).toBe('0px');
			expect(el.css('right')).toBe('auto');

			$('html').attr('dir', '');
		});
	});
});
