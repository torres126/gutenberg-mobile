/** @format */

import { BlockActionType } from './ActionTypes';

export interface BlockActionPayload {
	type: BlockActionType,
	rowId: number,
};

export interface BlockAction<> {
	(index: number) : BlockActionPayload
};

export const focusBlockAction: BlockAction = ( index: number ) => ( {
	type: BlockActionType.FOCUS,
	rowId: index,
} );

export const moveBlockUpAction: BlockAction = index => ( {
	type: BlockActionType.MOVE_UP,
	rowId: index,
} );

export const moveBlockDownAction: BlockAction = index => ( {
	type: BlockActionType.MOVE_DOWN,
	rowId: index,
} );

export const deleteBlockAction: BlockAction = index => ( {
	type: BlockActionType.DELETE,
	rowId: index,
} );
