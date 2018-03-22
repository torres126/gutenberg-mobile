/** @format */

import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ToolbarButton } from './constants';

type PropsType = {
	index: number,
	onButtonPressed: ( button: number, index: number ) => void,
};

export default class Toolbar extends React.Component<PropsType> {
	render() {
		return (
			<View style={ styles.toolbar }>
				<Button
					style={ styles.toolbarButton }
					onPress={ this.props.onButtonPressed.bind( this, ToolbarButton.UP, this.props.index ) }
					title="▲"
				/>
				<View style={ styles.buttonSeparator } />
				<Button
					style={ styles.toolbarButton }
					onPress={ this.props.onButtonPressed.bind( this, ToolbarButton.DOWN, this.props.index ) }
					title="▼"
				/>
				<View style={ styles.buttonSeparator } />
				<Button
					style={ styles.toolbarButton }
					onPress={ this.props.onButtonPressed.bind(
						this,
						ToolbarButton.SETTINGS,
						this.props.index
					) }
					title="⚙️"
				/>
				<View style={ styles.buttonSeparator } />
				<Button
					style={ styles.toolbarButton }
					onPress={ this.props.onButtonPressed.bind(
						this,
						ToolbarButton.DELETE,
						this.props.index
					) }
					title="🗑"
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create( {
	toolbar: {
		height: 34,
		backgroundColor: 'white',
		flexDirection: 'row',
		margin: 8,
	},
	toolbarButton: {
		padding: 4,
	},
	buttonSeparator: {
		width: 8,
	},
} );
