Copyright Mathieu Sylvain, 2009
This work is in the Public Domain. To view a copy of the public domain certification, visit http://creativecommons.org/licenses/publicdomain/ or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.

----

NOTE: This library is complete enough to be usefull in real-life situation, but it lacks a full
features test suite.

-----

jsCrutch 

Assisted javascript for better stability and reabilitation of broken code

jsCrush is a javascript utility used to apply a layer of monitoring and control
over the execution of existing javascript functions. It is usefull both while coding and
debuging an application and while running the code in production in order to manage
gracefull code failures.

Author:
	Mathieu Sylvain, 2009

Features:
	- Trap unforseen javascript errors and prevent general script execution failure
	- Log exceptions gracefully with more environment information
	- Log function call with environment information
	- Time the execution of function calls to monitor performance

Usage:
	Usage is recommended during development of new code or when debugging existing code without
	invasive changes. This is similar to using Firebug to debug, but crutches are less volatile
	than usual watches and breakpoints and can even become permanent fixtures of your code.
	
	Crutches can become especially usefull when a site goes through the activation of a series
	of indepedent piece of code which might fail at any moment because of external dependencies
	or the use of plugins which have not been tested for all possible situations or browsers
	(it is usually the case). In these cases, you can instruct a crutched routine to fail gracefully
	without breaking the rest of the site. This will trap any exception and raise them only if
	the used has activated a debugging console on his machine. This means that even in production
	your code can fail with very little noise and still be easy to debug.
	
	To use, first instantiate a crutch object, then use the crutch function to take control
	over the desired code. Options can be passed both during instantiation of the class
	and when crutching individual pieces of code.
	
	Also, it is recommended that if you plan to remove crutched before going to production,
	you should be crutch options declarations in a separate js file or code block that is easy
	to comment out in block.
	
	Make sure to run your scripts through JSLint to ensure that crutched code runs without
	weird behaviors.

Philosophical reminders
	- Dont fail to expect failure in your code.
	- Crutches are for safety, monitoring and debugging, its not an event management library.
	- Crutches help, but ideally you code should run smooth even when crutches are removed.
	- Its ok to leave crutches in production but not at the expense of performance

Sample:
	var crutch = new Crutch(options);
	function helloWorld() {
		alert("hello world!");
	};
	helloWorld.crutch = {
	}
	crutch.crutch(helloWorld);
	someFunction();

Special note:
	- The main Crutch constructor can be used as either a function or a constructor with exactly identical results
		i.e.: var crutch = Crutch()   or   var crutch = new Crutch()

Crutch class instantiation options:
	console - object - A console object compatible with the Firebug Console. If no console is provided, logging and timing is disabled.
	time - boolean - Wether function calls should be timed. A console object is required. (false by default)
	log - boolean - Wether function calls (successfull or not) should be logged to the console. : (false by default)
	onError - 

Crutch function meta options:
	label - string - The label of the function. Can be used as a short description or a full qualified function name. Ex.: "myClass.helloWorld()",
	action - string - A short phrase stating the action taken by the code. Use for friendly loggin. Ex.: "Writing hello world",
	desc - string - A more complete description of the code which could be usefull by someone investigating errors or debuggin code. Ex.: "This function write the hello world message using the systems alert funcion",
	hush - boolean - Determines wether catched errors should be re-thrown or not. Setting it to "true" will prevent broken code from stopping the script execution on the rest of the page (false by default)
	time - boolean - Wether function calls should be timed. A console object is required. (false by default)
	log - boolean - Wether function calls (successfull or not) should be logged to the console. : (false by default)

About performance:
	Using firefox on my netbook, going through 100000 function calls with a crutch activated
	took 1800 milliseconds, compared to 24 without. This equates to about 20 MICROseconds of
	performance taxation per function calls.
	
	These measurements take for granted that all logging were turned off. This means that only
	under extreme cases would the inclusion of Crutch in your project would degrade performance
	in any noticable way
	
	Also, once compressed, the source code is under 3kb, which is a meager sacrifice for a definitive gain. 

Available features:
	- Ability to create multiple crutch instances with different options and scope coverage 
	- Define hooks using literal notation
	- Enable or disable crutches via options parameter
	- Enable or disable individual hooks via options parameter
	- Access to a registry of enabled crutches and their original function call 
		crutch.hooks array (does not include self crutched functions)
	- Find a way to bubble up or make visible errors in routines marked as "safe" without causing JS interuption
	  (maybe a silent error counter? how could it be triggered?) 
	- Hook single function via a function call
		Done via C.crutch() function
	- Support for either function based or constructor based instantiation
	- Unhook all enabled hooks. (detach, detachAll)
	- Conditionnal logging, warn or function intercept
	- Custom callback upon errors/exceptions to be used with server side logging (Google Analytics Support)
	- Enable or disable crutches via console presence
	- Default settings for the main Crutch object and individual hooks
	- Override crutch and hook default options with an "options" arguments

Upcomming features:
	- Override hook default options with function "crutch" attribute
	- Override crutch default options with querystring parameters
	- Override crutch default options with cookie
	- Keep a count of silent errors which have been bubbled up. 

Ideas Out of Scope: 
	- Ability to activate logging of the full time taken for the page load cycle for logging purposes.



