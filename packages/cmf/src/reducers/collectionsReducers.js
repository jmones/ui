/**
 * @module react-cmf/lib/reducers/collectionsReducers
 */
import { Map, List, fromJS } from 'immutable';
import ACTIONS from '../actions';

export const defaultState = new Map();

/**
 * addElementToCollection
 *
 * @param state current redux state
 * @param action redux action
 * @returns {object} the new state
 */
function addCollectionElement(state, action) {
	if (action.operations.add) {
		return action.operations.add.reduce((s, e) => {
			const element = s.get(action.id);
			if (List.isList(element)) {
				return s.set(action.id, element.push(e));
			}
			if (Map.isMap(element)) {
				return s.set(action.id, element.merge(e));
			}
			return state;
		}, state);
	}
	return state;
}

function deleteListElements(state, action) {
	function shouldBeRemoved(element) {
		return action.operations.delete.indexOf(element.id) >= 0;
	}

	const collection = state.get(action.id);
	if (collection.some(shouldBeRemoved)) {
		return state.set(action.id, collection.filterNot(shouldBeRemoved));
	}
	return state;
}

function deleteMapElements(state, action) {
	const collection = state.get(action.id);

	if (action.operations.delete.some(id => collection.has(id))) {
		const changedCollection = action.operations.delete.reduce(
			(collectionAccu, element) => collectionAccu.delete(element),
			collection
		);
		return state.set(action.id, changedCollection);
	}

	return state;
}

/**
 * deleteElementFromCollection
 *
 * @param state current redux state
 * @param action redux action
 * @returns {object} the new state
 */
function deleteCollectionElement(state, action) {
	if (action.operations.delete) {
		const collection = state.get(action.id);
		if (Map.isMap(collection)) {
			return deleteMapElements(state, action);
		}
		else if (List.isList(collection)) {
			return deleteListElements(state, action);
		}
		else {
			throw new Error('CMF collection deletion is only compatible with ImmutableJs List and Map');
		}
	}
	return state;
}

function updateListElements(state, action) {
	const updates = action.operations.update;

	const changedCollection = state
		.get(action.id)
		.map(element => updates[element.id] || element);
	return state.set(action.id, changedCollection);
}

function updateMapElements(state, action) {
	const updates = action.operations.update;
	const changedCollection = Object.keys(updates).reduce(
		(collectionAccu, id) => collectionAccu.set(id, updates[id]),
		state.get(action.id)
	);
	return state.set(action.id, changedCollection);
}

/**
 * updateCollectionElement
 *
 * @param state current redux state
 * @param action redux action
 * @returns {object} the new state
 */
function updateCollectionElement(state, action) {
	if (action.operations.update) {
		const collection = state.get(action.id);
		if (Map.isMap(collection)) {
			return updateMapElements(state, action);
		}
		else if (List.isList(collection)) {
			return updateListElements(state, action);
		}
		else {
			throw new Error('CMF collection update is only compatible with ImmutableJs List and Map');
		}
	}
	return state;
}

/**
 * mutateCollection
 *
 * @param {object} state the current redux state
 * @param {object} action redux action
 * @returns {object} the new state
 */
function mutateCollection(state, action) {
	if (!action.operations || !state.has(action.id) || state.isEmpty()) {
		return state;
	}
	let newState = addCollectionElement(state, action);
	newState = deleteCollectionElement(newState, action);
	return updateCollectionElement(newState, action);
}

/**
 * @param  {object} state  the state
 * @param  {object} action redux action
 * @return {object}        the new state
 */
export function collectionsReducers(state = defaultState, action) {
	switch (action.type) {
	case ACTIONS.collectionsActions.COLLECTION_ADD_OR_REPLACE:
		return state.set(action.collectionId, fromJS(action.data));
	case ACTIONS.collectionsActions.COLLECTION_REMOVE:
		return state.delete(action.collectionId);
	case ACTIONS.collectionsActions.COLLECTION_MUTATE:
		return mutateCollection(state, action);
	default:
		return state;
	}
}

export default collectionsReducers;
