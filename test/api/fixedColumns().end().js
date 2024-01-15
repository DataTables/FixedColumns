describe('fixedColumns - fixedColumns().end())', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'fixedcolumns'],
		css: ['datatables', 'fixedcolumns']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Exists and is a function', function () {
			table = $('#example').DataTable({
				fixedColumns: true
			});
			expect(typeof table.fixedColumns().end).toBe('function');
		});
		it('Getter returns a boolean value', function () {
			expect(typeof table.fixedColumns().end()).toBe('number');
		});
		it('Setter returns an API instance', function () {
			expect(table.fixedColumns().end(2) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Getter', function () {
		dt.html('basic');
		it('Default', function () {
			table = $('#example').DataTable({
				fixedColumns: true
			});

			expect(table.fixedColumns().end()).toBe(0);
		});

		dt.html('basic');
		it('End', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					end: 4
				}
			});

			expect(table.fixedColumns().end()).toBe(4);
		});

		dt.html('basic');
		it('Start and end', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					start: 2,
					end: 3
				}
			});

			expect(table.fixedColumns().end()).toBe(3);
		});
	});

	describe('Setter', function () {
		dt.html('basic');
		it('End', function () {
			table = $('#example').DataTable({
				fixedColumns: true
			});

			table.fixedColumns().end(2);

			expect(table.fixedColumns().end()).toBe(2);
		});

		dt.html('basic');
		it('End', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					end: 4
				}
			});

			table.fixedColumns().end(2);

			expect(table.fixedColumns().end()).toBe(2);
		});

		dt.html('basic');
		it('Start and end', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					start: 2,
					end: 3
				}
			});

			table.fixedColumns().end(3);

			expect(table.fixedColumns().end()).toBe(3);
		});
	});

	describe('Text direction', function() {
		dt.html('basic');

		it('When end is set for rtl - start is 1', function() {
			$('html').attr('dir', 'rtl');

			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					start: 0,
					end: 1
				}
			});

			expect(table.fixedColumns().start()).toBe(0);
			expect(table.fixedColumns().left()).toBe(1);
			expect(table.fixedColumns().end()).toBe(1);
			expect(table.fixedColumns().right()).toBe(0);

			$('html').attr('dir', '');
		});

		dt.html('basic');

		it('When right is set for rtl - start is 0', function() {
			$('html').attr('dir', 'rtl');

			table = $('#example').DataTable({
				scrollX: true,
				fixedColumns: {
					left: 0,
					right: 1
				}
			});

			expect(table.fixedColumns().start()).toBe(1);
			expect(table.fixedColumns().left()).toBe(0);
			expect(table.fixedColumns().end()).toBe(0);
			expect(table.fixedColumns().right()).toBe(1);

			$('html').attr('dir', '');
		});
	});
});
