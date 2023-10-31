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

	function checkElements(start, end, left, right) {
		_checkElements('start', start);
		_checkElements('end', end);
		_checkElements('left', left);
		_checkElements('right', right);
	}

	describe('Check the defaults', function() {
		dt.html('basic_wide');
		it('Single column set by default', function() {
			expect($.fn.dataTable.FixedColumns.defaults.start).toBe(1);
		});

		it('None specified', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: true
			});

			checkElements(1, 0, 1, 0);
		});
	});


	describe('Check the defaults', function() {
		dt.html('basic_wide');
		it('Cycle through all columns', function() {
			for (let i = 1; i <= 6; i++) {
				table = $('#example').DataTable({
					destroy: true,
					scrollX: true,
					fixedColumns: {
						start: i
					}
				});

				checkElements(i, 0, i, 0);
			}
		});

		dt.html('basic_wide');
		it('Ensure sensible when end columns also used', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					start: 2,
					end: 1
				}
			});

			checkElements(2, 1, 2, 1);
		});
	});

	describe('Direction check', function() {
		dt.html('basic_wide');

		it('Start with ltr is left', function() {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					start: 1
				}
			});

			let el = $('td.dtfc-fixed-start').eq(0);
			
			expect(el.css('left')).toBe('0px');
			expect(el.css('right')).toBe('auto');

			checkElements(1, 0, 1, 0);
		});

		dt.html('basic_wide');

		it('Start with rtl is right', function() {
			$('html').attr('dir', 'rtl');

			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					start: 1
				}
			});

			let el = $('td.dtfc-fixed-start').eq(0);
			
			expect(el.css('left')).toBe('auto');
			expect(el.css('right')).toBe('0px');

			checkElements(1, 0, 0, 1);

			$('html').attr('dir', '');
		});
	});

	describe('Table classes', function() {
		dt.html('basic_wide');

		it('Initialisation', function(done) {
			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: true
			});

			setTimeout(function () {
				expect($('#example').hasClass('dtfc-has-start')).toBe(true);
				expect($('#example').hasClass('dtfc-has-end')).toBe(false);
				expect($('#example').hasClass('dtfc-has-left')).toBe(true);
				expect($('#example').hasClass('dtfc-has-right')).toBe(false);

				expect($('#example').hasClass('dtfc-scrolling-start')).toBe(false);
				expect($('#example').hasClass('dtfc-scrolling-end')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-left')).toBe(false);
				expect($('#example').hasClass('dtfc-scrolling-right')).toBe(true);

				done();
			});
		});

		it('Scrolling', function(done) {
			$('div.dt-scroll-body').scrollLeft(10);

			setTimeout(function () {
				expect($('#example').hasClass('dtfc-has-start')).toBe(true);
				expect($('#example').hasClass('dtfc-has-end')).toBe(false);
				expect($('#example').hasClass('dtfc-has-left')).toBe(true);
				expect($('#example').hasClass('dtfc-has-right')).toBe(false);

				expect($('#example').hasClass('dtfc-scrolling-start')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-end')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-left')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-right')).toBe(true);

				done();
			}, 100);
		});

		dt.html('basic_wide');

		it('RTL - Initialisation', function(done) {
			$('html').attr('dir', 'rtl');

			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: true
			});

			setTimeout(function () {
				expect($('#example').hasClass('dtfc-has-start')).toBe(true);
				expect($('#example').hasClass('dtfc-has-end')).toBe(false);
				expect($('#example').hasClass('dtfc-has-left')).toBe(false);
				expect($('#example').hasClass('dtfc-has-right')).toBe(true);

				expect($('#example').hasClass('dtfc-scrolling-start')).toBe(false);
				expect($('#example').hasClass('dtfc-scrolling-end')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-left')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-right')).toBe(false);

				done();
			});
		});

		it('RTL - Scrolling', function(done) {
			$('div.dt-scroll-body').scrollLeft(-10);

			setTimeout(function () {
				expect($('#example').hasClass('dtfc-has-start')).toBe(true);
				expect($('#example').hasClass('dtfc-has-end')).toBe(false);
				expect($('#example').hasClass('dtfc-has-left')).toBe(false);
				expect($('#example').hasClass('dtfc-has-right')).toBe(true);

				expect($('#example').hasClass('dtfc-scrolling-start')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-end')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-left')).toBe(true);
				expect($('#example').hasClass('dtfc-scrolling-right')).toBe(true);

				done();

				$('html').attr('dir', '');
			}, 100);
		});
	});
});
