/** @flow
 * @format */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Dashicon } from '@wordpress/components';

type PropsType = {
	disabled: boolean,
	icon: string,
	onPress: () => void,
};

import styles from './style.scss';

export default class InlineToolbarButton extends React.Component<PropsType> {
	static defaultProps = {
		disabled: false,
	};

	render() {
		const { disabled, icon, onPress } = this.props;

		// There are better ways to write this, but it looks like RNSVG
		// can't take an array of styles without crashing so we're doing
		// that work instead ¯\_(ツ)_/¯
		let iconStyle = styles.icon;
		if ( disabled ) {
			iconStyle = { ...iconStyle, ...styles.iconDisabled };
		}

		return (
			<TouchableOpacity onPress={ onPress } disabled={ disabled } >
				<View style={ styles.button }>
					<Dashicon icon={ icon } style={ iconStyle } />
				</View>
			</TouchableOpacity>
		);
	}
}
