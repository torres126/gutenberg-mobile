module.exports = function( api ) {
	api.cache( false );

	return {
		presets: [
			'react-native',
			'@wordpress/babel-preset-default',
		],
		plugins: [
			'@babel/plugin-proposal-class-properties',
			[
				'@wordpress/babel-plugin-import-jsx-pragma',
				{
					scopeVariable: 'createElement',
					source: '@wordpress/element',
					isDefault: false,
				},
			],
			'react-require',
			[
				'module-resolver',
				{
					cwd: 'babelrc',
					alias: {
						'@gutenberg': './gutenberg',
					},
					extensions: [
						'.js',
						'.native.js',
						'.ios.js',
						'.android.js',
					],
				},
			],
			'react-native-classname-to-style',
			[
				'react-native-platform-specific-extensions',
				{
					extensions: [
						'css',
						'scss',
						'sass',
					],
				},
			],
		],
	};
};
