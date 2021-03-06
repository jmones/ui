import React, { PropTypes } from 'react';

const REQUIRED_FIELD_SYMBOL = '*';

const Label = (props) => {
	const { label, required, id, ...rest } = props;
	if (!label) {
		// Ensure compatibility with old versions of React.
		// @see https://github.com/mozilla-services/react-jsonschema-form/commit/2afd55f527038a750a23898222814a02094ca591
		return <div />;
	}
	return (
		<label htmlFor={id} {...rest}>
			{required ? label + REQUIRED_FIELD_SYMBOL : label}
		</label>
	);
};

Label.propTypes = {
	label: PropTypes.string,
	required: PropTypes.bool,
	id: PropTypes.string,
};

export default Label;
