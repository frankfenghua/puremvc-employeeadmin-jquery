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
			RolePanelMediator.$super.intialize.call( this, RolePanelMediator.NAME, viewComponent );


			var rolePanel/*RolePanel*/ = this.getRolePanel();
			rolePanel.addEventListener( RolePanel.ADD, Relegate.create(this,this.onAddRole) );
			rolePanel.addEventListener( RolePanel.REMOVE, Relegate.create(this,this.onRemoveRole) );

			this.roleProxy = this.facade.retrieveProxy( RoleProxy.NAME );
		},

		o.getRolePanel = function()/*RolePanel*/
		{
			return this.viewComponent;
		},

		o.onAddRole = function( event/*EventS*/ )
		{
			this.roleProxy.addRoleToUser( this.getRolePanel().user, this.getRolePanel().selectedRole );
		},

		o.onRemoveRole = function( event/*EventS*/ )
		{
			this.roleProxy.removeRoleFromUser( this.getRolePanel().user, this.getRolePanel().selectedRole );
		
			this.updateUserRoleList();
		},

		o.updateUserRoleList = function()
		{
			this.getRolePanel().setUserRoles( this.roleProxy.getUserRoles( this.getRolePanel().user.username ) );
		},

		/**
		* @override
		*/
		o.listNotificationInterests = function()/*Array*/
		{
			return [
				ApplicationFacade.NEW_USER,
				ApplicationFacade.USER_ADDED,
				ApplicationFacade.USER_UPDATED,
				ApplicationFacade.USER_DELETED,
				ApplicationFacade.CANCEL_SELECTED,
				ApplicationFacade.USER_SELECTED,
				ApplicationFacade.ADD_ROLE_RESULT
			];
		},

		/**
		* @override
		*/
		o.handleNotification = function( note )
		{
			var rolePanel/*RolePanel*/ = this.getRolePanel();

			switch( note.getName() )
			{
				case ApplicationFacade.NEW_USER:
					this.clearForm();
					rolePanel.setEnabled(false);
				break;

				case ApplicationFacade.USER_ADDED:
					rolePanel.user/*UserVO*/ = note.getBody();
					var roleVO/*RoleVO*/ = new RoleVO ( rolePanel.user.username );
					this.roleProxy.addItem( roleVO );
					this.clearForm();
					rolePanel.setEnabled(false);
				break;

				case ApplicationFacade.USER_UPDATED:
					this.clearForm();
					rolePanel.setEnabled(false);
				break;

				case ApplicationFacade.USER_DELETED:
					this.clearForm();
					rolePanel.setEnabled(false);
				break;

				case ApplicationFacade.CANCEL_SELECTED:
					this.clearForm();
					rolePanel.setEnabled(false);
				break;

				case ApplicationFacade.USER_SELECTED:
					rolePanel.user = note.getBody();
					this.updateUserRoleList();
				
					//TODO rolePanel.roleCombo.selectedItem = RoleEnum.NONE_SELECTED;
					rolePanel.setEnabled(true);
				
				break;

				case ApplicationFacade.ADD_ROLE_RESULT:
					this.updateUserRoleList();
				break;
			}
		},

		o.clearForm = function()
		{
			var rolePanel/*RolePanel*/ = this.getRolePanel();

			rolePanel.user = null;
			rolePanel.setUserRoles(null);
		}
	}
}		