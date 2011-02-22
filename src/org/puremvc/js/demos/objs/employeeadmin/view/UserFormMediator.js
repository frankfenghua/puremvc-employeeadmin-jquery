/*
 PureMVC Javascript Objs Employee Admin Demo for jQuery
 by Frederic Saunier <frederic.saunier@puremvc.org> 
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved. 
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @classDescription
 * User form component <code>Mediator</code>.
 *
 * @see org.puremvc.js.patterns.mediator.Mediator Mediator
 * @see org.puremvc.js.patterns.observer.Notification Notification
 * @see org.puremvc.js.demos.objs.employeeadmin.ApplicationFacade ApplicationFacade
 * @see org.puremvc.js.demos.objs.employeeadmin.model.vo.UserVO UserVO
 * @see org.puremvc.js.demos.objs.employeeadmin.model.UserProxy UserProxy
 * @see org.puremvc.js.demos.objs.employeeadmin.model.enum.DeptEnum DeptEnum
 * @see org.puremvc.js.demos.objs.employeeadmin.view.components.UserForm UserForm
 *
 * @extends org.puremvc.js.patterns.mediator.Mediator Mediator
 *
 * @constructor
 */
var UserFormMediator = Objs.add
(
	"org.puremvc.js.demos.objs.employeeadmin.view.UserFormMediator",
	Mediator,
	{	

		/**
		 * @override
		 *
		 * Initialize a <code>UserFormMediator</code> instance.
		 * 
		 * @param {String} name
		 * 		Name for this <code>Mediator</code>.
		 *
		 * @param {UserForm} viewComponent
		 * 		The <code>UserForm</code> view Component this <code>Mediator</code>
		 * 		manage.
		 */
		initialize: function( name, viewComponent )
		{
			Mediator.prototype.initialize.call( this, name, viewComponent );
		
			var userForm/*UserForm*/ = this.getUserForm();
			userForm.addEventListener( UserForm.ADD, this.onAdd, this );
			userForm.addEventListener( UserForm.UPDATE, this.onUpdate, this );
			userForm.addEventListener( UserForm.CANCEL, this.onCancel, this );
		
			this.userProxy = this.facade.retrieveProxy( UserProxy.NAME );
			this.roleProxy = this.facade.retrieveProxy( ProxyNames.ROLE_PROXY );
		},
		
		/**
		 * @private
		 *
		 * A shortcut to the application <code>RoleProxy</code> instance.
		 * 
		 * @type {RoleProxy}
		 */
		roleProxy: null,
		
		/**
		 * @private
		 *
		 * A shortcut to the application <code>RoleProxy</code> instance.
		 * 
		 * @type {UserProxy}
		 */
		userProxy: null,
		
		/**
		 * @private
		 *
		 * The form component is in ADD or EDIT mode.
		 *
		 * <P>
		 * Note that in the jQuery version this is only needed to be able to
		 * disable the <code>uname</code> field when in EDIT mode.
		 *
		 * @type {String}
		 */
		mode: null,
		
		/**
		 * @private
		 * 
		 * The <code>UserForm</code> view component this <code>Mediator</code> manage.
		 * 
		 * @return {UserForm}
		 */
		getUserForm : function()
		{
			return this.viewComponent;
		},
		
		/**
		 * Called when a user is added using the user form.
		 */
		onAdd: function()
		{
			var user/*UserVO*/ = this.getUserForm().getUser();
			var userRoles/*Array*/ = this.getUserForm().getUserRoles();
		
			this.userProxy.addItem( user );
			//this.roleProxy.addItem( user );
			this.sendNotification( NotificationNames.USER_ADDED, user );
		},
		
		/**
		 * Called when a user is updated using the user form.
		 */
		onUpdate: function()
		{
			var user/*UserVO*/ = this.getUserForm().getUser();
			var userRoles/*Array*/ = this.getUserForm().getUserRoles();
			
			this.userProxy.updateItem( user );
			//this.roleProxy.addItem( user );
			this.sendNotification(  NotificationNames.USER_UPDATED, user );
		},
		
		onDelete: function()
		{
			var selectedUser/*UserVO*/ = this.getUserList().selectedUser ;
			if(selectedUser == null)
				return;
		
			this.sendNotification
			(
				NotificationNames.DELETE_USER,
				this.getUserList().selectedUser 
			);
		},
		
		onCancel: function()
		{
			this.sendNotification(  NotificationNames.CANCEL_SELECTED );
		},
		
		/**
		 * @override
		 */
		listNotificationInterests: function()
		{
			return [
				NotificationNames.NEW_USER,
				NotificationNames.USER_SELECTED
			];
		},
		
		/**
		 * @override
		 */
		handleNotification: function( note )
		{
			var userForm/*UserForm*/ = this.getUserForm();
			
			var user/*UserVO*/;
			switch ( note.getName() )
			{
				case NotificationNames.NEW_USER:
					userForm.clearForm();
					userForm.setUser( note.getBody() );
					userForm.setUserRoles( [] );
					userForm.setMode( UserForm.MODE_ADD );
				break;
		
				case NotificationNames.USER_SELECTED:
					user = note.getBody();
		
					userForm.clearForm();
					userForm.setUser( user );
		
					var roles/*Array*/ = this.roleProxy.getUserRoles(user.uname);
					userForm.setUserRoles( roles );
		
					userForm.setMode( UserForm.MODE_EDIT );
				break;
			}
		}
	}
);

/*
 * Constants
 */
UserFormMediator.ADD/*String*/			= "add";
UserFormMediator.UPDATE/*String*/		= "update";
UserFormMediator.CANCEL/*String*/		= "cancel";

UserFormMediator.MODE_ADD/*String*/		= "modeAdd";
UserFormMediator.MODE_EDIT/*String*/	= "modeEdit";