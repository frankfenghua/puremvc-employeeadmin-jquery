/*
 PureMVC Javascript Objs Employee Admin Demo for jQueryMobile
 by Frederic Saunier <frederic.saunier@puremvc.org> 
 PureMVC - Copyright(c) 2006-11 Futurescale, Inc., Some rights reserved. 
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @classDescription
 * PureMVC <code>Proxy</code> class object used to control the user list of the
 * application. 
 * 
 * @see org.puremvc.js.patterns.proxy.Proxy Proxy
 * @see org.puremvc.js.demos.objs.employeeadmin.abc.ProxyNames ProxyNames
 * @see org.puremvc.js.demos.objs.employeeadmin.model.vo.UserVO UserVO
 * @see org.puremvc.js.demos.objs.employeeadmin.model.enum.DeptEnum DeptEnum
 * 
 * @extends org.puremvc.js.patterns.proxy.Proxy Proxy
 * 
 * @constructor
 */
var UserProxy = Objs.add("org.puremvc.js.demos.objs.employeeadmin.model.UserProxy",
	Proxy,
	{
		
		/**
		 * @override
		 *
		 * Initialize a <code>UserProxy</code> instance.
		 * 
		 * @param {String} name
		 * 		Identifier of the <code>Proxy</code> object in the PureMVC framework.
		 * 
		 * @param {Array} users	
		 * 		The list of users controlled by the <code>Proxy</code>.
		 */
		initialize: function( name, users )
		{
			Proxy.prototype.initialize.call( this, name, users );
		},
		
		/**
		 * Return the users list controlled by the <code>Proxy</code>.
		 */
		getUsers: function()
		{
			return this.data;
		},
		
		/**
		 * Add a user to the list.
		 * 
		 * @param {UserVO} user
		 */ 
		addItem: function( user )
		{
			this.getUsers().push( user );
		},
		
		/**
		 * Update a user informations.
		 * 
		 * @param {UserVO} user
		 * 		The user to update.
		 */ 
		updateItem: function( user )
		{
			var users/*Array*/ = this.getUsers();
			for( var i/*Number*/=0; i<users.length; i++ )
				if( users[i].uname == user.uname )
					users[i] = user;
		},
		
		/**
		 * Remove a user from the list.
		 * 
		 * @param {UserVO} user
		 * 		The user to remove.
		 */ 
		deleteItem: function( user )
		{
			var users/*Array*/ = this.getUsers();
			for( var i/*Number*/=0; i<users.length; i++ )
				if( users[i].uname == user.uname )
					users.splice(i,1);
		}
	}
);