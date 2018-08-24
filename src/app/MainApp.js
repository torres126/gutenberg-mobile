/** @flow
 * @format */

import React from 'react';
import { Image } from 'react-native';

import BlockManager, { type BlockListType } from '../block-management/block-manager';

type PropsType = BlockListType;
type StateType = {};

export default class MainScreen extends React.Component<PropsType, StateType> {
	render() {
		const { parseBlocksAction } = this.props;
		const demo = require( '../../assets/demo.html' );
		const demoAsset = Image.resolveAssetSource( demo );
		if ( demoAsset.uri ) {
			fetch( demoAsset.uri )
				.then( (response) => response.text() )
				.catch( (error) => console.error( 'Error:', error ) )
				.then( (html) => {
					parseBlocksAction( html );
				} );
		}

		return <BlockManager { ...this.props } />;
	}
}
