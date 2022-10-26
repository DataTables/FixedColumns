// Type definitions for DataTables FixedColumns
//
// Project: https://datatables.net/extensions/fixedcolumns/, https://datatables.net

/// <reference types="jquery" />

import DataTables, {Api} from 'datatables.net';
import {IDefaults} from './FixedColumns';

export default DataTables;

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables' types integration
 */
declare module 'datatables.net' {
	interface Config {
		/**
		 * FixedColumns extension options
		 */
		fixedColumns?: boolean | ConfigFixedColumns;
	}

	interface ConfigLanguage {
		/**
		 * StateRestore language options
		 */
		 fixedColumns?: ConfigFixedColumnsLanguage;
	}

	interface Api<T> {
		/**
		 * FixedColumns API Methods
		 */
		fixedColumns(): ApiFixedColumns<T>;
	}

	interface ApiStatic {
		/**
		 * FixedColumns class
		 */
		FixedColumns: {
			/**
			 * Create a new FixedColumns instance for the target DataTable
			 */
			new (dt: Api<any>, settings: string[] | ConfigFixedColumns | ConfigFixedColumns[]);

			/**
			 * FixedColumns version
			 */
			version: string;

			/**
			 * Default configuration values
			 */
			defaults: ConfigFixedColumns;
		}
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Options
 */
interface ConfigFixedColumns extends DeepPartial<IDefaults> {}

interface ConfigFixedColumnsLanguage extends DeepPartial<IDefaults['i18n']> {}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * API
 */

interface ApiFixedColumns<T> extends Api<T> {
	/**
	 * Get the number of fixed left columns
	 */
	left(): number;

	/**
	 * Set the number of fixed left columns
	 */
	left(val: number): Api<T>;

	/**
	 * Get the number of fixed right columns
	 */
	right(): number;

	/**
	 * Set the number of fixed right columns
	 */
	right(val: number): Api<T>;
}
