import DataTable, { Api, Dom, HeaderStructure } from 'datatables.net';
import './interface';

const dom = DataTable.dom;
const util = DataTable.util;

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
	dt: Api;
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
	bottomBlocker: Dom;
	topBlocker: Dom;
	scroller: Dom;
}

export default class FixedColumns {
	private static version = '6.0.0-dev';

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

		this.classes = util.object.assignDeep({}, FixedColumns.classes);

		// Get options from user
		this.c = util.object.assignDeep({}, FixedColumns.defaults, opts);

		this.s = {
			dt: table,
			rtl: dom.s(table.table().node()).css('direction') === 'rtl'
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
			bottomBlocker: dom.c('div').classAdd(this.classes.bottomBlocker),
			topBlocker: dom.c('div').classAdd(this.classes.topBlocker),
			scroller: dom
				.s(this.s.dt.table().container())
				.find('div.dt-scroll-body')
		};

		if (this.s.dt.settings()[0].initDone) {
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

		// Lots or reasons to redraw the column styles
		table.on(
			'column-sizing.dt.dtfc column-reorder.dt.dtfc draw.dt.dtfc',
			() => this._addStyles()
		);

		// Column visibility can trigger a number of times quickly, so we debounce it
		let debounced = DataTable.util.debounce(() => {
			this._addStyles();
		}, 50);

		table.on('column-visibility.dt.dtfc', () => {
			debounced();
		});

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
	public left(count?: number) {
		return this.s.rtl ? this.end(count) : this.start(count);
	}

	/**
	 * Right fix - accounting for RTL
	 *
	 * @param count Columns to fix, or undefined for getter
	 */
	public right(count?: number) {
		return this.s.rtl ? this.start(count) : this.end(count);
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
		let wrapper = dom.s(dt.table().node()).closest('div.dt-scroll');
		let scroller = dom
			.s(dt.table().node())
			.closest('div.dt-scroll-body')
			.get(0);
		let rtl = this.s.rtl;
		let start = this.c.start;
		let end = this.c.end;
		let left = rtl ? end : start;
		let right = rtl ? start : end;
		let barWidth = dt.settings()[0].browser.barWidth; // dt internal

		// Do nothing if no scrolling in the DataTable
		if (wrapper.count() === 0) {
			return this;
		}

		// Bar not needed - no vertical scrolling
		if (scroller.offsetWidth === scroller.clientWidth) {
			barWidth = 0;
		}

		// Loop over the visible columns, setting their state
		dt.columns().every(function (colIdx) {
			let visIdx = dt.column.index('toVisible', colIdx);
			let offset;

			// Skip the hidden columns
			if (visIdx === null) {
				return;
			}

			if (visIdx < start) {
				// Fix to the start
				offset = that._sum(widths, visIdx);

				that._fixColumn(
					visIdx,
					offset,
					'start',
					headerStruct,
					footerStruct,
					barWidth
				);
			}
			else if (visIdx >= colCount - end) {
				// Fix to the end
				offset = that._sum(widths, colCount - visIdx - 1, true);

				that._fixColumn(
					visIdx,
					offset,
					'end',
					headerStruct,
					footerStruct,
					barWidth
				);
			}
			else {
				// Release
				that._fixColumn(
					visIdx,
					0,
					'none',
					headerStruct,
					footerStruct,
					barWidth
				);
			}
		});

		// Apply classes to table to indicate what state we are in
		dom.s(dt.table().node())
			.classToggle(that.classes.tableFixedStart, start > 0)
			.classToggle(that.classes.tableFixedEnd, end > 0)
			.classToggle(that.classes.tableFixedLeft, left > 0)
			.classToggle(that.classes.tableFixedRight, right > 0);

		// Blocker elements for when scroll bars are always visible
		let headerEl = dt.table().header();
		let footerEl = dt.table().footer();
		let headerHeight = dom.s(headerEl).height('outer');
		let footerHeight = dom.s(footerEl).height('outer');

		this.dom.topBlocker
			.appendTo(wrapper)
			.css('top', '0')
			.css(this.s.rtl ? 'left' : 'right', '0')
			.css('height', headerHeight + 'px')
			.css('width', (barWidth + 1) + 'px')
			.css('display', barWidth ? 'block' : 'none');

		if (footerEl) {
			this.dom.bottomBlocker
				.appendTo(wrapper)
				.css('bottom', '0')
				.css(this.s.rtl ? 'left' : 'right', '0')
				.css('height', footerHeight + 'px')
				.css('width', (barWidth + 1) + 'px')
				.css('display', barWidth ? 'block' : 'none');
		}
	}

	/**
	 * Clean up
	 */
	private _destroy() {
		this.s.dt.off('.dtfc');
		this.dom.scroller.off('.dtfc');

		dom.s(this.s.dt.table().node()).classRemove(
			this.classes.tableScrollingEnd +
				' ' +
				this.classes.tableScrollingLeft +
				' ' +
				this.classes.tableScrollingStart +
				' ' +
				this.classes.tableScrollingRight
		);

		this.dom.bottomBlocker.remove();
		this.dom.topBlocker.remove();
	}

	/**
	 * Fix or unfix a column
	 *
	 * @param idx Column visible index to operate on
	 * @param offset Offset from the start (pixels)
	 * @param side start, end or none to unfix a column
	 * @param header DT header structure object
	 * @param footer DT footer structure object
	 */
	private _fixColumn(
		idx: number,
		offset: number,
		side: 'start' | 'end' | 'none',
		header: HeaderStructure[][],
		footer: HeaderStructure[][],
		barWidth: number
	) {
		let dt = this.s.dt;
		let applyStyles = (item: Dom, part: string) => {
			if (side === 'none') {
				item.css('position', '')
					.css('left', '')
					.css('right', '')
					.classRemove(
						this.classes.fixedEnd +
							' ' +
							this.classes.fixedLeft +
							' ' +
							this.classes.fixedRight +
							' ' +
							this.classes.fixedStart
					);
			}
			else {
				let positionSide = side === 'start' ? 'left' : 'right';

				if (this.s.rtl) {
					positionSide = side === 'start' ? 'right' : 'left';
				}

				var off = offset;

				if (
					side === 'end' &&
					(part === 'header' || part === 'footer')
				) {
					off += barWidth;
				}

				item.css('position', 'sticky')
					.css(positionSide, off + 'px')
					.classAdd(
						side === 'start'
							? this.classes.fixedStart
							: this.classes.fixedEnd
					)
					.classAdd(
						positionSide === 'left'
							? this.classes.fixedLeft
							: this.classes.fixedRight
					);
			}
		};

		header.forEach(row => {
			if (row[idx]) {
				applyStyles(dom.s(row[idx].cell), 'header');
			}
		});

		applyStyles(
			dom.s(
				dt
					.column(idx + ':visible', { page: 'current' })
					.nodes()
					.toArray()
			),
			'body'
		);

		if (footer) {
			footer.forEach(row => {
				if (row[idx]) {
					applyStyles(dom.s(row[idx].cell), 'footer');
				}
			});
		}
	}

	/**
	 * Update classes on the table to indicate if the table is scrolling or not
	 */
	private _scroll() {
		let scroller = this.dom.scroller.get(0);

		// Not a scrolling table
		if (!scroller) {
			return;
		}

		// Need to update the classes on potentially multiple table tags. There is the
		// main one, the scrolling ones and if FixedHeader is active, the holding
		// position ones! jQuery will deduplicate for us.
		let table = dom
			.s(this.s.dt.table().node())
			.add(this.s.dt.table().header().parentNode as HTMLElement)
			.add(this.s.dt.table().footer().parentNode as HTMLElement)
			.add(
				dom
					.s(this.s.dt.table().container())
					.find('div.dt-scroll-headInner table')
					.get(0)
			)
			.add(
				dom
					.s(this.s.dt.table().container())
					.find('div.dt-scroll-footInner table')
					.get(0)
			);

		let scrollLeft = scroller.scrollLeft; // 0 when fully scrolled left
		let ltr = !this.s.rtl;
		let scrollStart = scrollLeft !== 0;
		let scrollEnd =
			scroller.scrollWidth >
			scroller.clientWidth + Math.abs(scrollLeft) + 1; // extra 1 for Chrome

		table.classToggle(this.classes.tableScrollingStart, scrollStart);
		table.classToggle(this.classes.tableScrollingEnd, scrollEnd);
		table.classToggle(
			this.classes.tableScrollingLeft,
			(scrollStart && ltr) || (scrollEnd && !ltr)
		);
		table.classToggle(
			this.classes.tableScrollingRight,
			(scrollEnd && ltr) || (scrollStart && !ltr)
		);
	}

	private _setKeyTableListener() {
		this.s.dt.on('key-focus.dt.dtfc', (e, dt, cell) => {
			let currScroll;
			let cellPos = dom.s(cell.node()).offset();
			let scroller = this.dom.scroller.get(0);
			let scroll = dom
				.s(this.s.dt.table().node())
				.closest('div.dt-scroll-body');

			// If there are fixed columns to the left
			if (this.c.start > 0) {
				// Get the rightmost left fixed column header, it's position and it's width
				let rightMost = dom.s(
					this.s.dt.column(this.c.start - 1).header()
				);
				let rightMostPos = rightMost.offset();
				let rightMostWidth = rightMost.width('outer');

				// If the current highlighted cell is left of the rightmost cell on the screen
				if (dom.s(cell.node()).classHas(this.classes.fixedLeft)) {
					// Fixed columns have the scrollbar at the start, always
					scroll.scrollLeft(0);
				}
				else if (cellPos.left < rightMostPos.left + rightMostWidth) {
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
				let cellWidth = dom.s(cell.node()).width('outer');

				// Get the leftmost right fixed column header and it's position
				let leftMost = dom.s(
					this.s.dt.column(numCols - this.c.end).header()
				);
				let leftMostPos = leftMost.offset();

				// If the current highlighted cell is right of the leftmost cell on the screen
				if (dom.s(cell.node()).classHas(this.classes.fixedRight)) {
					scroll.scrollLeft(
						scroller.scrollWidth - scroller.clientWidth
					);
				}
				else if (cellPos.left + cellWidth > leftMostPos.left) {
					// Scroll it into view
					currScroll = scroll.scrollLeft();
					scroll.scrollLeft(
						currScroll -
							(leftMostPos.left - (cellPos.left + cellWidth))
					);
				}
			}
		});
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
