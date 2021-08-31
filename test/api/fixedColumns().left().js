describe('fixedColumns - fixedColumns().left())', function () {
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
			expect(typeof table.fixedColumns().left).toBe('function');
		});
		it('Getter returns a boolean value', function () {
			expect(typeof table.fixedColumns().left()).toBe('number');
		});
		it('Setter returns an API instance', function () {
			expect(table.fixedColumns().left(2) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Getter', function () {
		dt.html('basic');
		it('Default', function () {
			table = $('#example').DataTable({
				fixedColumns: true
			});

			expect(table.fixedColumns().left()).toBe(1);
		});

		dt.html('basic');
		it('Left', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					left: 4
				}
			});

			expect(table.fixedColumns().left()).toBe(4);
		});

		dt.html('basic');
		it('Left and right', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					left: 2,
					right: 3
				}
			});

			expect(table.fixedColumns().left()).toBe(2);
		});
	});

	describe('Setter', function () {
		dt.html('basic');
		it('Left', function () {
			table = $('#example').DataTable({
				fixedColumns: true
			});

			table.fixedColumns().left(2);

			expect(table.fixedColumns().left()).toBe(2);
		});

		dt.html('basic');
		it('Left', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					left: 4
				}
			});

			table.fixedColumns().left(2);

			expect(table.fixedColumns().left()).toBe(2);
		});

		dt.html('basic');
		it('Left and right', function () {
			table = $('#example').DataTable({
				fixedColumns: {
					left: 2,
					right: 3
				}
			});

			table.fixedColumns().left(3);

			expect(table.fixedColumns().left()).toBe(3);
		});
	});
});
