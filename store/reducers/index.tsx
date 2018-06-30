/** @format */

import { BlockActionType } from '../actions/ActionTypes';
import { StateType } from '../';
import { BlockActionPayload } from '../actions';
import { BlockAction } from '../actions';

export function reducer(
	state: StateType = { blocks: [], refresh: false },
	action: BlockActionPayload
): StateType {
	switch ( action.type ) {
		case BlockActionType.FOCUS:
			var blocks = [ ...state.blocks ];
			const currentBlockState = blocks[ action.rowId ].focused;
			// Deselect all blocks
			for ( let block of blocks ) {
				block.focused = false;
			}
			// Select or deselect pressed block
			blocks[ action.rowId ].focused = ! currentBlockState;
			return { blocks: blocks, refresh: ! state.refresh };
		case BlockActionType.MOVE_UP:
			if ( action.rowId == 0 ) return state;

			var blocks = [ ...state.blocks ];
			var tmp = blocks[ action.rowId ];
			blocks[ action.rowId ] = blocks[ action.rowId - 1 ];
			blocks[ action.rowId - 1 ] = tmp;
			return { blocks: blocks, refresh: ! state.refresh };
		case BlockActionType.MOVE_DOWN:
			if ( action.rowId == state.blocks.length - 1 ) return state;

			var blocks = [ ...state.blocks ];
			var tmp = blocks[ action.rowId ];
			blocks[ action.rowId ] = blocks[ action.rowId + 1 ];
			blocks[ action.rowId + 1 ] = tmp;
			return { blocks: blocks, refresh: ! state.refresh };
		case BlockActionType.DELETE:
			var blocks = [ ...state.blocks ];
			blocks.splice( action.rowId, 1 );
			return { blocks: blocks, refresh: ! state.refresh };
		default:
			return state;
	}
};
