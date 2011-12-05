/*
 PureMVC Javascript Employee Admin Demo for Mootools by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @classDescription
 * The UI component in charge of the <em>user form</em>.
 * 
 * @extends org.puremvc.js.demos.objs.employeeadmin.view.components.UiComponent UiComponent
 *
 * @constructor
 */
var UserForm = Objs
(
	"org.puremvc.js.demos.objs.employeeadmin.view.components.UserForm",
	UiComponent,
	{
		
		/**
		 * The user form panel HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		userFormPanel: null,
		
		/**
		 * The unique name field HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		uname: null,
		
		/**
		 * The first name field HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		fname: null,
		
		/**
		 * The long name field HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		lname: null,
		
		/**
		 * The email field HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		email: null,
		
		/**
		 * The password field HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		password: null,
		
		/**
		 * The confirm password field HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		confirm: null,
		
		/**
		 * The department field HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		department: null,
		
		/**
		 * The submit button HTML element.
		 * 
		 * @private
		 * @type {HTMLElement}
		 */
		submitButton: null,
		
		/**
		 * The selected user.
		 * 
		 * @private
		 * @type {UserVO}
		 */
		user: null,
		
		/**
		 * The roles list for the selected user.
		 * 
		 * @private
		 * @type {Array}
		 */
		userRoles: null,
		
		/**
		 * @private
		 * @type {String}
		 */
		mode: null,
		
		/**
		 * An array used to compare currently selected items in the role list to those
		 * lastly inserted to know which one was the last changed by the user. 
		 * 
		 * @private
		 * @type {Array}
		 */
		roleListComparer: null,
		
		/**
		 * @override
		 *
		 * Initialize a <code>UserForm</code> instance.
		 */
		initialize: function()
		{
			UserForm.$super.initialize.call( this );
			
			this.initializeChildren();
			this.configureListeners();
		},
	
	    /**
	     * Initialize references to DOM elements.
	     */
	    initializeChildren: function()
	    {
			/*
			 * We use JQuery to initialize reference to UI components
			 */
			this.userFormPanel = $(".user-form-panel");
		
			this.uname = this.userFormPanel.find(".uname");
			this.fname = this.userFormPanel.find(".fname");
			this.lname = this.userFormPanel.find(".lname");
			this.email = this.userFormPanel.find(".email");
			this.password = this.userFormPanel.find(".password");
			this.confirm = this.userFormPanel.find(".confirm");
			this.department = this.userFormPanel.find(".department").combobox();
			this.roles = this.userFormPanel.find(".roles");
		
			this.submitButton = this.userFormPanel.find(".submit-button").button();
			this.cancelButton = this.userFormPanel.find(".cancel-button").button();	
	    },
		
	    /**
	     * Configure event listeners registration.
	     */
		configureListeners: function()
		{
			var that/*UserForm*/ = this; //Needed for closures to use "this" reference.
			this.uname.focus( function(evt){ that.field_focusHandler(evt) } );
			this.password.focus( function(evt){ that.field_focusHandler(evt) } );
			this.confirm.focus( function(evt){ that.field_focusHandler(evt) } );
			this.department.focus( function(evt){ that.field_focusHandler(evt) } );
			this.roles.focus( function(evt){ that.field_focusHandler(evt) } );
			this.submitButton.click( function(evt){ that.submit_clickHandler(evt) } );
			this.cancelButton.click( function(evt){ that.cancel_clickHandler(evt) } );
		
			//Needed to erase prefiled form informations.
			this.clearForm();
		},
		
		/**
		 * Add items from <code>DeptEnum</code> to the corresponding list UI component.
		 */
		fillDepartmentList: function()
		{
			var deptEnumList/*Array*/ = DeptEnum.getComboList();
		
			var htmlList/*String*/ = "";
			for(var i/*Number*/=0; i<deptEnumList.length; i++)
			{		
				var deptEnum/*DeptEnum*/ = deptEnumList[i];
				
				/*
				 * An item not having a value in jQuery will be excluded from the
				 * pop-up menu.
				 */ 
				var valueAttr = 'value="' + deptEnum.ordinal + '"';
				var selectedAttr/*String*/ = deptEnum.equals(this.user.department) ? 'selected' : "";
				htmlList += '<option ' + valueAttr + ' ' + selectedAttr + ' >' + deptEnum.value + '</option>';
			}
		
			this.department.html(htmlList);
		},
		
		/**
		 * Add items from <code>RoleEnum</code> to the corresponding list UI component.
		 */
		fillRoleList: function()
		{
			var roleEnumList/*Array*/ = RoleEnum.getComboList();
		
			this.roleListComparer = [];
		
			var htmlList/*String*/ = "";
			for(var i/*Number*/=0; i<roleEnumList.length; i++)
			{		
				var roleEnum/*RoleEnum*/ = roleEnumList[i];
		
				/*
				 * An item not having a value in jQuery will be excluded from the
				 * pop-up menu.
				 */ 
				var valueAttr/*String*/ = roleEnum.ordinal >= 0 ? 'value="' + roleEnum.ordinal + '"' : "";
				var selectedAttr/*String*/ = this.isUserRole( roleEnum ) ? 'selected' : "";
				htmlList += '<option ' + valueAttr + ' ' + selectedAttr + ' >' + roleEnum.value + '</option>';
			}
		
			this.roles.html(htmlList); 
		},
		
		/**
		 * Set the user used to populate the form.
		 * 
		 * @param {UserVO} user
		 * 		The currently selected user.
		 */
		setUser: function( user )
		{
			this.user = user;
			
			this.uname.val(user.uname);
			this.fname.val(user.fname);
			this.lname.val(user.lname);
			this.email.val(user.email);
			this.password.val(user.password);
			this.confirm.val(user.password);
			
			this.fillDepartmentList();
		},
		
		getUser: function()/*UserVO*/
		{
			this.updateUser();
			return this.user;
		},
		
		
		/**
		 * Set the roles for the selected user.
		 * 
		 * @param {Array} userRoles
		 * 		The roles list for the currently selected user.
		 *
		 * @private
		 */
		setUserRoles: function( userRoles/*Array*/ )
		{
			this.userRoles = userRoles;
			this.fillRoleList();
		},
		
		/**
		 * Return the roles selected in the UI role list component for the user.
		 *
		 * @return {Array}
		 * 		The list of <code>RoleEnum</code> object selected for the user.
		 *
		 * @private
		 */
		getUserRoles: function()
		{
			//TODO Implement if necessary
		},
		
		/**
		 * Update user attributes with form fields value.
		 * 
		 * @param {UserVO} user
		 * 		The currently selected user.
		 * 
		 * @param {Array} userRoles
		 * 		The roles list for the currently selected user.
		 */
		updateUser: function()
		{
			this.user.uname = this.uname.val();
			this.user.fname = this.fname.val();
			this.user.lname = this.lname.val();
			this.user.email = this.email.val();
			this.user.password = this.password.val();
		
			var selected/*Number*/ = this.department.selectedIndex;
			var deptEnumList/*Array*/ = DeptEnum.getComboList();
			this.user.department = deptEnumList[selected];
			
			this.fillRoleList();
		},
		
		/**
		 * Clear the whole form.
		 */
		clearForm: function()
		{
			this.setFieldError( 'uname', false );
			this.setFieldError( 'password', false );
			this.setFieldError( 'confirm', false );
			this.setFieldError( 'department', false );
		},
		
		/**
		 * Set the form mode to ADD or EDIT.
		 * 
		 * @param {String} mode
		 * 		<code>UserForm.MODE_ADD</code> or <code>UserForm.MODE_EDIT</code>
		 */
		setMode: function( mode )
		{
			this.mode = mode;
		
			switch(mode)
			{
				case UserForm.MODE_ADD:
					this.submitButton.find(".ui-btn-text").text("Add");
					//this.uname.removeAttr("disabled");
				break;
			
				case UserForm.MODE_EDIT:
					this.submitButton.find(".ui-btn-text").text("Save");
					//this.uname.attr("disabled", "disabled" );
				break;
			}
		},
		
		/**
		 * Submit the add or update.
		 */
		submit_clickHandler: function()
		{
			if( this.getErrors() )
				return;
		
			this.updateUser();
		
			if( this.user.getIsValid() )
			{
				if( this.mode == UserForm.MODE_ADD )
					this.dispatchEvent( UserForm.ADD );
				else
					this.dispatchEvent( UserForm.UPDATE );
			}
		},
		
		/**
		 * Cancel the add or update
		 */
		cancel_clickHandler: function()
		{
			this.dispatchEvent( UserForm.CANCEL );
		},
		
		/**
		 * Remove button onclick event listener.
		 */
		deleteButton_clickHandler: function()
		{
			this.dispatchEvent( UserForm.REMOVE );
		},
		
		/**
		 * Handle focus event on all the required form fields.
		 */
		field_focusHandler: function( evt )
		{
			this.setFieldError( $(evt.target).attr("class"), false );
		},
		
		/**
		 * Display errors associated with form fields and return if at least one
		 * field is in error.
		 * 
		 * @return {Boolean}
		 * 		The form contains errors.
		 */
		getErrors: function()
		{
			var error/*Boolean*/ = false;

			if( this.uname.val() == "" )
				this.setFieldError( 'uname', error = true );
			else
				this.setFieldError( 'uname', false );
		
			if( this.password.val() == "" )
				this.setFieldError( 'password', error = true );
			else
				this.setFieldError( 'password', false );
		
			if( this.password.val() != "" && this.confirm.val() != this.password.val() )
				this.setFieldError( 'confirm', error = true );
			else
				this.setFieldError( 'confirm', false );
		
			var selected/*Number*/ = this.department.val();
			var deptEnumList/*Array*/ = DeptEnum.getComboList();
			var department/*DeptEnum*/ = deptEnumList[selected];
		
			if( department == DeptEnum.NONE_SELECTED )
				this.setFieldError( 'department', error = true );
			else
				this.setFieldError( 'department', false );
				
			selected = this.roles.val();
			var rolesEnumList/*Array*/ = RoleEnum.getComboList();
			var role/*RolesEnum*/ = rolesEnumList[selected];
			if( role == RoleEnum.NONE_SELECTED )
				this.setFieldError( 'roles', error = true );
			else
				this.setFieldError( 'roles', false );
		
			return error;
		},
		
		/**
		 * Set or unset the error state on the uname field.
		 * 
		 * @param {String} fieldName
		 * 		Name of the field to mark as (or not mark as) containing an error.
		 *
		 * @param {Boolean} error
		 * 		The field must be marked as containing an error.
		 */
		setFieldError: function( fieldName, error )
		{
			var label/*HTMLElement*/ = this.userFormPanel.find( 'label[for="' + fieldName + '"]' );
			var field/*HTMLElement*/ = this.userFormPanel.find( '.' + fieldName );
		
			if( error )
				field.addClass( 'fieldError' );
			else
				field.removeClass( 'fieldError' );
		},
		
		/**
		 * Helper method that checks if a role from the UI role list exists in the user
		 * roles list.
		 * 
		 * @param {RoleEnum} roleEnum
		 * 		The <code>RoleEnum</code> item to check for	existence in the user roles
		 * 		list.
		 *
		 * @return {Boolean}
		 * 		The role exists in the list.
		 *
		 * @private
		 */
		isUserRole: function( roleEnum )
		{
		 	for( var i/*Number*/=0; i<this.userRoles.length; i++ )
				if( roleEnum.equals(this.userRoles[i]) )
					return true;
		
			return false;
		}
	}
);

/*
 * Event names
 */
UserForm.ADD_USER/*String*/		= "add";
UserForm.UPDATE_USER/*String*/	= "update";
UserForm.DELETE_USER/*String*/	= "cancel";
UserForm.CANCEL/*String*/		= "cancel";

UserForm.MODE_ADD/*String*/		= "modeAdd";
UserForm.MODE_EDIT/*String*/	= "modeEdit";

UserForm.ADD_ROLE/*String*/		= "addRole";
UserForm.REMOVE_ROLE/*String*/	= "removeRole";