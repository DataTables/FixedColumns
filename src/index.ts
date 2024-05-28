/*! FixedColumns 5.0.1
 * © SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     FixedColumns
 * @description FixedColumns extension for DataTables
 * @version     5.0.1
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @copyright   SpryMedia Ltd.
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

import FixedColumns, {setJQuery as fixedColumnsJQuery} from './FixedColumns';

fixedColumnsJQuery($);

// Defined by the loader
declare var DataTable: any;

($.fn as any).dataTable.FixedColumns = FixedColumns;
($.fn as any).DataTable.FixedColumns = FixedColumns;

let apiRegister = DataTable.Api.register;

apiRegister('fixedColumns()', function() {
	return this;
});

apiRegister('fixedColumns().start()', function(newVal) {
	let ctx = this.context[0];

	if (newVal !== undefined) {
		ctx._fixedColumns.start(newVal);
		return this;
	}
	else {
		return ctx._fixedColumns.start();
	}
});

apiRegister('fixedColumns().end()', function(newVal) {
	let ctx = this.context[0];

	if (newVal !== undefined) {
		ctx._fixedColumns.end(newVal);
		return this;
	}
	else {
		return ctx._fixedColumns.end();
	}
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

DataTable.ext.buttons.fixedColumns = {
	action(e, dt, node, config) {
		if($(node).attr('active')) {
			$(node).removeAttr('active').removeClass('active');
			dt.fixedColumns().start(0);
			dt.fixedColumns().end(0);
		}
		else {
			$(node).attr('active', 'true').addClass('active');
			dt.fixedColumns().start(config.config.start);
			dt.fixedColumns().end(config.config.end);
		}
	},
	config: {
		start: 1,
		end: 0
	},
	init(dt, node, config) {
		if(dt.settings()[0]._fixedColumns === undefined) {
			_init(dt.settings(), config);
		}
		$(node).attr('active', 'true').addClass('active');
		dt.button(node).text(
			config.text || dt.i18n('buttons.fixedColumns', dt.settings()[0]._fixedColumns.c.i18n.button)
		);
	},
	text: null
};

function _init(settings, options = null) {
	let api = new DataTable.Api(settings);
	let opts = options
		? options
		: api.init().fixedColumns || DataTable.defaults.fixedColumns;

	let fixedColumns = new FixedColumns(api, opts);

	return fixedColumns;
}

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on('plugin-init.dt', function(e, settings) {
	if (e.namespace !== 'dt') {
		return;
	}

	if (settings.oInit.fixedColumns ||
		DataTable.defaults.fixedColumns
	) {
		if (!settings._fixedColumns) {
			_init(settings, null);
		}
	}
});
