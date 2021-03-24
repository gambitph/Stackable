/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import {
	BlockDiv, getColumnClasses, Image, Style,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		attributes,
	} = props
	const {
		hasContainer,
	} = props.attributes

	const [ columnClass, columnWrapperClass ] = getColumnClasses( props.attributes )

	const blockClassNames = classnames( [
		'stk-card',
		columnClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		columnWrapperClass,
	], {
		'stk-container--no-padding': hasContainer,
	} )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
		'stk-card__content',
	], {
		'stk-container-padding': hasContainer,
	} )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<Style.Content
				styleFunc={ createStyles( props.version ) }
				attributes={ attributes }
			/>
			<div className={ contentClassNames }>
				{ props.attributes.imageUrl &&
					<Image.Content
						className="stk-card__image"
						attributes={ attributes }
					/>
				}
				<div className={ innerClassNames }>
					<InnerBlocks.Content />
				</div>
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
