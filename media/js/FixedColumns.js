/*
 * File:        FixedColumns.js
 * Version:     1.0.2.dev
 * Description: "Fix" columns on the left of a scrolling DataTable
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Created:     Sat Sep 18 09:28:54 BST 2010
 * Language:    Javascript
 * License:     GPL v2 or BSD 3 point style
 * Project:     Just a little bit of fun - enjoy :-)
 * Contact:     www.sprymedia.co.uk/contact
 * 
 * Copyright 2010 Allan Jardine, all rights reserved.
 */

var FixedColumns = function ( oDT, oInit ) {
	/* Sanity check - you just know it will happen */
	if ( typeof this._fnConstruct != 'function' )
	{
		alert( "FixedColumns warning: FixedColumns must be initialised with the 'new' keyword." );
		return;
	}
	
	if ( typeof oInit == 'undefined' )
	{
		oInit = {};
	}
	
	/**
	 * @namespace Settings object which contains customisable information for FixedColumns instance
	 */
	this.s = {
		/** 
		 * DataTables settings objects
     *  @property dt
     *  @type     object
     *  @default  null
		 */
		"dt": oDT.fnSettings(),
		
		/** 
		 * Number of columns to fix in position
     *  @property columns
     *  @type     int
     *  @default  1
		 */
		"columns": 1
	};
	
	
	/**
	 * @namespace Common and useful DOM elements for the class instance
	 */
	this.dom = {
		/**
		 * DataTables scrolling element
		 *  @property scroller
		 *  @type     node
		 *  @default  null
		 */
		"scroller": null,
		
		/**
		 * DataTables header table
		 *  @property header
		 *  @type     node
		 *  @default  null
		 */
		"header": null,
		
		/**
		 * DataTables body table
		 *  @property body
		 *  @type     node
		 *  @default  null
		 */
		"body": null,
		
		/**
		 * DataTables footer table
		 *  @property footer
		 *  @type     node
		 *  @default  null
		 */
		"footer": null,
		
		/**
		 * @namespace Cloned table nodes
		 */
		"clone": {
			/**
			 * Cloned header table
			 *  @property header
			 *  @type     node
			 *  @default  null
			 */
			"header": null,
		
			/**
			 * Cloned body table
			 *  @property body
			 *  @type     node
			 *  @default  null
			 */
			"body": null,
		
			/**
			 * Cloned footer table
			 *  @property footer
			 *  @type     node
			 *  @default  null
			 */
			"footer": null
		}
	};
	
	/* Let's do it */
	this._fnConstruct( oInit );
};


FixedColumns.prototype = {
	/**
	 * Update the fixed columns - including headers and footers
	 *  @method  fnUpdate
	 *  @returns void
	 */
	"fnUpdate": function ()
	{
		this._fnClone( true );
		this._fnScroll();
	},
	
	
	/**
	 * Initialisation for FixedColumns
	 *  @method  _fnConstruct
	 *  @param   {Object} oInit User settings for initialisation
	 *  @returns void
	 */
	"_fnConstruct": function ( oInit )
	{
		var that = this;
		
		/* Sanity checking */
		if ( typeof this.s.dt.oInstance.fnVersionCheck != 'function' ||
		     this.s.dt.oInstance.fnVersionCheck( '1.7.0' ) !== true )
		{
			alert( "FixedColumns 2 required DataTables 1.7.0 or later. "+
				"Please upgrade your DataTables installation" );
			return;
		}
		
		if ( this.s.dt.oScroll.sX === "" )
		{
			this.s.dt.oInstance.oApi._fnLog( this.s.dt, 1, "FixedColumns is not needed (no "+
				"x-scrolling in DataTables enabled), so no action will be taken. Use 'FixedHeader' for "+
				"column fixing when scrolling is not enabled" );
			return;
		}
		
		if ( typeof oInit.columns != 'undefined' )
		{
			if ( oInit.columns < 1 )
			{
				this.s.dt.oInstance.oApi._fnLog( this.s.dt, 1, "FixedColumns is not needed (no "+
					"columns to be fixed), so no action will be taken" );
				return;
			}
			this.s.columns = oInit.columns;
		}
		
		/* Set up the DOM as we need it and cache nodes */
		this.dom.body = this.s.dt.nTable;
		this.dom.scroller = this.dom.body.parentNode;
		this.dom.scroller.style.position = "relative";
		
		this.dom.header = this.s.dt.nTHead.parentNode;
		this.dom.header.parentNode.parentNode.style.position = "relative";
		
		if ( this.s.dt.nTFoot )
		{
			this.dom.footer = this.s.dt.nTFoot.parentNode;
			this.dom.footer.parentNode.parentNode.style.position = "relative";
		}
		
		/* Event handlers */
		$(this.dom.scroller).scroll( function () {
			that._fnScroll.call( that );
		} );
		
		this.s.dt.aoDrawCallback.push( {
			"fn": function () {
				that._fnClone.call( that, false );
				that._fnScroll.call( that );
			},
			"sName": "FixedColumns"
		} );
		
		/* Get things right to start with */
		this._fnClone( true );
		this._fnScroll();
	},
	
	
	/**
	 * Clone the DataTable nodes and place them in the DOM (sized correctly)
	 *  @method  _fnClone
	 *  @returns void
	 *  @param   {Boolean} bAll Indicate if the headre and footer should be updated as well (true)
	 *  @private
	 */
	"_fnClone": function ( bAll )
	{
		var
			that = this,
			iTableWidth = 0,
			aiCellWidth = [],
			i, iLen, jq;
		
		/* Grab the widths that we are going to need */
		for ( i=0, iLen=this.s.columns ; i<iLen ; i++ )
		{
			jq = $('thead tr:eq(0)', this.dom.header).children(':eq('+i+')');
			iTableWidth += jq.outerWidth();
			aiCellWidth.push( jq.width() );
		}
		
		/* Header */
		if ( bAll )
		{
			if ( this.dom.clone.header !== null )
			{
				this.dom.clone.header.parentNode.removeChild( this.dom.clone.header );
			}
			this.dom.clone.header = $(this.dom.header).clone(true)[0];
			this.dom.clone.header.className += " FixedColumns_Cloned";
			
			$('thead tr', this.dom.clone.header).each( function () {
				$(this).children(':gt('+(that.s.columns-1)+')').remove();
			} );
			
			this.dom.clone.header.style.position = "absolute";
			this.dom.clone.header.style.top = "0px";
			this.dom.clone.header.style.left = "0px";
			this.dom.clone.header.style.width = iTableWidth+"px";
			this.dom.header.parentNode.appendChild( this.dom.clone.header );
		}
		
		this.fnEqualiseHeights( 'thead', this.dom.header, this.dom.clone.header );
		$('thead tr:eq(0)', this.dom.clone.header).children().each( function (i) {
			this.style.width = aiCellWidth[i]+"px";
		} );
		
		
		/* Body */
		/* Remove any heights which have been applied already and let the browser figure it out */
		$('tbody tr', that.dom.body).css('height', 'auto');
		
		if ( this.dom.clone.body !== null )
		{
			this.dom.clone.body.parentNode.removeChild( this.dom.clone.body );
			this.dom.clone.body = null;
		}
		
		if ( this.s.dt.aiDisplay.length > 0 )
		{
			this.dom.clone.body = $(this.dom.body).clone(true)[0];
			this.dom.clone.body.className += " FixedColumns_Cloned";
			if ( this.dom.clone.body.getAttribute('id') !== null )
			{
				this.dom.clone.body.removeAttribute('id');
			}
			
			$('thead tr:eq(0)', this.dom.clone.body).each( function () {
				$('th:gt('+(that.s.columns-1)+')', this).remove();
			} );
			
			$('thead tr:gt(0)', this.dom.clone.body).remove();
			
			this.fnEqualiseHeights( 'tbody', that.dom.body, this.dom.clone.body );
			
			$('tfoot tr:eq(0)', this.dom.clone.body).each( function () {
				$('th:gt('+(that.s.columns-1)+')', this).remove();
			} );
			
			$('tfoot tr:gt(0)', this.dom.clone.body).remove();
			
			
			this.dom.clone.body.style.position = "absolute";
			this.dom.clone.body.style.top = "0px";
			this.dom.clone.body.style.left = "0px";
			this.dom.clone.body.style.width = iTableWidth+"px";
			this.dom.body.parentNode.appendChild( this.dom.clone.body );
		}
		
		/* Footer */
		if ( this.s.dt.nTFoot !== null )
		{
			if ( bAll )
			{
				if ( this.dom.clone.footer !== null )
				{
					this.dom.clone.footer.parentNode.removeChild( this.dom.clone.footer );
				}
				this.dom.clone.footer = $(this.dom.footer).clone(true)[0];
				this.dom.clone.footer.className += " FixedColumns_Cloned";
				
				
				$('tfoot tr', this.dom.clone.footer).each( function () {
					$(this).children(':gt('+(that.s.columns-1)+')').remove();
				} );
				
				this.dom.clone.footer.style.position = "absolute";
				this.dom.clone.footer.style.top = "0px";
				this.dom.clone.footer.style.left = "0px";
				this.dom.clone.footer.style.width = iTableWidth+"px";
				this.dom.footer.parentNode.appendChild( this.dom.clone.footer );
			}
			
			this.fnEqualiseHeights( 'tfoot', this.dom.footer, this.dom.clone.footer );
			
			$('tfoot tr:eq(0)', this.dom.clone.footer).children().each( function (i) {
				this.style.width = aiCellWidth[i]+"px";
			} );
		}
	},
	
	
	/**
	 * Equalise the heights of the rows in a given table txxxx node in a cross browser way
	 *  @method  fnEqualiseHeights
	 *  @returns void
	 *  @param   {string} parent Node type - thead, tbody or tfoot
	 *  @param   {element} original Original node to take the heights from
	 *  @param   {element} clone Copy the heights to
	 *  @private
	 */
	"fnEqualiseHeights": function ( parent, original, clone )
	{
		var that = this,
			jqBoxHack = $(parent+' tr:eq(0)', original).children(':eq(0)'),
			iBoxHack = jqBoxHack.outerHeight() - jqBoxHack.height(),
			bRubbishOldIE = ($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0"));
		
		/* Remove cells which are not needed and copy the height from the original table */
		$(parent+' tr', clone).each( function (k) {
			$(this).children(':gt('+(that.s.columns-1)+')', this).remove();
			
			/* Can we use some kind of object detection here?! This is very nasty - damn browsers */
			if ( $.browser.mozilla || $.browser.opera )
			{
				$(this).children().height( $(parent+' tr:eq('+k+')', original).outerHeight() );
			}
			else
			{
				$(this).children().height( $(parent+' tr:eq('+k+')', original).outerHeight() - iBoxHack );
			}
			
			if ( !bRubbishOldIE )
			{
				$(parent+' tr:eq('+k+')', original).height( $(parent+' tr:eq('+k+')', original).outerHeight() );		
			}
		} );
	},
	
	
	/**
	 * Set the absolute position of the fixed column tables when scrolling the DataTable
	 *  @method  _fnScroll
	 *  @returns void
	 *  @private
	 */
	"_fnScroll": function ()
	{
		var iScrollLeft = $(this.dom.scroller).scrollLeft();
		
		this.dom.clone.header.style.left = iScrollLeft+"px";
		if ( this.dom.clone.body !== null )
		{
			this.dom.clone.body.style.left = iScrollLeft+"px";
		}
		if ( this.dom.footer )
		{
			this.dom.clone.footer.style.left = iScrollLeft+"px";
		}
	}
};
