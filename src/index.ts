/*! FixedColumns 4.0.0
 * 2019-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     FixedColumns
 * @description FixedColumns extension for DataTables
 * @version     0.0.1
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @copyright   Copyright 2019-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 * MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/// <reference path = '../node_modules/@types/jquery/index.d.ts'

// Hack to allow TypeScript to compile our UMD
declare let define: {
	amd: string;
	// eslint-disable-next-line @typescript-eslint/member-ordering
	(stringValue, Function): any;
};

import FixedColumns, {setJQuery as fixedColumnsJQuery} from './FixedColumns';

// DataTables extensions common UMD. Note that this allows for AMD, CommonJS
// (with window and jQuery being allowed as parameters to the returned
// function) or just default browser loading.
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net'], function($) {
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
				$ = require('datatables.net')(root, $).$;
			}

			return factory($, root, root.document);
		};
	}
	else {
		// Browser - assume jQuery has already been loaded
		factory((window as any).jQuery, window, document);
	}
}(function($, window, document) {

	fixedColumnsJQuery($);

	let dataTable = $.fn.dataTable;

	($.fn as any).dataTable.FixedColumns = FixedColumns;
	($.fn as any).DataTable.FixedColumns = FixedColumns;

	let apiRegister = ($.fn.dataTable.Api as any).register;

	apiRegister('fixedColumns()', function() {
		return this;
	});

	apiRegister('fixedColumns().left()', function(newVal) {
		let ctx = this.context[0];
		if (newVal !== undefined) {
			ctx._fixedColumns.left(newVal);
			return this;
		}
		else {
			return ctx._fixedColumns.left();
		}
	});

	apiRegister('fixedColumns().right()', function(newVal) {
		let ctx = this.context[0];
		if (newVal !== undefined) {
			ctx._fixedColumns.right(newVal);
			return this;
		}
		else {
			return ctx._fixedColumns.right();
		}
	});

	$.fn.dataTable.ext.buttons.fixedColumns = {
		action(e, dt, node, config) {
			if($(node).attr('active')) {
				$(node).removeAttr('active').removeClass('active');
				dt.fixedColumns().left(0);
				dt.fixedColumns().right(0);
			}
			else {
				$(node).attr('active', true).addClass('active');
				dt.fixedColumns().left(config.config.left);
				dt.fixedColumns().right(config.config.right);
			}
		},
		config: {
			left: 1,
			right: 0
		},
		init(dt, node, config) {
			if(dt.settings()[0]._fixedColumns === undefined) {
				_init(dt.settings(), config);
			}
			$(node).attr('active', true).addClass('active');
			dt.button(node).text(
				config.text || dt.i18n('buttons.fixedColumns', dt.settings()[0]._fixedColumns.c.i18n.button)
			);
		},
		text: null
	};

	function _init(settings, options = null) {
		let api = new dataTable.Api(settings);
		let opts = options
			? options
			: api.init().fixedColumns || dataTable.defaults.fixedColumns;

		let fixedColumns = new FixedColumns(api, opts);

		return fixedColumns;
	}

	// Attach a listener to the document which listens for DataTables initialisation
	// events so we can automatically initialise
	$(document).on('init.dt.dtfc', function(e, settings) {
		if (e.namespace !== 'dt') {
			return;
		}

		if (settings.oInit.fixedColumns ||
			dataTable.defaults.fixedColumns
		) {
			if (!settings._fixedColumns) {
				_init(settings, null);
			}
		}
	});
}));
