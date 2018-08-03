/** @format */

const defaultPlatform = 'android';
if ( process.env.TEST_RN_PLATFORM ) {
	// eslint-disable-next-line no-console
	console.log( 'Setting RN platform to: ' + process.env.TEST_RN_PLATFORM );
} else {
	// eslint-disable-next-line no-console
	console.log( 'Setting RN platform to: default (' + defaultPlatform + ')' );
}

module.exports = {
	moduleFileExtensions: [
		'native.js',
		'android.js',
		'ios.js',
		'js',
		'native.json',
		'android.json',
		'ios.json',
		'json',
		'native.jsx',
		'android.jsx',
		'ios.jsx',
		'jsx',
		'node',
	],
	moduleNameMapper: {
		'@wordpress\\/(blocks|data|element|deprecated|editor)$': '<rootDir>/gutenberg/packages/$1/src/index',
		'@gutenberg': '<rootDir>/gutenberg',

		// Mock the CSS modules. See https://facebook.github.io/jest/docs/en/webpack.html#handling-static-assets
		'\\.(scss)$': '<rootDir>/__mocks__/styleMock.js',
	},
	preset: 'react-native',
	rootDir: '.',
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: [
		'/node_modules/',
		'/gutenberg/',
	],
};
