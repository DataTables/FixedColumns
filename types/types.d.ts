// Type definitions for datatables.net-fixedcolumns
// Definitions by:
//   SpryMedia
//   Konstantin Kuznetsov

/// <reference types="jquery" />

import DataTables, {Api} from 'datatables.net';

export default DataTables;

declare module 'datatables.net' {
    interface Config {
        /*
         * FixedColumns extension options
         */
        fixedColumns?: boolean | FixedColumnsConfig;
    }

    interface FixedColumnsConfig {
        /**
         * The number of columns to fix at the end of the table (ltr and rtl aware)
         */
        end?: number;

        i18n?: {
            /** Text for `fixedColumns` button */
            button?: string;
        };

        /**
         * The number of columns on the left hand side of the table to fix in place.
         */
        left?: number;

        /**
         * The number of columns on the left hand side of the table to fix in place.
         * @deprecated Use `start`
         */
        leftColumns?: number;

        /**
         * The number of columns on the right hand side of the table to fix in place.
         */
        right?: number;

        /**
         * The number of columns on the right hand side of the table to fix in place.
         * @deprecated Use `end`
         */
        rightColumns?: number;

        /**
         * The number of columns to fix at the start of the table (ltr and rtl aware)
         */
        start?: number;
    }

    interface Api<T> {
        /**
        * Namespacing for FixedColumns methods - FixedColumns' methods are available on the returned API instance.
        * 
        * @returns DataTables API instance with the FixedColumns methods available.
        */
        fixedColumns(): FixedColumnsMethods<T>;
    }

    interface FixedColumnsMethods<T> extends Api<T> {
        /**
        * Get the number of columns fixed at the end of the table
        * 
        * @returns Count
        */
        end(): number;

        /**
        * Set the number of columns fixed at the end of the table
        * 
        * @returns DataTables API instance
        */
        end(count: number): Api<T>;

        /**
        * Get the number of columns fixed at the left of the table
        * 
        * @returns Count
        */
        left(): number;

        /**
        * Set the number of columns fixed at the left of the table
        * 
        * @returns DataTables API instance
        */
        left(count: number): Api<T>;

        /**
        * Get the number of columns fixed at the right of the table
        * 
        * @returns Count
        */
        right(): number;

        /**
        * Set the number of columns fixed at the right of the table
        * 
        * @returns DataTables API instance
        */
        right(count: number): Api<T>;
    
        /**
        * Get the number of columns fixed at the start of the table
        * 
        * @returns Count
        */
        start(): number;

        /**
        * Set the number of columns fixed at the start of the table
        * 
        * @returns DataTables API instance
        */
        start(count: number): Api<T>;
    }
}
