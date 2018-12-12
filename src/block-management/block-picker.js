/**
 * @format
 * @flow
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import React, { Component } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import Modal from 'react-native-modal';
import styles from './block-picker.scss';
import { name as unsupportedBlockName } from '../block-types/unsupported-block';
// Gutenberg imports
import { getBlockTypes } from '@wordpress/blocks';

type PropsType = {
	style?: StyleSheet,
	isReplacement: boolean,
	onValueSelected: ( itemValue: string, itemIndex: number ) => void,
	onDismiss: () => void,
};

// TODO: not used for now - will hold currently selected Block Type, probably makes sense for the inspector
type StateType = {
	selectedIndex: number,
};

export default class BlockPicker extends Component<PropsType, StateType> {
	availableBlockTypes = getBlockTypes().filter( ( { name } ) => name !== unsupportedBlockName );

	constructor( props: PropsType ) {
		super( props );
		this.state = {
			selectedIndex: 0,
		};
	}

	render() {
		const titleForAdd = __( 'ADD BLOCK' );
		const titleForReplace = __( 'REPLACE BLOCK' );
		return (
			<Modal
				transparent={ true }
				isVisible={ true }
				onSwipe={ this.props.onDismiss.bind( this ) }
				onBackButtonPress={ this.props.onDismiss.bind( this ) }
				swipeDirection="down"
				style={ [ styles.bottomModal, this.props.style ] }
				backdropColor={ 'lightgrey' }
				backdropOpacity={ 0.4 }
				onBackdropPress={ this.props.onDismiss.bind( this ) }>
				<View style={ styles.modalContent }>
					<View style={ styles.shortLineStyle } />
					<View>
						<Text style={ styles.title }>
							{ this.props.isReplacement ? titleForReplace : titleForAdd }
						</Text>
					</View>
					<View style={ styles.lineStyle } />
					<FlatList
						keyboardShouldPersistTaps="always"
						numColumns={ 3 }
						data={ this.availableBlockTypes }
						keyExtractor={ ( item ) => item.name }
						renderItem={ ( { item } ) =>
							<TouchableHighlight
								style={ styles.touchableArea }
								underlayColor={ 'transparent' }
								activeOpacity={ .5 }
								onPress={ this.props.onValueSelected.bind( this, item.name ) }>
								<View style={ styles.modalItem }>
									<View style={ styles.modalIcon }>
										{ item.icon.src }
									</View>
									<Text style={ styles.modalItemLabel }>{ item.title }</Text>
								</View>
							</TouchableHighlight>
						}
					/>
				</View>
			</Modal>
		);
	}
}
