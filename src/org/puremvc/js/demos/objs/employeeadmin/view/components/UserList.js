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
var UserList = Objs.add
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
			this.userList = this.userListPanel.find(".user-list");
			this.newButton = this.userListPanel.find(".new-button").button();
			this.deleteButton = this.userListPanel.find(".delete-button").button();	
	    },
		
	    /**
	     * Configure event listeners registration.
	     */
	    configureListeners: function()
	    {
			var that/*UserList*/ = this; //Needed for closure to use "this" reference.
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
		
			var htmlList/*String*/ = "";
			for( var i/*Number*/ = 0; i<this.users.length; i++ )
			{
				var user/*UserVO*/ = this.users[i];
				htmlList += '<li id="' + i  + '-user-list-item"><a href=".">' + user.getGivenName() + '</a></li>';
			}

			this.userList.html(htmlList);
			
			var that/*UserList*/ = this;
			
			/*
			 * We have to bind the event on the <A /> instead of <li /> element
			 * otherwise the event is fired twice for some odd reasons.
			 */
			this.userList.find("a").each
			(
				function()
				{
					$(this).click
					(
						function(evt)
						{
							that.userList_clickHandler(evt);
						}
					) 
				} 
			);
		},
		
		/**
		 * List selection click event listener.
		 * 
		 * <P>
		 * We are currently unable to listen for a <code>select</code> event on an
		 * unumbered list in jQuery so we have to listen for the click on the
		 * whole list and identify the clicked <li /> element.
		 *
		 * @param {Event} event
		 * 		The native Event propagated by jQuery.
		 */
		userList_clickHandler: function( event )
		{
			event.preventDefault()
			var li/*HTMLElement*/ = $(event.currentTarget).parents("li");
			
			//Index of the clicked list item
			var entry/*Number*/ = parseInt( $(li).attr("id") );			
			this.dispatchEvent( UserList.SELECT, this.users[entry] );
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