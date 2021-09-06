module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'eslint-plugin-jsdoc',
		'eslint-plugin-import',
		'typescript-sort-keys',
		'@typescript-eslint',
	],
	root: true,
	rules: {
		'@typescript-eslint/array-type': [
			'error',
			{default: 'array-simple'}
		],
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					Object: {
						message: 'Avoid using the `Object` type. Did you mean `object`?'
					},
					Function: {
						message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
					},
					Boolean: {
						message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
					},
					Number: {
						message: 'Avoid using the `Number` type. Did you mean `number`?'
					},
					String: {
						message: 'Avoid using the `String` type. Did you mean `string`?'
					},
					Symbol: {
						message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
					}
				}
			}
		],
		'@typescript-eslint/consistent-type-assertions': 'error',
		'@typescript-eslint/consistent-type-definitions': 'error',
		'@typescript-eslint/explicit-member-accessibility': [
			'error',
			{
				accessibility: 'explicit'
			}
		],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/indent': [
			'error',
			'tab',
			{
				ObjectExpression: 'first',
				FunctionDeclaration: {
					parameters: 'first'
				},
				FunctionExpression: {
					parameters: 'first'
				}
			}
		],
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false
				}
			}
		],
		'@typescript-eslint/member-ordering': 'error',
		'@typescript-eslint/naming-convention': 'error',
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-parameter-properties': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/quotes': [
			'error',
			'single'
		],
		'@typescript-eslint/semi': [
			'error',
			'always'
		],
		'@typescript-eslint/triple-slash-reference': [
			'error',
			{
				lib: 'always',
				path: 'always',
				types: 'prefer-import'
			}
		],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/unified-signatures': 'error',
		'array-bracket-spacing': 'warn',
		'arrow-body-style': 'error',
		'arrow-parens': [
			'off',
			'always'
		],
		'block-scoped-var': 'error',
		'brace-style': [
			'error',
			'stroustrup'
		],
		'class-methods-use-this': 'off',
		'comma-dangle': 'off',
		'complexity': 'off',
		'constructor-super': 'error',
		'curly': [
			'error',
			'multi-line'
		],
		'eol-last': 'error',
		'eqeqeq': [
			'error',
			'smart'
		],
		'guard-for-in': 'off',
		'id-blacklist': [
			'error',
			'any',
			'Number',
			'number',
			'String',
			'string',
			'Boolean',
			'boolean',
			'Undefined',
			'undefined'
		],
		'id-match': 'error',
		'import/no-extraneous-dependencies': 'off',
		'import/no-internal-modules': 'off',
		'import/order': 'error',
		'indent': ['error', 'tab'],
		'jsdoc/check-alignment': 'error',
		'jsdoc/check-indentation': 'error',
		'jsdoc/newline-after-description': 'error',
		'max-classes-per-file': [
			'error',
			1
		],
		'max-len': [
			'error',
			{
				code: 120
			}
		],
		'new-parens': 'error',
		'newline-per-chained-call': 'off',
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-cond-assign': 'error',
		'no-console': 'warn',
		'no-debugger': 'error',
		'no-dupe-else-if': 'error',
		'no-dupe-keys': 'error',
		'no-duplicate-case': 'error',
		'no-duplicate-imports': 'error',
		'no-empty': 'error',
		'no-eval': 'error',
		'no-extra-bind': 'error',
		'no-extra-parens': 'warn',
		'no-extra-semi': 'error',
		'no-fallthrough': 'off',
		'no-invalid-this': 'off',
		'no-invalid-regexp': 'error',
		'no-irregular-whitespace': 'warn',
		'no-lone-blocks': 'error',
		'no-lonely-if': 'warn',
		'no-magic-numbers': 'off',
		'no-multi-spaces': 'warn',
		'no-multiple-empty-lines': 'warn',
		'no-new-func': 'error',
		'no-new-wrappers': 'error',
		'no-redeclare': 'error',
		'no-return-await': 'error',
		'no-sequences': 'error',
		'no-shadow': [
			'error',
			{
				hoist: 'all'
			}
		],
		'no-sparse-arrays': 'error',
		'no-template-curly-in-string': 'error',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'warn',
		'no-undef-init': 'error',
		'no-underscore-dangle': 'off',
		'no-unreachable': 'warn',
		'no-unsafe-finally': 'error',
		'no-unused-labels': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'one-var': [
			'error',
			'never'
		],
		'prefer-arrow/prefer-arrow-functions': 'off',
		'prefer-const': 'off',
		'prefer-object-spread': 'error',
		'quote-props': [
			'error',
			'consistent-as-needed'
		],
		'radix': 'error',
		'sort-keys': 'error',
		'space-before-blocks': 'warn',
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'never',
				asyncArrow: 'always',
				named: 'never'
			}
		],
		'space-in-parens': [
			'error',
			'never'
		],
		'spaced-comment': [
			'error',
			'always',
			{
				markers: [
					'/', '!'
				]
			}
		],
		'typescript-sort-keys/interface': 'error',
		'typescript-sort-keys/string-enum': 'error',
		'use-isnan': 'error',
		'valid-typeof': 'off',
	},
};