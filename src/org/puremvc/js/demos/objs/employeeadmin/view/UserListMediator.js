/*
 PureMVC Javascript Objs Employee Admin Demo for jQuery
 by Frederic Saunier <frederic.saunier@puremvc.org> 
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved. 
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @classDescription
 * User list component <code>Mediator</code>.
 * 
 * @see org.puremvc.js.patterns.mediator.Mediator Mediator
 * @see org.puremvc.js.patterns.observer.Notification Notification
 * @see org.puremvc.js.demos.objs.employeeadmin.ApplicationFacade ApplicationFacade
 * @see org.puremvc.js.demos.objs.employeeadmin.model.vo.UserVO UserVO
 * @see org.puremvc.js.demos.objs.employeeadmin.model.UserProxy UserProxy
 * @see org.puremvc.js.demos.objs.employeeadmin.view.components.UserList UserList
 *
 * @extends org.puremvc.js.patterns.mediator.Mediator Mediator
 * 
 * @constructor
 */
var UserListMediator = Objs.add
(
	"org.puremvc.js.demos.objs.employeeadmin.view.UserListMediator",
	Mediator,
	{		
		
		/**
		 * The <code>UserList</code> UI component this <code>Mediator</code>
		 * manage.
		 * 
		 * @type {UserList}
		 */
		userList: null,
		
		users/*Array*/: null,
		
		/**
		 * @override
		 *
		 * Initialize a <code>UserListMediator</code> instance.
		 * 
		 * @param {String} name
		 * 		Name for this <code>Mediator</code>.
		 *
		 * @param {UserList} viewComponent
		 * 		The <code>UserList</code> UI Component this <code>Mediator</code>
		 * 		manage.
		 */
		initialize: function( name, viewComponent )
		{
			Mediator.prototype.initialize.call( this, name, viewComponent );
			
			var userList/*UserList*/ = this.getUserList();
			userList.addEventListener( UserList.NEW, this.onNew, this );
			userList.addEventListener( UserList.SELECT, this.onSelect, this );
			
			var userProxy = this.facade.retrieveProxy( ProxyNames.USER_PROXY );
			userList.setUsers(userProxy.getUsers());
		},

		/**
		 * @private
		 * 
		 * Return the <code>UserList</code> UI component this
		 * <code>Mediator</code> manage.
		 * 
		 * @return {UserList}
		 * 		The <code>UserList</code> UI component this
		 * 		<code>Mediator</code> manage.
		 */
		getUserList: function()
		{
			return this.viewComponent;
		},
		
		/**
		 * @override
		 */
		listNotificationInterests: function()
		{
			return [
				NotificationNames.CANCEL_SELECTED,
				NotificationNames.USER_UPDATED,
				NotificationNames.USER_ADDED,
				NotificationNames.USER_DELETED
			];
		},
		
		/**
		 * @override
		 */
		handleNotification: function( note )
		{
			var userList/*UserList*/ = this.getUserList();
			var userProxy = this.facade.retrieveProxy( UserProxy.NAME );
		
			switch( note.getName() )
			{
				case NotificationNames.CANCEL_SELECTED:
					userList.deSelect();
				break;
		
				case NotificationNames.USER_UPDATED:
					userList.setUsers( userProxy.getUsers() );
					userList.deSelect();
				break;
					
				case NotificationNames.USER_ADDED:
					userList.setUsers( userProxy.getUsers() );
					userList.deSelect();
				break;
					
				case NotificationNames.USER_DELETED:
					userList.setUsers( userProxy.getUsers() );
					userList.deSelect();
				break;
			}
		},
		
		/**
		 * Called when to add a new user to the list.
		 * 
		 * @private
		 */
		onNew: function()
		{
			var user/*UserVO*/ = new UserVO();
			this.sendNotification( NotificationNames.NEW_USER, user );
			
			/*
			 * In the jQuery implementation of the demo adding the demo imply to
			 * set it as the currently selected user.
			 */
			this.sendNotification( NotificationNames.USER_SELECTED, user );
		},
		
		
		/**
		 * @private
		 * 
		 * Called when a user is selected in the user list.
		 * 
		 * @param {UserVO} selectedUser
		 * 		The user selected in the list.
		 */
		onSelect: function( selectedUser )
		{
			this.sendNotification( NotificationNames.USER_SELECTED, selectedUser );
		}
	}
);