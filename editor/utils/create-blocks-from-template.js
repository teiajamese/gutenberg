/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

export default function createBlocksFromTemplate( template ) {
	return map( template, ( [ name, attributes, innerBlocksTemplate ] ) => {
		return createBlock(
			name,
			attributes,
			createBlocksFromTemplate( innerBlocksTemplate )
		);
	} );
}
