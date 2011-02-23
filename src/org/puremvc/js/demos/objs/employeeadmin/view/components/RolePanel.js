/*
 PureMVC Javascript Employee Admin Demo for Mootools by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @classDescription
 * The UI component in charge of the <em>role panel</em>.
 * 
 * @extends org.puremvc.js.demos.objs.employeeadmin.view.components.UiComponent UiComponent
 *
 * @constructor
 */
var RolePanel = Objs.add
(
	"org.puremvc.js.demos.objs.employeeadmin.view.components.RolePanel",
	UiComponent,
	{
		/** 
		 * Currently selected user.
		 * 
		 * @private
		 * @type {UserVO}
		 */
		user: null,
	
		/**
		 * Currently selected role.
		 * 
		 * @private
		 * @type {UserRole}
		 */
		selectedRole: null,
	
		/**
		 * The add or remove role mode.
		 */
		mode: null,
				
		/**
		 * The role panel HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		rolePanel: null,
				
		/**
		 * The full role list HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		roleList: null,
		
		/**
		 * The user role datagrid HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		userRoleList: null,
		
		/**
		 * The add role button HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		addRoleButton: null,
		
		/**
		 * The remove role button HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		removeRoleButton: null,
	
		/**
		 * Initialize a <code>UserList</code> instance.
		 */
		initialize: function()
		{
			RolePanel.$super.initialize.call( this );
			
			this.initializeChildren();
			this.configureListeners();
			
			this.fillRoleList();
			this.setEnabled(false);
		},
	
	    /**
	     * Initialize references to DOM elements.
	     */
	    initializeChildren: function()
	    {
			this.rolePanel = $(".role-panel");
			this.userRoleList = this.rolePanel.find(".user-role-list");
			this.roleList = this.rolePanel.find(".role-list");
			this.addRoleButton = this.rolePanel.find(".add-role-button").button();
			this.removeRoleButton = this.rolePanel.find(".remove-role-button").button();
	    },

	    /**
	     * Configure event listeners registration.
	     */
	    configureListeners: function()
	    {
			var that/*RolePanel*/ = this; //Needed for closures to use "this" reference.
			this.addRoleButton.click( function(evt){ that.addRoleButton_clickHandler } );
			this.removeRoleButton.click( function(evt){ that.removeRoleButton_clickHandler } );
			this.roleList.change( function(evt){ that.roleList_changeHandler } );
			this.userRoleList.change( function(evt){ that.userRoleList_changeHandler } );
	    },

		/**
		 * Add items from <code>RoleEnum</code> to the <code>roleList</code>
		 * component.
		 */
		fillRoleList: function()
		{
			var roleEnumList/*Array*/ = RoleEnum.getComboList();
	
			/*First clear all*/
			while( this.roleList.firstChild )
				this.roleList.removeChild( this.roleList.firstChild );
	
			for(var i=0; i<roleEnumList.length; i++)
			{
				var role/*RoleVO*/ = roleEnumList[i];
				var option/*HTMLElement*/ = this.roleList.append( $("<option />") );
				option.associatedValue = role;
				option.text = role.value;
			}
		},

		/**
		 * Set the displayed user roles list.
		 * 
		 * @param {Array} userRoles
		 * 		The role list associated to the currently selected user.
		 */
		setUserRoles: function( userRoles )
		{
			/*First clear all*/
			this.userRoleList.empty();
	
			if( !userRoles )
				return;
	
			for( var i/*Number*/=0; i<userRoles.length; i++ )
			{
				var role/*RoleVO*/ = userRoles[i];
				var option/*HTMLElement*/ = this.userRoleList.append( $("<option />") );
				option.associatedValue = role;
				option.text(role.value);
			}
		},

		/**
		 * Enable or disable the form.
		 * 
		 * @param {Boolean} isEnabled
		 * 		When true enable the form and when false disable it. 
		 */
		setEnabled: function( isEnabled )
		{
			this.addRoleButton.disabled =
			this.removeRoleButton.disabled =
				!isEnabled;
	
			this.userRoleList.disabled =
			this.roleList.disabled =
				!isEnabled;
			
			if( !isEnabled )
				this.roleList.selectedIndex = -1;
		},

		/**
		 * Enable or disable the form.
		 *
		 * @param {String} mode
		 *		The Add/Remove role mode of the form.
		 */
		setMode: function( mode )
		{
			switch( mode )
			{
				case RolePanel.ADD_MODE:
					this.addRoleButton.disabled = false;
					this.removeRoleButton.disabled = true;
				break;
				
				case RolePanel.REMOVE_MODE:
					this.addRoleButton.disabled = true;
					this.removeRoleButton.disabled = false;
					this.roleList.selectedIndex = 0;
				break;
	
				default:
					this.addRoleButton.disabled = true;
					this.removeRoleButton.disabled = true;
			}
		},

		/**
		 * Clear the panel from all its displayed data.
		 */
		clearForm: function()
		{
			this.user = null;
			this.setUserRoles(null);
			this.roleList.selectedIndex = 0;
		},

		/**
		 * Add button onclick event listener.
		 */
		addRoleButton_clickHandler: function()
		{
			this.dispatchEvent( RolePanel.ADD );
		},

		/**
		 * Remove button onclick event listener.
		 */
		removeRoleButton_clickHandle: function()
		{
			this.dispatchEvent( RolePanel.REMOVE );
		},

		/**
		 * Select role to remove.
		 */
		userRoleList_changeHandler: function()
		{
			this.roleList.selectedIndex = -1;
			this.selectedRole = this.userRoleList.options[ this.userRoleList.selectedIndex ].associatedValue;
			
			this.setMode( RolePanel.REMOVE_MODE );
		},

		/**
		 * Select role to add.
		 */
		roleList_changeHandler: function()
		{
			this.userRoleList.selectedIndex = -1;
			this.selectedRole = this.roleList[this.roleList.selectedIndex].associatedValue;
			
			if( this.selectedRole == RoleEnum.NONE_SELECTED )
				this.setMode( null );
			else
				this.setMode( RolePanel.ADD_MODE );
		}
	}
);

/*
 * Event names
 */
RolePanel.REMOVE/*String*/ 			= "remove";
RolePanel.ADD_MODE/*String*/ 		= "addMode";
RolePanel.REMOVE_MODE/*String*/ 	= "removeMode";