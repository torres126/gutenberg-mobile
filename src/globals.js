/** @format */

import jsdom from 'jsdom-jscore';
import jsdomLevel1Core from 'jsdom-jscore/lib/jsdom/level1/core';

const doc = jsdom.html( '', null, null );

// inject a simple version of the missing createHTMLDocument method that `hpq` depends on
doc.implementation.createHTMLDocument = function( html ) {
	return jsdom.html( html, null, null );
};

// `hpq` depends on `document` be available globally
global.document = doc;

if ( ! global.window.Node ) {
	global.window.Node = jsdomLevel1Core.dom.level1.core.Node;
}
