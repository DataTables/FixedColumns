/*! Bootstrap integration for DataTables' FixedColumns
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
// Hack to allow TypeScript to compile our UMD
declare let define: {
	(stringValue, Function): any;
	amd: string;
};
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-bs', 'datatables.net-fixedcolumns'], function($) {
			return factory($);
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
				$ = require('datatables.net-bs')(root, $).$;
			}

			if (! $.fn.dataTable.SearchPanes) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				require('datatables.net-fixedcolumns')(root, $);
			}

			return factory($);
		};
	}
	else {
		// Browser
		factory(jQuery);
	}
}(function($) {
	'use strict';
	let dataTable = $.fn.dataTable;

	return dataTable.fixedColumns;
}));
