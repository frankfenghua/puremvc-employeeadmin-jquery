/*
 PureMVC Javascript Objs Employee Admin Demo for jQueryMobile
 by Frederic Saunier <frederic.saunier@puremvc.org> 
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved. 
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @classDescription
 * Command used to delete a user from the main users list.
 *
 * @see org.puremvc.js.patterns.command.SimpleCommand SimpleCommand
 * @see org.puremvc.js.patterns.observer.Notification Notification
 * @see org.puremvc.js.demos.objs.employeeadmin.model.UserProxy UserProxy
 * @see org.puremvc.js.demos.objs.employeeadmin.model.RoleProxy RoleProxy
 * @see org.puremvc.js.demos.objs.employeeadmin.model.vo.UserVO UserVO
 * 
 * @extends org.puremvc.js.patterns.command.SimpleCommand SimpleCommand
 * 
 * @constructor
 */
var DeleteUserCommand = Objs.add
(
	"org.puremvc.js.demos.objs.employeeadmin.controller.DeleteUserCommand",
	SimpleCommand,
	{
		execute: function( notification )
		{
			var user/*UserVO*/ = notification.getBody();
			var userProxy/*UserProxy*/ = this.facade.retrieveProxy( UserProxy.NAME );
			var roleProxy/*RoleProxy*/ = this.facade.retrieveProxy( RoleProxy.NAME );
		
			userProxy.deleteItem( user );        
			roleProxy.deleteItem( user );
			
			this.sendNotification( NotificationNames.USER_DELETED );
		}
	}
);