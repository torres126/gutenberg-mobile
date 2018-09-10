/** @format */
const blacklist = require( 'metro' ).createBlacklist;
const path = require( 'path' );

const enm = require( './extra-node-modules.config.js' );

const { lstatSync, readdirSync } = require( 'fs' );
const getDirectoryNames = ( dir ) =>
	readdirSync( dir ).filter( ( name ) => lstatSync( path.resolve( dir, name ) ).isDirectory() );

const wppackagenames = getDirectoryNames( path.resolve( __dirname, '../packages/' ) );

const mapper = function( accu, v ) {
	accu[ '@wordpress/' + v ] = path.resolve( __dirname, '../packages/' + v );
	return accu;
};

const wppackages = wppackagenames.reduce( mapper, {} );

module.exports = {
	extraNodeModules: Object.assign( enm, wppackages ),
	getProjectRoots() {
		const roots = [ __dirname, path.resolve( __dirname, '../node_modules' ) ].concat(
			Object.values( wppackages )
		);
		return roots;
	},
	getBlacklistRE: function() {
		// Blacklist the GB packages we want to consume from NPM (online) directly.
		// On the other hand, GB packages that are loaded from the source tree directly
		// are automagically resolved by Metro so, there is no list of them anywhere.
		return blacklist( [ new RegExp( path.basename( __dirname ) + '/gutenberg/.*' ) ] );
	},
	getTransformModulePath() {
		return require.resolve( './sass-transformer-inside-gb.js' );
	},
	getSourceExts() {
		return [ 'js', 'json', 'scss', 'sass' ];
	},
	getProvidesModuleNodeModules() {
		return [ 'react-native-svg', 'react-native' ];
	},
};