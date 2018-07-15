/** @format */

import { createElement } from '@wordpress/element';
import jsdom from 'jsdom-jscore';

global.wp = {
	element: {
		createElement, // load the element creation function, needed by Gutenberg-web
	},
};

const doc = jsdom.html( '', null, null );

// inject a simple version of the missing createHTMLDocument method that `hpq` depends on
doc.implementation.createHTMLDocument = function( html ) {
	return jsdom.html( html, null, null );
};

// `hpq` depends on `document` be available globally
global.document = doc;

// create the nodeType constants if the Node object is not defined
if ( ! global.window.Node ) {
	const Node = {
		ELEMENT_NODE: 1,
		ATTRIBUTE_NODE: 2,
		TEXT_NODE: 3,
		CDATA_SECTION_NODE: 4,
		ENTITY_REFERENCE_NODE: 5,
		ENTITY_NODE: 6,
		PROCESSING_INSTRUCTION_NODE: 7,
		COMMENT_NODE: 8,
		DOCUMENT_NODE: 9,
		DOCUMENT_TYPE_NODE: 10,
		DOCUMENT_FRAGMENT_NODE: 11,
		NOTATION_NODE: 12,
	};
	global.window.Node = Node;
}
