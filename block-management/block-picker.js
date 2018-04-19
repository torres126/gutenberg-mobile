/** @flow
 * @format */

import React from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';

type PropsType = { visible: boolean };
type StateType = {};

export default class BlockPicker extends React.Component<PropsType, StateType> {
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
						<View>
							<Text>Hey Ponies!</Text>
							<TouchableHighlight onPress={ () => {} }>
								<Text>Hide Modal</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}
