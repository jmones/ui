import React from 'react';
import classNames from 'classnames';
import {Button} from 'react-bootstrap';
import TooltipTrigger from '../../../TooltipTrigger';
import Action from '../../../Actions/Action';
import theme from './Item.scss';
import ItemPropTypes from './Item.propTypes';

function itemClasses(isSelected) {
	return classNames({
		[theme['tc-enumeration-item']]: true,
		[theme['selected-item']]: isSelected,
		'tc-enumeration-item': true,
		'selected-item': isSelected,
	});
}

function itemLabelClasses() {
	return classNames({
		[theme['tc-enumeration-item-label']]: true,
		'tc-enumeration-item-label': true,
	});
}

function itemDefaultActionsClasses() {
	return classNames({
		[theme['tc-enumeration-item-actions']]: true,
		'tc-enumeration-item-actions': true,
		[theme.editable]: true,
	});
}

function Item({ id, item }) {
	const {
		key,
		actions,
		onSelectItem,
	} = item.itemProps;

	function getAction(action, index) {
		function onClick(event) {
			if (action.onClick) {
				action.onClick(event, {
					value: event.target.value,
					index: item.index,
				});
			}
		}

		return (
			<Action
				key={index}
				label={action.label}
				icon={action.icon}
				onClick={onClick}
				tooltipPlacement="bottom"
				hideLabel
				link
			/>
		);
	}

	return (
		<li className={itemClasses(item.isSelected)} id={id}>
			<TooltipTrigger
				label={item[key].join(',')}
				tooltipPlacement="bottom"
				delay={400}
			>
				<Button
					key={item.index}
					onClick={event => onSelectItem(item, event)}
					className={itemLabelClasses()}
				><span>{item[key].join(',')}</span></Button>
			</TooltipTrigger>
			<div className={itemDefaultActionsClasses()}>
				{actions.map((action, index) => getAction(action, index))}
			</div>
		</li>
	);
}

Item.propTypes = ItemPropTypes;

export default Item;
