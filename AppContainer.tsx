/** @format */
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
	focusBlockAction,
	moveBlockUpAction,
	moveBlockDownAction,
	deleteBlockAction,
	BlockAction,
} from './store/actions';
import MainApp from './MainApp';

const mapStateToProps = (state: any) => ( {
	...state,
} );

const mapDispatchToProps = ( dispatch: Dispatch<BlockAction>, ownProps: any ) => {
	return {
		...ownProps,
		focusBlockAction: (index: number) => {
			dispatch( focusBlockAction( index ) );
		},
		moveBlockUpAction: (index: number) => {
			dispatch( moveBlockUpAction( index ) );
		},
		moveBlockDownAction: (index: number) => {
			dispatch( moveBlockDownAction( index ) );
		},
		deleteBlockAction: (index: number) => {
			dispatch( deleteBlockAction( index ) );
		},
	};
};

const AppContainer = connect( mapStateToProps, mapDispatchToProps )( MainApp );
export default AppContainer;
