let $;
let dataTable;

export function setJQuery(jq) {
	$ = jq;
	dataTable = $.fn.dataTable;
}

export interface IDefaults {
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
}

export interface IDOM {
	leftBottomBlocker: JQuery<HTMLElement>;
	leftTopBlocker: JQuery<HTMLElement>;
	rightBottomBlocker: JQuery<HTMLElement>;
	rightTopBlocker: JQuery<HTMLElement>;
}

export default class FixedColumns {
	private static version = '4.0.0';

	private static classes: IClasses = {
		fixedLeft: 'dtfc-fixed-left',
		fixedRight: 'dtfc-fixed-right',
		leftBottomBlocker: 'dtfc-left-bottom-blocker',
		leftTopBlocker: 'dtfc-left-top-blocker',
		rightBottomBlocker: 'dtfc-right-bottom-blocker',
		rightTopBlocker: 'dtfc-right-top-blocker',
	};

	private static defaults: IDefaults = {
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

		if(this.s.dt.init().scrollY !== false) {
			this.s.barWidth = this.s.dt.settings()[0].oBrowser.barWidth;
		}

		this.dom = {
			leftBottomBlocker: $('<div>')
				.css({
					'background-color': 'white',
					'border-top': '1px solid black',
					'bottom': '0px',
					'display': 'block',
					'left': '0px',
					'position': 'absolute',
					'width': this.s.barWidth+1+'px'
				})
				.addClass(this.classes.leftBottomBlocker),
			leftTopBlocker: $('<div>')
				.css({
					'background-color': 'white',
					'border-bottom': '1px solid black',
					'bottom': '0px',
					'display': 'block',
					'left': '0px',
					'position': 'absolute',
					'top': '0px',
					'width': this.s.barWidth+1+'px'
				})
				.addClass(this.classes.leftTopBlocker),
			rightBottomBlocker: $('<div>')
				.css({
					'background-color': 'white',
					'border-top': '1px solid black',
					'bottom': '0px',
					'display': 'block',
					'position': 'absolute',
					'right': '0px',
					'width': this.s.barWidth+1+'px',
				})
				.addClass(this.classes.rightBottomBlocker),
			rightTopBlocker: $('<div>')
				.css({
					'background-color': 'white',
					'border-bottom': '1px solid black',
					'bottom': '0px',
					'display': 'block',
					'position': 'absolute',
					'right': '0px',
					'top': '0px',
					'width': this.s.barWidth+1+'px',
				})
				.addClass(this.classes.rightTopBlocker)
		};

		this._addStyles();
		this._setKeyTableListener();
	}

	private _addStyles() {
		let header = this.s.dt.column(0).header();
		let headerHeight = null;
		let parentDiv = null;
		if(header !== null) {
			header = $(header);
			headerHeight = header.outerHeight();
			parentDiv = $(header.closest('div.dataTables_scroll')).css({position: 'relative'});
		}

		let footer = this.s.dt.column(0).footer();
		let footerHeight = null;
		if(footer !== null) {
			footer = $(footer);
			footerHeight = footer.outerHeight();
			parentDiv = $(footer.closest('div.dataTables_scroll')).css({position: 'relative'});
		}

		let numCols = this.s.dt.columns().data().toArray().length;

		if(this.c.left > 0) {
			let distLeft = 0;
			for (let i = 0; i < this.c.left; i++) {
				if(i !== 0) {
					distLeft += $(this.s.dt.column(i-1).nodes()[0]).outerWidth();
				}
				let rows = $(this.s.dt.table().node()).children('tbody').children('tr');
				for(let row of rows) {
					$($(row).children()[i])
						.css(
							!this.s.rtl ?
								{
									left: distLeft +'px',
									position: 'sticky'
								} :
								{
									position: 'sticky',
									right: distLeft +'px'
								}
						)
						.addClass(this.classes.fixedLeft);
				}
				$(this.s.dt.column(i).header())
					.css(
						!this.s.rtl ?
							{
								left: distLeft+'px',
								position: 'sticky'
							} :
							{
								position: 'sticky',
								right: distLeft + this.s.barWidth + 'px'
							}
					)
					.addClass(this.classes.fixedLeft);
				$(this.s.dt.column(i).footer())
					.css(
						!this.s.rtl ?
							{
								left: distLeft+'px',
								position: 'sticky'
							} :
							{
								position: 'sticky',
								right: distLeft + this.s.barWidth+'px'
							}
					)
					.addClass(this.classes.fixedLeft);
			}

			if(header !== null && !header.hasClass('index') && this.s.rtl) {
				this.dom.leftTopBlocker.outerHeight(headerHeight);
				parentDiv.append(this.dom.leftTopBlocker);
			}

			if(footer !== null && !footer.hasClass('index') && this.s.rtl) {
				this.dom.leftBottomBlocker.outerHeight(footerHeight);
				parentDiv.append(this.dom.leftBottomBlocker);
			}
		}
		if(this.c.right > 0) {
			let distRight = 0;
			for (let i = 0; i < this.c.right; i++) {
				if(i !== 0) {
					distRight += $(this.s.dt.column(numCols - i).nodes()[0]).outerWidth();
				}
				let rows = $(this.s.dt.table().node()).children('tbody').children('tr');
				for(let row of rows) {
					$($(row).children()[numCols - i-1])
						.css(
							!this.s.rtl ?
								{
									position: 'sticky',
									right: distRight+'px'
								} :
								{
									left: distRight+'px',
									position: 'sticky'
								}
						)
						.addClass(this.classes.fixedRight);
				}
				$(this.s.dt.column(numCols - i-1).header())
					.css(
						!this.s.rtl ?
							{
								position: 'sticky',
								right: distRight+this.s.barWidth + 'px'
							} :
							{
								left: distRight+'px',
								position: 'sticky'
							}
					)
					.addClass(this.classes.fixedRight);
				$(this.s.dt.column(numCols - i-1).footer())
					.css(
						!this.s.rtl ?
							{
								position: 'sticky',
								right: distRight+this.s.barWidth+'px'
							} :
							{
								left: distRight+'px',
								position: 'sticky'
							}
					)
					.addClass(this.classes.fixedRight);
			}
		}
		if(!this.s.rtl) {
			this.dom.rightTopBlocker.outerHeight(headerHeight);
			parentDiv.append(this.dom.rightTopBlocker);
		}
		if(footer && !this.s.rtl) {
			this.dom.rightBottomBlocker.outerHeight(footerHeight);
			parentDiv.append(this.dom.rightBottomBlocker);
		}
	}

	private _setKeyTableListener() {
		this.s.dt.on('key-focus', (e, dt, cell, originalEvent) => {
			let cellPos = $(cell.node()).offset();
			let scroll = $($(this.s.dt.table().node()).closest('div.dataTables_scrollBody'));

			if(this.c.left > 0) {
				let leftMost = $(this.s.dt.column(this.c.left-1).header());
				let leftMostPos = leftMost.offset();
				let leftMostWidth = leftMost.outerWidth();
				if(cellPos.left < leftMostPos.left + leftMostWidth) {
					let currScroll = scroll.scrollLeft();
					scroll.scrollLeft(currScroll - ((leftMostPos.left + leftMostWidth) - cellPos.left));
				}
			}

			if(this.c.right > 0) {
				let numCols = this.s.dt.columns().data().toArray().length;
				let cellWidth = $(cell.node()).outerWidth();
				let rightMost = $(this.s.dt.column(numCols - this.c.right).header());
				let rightMostPos = rightMost.offset();
				if(cellPos.left + cellWidth > rightMostPos.left) {
					let currScroll = scroll.scrollLeft();
					scroll.scrollLeft(currScroll - (rightMostPos.left - (cellPos.left + cellWidth)));
				}
			}

		});
	}
}
