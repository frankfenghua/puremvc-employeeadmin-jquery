/*
 PureMVC Javascript Employee Admin Demo for Mootools by Frederic Saunier <frederic.saunier@puremvc.org> 
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved. 
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * The UI component in charge of the <em>User List</em>.
 * 
 * @extends org.puremvc.js.demos.objs.employeeadmin.view.components.UiComponent UiComponent
 */
var UserList = Objs
(
	"org.puremvc.js.demos.objs.employeeadmin.view.components.UserList",
	UiComponent,
	{

		/**
		 * The user list panel HTML element.
		 * 
		 * @type {HTMLElement}
		 * @private
		 */
		userListPanel/*HTMLElement*/: null,
		
		/**
		 * The user list HTML element.
		 * 
		 * @type {HTMLElement}
		 * @private
		 */
		userList/*HTMLElement*/: null,
		
		/**
		 * The "new" button HTML element.
		 * 
		 * @type {HTMLElement}
		 * @private
		 */
		newButton/*HTMLElement*/: null,
		
		/**
		 * The user list of the application.
		 * 
		 * @type {Array}
		 * @private
		 */
		users/*Array*/: null,
		
		/**
		 * Initialize a <code>UserList</code> instance.
		 */
		initialize: function()
		{
			UserList.$super.initialize.call( this );
			
			this.initializeChildren();
			this.configureListeners();
		},
	
	    /**
	     * Initialize references to DOM elements.
	     */
	    initializeChildren: function()
	    {
			this.userListPanel = $(".user-list-panel");

			this.userList = this.userListPanel.find("#user-list");
			
			/*
			this.userList.jqGrid
			(
				{
					datatype: "local",
					width: 630,
					height: 160,
				   	colNames:['User Name', 'First Name', 'Last Name', 'Email', 'Department'],
				   	colModel:
					[
				   		{name:'uname', index:'uname', width:125 },
				   		{name:'fname', index:'fname', width:125 },
				   		{name:'lname', index:'lname', width:125 },
				   		{name:'email', index:'email', width:130 },
				   		{name:'department', index:'department', width:125}
				   	]
				}
			);
			*/
			
			var columns = [
				{id:"uname", name:"User Name", field:"uname"},
				{id:"fname", name:"First Name", field:"fname"},
				{id:"lname", name:"Last Name", field:"lname"},
				{id:"email", name:"Email", field:"email"},
				{id:"department", name:"Department", field:"department"}
			];

			var options = {
				enableCellNavigation: false,
				enableColumnReorder: false
			};

			this.data = [];
			this.grid = new Slick.Grid( this.userList, this.data, columns, options );
	
			this.newButton = this.userListPanel.find(".new-button").button();
			this.deleteButton = this.userListPanel.find(".delete-button").button();	
	    },

	    /**
	     * Configure event listeners registration.
	     */
	    configureListeners: function()
	    {		
			var that/*UserList*/ = this; //Needed for closure to use "this" reference.
			
			//this.userList.jqGrid( 'setGridParam', { onSelectRow: function( id ){ that.userList_selectHandler( id ); } } );
			this.newButton.click( function(evt){ that.newButton_clickHandler(evt) } );
			this.deleteButton.click( function(evt){ that.deleteButton_clickHandler(evt) } );
	    },

		/**
		 * Add users from a list to the <SELECT> component.
		 * 
		 * @param {Array} userList
		 * 		The user list to set.
		 */
		setUsers: function( userList )
		{
			this.users = userList;
			
			this.data.splice(0);
			
			// Fill the data-grid
			for(var i/*Number*/=0; i<userList.length; i++)
			{
				var user/*UserVO*/ = userList[i];
				var rowData/*Object*/ = 
				{
					uname: user.uname,
					fname: user.fname,
					lname: user.lname,
					email: user.email,
					department: user.department.value
				};
				
				this.data.push(rowData);
			}
			
			//this.grid.invalidateRow( this.data.length );
			this.grid.invalidate();
			this.grid.removeAllRows();
			this.grid.updateRowCount();
			this.grid.render();	
		},
		
		/**
		 * List row selection event listener.
		 * 
		 * @param {String} id
		 * 		The id of the selected row.
		 */
		userList_selectHandler: function( id )
		{
			var rowData/*Object*/ = this.userList.jqGrid( 'getRowData', id );
			
			for( var i/*Number*/=0; i<this.users.length; i++ )
				if( this.users[i].uname == rowData.uname )
					this.dispatchEvent( UserList.SELECT, rowData.uname );
		},
		
		/**
		 * New button click event listener. 
		 */
		newButton_clickHandler: function()
		{
			this.dispatchEvent( UserList.NEW );
		},

		/**
		 * New button click event listener. 
		 */
		deleteButton_clickHandler: function()
		{
			this.dispatchEvent( UserList.DELETE );
		}
	}
);

/*
 * Events type
 */
UserList.NEW/*String*/ 		= "new";
UserList.DELETE/*String*/ 	= "delete";
UserList.SELECT/*String*/ 	= "select";