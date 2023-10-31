let $;
let DataTable;

export function setJQuery(jq) {
	$ = jq;
	DataTable = $.fn.dataTable;
}

export interface IDefaults {
	i18n: {
		button: string;
	};
	end: number;
	left?: number;
	leftColumns?: number;
	right?: number;
	rightColumns?: number;
	start: number;
}

export interface IS {
	dt: any;
	rtl: boolean;
}

export interface IClasses {
	bottomBlocker: string;
	fixedEnd: string;
	fixedLeft: string;
	fixedRight: string;
	fixedStart: string;
	tableFixedEnd: string;
	tableFixedLeft: string;
	tableFixedStart: string;
	tableFixedRight: string;
	topBlocker: string;
	tableScrollingEnd: string;
	tableScrollingLeft: string;
	tableScrollingRight: string;
	tableScrollingStart: string;
}

export interface IDOM {
	bottomBlocker: JQuery<HTMLElement>;
	topBlocker: JQuery<HTMLElement>;
	scroller: JQuery<HTMLElement>;
}

export default class FixedColumns {
	private static version = '5.0.0';

	private static classes: IClasses = {
		bottomBlocker: 'dtfc-bottom-blocker',
		fixedEnd: 'dtfc-fixed-end',
		fixedLeft: 'dtfc-fixed-left',
		fixedRight: 'dtfc-fixed-right',
		fixedStart: 'dtfc-fixed-start',
		tableFixedEnd: 'dtfc-has-end',
		tableFixedLeft: 'dtfc-has-left',
		tableFixedRight: 'dtfc-has-right',
		tableFixedStart: 'dtfc-has-start',
		tableScrollingEnd: 'dtfc-scrolling-end',
		tableScrollingLeft: 'dtfc-scrolling-left',
		tableScrollingRight: 'dtfc-scrolling-right',
		tableScrollingStart: 'dtfc-scrolling-start',
		topBlocker: 'dtfc-top-blocker'
	};

	private static defaults: IDefaults = {
		i18n: {
			button: 'FixedColumns'
		},
		start: 1,
		end: 0
	};

	public classes: IClasses;
	public c: IDefaults;
	public dom: IDOM;
	public s: IS;

	public constructor(settings: any, opts: IDefaults) {
		// Check that the required version of DataTables is included
		if (
			!DataTable ||
			!DataTable.versionCheck ||
			!DataTable.versionCheck('2')
		) {
			throw new Error('FixedColumns requires DataTables 2 or newer');
		}

		let table = new DataTable.Api(settings);

		this.classes = $.extend(true, {}, FixedColumns.classes);

		// Get options from user
		this.c = $.extend(true, {}, FixedColumns.defaults, opts);

		this.s = {
			dt: table,
			rtl: $(table.table().node()).css('direction') === 'rtl'
		};

		// Backwards compatibility for deprecated options
		if (opts && opts.leftColumns !== undefined) {
			opts.left = opts.leftColumns;
		}
		if (opts && opts.left !== undefined) {
			this.c[this.s.rtl ? 'end' : 'start'] = opts.left;
		}

		if (opts && opts.rightColumns !== undefined) {
			opts.right = opts.rightColumns;
		}
		if (opts && opts.right !== undefined) {
			this.c[this.s.rtl ? 'start' : 'end'] = opts.right;
		}

		this.dom = {
			bottomBlocker: $('<div>').addClass(this.classes.bottomBlocker),
			topBlocker: $('<div>').addClass(this.classes.topBlocker),
			scroller: $('div.dt-scroll-body', this.s.dt.table().container()),
		};

		if (this.s.dt.settings()[0]._bInitComplete) {
			// Fixed Columns Initialisation
			this._addStyles();
			this._setKeyTableListener();
		}
		else {
			table.one('init.dt.dtfc', () => {
				// Fixed Columns Initialisation
				this._addStyles();
				this._setKeyTableListener();
			});
		}

		table.on('column-sizing.dt.dtfc', () => this._addStyles());

		// Add classes to indicate scrolling state for styling
		this.dom.scroller.on('scroll.dtfc', () => this._scroll());
		this._scroll();

		// Make class available through dt object
		table.settings()[0]._fixedColumns = this;

		table.on('destroy', () => this._destroy());

		return this;
	}

	/**
	 * Getter for the `fixedColumns.end` property
	 *
	 * @param newVal Optional. If present this will be the new value for the number of end fixed columns
	 * @returns The number of end fixed columns
	 */
	public end(): number;
	/**
	 * Setter for the `fixedColumns.right` property
	 *
	 * @param newVal The new value for the number of right fixed columns
	 * @returns DataTables API for chaining
	 */
	public end(newVal: number): any;
	public end(newVal?: number): any {
		// If the value is to change
		if (newVal !== undefined) {
			if (newVal >= 0 && newVal <= this.s.dt.columns().count()) {
				// Set the new values and redraw the columns
				this.c.end = newVal;
				this._addStyles();
			}

			return this;
		}

		return this.c.end;
	}

	/**
	 * Left fix - accounting for RTL
	 *
	 * @param count Columns to fix, or undefined for getter
	 */
	public left(count?) {
		return this.s.rtl
			? this.end(count)
			: this.start(count);
	}

	/**
	 * Right fix - accounting for RTL
	 *
	 * @param count Columns to fix, or undefined for getter
	 */
	public right(count?) {
		return this.s.rtl
			? this.start(count)
			: this.end(count);
	}

	/**
	 * Getter for the `fixedColumns.start` property
	 *
	 * @param newVal Optional. If present this will be the new value for the number of start fixed columns
	 * @returns The number of start fixed columns
	 */
	public start(): number;
	/**
	 * Setter for the `fixedColumns.start` property
	 *
	 * @param newVal The new value for the number of left fixed columns
	 * @returns DataTables API for chaining
	 */
	public start(newVal: number): any;
	public start(newVal?: number): any {
		// If the value is to change
		if (newVal !== undefined) {
			if (newVal >= 0 && newVal <= this.s.dt.columns().count()) {
				// Set the new values and redraw the columns
				this.c.start = newVal;
				this._addStyles();
			}

			return this;
		}

		return this.c.start;
	}

	/**
	 * Iterates over the columns, fixing the appropriate ones to the left and right
	 */
	private _addStyles() {
		let dt = this.s.dt;
		let that = this;
		let colCount = this.s.dt.columns(':visible').count();
		let headerStruct = dt.table().header.structure(':visible');
		let footerStruct = dt.table().footer.structure(':visible');
		let widths = dt.columns(':visible').widths().toArray();
		let wrapper = $(dt.table().node()).closest('div.dt-scroll');
		let scroller = $(dt.table().node()).closest('div.dt-scroll-body')[0];
		let rtl = this.s.rtl;
		let start = this.c.start;
		let end = this.c.end;
		let left = rtl ? end : start;
		let right = rtl ? start : end;

		// Do nothing if no scrolling in the DataTable
		if (wrapper.length === 0) {
			return this;
		}

		// Loop over the visible columns, setting their state
		dt.columns(':visible').every(function (colIdx) {
			let visIdx = dt.column.index('toVisible', colIdx);
			let offset;

			if (visIdx < start) {
				// Fix to the start
				offset = that._sum(widths, colIdx);

				that._fixColumn(
					colIdx,
					offset,
					'start',
					headerStruct,
					footerStruct
				);
			}
			else if (visIdx >= colCount - end) {
				// Fix to the end
				offset = that._sum(
					widths,
					colCount - visIdx - 1,
					true
				);

				that._fixColumn(
					colIdx,
					offset,
					'end',
					headerStruct,
					footerStruct
				);
			}
			else {
				// Release
				that._fixColumn(colIdx, 0, 'none', headerStruct, footerStruct);
			}
		});

		// Apply classes to table to indicate what state we are in
		$(dt.table().node())
			.toggleClass(that.classes.tableFixedStart, start > 0)
			.toggleClass(that.classes.tableFixedEnd, end > 0)
			.toggleClass(that.classes.tableFixedLeft, left > 0)
			.toggleClass(that.classes.tableFixedRight, right > 0);

		// Blocker elements for when scroll bars are always visible
		let headerEl = dt.table().header();
		let footerEl = dt.table().footer();
		let headerHeight = $(headerEl).outerHeight();
		let footerHeight = $(footerEl).outerHeight();
		let barWidth = dt.settings()[0].oBrowser.barWidth; // dt internal

		// Bar not needed - no vertical scrolling
		if (scroller.offsetWidth === scroller.clientWidth) {
			barWidth = 0;
		}

		this.dom.topBlocker
			.appendTo(wrapper)
			.css('top', 0)
			.css(this.s.rtl ? 'left' : 'right', 0)
			.css('height', headerHeight)
			.css('width', barWidth + 1);

		if (footerEl) {
			this.dom.bottomBlocker
				.appendTo(wrapper)
				.css('bottom', 0)
				.css(this.s.rtl ? 'left' : 'right', 0)
				.css('height', footerHeight)
				.css('width', barWidth + 1);
		}
	}

	/**
	 * Clean up
	 */
	private _destroy() {
		this.s.dt.off('.dtfc');
		this.dom.scroller.off('.dtfc');

		$(this.s.dt.table().node())
			.removeClass(
				this.classes.tableScrollingEnd + ' ' +
				this.classes.tableScrollingLeft + ' ' +
				this.classes.tableScrollingStart + ' ' +
				this.classes.tableScrollingRight
			);

		this.dom.bottomBlocker.remove();
		this.dom.topBlocker.remove();
	}

	/**
	 * Fix or unfix a column
	 *
	 * @param idx Column data index to operate on
	 * @param offset Offset from the start (pixels)
	 * @param side start, end or none to unfix a column
	 * @param header DT header structure object
	 * @param footer DT footer structure object
	 */
	private _fixColumn(
		idx: number,
		offset: number,
		side: 'start' | 'end' | 'none',
		header,
		footer
	) {
		let dt = this.s.dt;
		let applyStyles = (jq) => {
			if (side === 'none') {
				jq.css('position', '')
					.css('left', '')
					.css('right', '')
					.removeClass(
						this.classes.fixedEnd + ' ' +
						this.classes.fixedLeft + ' ' +
						this.classes.fixedRight + ' ' +
						this.classes.fixedStart
					);
			}
			else {
				let positionSide = side === 'start' ? 'left' : 'right';

				if (this.s.rtl) {
					positionSide = side === 'start' ? 'right' : 'left';
				}

				jq.css('position', 'sticky')
					.css(positionSide, offset)
					.addClass(
						side === 'start'
							? this.classes.fixedStart
							: this.classes.fixedEnd
					)
					.addClass(
						positionSide === 'left'
							? this.classes.fixedLeft
							: this.classes.fixedRight
					);
			}
		};

		header.forEach((row) => {
			if (row[idx]) {
				applyStyles($(row[idx].cell));
			}
		});

		applyStyles(dt.column(idx, { page: 'current' }).nodes().to$());

		if (footer) {
			footer.forEach((row) => {
				if (row[idx]) {
					applyStyles($(row[idx].cell));
				}
			});
		}
	}

	/**
	 * Update classes on the table to indicate if the table is scrolling or not
	 */
	private _scroll() {
		let scroller = this.dom.scroller[0];

		// Not a scrolling table
		if (! scroller) {
			return;
		}

		let scrollLeft = scroller.scrollLeft; // 0 when fully scrolled left
		let table = $(this.s.dt.table().node());
		let ltr = ! this.s.rtl;
		let scrollStart = scrollLeft !== 0;
		let scrollEnd = scroller.scrollWidth > (scroller.clientWidth + Math.abs(scrollLeft));

		table.toggleClass(this.classes.tableScrollingStart, scrollStart);
		table.toggleClass(this.classes.tableScrollingEnd, scrollEnd);
		table.toggleClass(this.classes.tableScrollingLeft, (scrollStart && ltr) || (scrollEnd && ! ltr));
		table.toggleClass(this.classes.tableScrollingRight, (scrollEnd && ltr) || (scrollStart && ! ltr));
	}

	private _setKeyTableListener() {
		this.s.dt.on('key-focus.dt.dtfc', (e, dt, cell) => {
			let currScroll;
			let cellPos = $(cell.node()).offset();
			let scroll = $(
				$(this.s.dt.table().node()).closest('div.dt-scroll-body')
			);

			// If there are fixed columns to the left
			if (this.c.start > 0) {
				// Get the rightmost left fixed column header, it's position and it's width
				let rightMost = $(this.s.dt.column(this.c.start - 1).header());
				let rightMostPos = rightMost.offset();
				let rightMostWidth = rightMost.outerWidth();

				// If the current highlighted cell is left of the rightmost cell on the screen
				if (cellPos.left < rightMostPos.left + rightMostWidth) {
					// Scroll it into view
					currScroll = scroll.scrollLeft();
					scroll.scrollLeft(
						currScroll -
							(rightMostPos.left + rightMostWidth - cellPos.left)
					);
				}
			}

			// If there are fixed columns to the right
			if (this.c.end > 0) {
				// Get the number of columns and the width of the cell as doing right side calc
				let numCols = this.s.dt.columns().data().toArray().length;
				let cellWidth = $(cell.node()).outerWidth();

				// Get the leftmost right fixed column header and it's position
				let leftMost = $(
					this.s.dt.column(numCols - this.c.end).header()
				);
				let leftMostPos = leftMost.offset();

				// If the current highlighted cell is right of the leftmost cell on the screen
				if (cellPos.left + cellWidth > leftMostPos.left) {
					// Scroll it into view
					currScroll = scroll.scrollLeft();
					scroll.scrollLeft(
						currScroll -
							(leftMostPos.left - (cellPos.left + cellWidth))
					);
				}
			}
		});

		// Whenever a draw occurs there is potential for the data to have changed and therefore also the column widths
		// Therefore it is necessary to recalculate the values for the fixed columns
		this.s.dt.on('draw.dt.dtfc', () => {
			this._addStyles();
		});

		this.s.dt.on('column-reorder.dt.dtfc', () => {
			this._addStyles();
		});

		this.s.dt.on(
			'column-visibility.dt.dtfc',
			(e, settings, column, state, recalc) => {
				if (recalc && !settings.bDestroying) {
					setTimeout(() => {
						this._addStyles();
					}, 50);
				}
			}
		);
	}

	/**
	 * Sum a range of values from an array
	 *
	 * @param widths
	 * @param index
	 * @returns
	 */
	private _sum(widths: number[], index: number, reverse: boolean = false) {
		if (reverse) {
			widths = widths.slice().reverse();
		}

		return widths.slice(0, index).reduce((accum, val) => accum + val, 0);
	}
}
