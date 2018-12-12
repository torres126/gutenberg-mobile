/**
 * @format
 * @flow
 */

import React from 'react';
import { isEqual } from 'lodash';

import { Text, View, FlatList, Keyboard, LayoutChangeEvent } from 'react-native';
import BlockHolder from './block-holder';
import { InlineToolbarActions } from './inline-toolbar';
import type { BlockType } from '../store/types';
import styles from './block-manager.scss';
import BlockPicker from './block-picker';
import HTMLTextInput from '../components/html-text-input';
import BlockToolbar from './block-toolbar';
import KeyboardAvoidingView from '../components/keyboard-avoiding-view';

// Gutenberg imports
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock, isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import { DefaultBlockAppender } from '@wordpress/editor';

import EventEmitter from 'events';

const keyboardDidShow = 'keyboardDidShow';
const keyboardDidHide = 'keyboardDidHide';

export type BlockListType = {
	rootClientId: ?string,
	onChange: ( clientId: string, attributes: mixed ) => void,
	focusBlockAction: string => void,
	moveBlockUpAction: string => mixed,
	moveBlockDownAction: string => mixed,
	deleteBlockAction: string => mixed,
	createBlockAction: ( string, BlockType ) => mixed,
	replaceBlock: ( string, BlockType ) => mixed,
	selectedBlock: ?BlockType,
	selectedBlockClientId: string,
	serializeToNativeAction: void => void,
	toggleHtmlModeAction: void => void,
	updateHtmlAction: string => void,
	mergeBlocksAction: ( string, string ) => mixed,
	blocks: Array<BlockType>,
	isBlockSelected: string => boolean,
	showHtml: boolean,
};

type PropsType = BlockListType;
type StateType = {
	blockTypePickerVisible: boolean,
	blocks: Array<BlockType>,
	selectedBlockType: string,
	refresh: boolean,
	isKeyboardVisible: boolean,
	rootViewHeight: number;
};

export class BlockManager extends React.Component<PropsType, StateType> {
	keyboardDidShowListener: EventEmitter;
	keyboardDidHideListener: EventEmitter;

	constructor( props: PropsType ) {
		super( props );

		const blocks = props.blocks.map( ( block ) => {
			const newBlock = { ...block };
			newBlock.focused = props.isBlockSelected( block.clientId );
			return newBlock;
		} );

		this.state = {
			blocks: blocks,
			blockTypePickerVisible: false,
			selectedBlockType: 'core/paragraph', // just any valid type to start from
			refresh: false,
			isKeyboardVisible: false,
			rootViewHeight: 0,
		};
	}

	// TODO: in the near future this will likely be changed to onShowBlockTypePicker and bound to this.props
	// once we move the action to the toolbar
	showBlockTypePicker( show: boolean ) {
		this.setState( { ...this.state, blockTypePickerVisible: show } );
	}

	onKeyboardHide() {
		Keyboard.dismiss();
	}

	onBlockTypeSelected( itemValue: string ) {
		this.setState( { selectedBlockType: itemValue, blockTypePickerVisible: false } );

		// create an empty block of the selected type
		const newBlock = createBlock( itemValue );

		// now determine whether we need to replace the currently selected block (if it's empty)
		// or just add a new block as usual
		if ( this.isReplaceable( this.props.selectedBlock ) ) {
			// do replace here
			this.props.replaceBlock( this.props.selectedBlockClientId, newBlock );
		} else {
			this.props.createBlockAction( newBlock.clientId, newBlock );
		}
		// now set the focus
		this.props.focusBlockAction( newBlock.clientId );
	}

	static getDerivedStateFromProps( props: PropsType, state: StateType ) {
		const blocks = props.blocks.map( ( block ) => {
			const newBlock = { ...block };
			newBlock.focused = props.isBlockSelected( block.clientId );
			return newBlock;
		} );

		if ( ! isEqual( state.blocks, blocks ) ) {
			return {
				blocks,
				refresh: ! state.refresh,
			};
		}

		// no state change necessary
		return null;
	}

	onInlineToolbarButtonPressed = ( button: number, clientId: string ) => {
		switch ( button ) {
			case InlineToolbarActions.UP:
				this.props.moveBlockUpAction( clientId );
				break;
			case InlineToolbarActions.DOWN:
				this.props.moveBlockDownAction( clientId );
				break;
			case InlineToolbarActions.DELETE:
				this.props.deleteBlockAction( clientId );
				break;
		}
	}

	onRootViewLayout = ( event: LayoutChangeEvent ) => {
		const { height } = event.nativeEvent.layout;
		this.setState( { rootViewHeight: height } );
	}

	componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener( keyboardDidShow, this.keyboardDidShow );
		this.keyboardDidHideListener = Keyboard.addListener( keyboardDidHide, this.keyboardDidHide );
	}

	componentWillUnmount() {
		Keyboard.removeListener( keyboardDidShow, this.keyboardDidShow );
		Keyboard.removeListener( keyboardDidHide, this.keyboardDidHide );
	}

	keyboardDidShow = () => {
		this.setState( { isKeyboardVisible: true } );
	}

	keyboardDidHide = () => {
		this.setState( { isKeyboardVisible: false } );
	}

	insertBlocksAfter( clientId: string, blocks: Array<Object> ) {
		//TODO: make sure to insert all the passed blocks
		const newBlock = blocks[ 0 ];
		if ( ! newBlock ) {
			return;
		}

		this.props.createBlockAction( newBlock.clientId, newBlock );

		// now set the focus
		this.props.focusBlockAction( newBlock.clientId );
	}

	mergeBlocks = ( forward: boolean = false ) => {
		// find currently focused block
		const focusedItemIndex = this.state.blocks.findIndex( ( block ) => block.focused );
		if ( focusedItemIndex === -1 ) {
			// do nothing if it's not found.
			// Updates calls from the native side may arrive late, and the block already been deleted
			return;
		}

		const block = this.state.blocks[ focusedItemIndex ];
		const previousBlock = this.state.blocks[ focusedItemIndex - 1 ];
		const nextBlock = this.state.blocks[ focusedItemIndex + 1 ];

		// Do nothing when it's the first block.
		if (
			( ! forward && ! previousBlock ) ||
			( forward && ! nextBlock )
		) {
			return;
		}

		if ( forward ) {
			this.props.mergeBlocksAction( block.clientId, nextBlock.clientId );
		} else {
			this.props.mergeBlocksAction( previousBlock.clientId, block.clientId );
		}
	};

	onReplace( clientId: string, block: BlockType ) {
		this.props.replaceBlock( clientId, block );
	}

	renderList() {
		// TODO: we won't need this. This just a temporary solution until we implement the RecyclerViewList native code for iOS
		// And fix problems with RecyclerViewList on Android
		const list = (
			<FlatList
				keyboardShouldPersistTaps="always"
				style={ styles.list }
				data={ this.state.blocks }
				extraData={ { refresh: this.state.refresh } }
				keyExtractor={ ( item ) => item.clientId }
				renderItem={ this.renderItem.bind( this ) }
			/>
		);
		return (
			<KeyboardAvoidingView style={ { flex: 1 } } parentHeight={ this.state.rootViewHeight }>
				<DefaultBlockAppender rootClientId={ this.props.rootClientId } />
				{ list }
				<BlockToolbar
					onInsertClick={ () => {
						this.showBlockTypePicker( true );
					} }
					onKeyboardHide={ () => {
						this.onKeyboardHide();
					} }
					showKeyboardHideButton={ this.state.isKeyboardVisible }
				/>
			</KeyboardAvoidingView>
		);
	}

	render() {
		const list = this.renderList();
		const blockTypePicker = (
			<BlockPicker
				onDismiss={ () => {
					this.showBlockTypePicker( false );
				} }
				onValueSelected={ ( itemValue ) => {
					this.onBlockTypeSelected( itemValue );
				} }
				isReplacement={ this.isReplaceable( this.props.selectedBlock ) }
			/>
		);

		return (
			<View style={ styles.container } onLayout={ this.onRootViewLayout }>
				{ this.props.showHtml && this.renderHTML() }
				{ ! this.props.showHtml && list }
				{ this.state.blockTypePickerVisible && blockTypePicker }
			</View>
		);
	}

	isFirstBlock( index: number ) {
		return index === 0;
	}

	isLastBlock( index: number ) {
		return index === this.state.blocks.length - 1;
	}

	isReplaceable( block: ?BlockType ) {
		if ( ! block ) {
			return false;
		}
		return isUnmodifiedDefaultBlock( block );
	}

	renderItem( value: { item: BlockType, index: number } ) {
		const insertHere = (
			<View style={ styles.containerStyleAddHere } >
				<View style={ styles.lineStyleAddHere }></View>
				<Text style={ styles.labelStyleAddHere } >ADD BLOCK HERE</Text>
				<View style={ styles.lineStyleAddHere }></View>
			</View>
		);

		const canMoveUp = ! this.isFirstBlock( value.index );
		const canMoveDown = ! this.isLastBlock( value.index );

		return (
			<View>
				<BlockHolder
					key={ value.item.clientId }
					onInlineToolbarButtonPressed={ this.onInlineToolbarButtonPressed }
					onChange={ this.props.onChange }
					showTitle={ false }
					clientId={ value.item.clientId }
					canMoveUp={ canMoveUp }
					canMoveDown={ canMoveDown }
					insertBlocksAfter={ ( blocks ) => this.insertBlocksAfter( value.item.clientId, blocks ) }
					mergeBlocks={ this.mergeBlocks }
					onReplace={ ( block ) => this.onReplace( value.item.clientId, block ) }
					{ ...value.item }
				/>
				{ this.state.blockTypePickerVisible && value.item.focused && insertHere }
			</View>
		);
	}

	renderHTML() {
		return (
			<HTMLTextInput { ...this.props } />
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const {
			getSelectedBlock,
			getSelectedBlockClientId,
		} = select( 'core/editor' );

		return {
			selectedBlock: getSelectedBlock(),
			selectedBlockClientId: getSelectedBlockClientId(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			replaceBlock,
		} = dispatch( 'core/editor' );

		return {
			replaceBlock,
		};
	} ),
] )( BlockManager );
