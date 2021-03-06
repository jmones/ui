import React, { PropTypes as PT } from 'react';

import { Action, Icon, Badge } from '../../';

import css from './TreeViewItem.scss';

function getActionHandler(func, item) {
	return function actionHandler(event) {
		event.stopPropagation();
		func(item);
	};
}


/**
 *
 * Single item of TreeView component
 *
 * @param id, for qa purposes
 * @param item required, item to display
 * 		  item.actions optional, array with actions' to be displayed meta-info
 * @param showCounter optional, flags that counter badge should be shown
 * @param itemSelectCallback required, callback function to trigger once item was clicked
 * @param itemToggleCallback required, callback function to trigger once item was clicked
 * @param depth optional, depth of an item in a tree
 *
 * @returns XML, jsx to display
 */

function TreeViewItem({
	id,
	item,
	showCounter,
	depth = 0,
	itemSelectCallback,
	itemToggleCallback,
}) {
	const {
		toggled = false,
		selected,
		hidden,
		name,
		children = [],
		actions,
		icon = 'talend-folder',
	} = item;
	const toggleIconLabel = toggled ? 'Collapse' : 'Expand';

	function selectHandler() {
		return itemSelectCallback(item);
	}

	function getTreeViewItem(child, i) {
		return (<TreeViewItem
			{...{
				id: id && `${id}-${i}`,
				item: child,
				itemSelectCallback,
				itemToggleCallback,
				depth: depth + 1,
				key: i,
			}}
		/>);
	}

	function getIconAction(label, icon_, action, id_) {
		return (<Action
			label={label}
			icon={icon_}
			onClick={getActionHandler(action, item)}
			tooltipPlacement="right"
			hideLabel
			key={label}
			id={id_ || `${id}-${icon_}`}
			link
		/>);
	}

	return (
		<li className={css['tc-treeview-li']} data-hidden={hidden}>
			<div // eslint-disable-line jsx-a11y/no-static-element-interactions
				className={css['tc-treeview-item']}
				data-depth={depth}
				data-selected={selected}
				onClick={selectHandler}
				id={id}
			>
				{!children.length ||
					<div className={css['tc-treeview-toggle']} data-toggled={toggled}>
						{getIconAction(toggleIconLabel, 'talend-caret-down', itemToggleCallback, `${id}-toggle`)}
					</div>
				}
				<span className={css['tc-treeview-folder']}><Icon name={icon} key={icon} /></span>
				<span>{name}</span>
				<div className={'tc-treeview-item-ctrl'}>
					{showCounter && <Badge label={children.length.toString()} />}
					{actions && actions.map(a => getIconAction(a.label, a.icon, a.action))}
				</div>
			</div>
			{children && toggled &&
				<ul className={css['tc-treeview-ul']}>
					{children.map(getTreeViewItem)}
				</ul>
			}
		</li>
	);
}

TreeViewItem.propTypes = {
	id: PT.string,
	item: PT.shape({
		name: PT.string.isRequired,
		toggled: PT.bool,
		selected: PT.bool,
		children: PT.arrayOf(PT.object),
		icon: PT.string,
		actions: PT.arrayOf(PT.shape({
			action: PT.func,
			label: PT.string,
			icon: PT.string,
		})),
	}).isRequired,
	itemSelectCallback: PT.func.isRequired,
	itemToggleCallback: PT.func.isRequired,
	showCounter: PT.bool,
	depth: PT.number,
};

export default TreeViewItem;
