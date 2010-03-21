/* ====================================================================================
	Code refactoring and optimization
	The code has been optimized for readability, maintainability and size after compression
	by tools such as:
	Dean Edward Packer - http://dean.edwards.name/packer/
	YUI Compressor - http://www.refresh-sf.com/yui/
*/

/* ====================================================================================
	Iteration 6 - 2589
	- Used shorter variable name internally for "Crutch", "crutch", "options" 
	- 
	Packer: ?/?=?
	YUI Compressor: 15910/2589=84%
*/


/* ====================================================================================
	Iteration 5 - ? - Bloat!!!
	- Added many features without re-optimizing
	- Re validated through JSLint
	Packer: ?/?=?
	YUI Compressor: ?/?=?
*/

"use strict";
(function () {
	window.Crutch = function (options) {
		var Utils,
			Crutch,
			doNothing,
			safeAndWarn,
			scope;

		/*
		The main crutch object which is used both as the statefull object
		and the main function call.
		*/
		// Todo: consider using "C/c" as private vars for optimization Could save up to 600 bytes
		Crutch = function Crutch(scope) {
			if (Crutch.options.enabled) {
				Crutch.attachAll(scope);
			}
		};

		// Todo: Test if this var is compressed
		Utils = {};

		/*
		Function: Utils.extend

		Recursively extend a first object with the attributes of subsequent objects passed
		as arguments. Ex.: extend({}, defaultOptions, options);
		Used to merge values from defaults, options arguments cookies or querystring
		*/
		Utils.extend = function extend(obj, extObj) {
			var a, i;
			if (arguments.length > 2) {
				for (a = 1; a < arguments.length; a = a + 1) {
					extend(obj, arguments[a]);
				}
			} else {
				for (i in extObj) {
					if (extObj.hasOwnProperty(i)) {
						obj[i] = extObj[i];
					}
				}
			}
			return obj;
		};

		/*
		Function: Utils.leaf

		Recursively finds the leaf object by interpretting the object string
		*/
		Utils.leaf = function leaf(scope, chain, chainHistory) {
			var newObj, varLabel;
			if (typeof(scope) !== "undefined") {
				if (chain.length > 1) {
					varLabel = chain.shift();
					newObj = scope[varLabel];
					if (typeof(newObj) !== "undefined") {
						if (chainHistory !== "") {
							chainHistory = chainHistory + ".";
						}
						return leaf(newObj, chain, chainHistory + varLabel);
					} else {
						throw ("Variable not found in the scope: " + varLabel + " in " + chainHistory);
					}
				} else {
					if (typeof(scope[chain[0]]) !== "undefined") {
						return [scope, chain[0]];
					} else {
						throw ("Variable not found while crutching: " + chain[0] + " in " + chainHistory);
					}
				}
			} else {
				throw ("scope is empty, cannot return value");
			}
		};


		// Default options for the crutch instance
		Crutch.defaults = {
			enabled: true, // If enabled or not
			console: window.console, // The "Firebug" compatible console object 
			warn: true, // Wether or not errors should be logged to the console
			log: true, // Wether or not successfull execution should be logged to the console
			hooks: {} // A literal object containing the individual hooks composing the crutch 
		};

		// Default options for hooks
		Crutch.hookDefaults = {
			enabled: true, // If the hook is enabled or not
			warn: true, // Wether or not errors should be logged to the console
			time: false, // Wether or not successfull execution should be timed and results logged to the console
			log: false, // Wether or not successfull execution should be logged to the console
			hush: false, // Wether or not errors/exceptions should be hushed and only made visible to the console.
			selfCrutch : false // Internal option for crutching functions internal to this library
		};

		/*
		Various Setup
		Set default attributes
		Set the console
		Set the default options
		*/
		//TODO: Encapsulate in some setup or init function
		// Set the default options and extend with the option argument
		// Todo: consider using "O" instead of options as private Could save up to 300 bytes
		Crutch.options = Utils.extend({}, Crutch.defaults, options);
		Crutch.hooks = [];

		// Attach the console if necessary
		doNothing = function doNothing() {};
		if (Crutch.options.console) {
			Crutch.console = Crutch.options.console;
		} else {
			Crutch.console = {
				log: doNothing,
				error: doNothing,
				time: doNothing,
				timeEnd: doNothing
			};
		}

		/*
		Function: Crutch.attachAll

		Process in batch all the hooks provided in the options when
		the crutch has been constructed, while using the specified scope
		*/
		Crutch.attachAll = function attachAll(scope) {
			for (var hook in this.options.hooks) {
				if (this.options.hooks.hasOwnProperty(hook)) {
					Crutch.attach(hook, scope);
				}
			}
		};

		/*
		Function: Crutch.attach

		Process a single hook, while using the provided scope
		*/
		// Todo: This method and the crutch method should be merged into a single one.
		Crutch.attach = function attach(hook, scope) {
			var hookOptions;
			// Applies all the hooks
			hookOptions = Utils.extend({}, this.hookDefaults, this.options.hooks[hook]);
			if (hookOptions.enabled !== false) {
				//TODO: The scope var should come either from param or from original options
				Crutch.crutch(hook, hookOptions, scope);
			}
		};

		/*
		Function: Crutch.detach
		*/
		Crutch.detach = function detach(hook) {
			if (hook) {
				hook.parent[hook.functionName] = hook["function"];
			}
		};

		/*
		Function: Crutch.detachAll
		*/
		Crutch.detachAll = function detachAll() {
			while (Crutch.hooks.length > 0) {
				Crutch.detach(Crutch.hooks.shift());
			}
		};


		/*
		Function: Crutch.context

		Returns a detailed context object that can be used when debugging or inspecting code
		*/
		Crutch.context = function context(hook, returnValue, isThis, options, func, args, exception) {
			return {
				"hook": hook,
				"return": returnValue,
				"this": isThis,
				"options": options,
				"function": func,
				"arguments": args,
				"exception": exception
			};
		};

		/*
		Function: Crutch.proxy

		The proxy call which is used to intercept function call and "manage" their outcomes 
		*/
		//Todo: bring back option overrigind with argument
		//Todo: Merge the default options and local options and meta options into a single object
		Crutch.proxy = function proxy(func, args, hook, options) {
			var c, // console alias
				returnValue,
				label, // The function label to use for logging
				caller; // Used when moving up the call stack
			c = Crutch.console;
			if (options.time) {
				c.time("Timed " + options.action);
			}
			label = (options.action || hook + "()");
			try {
				returnValue = func.apply(this, args);
				if (proxy.error) {
					throw (proxy.error);
				}
				if (options.log) {
					//TODO: Is there really access to Crutch here ? 
					c.info("Ok upon " + label, Crutch.context(hook, returnValue, this, options, func, args));
				}
			} catch (e) {
				if (options.log || options.warn) {
					c.error("Exception upon " + label, Crutch.context(hook, returnValue, this, options, func, args, e));
				}
				// Trigger the onError callback if needed, and provide the context summary object as the single argument 
				if (typeof(Crutch.options.onError) === "function") {
					Crutch.options.onError(Crutch.context(hook, returnValue, this, options, func, args, e));
				}
				if (!options.hush) {
					throw (e);
				} else {
					// Raise a silent error to the next crutch function 
					// Crawl back the scopeChain recursivelly
					caller = proxy.caller;
					while (caller) {
						if (caller.isCrutchProxy) {
							break;
						}
						caller = caller.caller;
					}
					if (caller) {
						caller.error = e;
					}
				}
			} finally {
				if (options.time) {
					c.timeEnd("Timed " + label);
				}
				return returnValue;
			}
		};
		// A special attribute to differentiate the proxy from other functions in the call stack
		Crutch.proxy.isCrutchProxy = true;

		/*
		Function: Crutch.crutch

		Applies a single hook to a function call
		This function can be called directly and is called by "Crutch.attach" upons initialisation  
		This returns the function call that has successfully been hooked
		*/
		Crutch.crutch = function crutch(hook, options, scope) {
			var $this, scopeAndObj, chain, oldFunc;
			$this = this;
			chain = hook.split(".");
			scopeAndObj = Utils.leaf(scope, chain, "");
			if (scopeAndObj.length > 0) {
				oldFunc = scopeAndObj[0][scopeAndObj[1]];
				scopeAndObj[0][scopeAndObj[1]] = function proxyCall() {
					return Crutch.proxy.call(scopeAndObj[0], oldFunc, arguments, hook, options);
				};
				// Add the successfull crutch to the "hooks" registry
				if (oldFunc && !options.selfCrutch) {
					Crutch.hooks.push({
						"hook" : hook,
						"options" : options,
						"parent" : scopeAndObj[0],
						"functionName" : scopeAndObj[1],
						"function" : oldFunc,
						"scope" : scope
					});
				}

				return oldFunc;
			}
			return null;
		};

		/*
		Applies self crutching of the crutch and leaf fucntions
		Is a sort of "eat your own dog food" approach
		*/
		//Todo: Put this in some init function ?
		//Todo: Optimize this using the default and extends
		safeAndWarn = {
			"hush" : true,
			"warn" : true,
			"selfCrutch" : true
		};
		scope = {Crutch : Crutch, Utils: Utils};
		//Todo: Optimize this by using a single call with a "hooks" attribute
		Crutch.crutch("Utils.extend", safeAndWarn, scope);
		Crutch.crutch("Utils.leaf", safeAndWarn, scope);
		Crutch.crutch("Crutch.attach", safeAndWarn, scope);
		Crutch.crutch("Crutch.attachAll", safeAndWarn, scope);
		Crutch.crutch("Crutch.detach", safeAndWarn, scope);
		Crutch.crutch("Crutch.detachAll", safeAndWarn, scope);
		Crutch.crutch("Crutch.crutch", safeAndWarn, scope);

		// Return the core Crutch function instead of an object
		return Crutch;
	};

}());





/* ====================================================================================
	Iteration 4 - 777 bytes
	- Used JSLint to obtain strict validity
	- Started using the YUI Compressor, which shrinks local vars more agressivelly
	- Removed unused fnOptions var
	- Fixed a bug with a bad timer call
	- Used a complete try/catch/finally set of statement for a more direct execution path  
	- Assign the constructor directly to the window object instead of using intermediary Crutch object
	- Created a "context" function for logging error and function call in a uniform manner
	Packer: 723/3571=0.202
	YUI Compressor: 551/3569=0.15

	END RESULT:
*/

"use strict";(function(){window.Crutch=function(c){var a,d,b;a=c;d=function(){};if(c.console){b=c.console}else{b={log:d,error:d,time:d,timeEnd:d}}this.crutch=function(i,h){var e,f,k,g,j;j=this;k=f=i.crutch;e=function(){var l;l=function(){return[g,k,this,f,i,arguments]};if(f.time){b.time("Timed "+k.action)}try{g=i.apply(this,arguments);if(f.log){b.log("Ok upon "+k.action,l())}}catch(m){g=undefined;if(f.log){b.error("Exception upon "+k.action,m,l())}if(!k.safety){throw (m)}}finally{if(f.time){b.timeEnd("Timed "+k.action)}return g}};return e}}}());

/*
	FINAL SOURCE
*/
"use strict";
/*global window */
/*jslint white: true, onevar: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
/*members Crutch, action, apply, console, crutch, error, log, safety, time, timeEnd */
/*
	jsCrutch

	jsCrush is a javascript utility used to apply a layer of monitoring and control
	over the execution of existing avascript code. It is usefull both while coding and
	debuging an application and while running the code in production in order to manage
	gracefull code failures.	

	Author:
		Mathieu Sylvain, 2009

	Usage:
		First, instantiate a crutch object, then use the crutch function to take control
		over the desired code. Options can be passed both during instantiation of the class
		and when crutching individual pieces of code. 

	Sample:
		var crutch = new Crutch(options);
		function helloWorld() {
			alert("hello world!");
		};
		crutch.crutch(helloWorld, options);
		someFunction();

	Options:
		console - object - A console object compatible with the Firebug Console. If no console is provided, logging and timing is disabled.
		label - string - The label of the function. Can be used as a short description or a full qualified function name. Ex.: "myClass.helloWorld()",
		action - string - A short phrase stating the action taken by the code. Use for friendly loggin. Ex.: "Writing hello world",
		desc - string - A more complete description of the code which could be usefull by someone investigating errors or debuggin code. Ex.: "This function write the hello world message using the systems alert funcion",
		safety - boolean - Determines wether catched errors should be re-thrown or not. Setting it to "true" will prevent broken code from stopping the script execution on the rest of the page (false by default)
		time - boolean - Wether function calls should be timed. A console object is required. (false by default)
		log - boolean - Wether function calls (successfull or not) should be logged to the console. : (false by default)

*/
(function () {

	window.Crutch = function (options) {
		var defaultOptions, doNothing, console;
		defaultOptions = options;
		doNothing = function () {};
		if (options.console) {
			console = options.console;
		} else {
			console = {
				log: doNothing,
				error: doNothing,
				time: doNothing,
				timeEnd: doNothing
			};
		}

		this.crutch = function (func, argOptions) {
			var proxyFunc, options, meta, returnValue, $this;
			$this = this;
			//Todo: bring back option overrigind with argument
			//options = defaultOptions || argOptions;
			meta = options = func.crutch;
			// Todo: Merge the default options and local options and meta options into a single object
			proxyFunc = function () {
				var context;
				context = function() {
					return [returnValue, meta, this, options, func, arguments]
				};
				if (options.time) {
					console.time("Timed " + meta.action);
				}
				try {
					returnValue = func.apply(this, arguments);
					if (options.log) {
						console.log("Ok upon " + meta.action, context());
					}
				} catch (e) {
					returnValue = undefined;
					if (options.log) {
						console.error("Exception upon " + meta.action, e, context());
					}
					if (!meta.safety) {
						throw (e);
					}
				} finally {
					if (options.time) {
						console.timeEnd("Timed " + meta.action);
					}
					return returnValue;
				}
			};
			return proxyFunc;
		};
	};

}());






/* ====================================================================================
	Iteration 4 - 777 bytes
	- Change console object to a local scope and used scope from parent closure
	- Removed unused vars from previous iteration
	compression ratio: 718/3083=0.233
*/
/*
	jsCrutch

	jsCrush is a javascript utility used to apply a layer of monitoring and control
	over the execution of existing avascript code. It is usefull both while coding and
	debuging an application and while running the code in production in order to manage
	gracefull code failures.	

	Author:
		Mathieu Sylvain, 2009

	Usage:
		First, instantiate a crutch object, then use the crutch function to take control
		over the desired code. Options can be passed both during instantiation of the class
		and when crutching individual pieces of code. 

	Sample:
		var crutch = new Crutch(options);
		function helloWorld() {
			alert("hello world!");
		};
		crutch.crutch(helloWorld, options);
		someFunction();

	Options:
		console - object - A console object compatible with the Firebug Console. If no console is provided, logging and timing is disabled.
		label - string - The label of the function. Can be used as a short description or a full qualified function name. Ex.: "myClass.helloWorld()",
		action - string - A short phrase stating the action taken by the code. Use for friendly loggin. Ex.: "Writing hello world",
		desc - string - A more complete description of the code which could be usefull by someone investigating errors or debuggin code. Ex.: "This function write the hello world message using the systems alert funcion",
		safety - boolean - Determines wether catched errors should be re-thrown or not. Setting it to "true" will prevent broken code from stopping the script execution on the rest of the page (false by default)
		time - boolean - Wether function calls should be timed. A console object is required. (false by default)
		log - boolean - Wether function calls (successfull or not) should be logged to the console. : (false by default)

*/
(function() {

var Crutch;

Crutch = function(options) {
	var defaultOptions, doNothing, console;
	defaultOptions = options;
	doNothing = function() {};
	if (options.console) {
		console = options.console;
	} else {
		console = {
			log: doNothing,
			error: doNothing,
			time: doNothing,
			timeEnd: doNothing
		};
	}

	this.crutch = function(_fn, _options) {
		var $this, fn, options, meta, fnOptions, returnValue;
		$this = this;
		options = options || _options;
		fn = _fn;
		meta = options = fn.crutch;
		if (meta) {
			// Todo: Merge the default options and local options and meta options into a single object
			_fn = function() {
				if (options.time) console.time("Timed " + meta.action);
				try {
					returnValue = fn.apply(this, arguments);
				} catch(e) {
					_timeEnd();
					if (options.log) console.error("Exception upon " + meta.action, e, meta, this, options, fn, arguments);
					if (!meta.safety) {
						throw(e);
					}
					return;
				};
				if (options.time) console.timeEnd("Timed " + meta.action);
				if (options.log) console.log("Ok upon " + meta.action, returnValue, meta, this, options, fn, arguments);
				return returnValue;
			}
		}
		return _fn;
	}
};

window.Crutch = Crutch;

})();

/* ====================================================================================
	Iteration 3 - 842 bytes
	- Used console object directly
	- Change a few vars to local scope	
	compression ratio: 842/3223=0.261
*/
/* ====================================================================================
	Iteration 2 - 937 bytes
	- Change the doNothing function to a local variable	
	compression ratio: 937/3407=0.275
*/
/* ====================================================================================
	Iteration 1 - 973 bytes
	- Base release before optimization	
	compression ratio: 973/3402=0.286
*/
/*
	jsCrutch

	jsCrush is a javascript utility used to apply a layer of monitoring and control
	over the execution of existing avascript code. It is usefull both while coding and
	debuging an application and while running the code in production in order to manage
	gracefull code failures.	

	Author:
		Mathieu Sylvain, 2009

	Usage:
		First, instantiate a crutch object, then use the crutch function to take control
		over the desired code. Options can be passed both during instantiation of the class
		and when crutching individual pieces of code. 

	Sample:
		var crutch = new Crutch(options);
		function helloWorld() {
			alert("hello world!");
		};
		crutch.crutch(helloWorld, options);
		someFunction();

	Options:
		console - object - A console object compatible with the Firebug Console. If no console is provided, logging and timing is disabled.
		label - string - The label of the function. Can be used as a short description or a full qualified function name. Ex.: "myClass.helloWorld()",
		action - string - A short phrase stating the action taken by the code. Use for friendly loggin. Ex.: "Writing hello world",
		desc - string - A more complete description of the code which could be usefull by someone investigating errors or debuggin code. Ex.: "This function write the hello world message using the systems alert funcion",
		safety - boolean - Determines wether catched errors should be re-thrown or not. Setting it to "true" will prevent broken code from stopping the script execution on the rest of the page (false by default)
		time - boolean - Wether function calls should be timed. A console object is required. (false by default)
		log - boolean - Wether function calls (successfull or not) should be logged to the console. : (false by default)

*/
(function() {

var Crutch;

Crutch = function(options) {
	this.options = options;

	function doNothing() {};
	if (options.console) {
		this.console = options.console;
	} else {
		this.console = {
			log: doNothing,
			error: doNothing,
			time: doNothing,
			timeEnd: doNothing
		};
	}

	this.crutch = function(_fn, options) {
		var $this, fn, options, meta, fnOptions, returnValue, timeStart, timeEnd, _consoleLog, _consoleError;
		$this = this;
		if (!options) options = {};
		timeStart = timeEnd = _consoleLog = _consoleError = function() {};
		fn = _fn;
		meta = fn.crutch;
		options = fn.crutch;
		if (meta) {
			// Todo: Merge the default options and local options and meta options into a single object
			if (options.log) {
				console.log("options", options);
				_consoleLog = this.console.log;
				_consoleError = this.console.error;
			}
			if (options.time) {
				timeStart = function() {
					this.console.time("Timed " + meta.action);
				};
				timeEnd = function() {
					this.console.timeEnd("Timed " + meta.action);
				};
			}
			_fn = function() {
				timeStart();
				try {
					returnValue = fn.apply(this, arguments);
				} catch(e) {
					timeEnd();
					_consoleError("Exception upon " + meta.action, e, meta, this, options, fn, arguments);
					if (!meta.safety) {
						throw(e);
					}
					return;
				};
				timeEnd();
				_consoleLog("Ok upon " + meta.action, returnValue, meta, this, options, fn, arguments);
				return returnValue;
			}
		}
		return _fn;
	}
};

window.Crutch = Crutch;

})();
