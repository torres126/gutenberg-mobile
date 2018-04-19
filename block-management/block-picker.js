/** @flow
 * @format */

import React from 'react';
import { Modal, Text, TouchableNativeFeedback, FlatList, View, StyleSheet } from 'react-native';

type PropsType = { visible: boolean };
type StateType = {};

export default class BlockPicker extends React.Component<PropsType, StateType> {
	renderItem( { item } ) {
		return (
			<TouchableNativeFeedback onPress={ () => {} }>
				<View
					style={ {
						flex: 1,
						margin: 4,
						height: 150,
						justifyContent: 'center',
						backgroundColor: '#CCC',
					} }
				>
					<Text style={ { textAlign: 'center' } }>{ item.text } </Text>
				</View>
			</TouchableNativeFeedback>
		);
	}

	renderList() {
		return (
			<FlatList
				contentContainerStyle={ styles.list }
				data={ [
					{ key: '1', text: 'Paragraph' },
					{ key: '2', text: 'Code' },
					{ key: '3', text: 'More' },
				] }
				horizontal={ false }
				numColumns={ 2 }
				renderItem={ this.renderItem }
			/>
		);
	}

	render() {
		return (
			<View>
				<Modal
					animationType="slide"
					transparent={ false }
					hardwareAccelerate={ true }
					visible={ this.props.visible }
					onRequestClose={ () => {} }
				>
					<View>
						<View>{ this.renderList() }</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create( {
	list: {
		justifyContent: 'center',
		margin: 4,
	},
} );
