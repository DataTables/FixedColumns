
/*! DataTables integration for DataTables' FixedColumns
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-dt', 'datatables.net-fixedcolumns'], function($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if (! root) {
				root = window;
			}

			if (! $ || ! $.fn.dataTable) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				$ = require('datatables.net-dt')(root, $).$;
			}

			if (! $.fn.dataTable.FixedColumns) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				require('datatables.net-fixedcolumns')(root, $);
			}

			return factory($, root, root.document);
		};
	}
	else {
		// Browser
		factory(jQuery, window, document);
	}
}(function($, window, document) {
	'use strict';
	let dataTable = $.fn.dataTable;

	return dataTable.fixedColumns;
}));
