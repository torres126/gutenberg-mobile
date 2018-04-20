/** @flow
 * @format */

import React from 'react';
import {
	Modal,
	Text,
	TouchableOpacity,
	FlatList,
	View,
	StyleSheet,
	BackHandler,
} from 'react-native';

type PropsType = {
	visible: boolean,
	onBlockButtonPressed: ( uid: string ) => void,
	closeBlockPicker: () => void,
};
type StateType = {};

export default class BlockPicker extends React.Component<PropsType, StateType> {
	componentWillMount() {
		BackHandler.addEventListener( 'hardwareBackPress', function() {
			this.props.closeBlockPicker();
			return true;
		} );
	}

	componentWillUnmount() {
		BackHandler.removeEventListener( 'hardwareBackPress' );
	}

	renderItem( { item } ) {
		return (
			<TouchableOpacity
				onPress={ this.props.onBlockButtonPressed() }
				activeOpacity={ 0.5 }
				style={ {
					flex: 1,
					margin: 4,
					height: 150,
					justifyContent: 'center',
					backgroundColor: '#CCC',
				} }
			>
				<View>
					<Text style={ { textAlign: 'center' } }>{ item.text } </Text>
				</View>
			</TouchableOpacity>
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
				renderItem={ this.renderItem.bind( this ) }
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
