// Type definitions for datatables.net-fixedcolumns 3.2
// Project: https://datatables.net
// Definitions by: Konstantin Kuznetsov <https://github.com/Arik-neKrol>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

/// <reference types="jquery" />
/// <reference types="datatables.net"/>

declare namespace DataTables {
    interface Settings {
        /*
         * FixedColumns extension options
         */
        fixedColumns?: boolean | FixedColumnsSettings;
    }

    interface FixedColumnsSettings {
        /*
         * Row height matching algorithm to use
         *
         * The algorithm to use. This can be one of (see below for full description):
         * 'none' | 'semiauto' | 'auto'
         */
        heightMatch?: 'none' | 'semiauto' | 'auto';

        /*
         * The number of columns on the left hand side of the table to fix in place.
         */
        leftColumns?: number;

        /*
         * The number of columns on the right hand side of the table to fix in place.
         */
        rightColumns?: number;
    }

    interface Api {
        /**
        * Namespacing for FixedColumns methods - FixedColumns' methods are available on the returned API instance.
        * 
        * @returns DataTables API instance with the FixedColumns methods available.
        */
        fixedColumns(): FixedColumnsMethods | Api;
    }

    interface FixedColumnsMethods extends Api {
        /**
        * @Deprecated(use dt.cell(this).index())
        * Get the cell index of a cell in a fixed column
        * 
        * @param row The cell (td or th) to get the cell index of. This can be either a cell in the fixed columns or in the host DataTable.
        * @returns The cell index for the given cell.
        */
        cellIndex(row: JQuery | Node): CellIndex;
        
        /**
         * Redraw the fixed columns based on new table size
         * 
         * @returns DataTables API instance
         */
        relayout(): Api;
        
        /**
         * @Deprecated(use dt.row(this).index())
         * Get the row index of a row in a fixed column
         * 
         * @param row The row (tr) to get the row index of. This can be either a row in the fixed columns or in the host DataTable.
         * @returns The row index for the given row
         */
        rowIndex(row: JQuery | Node): number;

        /**
        * Update the data shown in the FixedColumns
        * 
        * @returns DataTables API instance
        */
        update(): Api;
    }

    /*
    */
    interface CellIndex {
        row: number;
        column: number;
        columnVisible: number;
    }

    interface RowsMethods {
        /*
         * Recalculate the height of one or more rows after a data change
         */
        recalcHeight(): Api;
    }
}
