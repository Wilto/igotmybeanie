(function(win, undefined){
	
	var doc 		 = win.document,
		docElem 	 = doc.documentElement,
		head		 = doc.head || doc.getElementsByTagName( "head" )[0] || docElem,
		Modernizr	 = win.Modernizr,
		md			 = win.md;
	
	// Supportin’ stuff.
	md = {
		screenWidth 	 : window.screen.width,
		mobileBreakpoint : window.screen.width >= 480,
		browser : {
			ie6			 : !!~docElem.className.indexOf( "ie6" ),
			ie7			 : !!~docElem.className.indexOf( "ie7" ),
			ie8			 : !!~docElem.className.indexOf( "ie8" )	
		},
		devMode : {
			mobileAssets : !!~location.search.indexOf("mobile"),
			basicAssets	 : !!~location.search.indexOf("basic")
		},
		enhanced		 : respond.mediaQueriesSupported || md.browser.ie6 || md.browser.ie7 || md.browser.ie8
	};

	// If we’re emulating non-MQ browsers for development purposes:
	if( md.devMode.basicAssets ) {
		head.removeChild( doc.getElementById( "enhanced-css" ) );
		head.removeChild( doc.getElementById( "reset-css" ) );
		return;
	}

	// Non-MQ browser, or in “mobile” preview mode? Exit here:
	if( !md.enhanced || md.devMode.mobileAssets ) { 
		return;
	}

	// If we’ve made it this far, we’re enhanced. Add a class to style against.
	docElem.className += " enhanced";

	// Add a class for “homescreen mode”:
	if ( win.navigator.standalone ) {
		docElem.className += " standalone";	
	}

	// Callback for body-dependent scripts:
	md.bodyready = (function(){

		var callbackStack 	= [],
			checkRun		= function( callback ){

				if( callback ){
					callbackStack.push( callback );
				}

				if( doc.body ){
					while( callbackStack[0] && typeof( callbackStack[0] ) === "function" ){
						callbackStack.shift().call( win );
					}
				}
				else{
					setTimeout(checkRun, 15); 
				}
			};
			return checkRun;
	})();

	// Loading functions available on md.load:
	md.load = {};

	// Define md.load.style:
	md.load.style = function( href, media ){

		if( !href ){ return; }

		var lk			= doc.createElement( "link" ),
			links		= head.getElementsByTagName("link"),
			lastlink	= links[links.length-1];
			lk.type 	= "text/css";
			lk.href 	= href;
			lk.rel		= "stylesheet";
			if( media ){
				lk.media = media;
			}

			//if respond.js is present, be sure to update its media queries cache once this stylesheet loads
			//IE should have no problems with the load event on links, unlike other browsers
			if( "respond" in window ){
				lk.onload = respond.update;
			}

			//might need to wait until DOMReady in IE...
			if( lastlink.nextSibling ){
				head.insertBefore(lk, lastlink.nextSibling );
			} else {
				head.appendChild( lk );
			}
	};

	//define md.load.style
	md.load.script = function( src ){
		if( !src ){ return; }
		var script		= doc.createElement( "script" ),
			fc			= head.firstChild;
			script.src 	= src;

			//might need to wait until DOMReady in IE...
			if( fc ){
				head.insertBefore(script, fc );
			} else {
				head.appendChild( script );
			}
	};

	// Non-MQ browser, or in one of the two development modes? Exit here:
	if( !md.enhanced || md.devMode.mobileAssets || md.devMode.basicAssets ) { 
		return;
	}

	// Define scripts and styles for conditional loading:
	md.assets = {
		js: {
			jQuery   : "libs/jquery.min.js",
			plugin   : "plugins.js",
			init     : "init.js",
			touch    : "touch.js",
			fitText  : "libs/fittext.js"
		},
		css: {
			fonts 	 : "fonts.css"
		}
	};

		
	var jsToLoad = [
		md.assets.js.jQuery,
		md.assets.js.plugin,
		md.assets.js.init
	],
	cssToLoad = [];
		
	// Wait for body to be ready for the rest, so we can check the body class and load accordingly:
	md.bodyready(function(){

		// Load custom fonts above:
		if( md.mobileBreakpoint && !md.devMode.mobileAssets ){
			
			jsToLoad.push( md.assets.js.fitText );
			
			cssToLoad.push( md.assets.css.fonts );
			// Remove no-fontface class, for fallback font styling:
			docElem.className = docElem.className.replace(/\bno-fontface\b/,'');
		}

		// Load enhanced assets:
		if( jsToLoad.length ){
			md.load.script( jsToLoad.join(",") );
		}
		if( cssToLoad.length ){
			md.load.style( cssToLoad.join(",") );
		}
		
		// Advanced support 
		md.support = {
			touch		 : Modernizr.touch
		};
		
		// If it's a device that supports touch...
		if( md.support.touch ) {
			jsToLoad.push(md.assets.js.touch);
		}

	});
	
	// WebReflection Solution for ensuring domready fires when dynamically appending jQuery in older browsers
	(function(h,a,c,k){if(h[a]==null&&h[c]){h[a]="loading";h[c](k,c=function(){h[a]="complete";h.removeEventListener(k,c,!1)},!1)}})(document,"readyState","addEventListener","DOMContentLoaded");

})(this);