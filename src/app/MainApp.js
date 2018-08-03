/** @format */

// @flow

import { Component } from '@wordpress/element';

import BlockManager, { type BlockListType } from '../block-management/block-manager';

type PropsType = BlockListType;
type StateType = {};

export default class MainScreen extends Component<PropsType, StateType> {
	render() {
		return <BlockManager { ...this.props } />;
	}
}
