/*
 PureMVC Javascript Objs Employee Admin Demo for jQuery
 by Frederic Saunier <frederic.saunier@puremvc.org> 
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved. 
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @classDescription
 * Role panel component <code>Mediator</code>.
 *
 * @see org.puremvc.js.patterns.mediator.Mediator Mediator
 * @see org.puremvc.js.patterns.observer.Notification Notification
 * @see org.puremvc.js.demos.objs.employeeadmin.model.vo.UserVO UserVO
 * @see org.puremvc.js.demos.objs.employeeadmin.model.UserProxy UserProxy
 * @see org.puremvc.js.demos.objs.employeeadmin.model.enum.DeptEnum DeptEnum
 * @see org.puremvc.js.demos.objs.employeeadmin.view.components.UserForm UserForm
 *
 * @extends org.puremvc.js.patterns.mediator.Mediator Mediator
 *
 * @constructor
 */
var RolePanelMediator = Objs.add
(
	"org.puremvc.js.demos.objs.employeeadmin.view.components.RolePaneMediator",
	Mediator,
	{
		/**
		 * A shortcut reference to the <code>RoleProxy</code>.
		 *
		 * @type {RoleProxy}
		 */
		roleProxy: null,

		/**
		 * Initialize a <code>RolePanelMediator</code> instance.
		 * 
		 * @param {String} name
		 * 		Name for this <code>Mediator</code>.
		 *
		 * @param {RolePanel} viewComponent
		 * 		The <code>UserForm</code> view Component this <code>Mediator</code>
		 * 		manage.
		 */
		initialize: function( name, viewComponent )
		{
			RolePanelMediator.$super.initialize.call( this, RolePanelMediator.NAME, viewComponent );


			var rolePanel/*RolePanel*/ = this.getRolePanel();
			rolePanel.addEventListener( RolePanel.ADD, this.onAddRole, this );
			rolePanel.addEventListener( RolePanel.REMOVE, this.onRemoveRole, this );

			this.roleProxy = this.facade.retrieveProxy( ProxyNames.ROLE_PROXY );
		},

		getRolePanel: function()/*RolePanel*/
		{
			return this.viewComponent;
		},

		onAddRole: function( event/*EventS*/ )
		{
			this.roleProxy.addRoleToUser( this.getRolePanel().user, this.getRolePanel().selectedRole );
			this.getRolePanel().setMode(null);
		},

		onRemoveRole: function( event/*EventS*/ )
		{
			this.roleProxy.removeRoleFromUser( this.getRolePanel().user, this.getRolePanel().selectedRole );
		
			this.updateUserRoleList();
			this.getRolePanel().setMode(null);
		},

		updateUserRoleList: function()
		{
		var userName/*String*/ = this.getRolePanel().user.uname;
		var userRoles/*Array*/ = this.roleProxy.getUserRoles( userName );
		this.getRolePanel().setUserRoles( userRoles );
		},

		/**
		* @override
		*/
		listNotificationInterests: function()/*Array*/
		{
			return [
				NotificationNames.NEW_USER,
				NotificationNames.USER_ADDED,
				NotificationNames.USER_UPDATED,
				NotificationNames.USER_DELETED,
				NotificationNames.CANCEL_SELECTED,
				NotificationNames.USER_SELECTED,
				NotificationNames.ADD_ROLE_RESULT
			];
		},

		/**
		* @override
		*/
		handleNotification: function( note )
		{
			var rolePanel/*RolePanel*/ = this.getRolePanel();

			switch( note.getName() )
			{
				case NotificationNames.NEW_USER:
				rolePanel.clearForm();
					rolePanel.setEnabled(false);
				break;

				case NotificationNames.USER_ADDED:
					rolePanel.user/*UserVO*/ = note.getBody();
				var roleVO/*RoleVO*/ = new RoleVO ( rolePanel.user.uname );
					this.roleProxy.addItem( roleVO );
				rolePanel.clearForm();
					rolePanel.setEnabled(false);
				break;

				case NotificationNames.USER_UPDATED:
				rolePanel.clearForm();
					rolePanel.setEnabled(false);
				break;

				case NotificationNames.USER_DELETED:
				rolePanel.clearForm();
					rolePanel.setEnabled(false);
				break;

				case NotificationNames.CANCEL_SELECTED:
				rolePanel.clearForm();
					rolePanel.setEnabled(false);
				break;

				case NotificationNames.USER_SELECTED:
					rolePanel.clearForm();
					rolePanel.setEnabled(true);
					rolePanel.setMode(null);

					rolePanel.user = note.getBody();
					this.updateUserRoleList();
				break;

				case NotificationNames.ADD_ROLE_RESULT:
					this.updateUserRoleList();
				break;
			}
		}
	}
);