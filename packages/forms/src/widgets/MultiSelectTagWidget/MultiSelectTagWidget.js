import React from 'react';
import Badge from 'react-talend-components/lib/Badge';
import { MenuItem } from 'react-bootstrap';
import classNames from 'classnames';
import theme from './MultiSelectTagWidget.scss';

const ENTER = 'ENTER';
const LEAVE = 'LEAVE';

const INPUT_TEXT_INDENT = 7.5;
const INPUT_HEIGHT = 32;
const BADGE_HEIGHT = 24;
const BADGES_MARGIN_TOP = 7;
const INPUT_MIN_WIDTH = 135;

function mapValue2Label(enumOptions) {
	return enumOptions.reduce((map, option) => {
		map[option.value] = option.label; // eslint-disable-line no-param-reassign
		return map;
	}, {});
}

function DropDownOptions({
	options, onSelectOption, filterText, createIfNoneMatch, onCreateNew, onMouseEvent }) {
	const optionsToShow = options.map((item, index) => (
		<MenuItem key={index} onClick={() => onSelectOption(item)}>
			{item.label}
		</MenuItem>
	));
	const NO_AVAILABLE = (
		<MenuItem onClick={() => onSelectOption()}>
			No Available
		</MenuItem>
	);
	const NEW_OPTION = (
		<MenuItem onClick={onCreateNew}>
			{filterText} (new)
		</MenuItem>
	);

	function renderOptions() {
		if (optionsToShow.length > 0) {
			return optionsToShow;
		} else if (createIfNoneMatch && filterText.length > 0) {
			return NEW_OPTION;
		}
		return NO_AVAILABLE;
	}

	return (
		<ul
			role="menu"
			className={classNames(theme['dropdown-menu'], 'dropdown-menu')}
			onMouseEnter={() => onMouseEvent(ENTER)}
			onMouseLeave={() => onMouseEvent(LEAVE)}
		>
			{renderOptions()}
		</ul>
	);
}

class MultiSelectTagWidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDropDownOptions: false,
			filterText: '',
		};

		this.isMouseHoverOnOptions = false;

		this.toggleDropDownOptions = this.toggleDropDownOptions.bind(this);
		this.onCreateNewTag = this.onCreateNewTag.bind(this);
		this.onSelectTag = this.onSelectTag.bind(this);
		this.onMouseEvent = this.onMouseEvent.bind(this);
	}

	onFilterTextChange(event) {
		this.setState({
			filterText: event.target.value,
		});
	}

	onSelectTag(tag) {
		if (tag) {
			const { onChange, value } = this.props;
			const nextValue = value.concat(tag.value);
			onChange(nextValue);
		}
		this.input.focus();
	}

	onCreateNewTag() {
		const { onChange, value } = this.props;
		const nextValue = value.concat(this.state.filterText);
		this.setState({ filterText: '' });
		onChange(nextValue);
		this.input.focus();
	}

	onRemoveTag(tagValue) {
		const { onChange, value } = this.props;
		const nextValue = value.filter(val => val !== tagValue);
		onChange(nextValue);
	}

	onMouseEvent(event) {
		switch (event) {
		case ENTER: {
			this.isMouseHoverOnOptions = true;
			break;
		}
		default:
			this.isMouseHoverOnOptions = false;
		}
	}

	onInputMount(input) {
		this.input = input;
	}

	onKeyDown(event) {
		if (event.which === 13) {
			const optionsToShow = this.getOptionsToShow();
			if (optionsToShow.length > 0) {
				this.onSelectTag(optionsToShow[0]);
			} else if (this.state.filterText.length > 0) {
				const { schema } = this.props;
				if (schema.createIfNoneMatch) {
					this.onCreateNewTag();
				}
			}
			event.preventDefault();
		}
	}

	onTagsMount(tags) {
		if (tags && this.input) {
			const lastTag = tags.querySelector('div.tc-badge:last-child');
			if (lastTag) {
				const paddingLeft = lastTag.offsetLeft + lastTag.offsetWidth + INPUT_TEXT_INDENT;
				let paddingTop = lastTag.offsetTop - BADGES_MARGIN_TOP;
				const toNextLine = (this.input.offsetWidth - paddingLeft) < INPUT_MIN_WIDTH;
				if (toNextLine) {
					paddingTop += BADGE_HEIGHT;
					this.input.style.paddingLeft = `${INPUT_TEXT_INDENT}px`;
				} else {
					this.input.style.paddingLeft = `${paddingLeft}px`;
				}
				this.input.style.paddingTop = `${paddingTop}px`;
				this.input.style.height = `${parseInt(this.input.style.paddingTop, 10) + INPUT_HEIGHT}px`;
			} else {
				this.input.style.paddingLeft = '0px';
				this.input.style.paddingTop = '0px';
				this.input.style.height = `${INPUT_HEIGHT}px`;
			}
		}
	}

	getOptionsToShow() {
		const { value, options } = this.props;
		return options.enumOptions.filter(
			option => value.indexOf(option.value) < 0,
		).filter(
			item => item.label.toUpperCase().indexOf(this.state.filterText.toUpperCase()) > -1,
		);
	}

	toggleDropDownOptions(isOpen) {
		if (!isOpen && this.isMouseHoverOnOptions) {
			return;
		}
		this.setState({
			showDropDownOptions: isOpen,
		});
	}

	render() {
		const { value, readonly, schema, options } = this.props;
		const optionsToShow = this.getOptionsToShow();
		const value2Label = mapValue2Label(options.enumOptions);
		const className = classNames({
			[theme.dropdown]: true,
			dropdown: true,
			open: this.state.showDropDownOptions,
		});

		return (
			<div className={className}>
				<input
					aria-label="Filter"
					value={this.state.filterText}
					disabled={readonly}
					className={classNames(theme['form-control'], 'form-control')}
					onChange={event => this.onFilterTextChange(event)}
					onFocus={() => this.toggleDropDownOptions(true)}
					onBlur={() => this.toggleDropDownOptions(false)}
					onKeyDown={event => this.onKeyDown(event)}
					ref={input => this.onInputMount(input)}
				/>
				<div className={classNames(theme['dropdown-toggle'], 'dropdown-toggle')}>
					<span className="caret" />
				</div>
				<div
					className={classNames(theme['tags-container'], 'tags-container')}
					ref={tags => this.onTagsMount(tags)}
				>
					{
						value.map((val, index) => {
							const label = value2Label[val] || val;
							const BadgeProps = { label, key: index };
							if (!readonly) {
								BadgeProps.onDelete = () => this.onRemoveTag(val);
							}
							return (
								<Badge {...BadgeProps} />
							);
						})
					}
				</div>
				{
					this.state.showDropDownOptions &&
					<DropDownOptions
						options={optionsToShow}
						onSelectOption={this.onSelectTag}
						filterText={this.state.filterText}
						createIfNoneMatch={schema.createIfNoneMatch}
						onCreateNew={this.onCreateNewTag}
						onMouseEvent={this.onMouseEvent}
					/>
				}
			</div>
		);
	}
}

if (process.env.NODE_ENV !== 'production') {
	const Tag = React.PropTypes.shape({
		label: React.PropTypes.string.isRequired,
		value: React.PropTypes.string,
	});

	DropDownOptions.propTypes = {
		options: React.PropTypes.arrayOf(Tag),
		onSelectOption: React.PropTypes.func.isRequired,
		filterText: React.PropTypes.string,
		createIfNoneMatch: React.PropTypes.bool,
		onCreateNew: React.PropTypes.func,
		onMouseEvent: React.PropTypes.func,
	};

	MultiSelectTagWidget.propTypes = {
		value: React.PropTypes.array,
		options: React.PropTypes.shape({
			enumOptions: React.PropTypes.arrayOf(Tag),
		}),
		readonly: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		schema: React.PropTypes.object.isRequired,
	};
}

export default MultiSelectTagWidget;
