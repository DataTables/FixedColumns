describe('fixedColumns - destroy', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'fixedcolumns'],
		css: ['datatables', 'fixedcolumns']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Initialisation inserts a blocker', function () {
			table = $('#example').DataTable({
				fixedColumns: true,
				scrollX: true
			});
			expect($('div.dtfc-top-blocker').length).toBe(1);
		});
		it('After re-init has just one still', function () {
			table = $('#example').DataTable({
				fixedColumns: true,
				scrollX: true,
				destroy: true
			});
			expect($('div.dtfc-top-blocker').length).toBe(1);
		});
		it('And a third init still has one', function () {
			$('#example').DataTable().destroy();
			table = $('#example').DataTable({
				fixedColumns: true,
				scrollX: true
			});
			expect($('div.dtfc-top-blocker').length).toBe(1);
		});
	});
});
