/**
 * @classDescription
 * A minimalistic library intended to help in using namespaces and class
 * inheritance in JavaScript.
 * 
 * @author   Frederic Saunier - www.tekool.net
 * @version 2.0
 *
 * @license
 * Copyright (C) 2011 Frederic Saunier
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/.
 *
 */
var Objs = new function()
{
	//----------------------------------------------------------------------
	// Public methods
	//

	/**
	 * Associate a class constructor with a classpath.
	 * 
	 * <P>
	 * A classpath is a namespace plus an associated class name.
	 * eg. : Objs.register('com.mywebsite.somenamespace.MyClass',myConstructor)
	 * 
	 * <P>
	 * If a class is associated twice with the same namespace, only the last
	 * call will be taken into account.
	 *
	 * @param {String} classpath
	 * 		The classpath of the class to register.
	 *
	 * @param {Function} superclass
	 * 		(optional) A superclass to inherit from.
	 * 
	 * @param {Object} protobject
	 * 		(optional) The object used to declare class methods.
	 * 		
	 * 		<P>
	 * 		This can be the second or third argument. The method will
	 * 		automatically detect if the argument is a superclass of a
	 * 		protobject declaration.
	 *
	 * @return {Function}
	 * 		The constructor method of the registered class.
	 */
	this.add = function( classpath )
	{
		var 
			protobject/*Object*/,
			func/*Function*/,
			arg1/*Object*/ = arguments[1],
			arg1Type/*String*/ = typeof arg1,
			propName/*String*/,
			i/*Number*/,
			arr/*Array*/
		;

		if( typeof classpath != Tstring )
			throw Error("Invalid classpath");

		func = map[classpath] = function()
		{
			//Allow YUICompressor to munge it as a local var
			var callee/*Function*/ = arguments.callee;

			/*
			 * The constructor is not called during the extend phase:
			 * myClass.prototype = new MySuperClass().
			 */
			if( !callee[$extending] )
			{
				//A superclass is registered.
				if( callee[$superclass] )
				{
					callee[$superclass][$constructing] = 1;
					callee[$superclass].call( this );
					delete callee[$superclass][$constructing];
				}
	
				/*
				 * The initialize method must only be called automatically on the
				 * first called constructor in the inheritance chain.
				 */
				if
				(
					!callee[$constructing]
					&&
					callee[$prototype][$initialize]
				)
					callee[$prototype][$initialize].apply( this, arguments );
	
				//TODO If the developer do not declare an initialize method on the first called constructor prototype he may think that its super initialize method will be called automatically
			}
		}
		
		/*
		 * If the 2nd argument is "protobject".
		 */
		if( arg1Type == "object" )
			protobject = arg1;
		else
		{
			if( arg1Type == Tstring )
				func[$superclass] = Objs.getClass(arg1);
			else
				func[$superclass] = arg1;
			
			protobject = arguments[2];		
		}


		//There is superclass to extend from.
		if( func[$superclass] )
		{
			/*
			 * Here we add a shortcut reference to easily call the super
			 * initialize method from its subclass.
			 * 
			 * $super can't reference superclass.prototype.initialize.call
			 * directly for some obscure reason on several browsers.
			 */
			if( func[$superclass][$prototype][$initialize] )
				func[$super] = function( a, b, c, d, e, f, g, h, i, j ) //arguments is not an array, same old ugly hook
				{
					func[$superclass][$prototype][$initialize].call( a, b, c, d, e, f, g, h, i, j );
				}

			func[$superclass][$extending] = 1;
			func[$prototype] = new func[$superclass]();
			delete func[$superclass][$extending];
		}
			
		/*
		 * Protobject properties and method are copied into the prototype of
		 * the returned constructor.
		 */
		if( protobject )
		{			
			//Some Object methods are not enumerable in some browsers
			arr = nonEnumerable.slice(0);
			for( propName in protobject )
				if( protobject.hasOwnProperty(propName) )
					arr.push(propName);

			for( i=0; i<arr.length; i++ )
			{
				propName = arr[i];
				func[$prototype][propName] = protobject[propName];
			}
		}

		return func;
	}

	/**
	 * Return the class constructor for a given classpath.
	 * 
	 * @param {String} classpath
	 * 		The classpath of the requested class constructor.	
	 * 
	 * @return {Function}
	 * 		The class constructor corresponding to the given classpath if it
	 * 		exists or strict <code>null</code> if it doesn't.	
	 */
	this.getClass = function( classpath )
	{
		return map[classpath] || null;
	}

	//----------------------------------------------------------------------
	// Private properties
	//
	
	/**
	 * A map of <code>ClassInfo</code> objects used to manage classes
	 * registrations.
	 * 
	 * @type {Object}
	 * @private
	 */
	var map/*Object*/ = {},
	
	/**
	 * A list of non enumerable <code>Object</code> methods
	 * (Internet Explorer).
	 * 
	 * @type {Array}
	 * @private
	 */
	nonEnumerable = [ "toString", "valueOf", "toLocaleString" ],
	
	//String helpers to reduce the generated file size.
	Tstring/*String*/ = "string",
	$super/*String*/ = "$super",
	$prototype/*String*/ = "prototype",
	$initialize/*String*/ = "initialize",
	$prefix/*String*/ = "$Objs$",
	$constructing/*String*/ = $prefix + "c",
	$extending/*String*/ = $prefix + "e",
	$superclass/*String*/ = $prefix + "s"
	;
}
