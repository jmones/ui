import React from 'react';
import renderer from 'react-test-renderer';
jest.mock('../../node_modules/react-virtualized/dist/commonjs/AutoSizer/AutoSizer', () => (props) =>
	{
		return (<div id="autoSizer">{props.children({height: 30, width: 30})}</div>);
	}
);

import Enumeration from './Enumeration.component';

describe('Enumeration', () => {
	it('should render with header in default state and list in default state', () => {
		const props = {
			displayMode: 'DISPLAY_MODE_DEFAULT',

			headerDefault: [{
				label: 'Add item',
				icon: 'talend-plus',
				id: 'add',
				onClick: jest.fn(), // no click callback
			}],
			headerInput: [{
				disabled: false,
				label: 'Validate',
				icon: 'talend-check',
				id: 'validate',
				onClick: jest.fn(), // no click callback
			}, {
				label: 'Abort',
				icon: 'talend-cross',
				id: 'abort',
				onClick: jest.fn(), // no click callback
			}],
			items: Array(3).fill('').map((item, index) => ({
				values: [`Lorem ipsum dolor sit amet ${index}`],
			})),
			itemsProp: {
				key: 'values',
				onSubmitItem: jest.fn(), // no click callback
				onAbortItem: jest.fn(), // no click callback
				getItemHeight: () => {
					return 42;
				},
				actionsDefault: [{
					disabled: false,
					label: 'Edit',
					icon: 'talend-pencil',
					id: 'edit',
					onClick: jest.fn(), // no click callback
				}, {
					label: 'Delete',
					icon: 'talend-trash',
					id: 'delete',
					onClick: jest.fn(), // no click callback
				}],
				actionsEdit: [{
					disabled: false,
					label: 'Validate',
					icon: 'talend-check',
					id: 'validate',
					onClick: jest.fn(), // no click callback
				}],
			},
			onAddChange: jest.fn(), // no click callback
			onAddKeyDown: jest.fn(), // no click callback
		};
		const wrapper = renderer.create(
			<Enumeration {...props} />
		).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render with header in add state and list in default state', () => {
		const props = {
			displayMode: 'DISPLAY_MODE_ADD',

			headerDefault: [{
				label: 'Add item',
				icon: 'talend-plus',
				id: 'add',
				onClick: jest.fn(), // no click callback
			}],
			headerInput: [{
				disabled: false,
				label: 'Validate',
				icon: 'talend-check',
				id: 'validate',
				onClick: jest.fn(), // no click callback
			}, {
				label: 'Abort',
				icon: 'talend-cross',
				id: 'abort',
				onClick: jest.fn(), // no click callback
			}],
			items: Array(3).fill('').map((item, index) => ({
				values: [`Lorem ipsum dolor sit amet ${index}`],
			})),
			itemsProp: {
				key: 'values',
				onSubmitItem: jest.fn(), // no click callback
				onAbortItem: jest.fn(), // no click callback
				getItemHeight: () => {
					return 42;
				},
				actionsDefault: [{
					disabled: false,
					label: 'Edit',
					icon: 'talend-pencil',
					id: 'edit',
					onClick: jest.fn(), // no click callback
				}, {
					label: 'Delete',
					icon: 'talend-trash',
					id: 'delete',
					onClick: jest.fn(), // no click callback
				}],
				actionsEdit: [{
					disabled: false,
					label: 'Validate',
					icon: 'talend-check',
					id: 'validate',
					onClick: jest.fn(), // no click callback
				}],
			},
			onAddChange: jest.fn(), // no click callback
			onAddKeyDown: jest.fn(), // no click callback
		};
		const wrapper = renderer.create(
			<Enumeration {...props} />
		).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render with header in default state and first item in edit mode, validate button disabled is disabled', () => {
		const props = {
			displayMode: 'DISPLAY_MODE_DEFAULT',
			currentEdit: {
				validate: {
					disabled: true,
				},
			},
			headerDefault: [{
				label: 'Add item',
				icon: 'talend-plus',
				id: 'add',
				onClick: jest.fn(), // no click callback
			}],
			headerInput: [{
				disabled: false,
				label: 'Validate',
				icon: 'talend-check',
				id: 'validate',
				onClick: jest.fn(), // no click callback
			}, {
				label: 'Abort',
				icon: 'talend-cross',
				id: 'abort',
				onClick: jest.fn(), // no click callback
			}],
			items: Array(3).fill('').map((item, index) => ({
				values: [`Lorem ipsum dolor sit amet ${index}`],
			})),
			itemsProp: {
				key: 'values',
				onSubmitItem: jest.fn(), // no click callback
				onAbortItem: jest.fn(), // no click callback
				getItemHeight: () => {
					return 42;
				},
				actionsDefault: [{
					disabled: false,
					label: 'Edit',
					icon: 'talend-pencil',
					id: 'edit',
					onClick: jest.fn(), // no click callback
				}, {
					label: 'Delete',
					icon: 'talend-trash',
					id: 'delete',
					onClick: jest.fn(), // no click callback
				}],
				actionsEdit: [{
					disabled: false,
					label: 'Validate',
					icon: 'talend-check',
					id: 'validate',
					onClick: jest.fn(), // no click callback
				}, {
					disabled: false,
					label: 'Cancel',
					icon: 'talend-cross',
					id: 'abort',
					onClick: jest.fn(), // no click callback
				}],
			},
			onAddChange: jest.fn(), // no click callback
			onAddKeyDown: jest.fn(), // no click callback
		};
		props.items[0].displayMode = 'DISPLAY_MODE_EDIT';

		function createNodeMock(element) {
			if (element.type === 'input') {
				return {};
			}
			return null;
		}
		const rendererOptions = { createNodeMock };

		// when
		const wrapper = renderer.create(
			<Enumeration {...props} />,
			rendererOptions
		).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});
