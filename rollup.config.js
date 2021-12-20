import resolve from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'src/index.js',
		output: {
			file: process.env.OUT + '/js/dataTables.fixedColumns.js',
			format: 'iife'
		},
		plugins: [resolve()]
	}
];
