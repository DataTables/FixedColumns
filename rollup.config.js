import resolve from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'src/index.js',
		output: {
			file: process.env.OUT + '/js/dataTables.fixedColumns.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/fixedColumns.bootstrap.js',
		output: {
			file: process.env.OUT + '/js/fixedColumns.bootstrap.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/fixedColumns.bootstrap4.js',
		output: {
			file: process.env.OUT + '/js/fixedColumns.bootstrap4.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/fixedColumns.dataTables.js',
		output: {
			file: process.env.OUT + '/js/fixedColumns.dataTables.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/fixedColumns.foundation.js',
		output: {
			file: process.env.OUT + '/js/fixedColumns.foundation.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/fixedColumns.semanticui.js',
		output: {
			file: process.env.OUT + '/js/fixedColumns.semanticui.js',
			format: 'iife'
		},
		plugins: [resolve()]
	}
];
