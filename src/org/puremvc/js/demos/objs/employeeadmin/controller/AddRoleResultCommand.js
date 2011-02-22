/*
 PureMVC Javascript Objs Employee Admin Demo for jQuery
 by Frederic Saunier <frederic.saunier@puremvc.org> 
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved. 
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @classDescription
 * Receive the result generated by calling <code<RoleProxy.addRole()</code>
 * method.
 *
 * @see org.puremvc.js.patterns.command.SimpleCommand SimpleCommand
 * @see org.puremvc.js.patterns.observer.Notification Notification
 * 
 * @extends org.puremvc.js.patterns.command.SimpleCommand SimpleCommand
 * 
 * @constructor
 */
var AddRoleResultCommand =	Objs.add
(
	"org.puremvc.js.demos.objs.employeeadmin.controller.AddRoleResultCommand",
	SimpleCommand,
	{
		/**
		 * @override
		 */
		execute: function( note )
		{
			var result/*Boolean*/ = note.getBody();
			if( !result )
				alert('Role already exists for this user!\nAdd User Role');
		}
	}
);