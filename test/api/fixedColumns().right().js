describe('fixedColumns - fixedColumns().right())', function () {
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
			expect(typeof table.fixedColumns().right).toBe('function');
		});
		it('Getter returns a boolean value', function () {
			expect(typeof table.fixedColumns().right()).toBe('number');
		});
		it('Setter returns an API instance', function () {
			expect(table.fixedColumns().right(2) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Getter', function () {
		dt.html('basic');
		it('Default', function () {
			table = $('#example').DataTable({
				fixedColumns: true
			});

			expect(table.fixedColumns().right()).toBe(0);
		});

		dt.html('basic');
		it('Right', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					right: 4
				}
			});

			expect(table.fixedColumns().right()).toBe(4);
		});

		dt.html('basic');
		it('Left and right', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					left: 2,
					right: 3
				}
			});

			expect(table.fixedColumns().right()).toBe(3);
		});
	});

	describe('Setter', function () {
		dt.html('basic');
		it('Left', function () {
			table = $('#example').DataTable({
				fixedColumns: true
			});

			table.fixedColumns().right(2);

			expect(table.fixedColumns().right()).toBe(2);
		});

		dt.html('basic');
		it('Right', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					right: 4
				}
			});

			table.fixedColumns().right(2);

			expect(table.fixedColumns().right()).toBe(2);
		});

		dt.html('basic');
		it('Left and right', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					left: 2,
					right: 3
				}
			});

			table.fixedColumns().right(3);

			expect(table.fixedColumns().right()).toBe(3);
		});
	});
});
