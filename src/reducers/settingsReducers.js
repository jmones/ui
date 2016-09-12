/**
 * @module react-cmf/lib/reducers/settingsReducers
 */
import * as ACTIONS from '../actions';

const defaultState = {
	initialized: false,
	contentTypes: {},
	actions: {},
	views: {},
	routes: {},
};

/**
 * handle actions related to the settings
 * @param  {object} state  initial state
 * @param  {object} action redux aciton
 * @return {object}        new state
 */
export function settingsReducer(state = defaultState, action) {
	switch (action.type) {
	case ACTIONS.REQUEST_OK:
		return Object.assign({}, state, {
			initialized: true,
		}, action.settings);
	default:
		return state;
	}
}
export default settingsReducer;
