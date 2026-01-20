import DataTable, { Context } from 'datatables.net';
import FixedColumns from './FixedColumns';
import './interface';

DataTable.FixedColumns = FixedColumns;

const apiRegister = DataTable.Api.register;
const dom = DataTable.dom;

apiRegister('fixedColumns()', function () {
	return this.inst(this.context);
});

apiRegister('fixedColumns().start()', function (newVal) {
	let ctx = this.context[0];

	if (newVal !== undefined) {
		ctx._fixedColumns.start(newVal);
		return this;
	}
	else {
		return ctx._fixedColumns.start();
	}
});

apiRegister('fixedColumns().end()', function (newVal) {
	let ctx = this.context[0];

	if (newVal !== undefined) {
		ctx._fixedColumns.end(newVal);
		return this;
	}
	else {
		return ctx._fixedColumns.end();
	}
});

apiRegister('fixedColumns().left()', function (newVal) {
	let ctx = this.context[0];

	if (newVal !== undefined) {
		ctx._fixedColumns.left(newVal);
		return this;
	}
	else {
		return ctx._fixedColumns.left();
	}
});

apiRegister('fixedColumns().right()', function (newVal) {
	let ctx = this.context[0];

	if (newVal !== undefined) {
		ctx._fixedColumns.right(newVal);
		return this;
	}
	else {
		return ctx._fixedColumns.right();
	}
});

(DataTable.ext.buttons as any).fixedColumns = {
	action(e, dt, node, config) {
		if (dom.s(node).attr('active')) {
			dom.s(node).removeAttr('active').classRemove('active');
			dt.fixedColumns().start(0);
			dt.fixedColumns().end(0);
		}
		else {
			dom.s(node).attr('active', 'true').classAdd('active');
			dt.fixedColumns().start(config.config.start);
			dt.fixedColumns().end(config.config.end);
		}
	},
	config: {
		start: 1,
		end: 0
	},
	init(dt, node, config) {
		if (dt.settings()[0]._fixedColumns === undefined) {
			_init(dt.settings(), config.config);
		}
		dom.s(node).attr('active', 'true').classAdd('active');
		dt.button(node).text(
			config.text ||
				dt.i18n(
					'buttons.fixedColumns',
					dt.settings()[0]._fixedColumns.c.i18n.button
				)
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
dom.s(document).on('plugin-init.dt', function (e, settings: Context) {
	if (e.namespace !== 'dt') {
		return;
	}

	if (settings.init.fixedColumns || DataTable.defaults.fixedColumns) {
		if (!settings._fixedColumns) {
			_init(settings, null);
		}
	}
});
