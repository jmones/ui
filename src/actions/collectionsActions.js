/**
 * @module react-cmf/lib/actions/collectionsActions
 */
import invariant from 'invariant';

export const COLLECTION_ADD_OR_REPLACE = 'REACT_CMF.COLLECTION_ADD_OR_REPLACE';
export const COLLECTION_REMOVE = 'REACT_CMF.COLLECTION_REMOVE';

/**
 * Add or replace collection data in store
 * @param {string} collection identifier
 * @param {any} any element that represent business data
 */
export const addOrReplaceCollection = (collectionId, data) => ({
	type: COLLECTION_ADD_OR_REPLACE,
	collectionId,
	data,
});

/**
 * Remove collection data in store to free space
 * @param {string} collection identifier
 *
 * @throws if you try to remove non existent collection
 */
export const removeCollection = collectionId => (
	(dispatch, getState) => {
		const state = getState();
		let error = false;
		if (!state.settings.collections.get('collectionId')) {
			error = true;
			invariant(false, `Can't remove collection ${collectionId} since it doesn't already exist.`);
		}
		if (!error) {
			dispatch({
				type: COLLECTION_REMOVE,
				collectionId,
			});
		}
	}
);
