/** @format */
const blacklist = require( 'metro-config/src/defaults/blacklist' );
const enm = require( './extra-node-modules.config.js' );
const blacklistElements = blacklist( [
	/gutenberg\/packages\/(autop|compose|deprecated|hooks|i18n|is-shallow-equal|blob|redux-routine)\/.*/,
] );

module.exports = {
	extraNodeModules: enm,
	resolver: {
		blacklistRE: blacklistElements,
		sourceExts: [ 'js', 'json', 'scss', 'sass' ],
	},
	transformer: {
		babelTransformerPath: require.resolve( './sass-transformer.js' ),
	},
};
