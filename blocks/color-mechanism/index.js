/**
 * External dependencies
 */
import { find, get, kebabCase } from 'lodash';

/**
 * WordPress dependencies
 */
import { getWrapperDisplayName } from '@wordpress/element';
import { withContext } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';

const getColorValue = ( colors, namedColor, customColor ) => {
	if ( namedColor ) {
		const colorObj = find( colors, { name: namedColor } );
		return colorObj && colorObj.color;
	}
	if ( customColor ) {
		return customColor;
	}
};

const setColorValue = ( colors, colorAttributeName, customColorAttributeName, setAttributes ) =>
	( colorValue ) => {
		const colorObj = find( colors, { color: colorValue } );
		if ( colorObj ) {
			setAttributes( {
				[ colorAttributeName ]: colorObj.name,
				[ customColorAttributeName ]: undefined,
			} );
			return;
		}
		setAttributes( {
			[ colorAttributeName ]: undefined,
			[ customColorAttributeName ]: colorValue,
		} );
	};

/**
 * Returns a class based on the context a color is being used and its name.
 *
 * @param {string} colorContextName Context/place where color is being used e.g: background, text etc...
 * @param {string} colorName        Name of the color.
 *
 * @return {string} String with the class corresponding to the color in the provided context.
 */
export function getColorClass( colorContextName, colorName ) {
	if ( ! colorContextName || ! colorName ) {
		return undefined;
	}

	return `has-${ kebabCase( colorName ) }-${ colorContextName }-color`;
}

/**
 * Higher-order component, which handles color logic for class generation
 * color value, retrieval and color attribute setting.
 *
 * @param {WPElement} WrappedComponent The wrapped component.
 *
 * @return {Component} Component with a new colors prop.
 */
export function withColors( WrappedComponent ) {
	const ComponentWithColorContext = withContext( 'editor' )(
		( settings, props ) => {
			const colors = get( settings, 'colors', [] );
			return {
				colors: ( colorContextName, colorAttributeName, customColorAttributeName ) => ( {
					value: getColorValue(
						colors,
						props.attributes[ colorAttributeName ],
						props.attributes[ customColorAttributeName ]
					),
					class: getColorClass( colorContextName, props.attributes[ colorAttributeName ] ),
					set: setColorValue( colors, colorAttributeName, customColorAttributeName, props.setAttributes ),
				} ),
			};
		} )( WrappedComponent );

	const NewComponent = ( props ) => {
		return <ComponentWithColorContext { ...props } />;
	};
	NewComponent.displayName = getWrapperDisplayName( WrappedComponent, 'colorMechanism' );

	return NewComponent;
}
