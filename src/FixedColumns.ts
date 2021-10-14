let $;
let dataTable;

export function setJQuery(jq) {
	$ = jq;
	dataTable = $.fn.dataTable;
}

export interface IDefaults {
	i18n: {
		button: string;
	};
	left: number;
	leftColumns?: number;
	right: number;
	rightColumns?: number;
}

export interface IS {
	barWidth: number;
	dt: any;
	rtl: boolean;
}

export interface IClasses {
	fixedLeft: string;
	fixedRight: string;
	leftBottomBlocker: string;
	leftTopBlocker: string;
	rightBottomBlocker: string;
	rightTopBlocker: string;
	tableFixedLeft: string;
	tableFixedRight: string;
}

export interface IDOM {
	leftBottomBlocker: JQuery<HTMLElement>;
	leftTopBlocker: JQuery<HTMLElement>;
	rightBottomBlocker: JQuery<HTMLElement>;
	rightTopBlocker: JQuery<HTMLElement>;
}

export interface ICellCSS {
	left?: string;
	position: string;
	right?: string;
}
export default class FixedColumns {
	private static version = '4.0.1-dev';

	private static classes: IClasses = {
		fixedLeft: 'dtfc-fixed-left',
		fixedRight: 'dtfc-fixed-right',
		leftBottomBlocker: 'dtfc-left-bottom-blocker',
		leftTopBlocker: 'dtfc-left-top-blocker',
		rightBottomBlocker: 'dtfc-right-bottom-blocker',
		rightTopBlocker: 'dtfc-right-top-blocker',
		tableFixedLeft: 'dtfc-has-left',
		tableFixedRight: 'dtfc-has-right'
	};

	private static defaults: IDefaults = {
		i18n: {
			button: 'FixedColumns'
		},
		left: 1,
		right: 0
	};

	public classes: IClasses;
	public c: IDefaults;
	public dom: IDOM;
	public s: IS;

	public constructor(settings: any, opts: IDefaults) {
		// Check that the required version of DataTables is included
		if (! dataTable || ! dataTable.versionCheck || ! dataTable.versionCheck('1.10.0')) {
			throw new Error('StateRestore requires DataTables 1.10 or newer');
		}

		let table = new dataTable.Api(settings);

		this.classes = $.extend(true, {}, FixedColumns.classes);

		// Get options from user
		this.c = $.extend(true, {}, FixedColumns.defaults, opts);

		// Backwards compatibility for deprecated leftColumns
		if(opts.left === undefined && this.c.leftColumns !== undefined) {
			this.c.left = this.c.leftColumns;
		}

		// Backwards compatibility for deprecated rightColumns
		if(opts.right === undefined && this.c.rightColumns !== undefined) {
			this.c.right = this.c.rightColumns;
		}

		this.s = {
			barWidth: 0,
			dt: table,
			rtl: $(table.table().node()).css('direction') === 'rtl'
		};

		// Common CSS for all blockers
		let blockerCSS = {
			'background-color': 'white',
			'bottom': '0px',
			'display': 'block',
			'position': 'absolute',
			'width': this.s.barWidth+1+'px',
		};

		this.dom = {
			leftBottomBlocker: $('<div>')
				.css(blockerCSS)
				.css('left', 0)
				.addClass(this.classes.leftBottomBlocker),
			leftTopBlocker: $('<div>')
				.css(blockerCSS)
				.css({
					left: 0,
					top: 0,
				})
				.addClass(this.classes.leftTopBlocker),
			rightBottomBlocker: $('<div>')
				.css(blockerCSS)
				.css('right', 0)
				.addClass(this.classes.rightBottomBlocker),
			rightTopBlocker: $('<div>')
				.css(blockerCSS)
				.css({
					right: 0,
					top: 0,
				})
				.addClass(this.classes.rightTopBlocker)
		};

		if (this.s.dt.settings()[0]._bInitComplete) {
			// Fixed Columns Initialisation
			this._addStyles();
			this._setKeyTableListener();
		}
		else {
			table.one('preInit.dt', () => {
				// Fixed Columns Initialisation
				this._addStyles();
				this._setKeyTableListener();
			});
		}

		// Make class available through dt object
		table.settings()[0]._fixedColumns = this;

		return this;
	}

	/**
	 * Getter/Setter for the `fixedColumns.left` property
	 *
	 * @param newVal Optional. If present this will be the new value for the number of left fixed columns
	 * @returns The number of left fixed columns
	 */
	public left(newVal?: number): number {
		// If the value is to change
		if (newVal !== undefined) {
			// Set the new values and redraw the columns
			this.c.left = newVal;
			this._addStyles();
		}

		return this.c.left;
	}

	/**
	 * Getter/Setter for the `fixedColumns.left` property
	 *
	 * @param newVal Optional. If present this will be the new value for the number of right fixed columns
	 * @returns The number of right fixed columns
	 */
	public right(newVal?: number): number {
		// If the value is to change
		if (newVal !== undefined) {
			// Set the new values and redraw the columns
			this.c.right = newVal;
			this._addStyles();
		}

		return this.c.right;
	}

	/**
	 * Iterates over the columns, fixing the appropriate ones to the left and right
	 */
	private _addStyles() {
		// Set the bar width if vertical scrolling is enabled
		if (this.s.dt.settings()[0].oScroll.sY) {
			let scroll = $(this.s.dt.table().node()).closest('div.dataTables_scrollBody')[0];
			let barWidth = this.s.dt.settings()[0].oBrowser.barWidth;


			if (scroll.offsetWidth - scroll.clientWidth >= barWidth) {
				this.s.barWidth = barWidth;
			}
			else {
				this.s.barWidth = 0;
			}

			this.dom.rightTopBlocker.css('width', this.s.barWidth + 1);
			this.dom.leftTopBlocker.css('width', this.s.barWidth + 1);
			this.dom.rightBottomBlocker.css('width', this.s.barWidth + 1);
			this.dom.leftBottomBlocker.css('width', this.s.barWidth + 1);
		}

		let parentDiv = null;

		// Get the header and it's height
		let header = this.s.dt.column(0).header();
		let headerHeight = null;
		if (header !== null) {
			header = $(header);
			headerHeight = header.outerHeight() + 1;
			parentDiv = $(header.closest('div.dataTables_scroll')).css('position', 'relative');
		}

		// Get the footer and it's height
		let footer = this.s.dt.column(0).footer();
		let footerHeight = null;
		if (footer !== null) {
			footer = $(footer);
			footerHeight = footer.outerHeight();

			// Only attempt to retrieve the parentDiv if it has not been retrieved already
			if(parentDiv === null) {
				parentDiv = $(footer.closest('div.dataTables_scroll')).css('position', 'relative');
			}
		}

		// Get the number of columns in the table - this is used often so better to only make 1 api call
		let numCols = this.s.dt.columns().data().toArray().length;

		// Tracker for the number of pixels should be left to the left of the table
		let distLeft = 0;

		// Sometimes the headers have slightly different widths so need to track them individually
		let headLeft = 0;

		// Get all of the row elements in the table
		let rows = $(this.s.dt.table().node()).children('tbody').children('tr');

		let invisibles = 0;

		// When working from right to left we need to know how many are invisible before a point,
		// without including those that are invisible after
		let prevInvisible = new Map();

		// Iterate over all of the columns
		for (let i = 0; i < numCols; i++) {
			let column = this.s.dt.column(i);
			// Set the map for the previous column
			if (i > 0) {
				prevInvisible.set(i-1, invisibles);
			}

			if(!column.visible()) {
				invisibles ++;
				continue;
			}
			// Get the columns header and footer element
			let colHeader = $(column.header());
			let colFooter = $(column.footer());

			// If i is less than the value of left then this column should be fixed left
			if (i - invisibles < this.c.left) {
				$(this.s.dt.table().node()).addClass(this.classes.tableFixedLeft);
				parentDiv.addClass(this.classes.tableFixedLeft);

				// Add the width of the previous node - only if we are on atleast the second column
				if (i !== 0) {
					let prevCol = this.s.dt.column(i-1-invisibles, {page: 'current'});
					if (prevCol.visible()) {
						distLeft += $(prevCol.nodes()[0]).outerWidth();
						headLeft += headLeft += prevCol.header() ?
							$(prevCol.header()).outerWidth() :
							prevCol.footer() ?
								$(prevCol.header()).outerWidth() :
								0;
					}
				}

				// Iterate over all of the rows, fixing the cell to the left
				for (let row of rows) {
					$($(row).children()[i-invisibles])
						.css(this._getCellCSS(false, distLeft, 'left'))
						.addClass(this.classes.fixedLeft);
				}

				// Add the css for the header and the footer
				colHeader
					.css(this._getCellCSS(true, headLeft, 'left'))
					.addClass(this.classes.fixedLeft);
				colFooter
					.css(this._getCellCSS(true, headLeft, 'left'))
					.addClass(this.classes.fixedLeft);
			}
			else {
				// Iteriate through all of the rows, making sure they aren't currently trying to fix left
				for (let row of rows) {
					let cell = $($(row).children()[i-invisibles]);

					// If the cell is trying to fix to the left, remove the class and the css
					if (cell.hasClass(this.classes.fixedLeft)) {
						cell
							.css(this._clearCellCSS('left'))
							.removeClass(this.classes.fixedLeft);
					}
				}
				// Make sure the header for this column isn't fixed left
				if (colHeader.hasClass(this.classes.fixedLeft)) {
					colHeader
						.css(this._clearCellCSS('left'))
						.removeClass(this.classes.fixedLeft);
				}
				// Make sure the footer for this column isn't fixed left
				if (colFooter.hasClass(this.classes.fixedLeft)) {
					colFooter
						.css(this._clearCellCSS('left'))
						.removeClass(this.classes.fixedLeft);
				}
			}
		}

		// If there is a header with the index class and reading rtl then add left top blocker
		if(header !== null && !header.hasClass('index')) {
			if(this.s.rtl) {
				this.dom.leftTopBlocker.outerHeight(headerHeight);
				parentDiv.append(this.dom.leftTopBlocker);
			}
			else {
				this.dom.rightTopBlocker.outerHeight(headerHeight);
				parentDiv.append(this.dom.rightTopBlocker);
			}
		}

		// If there is a footer with the index class and reading rtl then add left bottom blocker
		if(footer !== null && !footer.hasClass('index')) {
			if (this.s.rtl) {
				this.dom.leftBottomBlocker.outerHeight(footerHeight);
				parentDiv.append(this.dom.leftBottomBlocker);
			}
			else {
				this.dom.rightBottomBlocker.outerHeight(footerHeight);
				parentDiv.append(this.dom.rightBottomBlocker);
			}
		}

		let distRight = 0;
		let headRight = 0;
		// Counter for the number of invisible columns so far
		let rightInvisibles = 0;
		for (let i = numCols-1; i >= 0; i--) {
			let column = this.s.dt.column(i);

			// If a column is invisible just skip it
			if(!column.visible()) {
				rightInvisibles ++;
				continue;
			}


			// Get the columns header and footer element
			let colHeader = $(column.header());
			let colFooter = $(column.footer());

			// Get the number of visible columns that came before this one
			let prev = prevInvisible.get(i);
			if (prev === undefined) {
				// If it wasn't set then it was the last column so just use the final value
				prev = invisibles;
			}

			if(i + rightInvisibles >= numCols - this.c.right) {
				$(this.s.dt.table().node()).addClass(this.classes.tableFixedRight);
				parentDiv.addClass(this.classes.tableFixedRight);
				// Add the widht of the previous node, only if we are on atleast the second column
				if (i + 1 + rightInvisibles < numCols) {
					let prevCol = this.s.dt.column(i+1+rightInvisibles, {page: 'current'});
					if(prevCol.visible()) {
						distRight += $(prevCol.nodes()[0]).outerWidth();
						headRight += prevCol.header() ?
							$(prevCol.header()).outerWidth() :
							prevCol.footer() ?
								$(prevCol.header()).outerWidth() :
								0;
					}
				}

				// Iterate over all of the rows, fixing the cell to the right
				for(let row of rows) {
					$($(row).children()[i - prev])
						.css(this._getCellCSS(false, distRight, 'right'))
						.addClass(this.classes.fixedRight);
				}

				// Add the css for the header and the footer
				colHeader
					.css(this._getCellCSS(true, headRight, 'right'))
					.addClass(this.classes.fixedRight);
				colFooter
					.css(this._getCellCSS(true, headRight, 'right'))
					.addClass(this.classes.fixedRight);
			}
			else {
				// Iteriate through all of the rows, making sure they aren't currently trying to fix right
				for (let row of rows) {
					let cell = $($(row).children()[i-prev]);

					// If the cell is trying to fix to the right, remove the class and the css
					if (cell.hasClass(this.classes.fixedRight)) {
						cell
							.css(this._clearCellCSS('right'))
							.removeClass(this.classes.fixedRight);
					}
				}
				// Make sure the header for this column isn't fixed right
				if (colHeader.hasClass(this.classes.fixedRight)) {
					colHeader
						.css(this._clearCellCSS('right'))
						.removeClass(this.classes.fixedRight);
				}
				// Make sure the footer for this column isn't fixed right
				if (colFooter.hasClass(this.classes.fixedRight)) {
					colFooter
						.css(this._clearCellCSS('right'))
						.removeClass(this.classes.fixedRight);
				}
			}
		}

		// If there is a header with the index class and reading rtl then add right top blocker
		if (header) {
			if (!this.s.rtl) {
				this.dom.rightTopBlocker.outerHeight(headerHeight);
				parentDiv.append(this.dom.rightTopBlocker);
			}
			else {
				this.dom.leftTopBlocker.outerHeight(headerHeight);
				parentDiv.append(this.dom.leftTopBlocker);
			}
		}

		// If there is a footer with the index class and reading rtl then add right bottom blocker
		if (footer) {
			if(!this.s.rtl) {
				this.dom.rightBottomBlocker.outerHeight(footerHeight);
				parentDiv.append(this.dom.rightBottomBlocker);
			}
			else {
				this.dom.leftBottomBlocker.outerHeight(footerHeight);
				parentDiv.append(this.dom.leftBottomBlocker);
			}
		}
	}

	/**
	 * Gets the correct CSS for the cell, header or footer based on options provided
	 *
	 * @param header Whether this cell is a header or a footer
	 * @param dist The distance that the cell should be moved away from the edge
	 * @param lr Indicator of fixing to the left or the right
	 * @returns An object containing the correct css
	 */
	private _getCellCSS(header: boolean, dist: number, lr: 'left' | 'right'): ICellCSS {
		if(lr === 'left') {
			return !this.s.rtl ?
				{
					left: dist+'px',
					position: 'sticky'
				} :
				{
					position: 'sticky',
					right: dist + (header ? this.s.barWidth : 0) + 'px'
				};
		}
		else {
			return !this.s.rtl ?
				{
					position: 'sticky',
					right: dist + (header ? this.s.barWidth : 0) + 'px'
				} :
				{
					left: dist+'px',
					position: 'sticky'
				};
		}
	}

	/**
	 * Gets the css that is required to clear the fixing to a side
	 *
	 * @param lr Indicator of fixing to the left or the right
	 * @returns An object containing the correct css
	 */
	private _clearCellCSS(lr: 'left' | 'right'): ICellCSS {
		if(lr === 'left') {
			return !this.s.rtl ?
				{
					left: '',
					position: ''
				} :
				{
					position: '',
					right: ''
				};
		}
		else {
			return !this.s.rtl ?
				{
					position: '',
					right: ''
				} :
				{
					left: '',
					position: ''
				};
		}
	}

	private _setKeyTableListener() {
		this.s.dt.on('key-focus', (e, dt, cell) => {
			let cellPos = $(cell.node()).offset();
			let scroll = $($(this.s.dt.table().node()).closest('div.dataTables_scrollBody'));

			// If there are fixed columns to the left
			if (this.c.left > 0) {
				// Get the rightmost left fixed column header, it's position and it's width
				let rightMost = $(this.s.dt.column(this.c.left-1).header());
				let rightMostPos = rightMost.offset();
				let rightMostWidth = rightMost.outerWidth();

				// If the current highlighted cell is left of the rightmost cell on the screen
				if (cellPos.left < rightMostPos.left + rightMostWidth) {
					// Scroll it into view
					let currScroll = scroll.scrollLeft();
					scroll.scrollLeft(currScroll - (rightMostPos.left + rightMostWidth - cellPos.left));
				}
			}

			// If there are fixed columns to the right
			if (this.c.right > 0) {
				// Get the number of columns and the width of the cell as doing right side calc
				let numCols = this.s.dt.columns().data().toArray().length;
				let cellWidth = $(cell.node()).outerWidth();

				// Get the leftmost right fixed column header and it's position
				let leftMost = $(this.s.dt.column(numCols - this.c.right).header());
				let leftMostPos = leftMost.offset();

				// If the current highlighted cell is right of the leftmost cell on the screen
				if (cellPos.left + cellWidth > leftMostPos.left) {
					// Scroll it into view
					let currScroll = scroll.scrollLeft();
					scroll.scrollLeft(currScroll - (leftMostPos.left - (cellPos.left + cellWidth)));
				}
			}
		});

		// Whenever a draw occurs there is potential for the data to have changed and therefore also the column widths
		// Therefore it is necessary to recalculate the values for the fixed columns
		this.s.dt.on('draw', () => {
			this._addStyles();
		});

		this.s.dt.on('column-reorder', () => {
			this._addStyles();
		});

		this.s.dt.on('column-visibility', () => {
			setTimeout(() => {
				this._addStyles();
			}, 50);
		});
	}
}
