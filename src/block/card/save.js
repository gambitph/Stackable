/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { Image2 } from '~stackable/components'
import { withVersion } from '~stackable/higher-order'
import { getImageProps } from '~stackable/helpers'
import {
	BlockDiv, getColumnClasses, Style,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		hasContainer,
	} = props.attributes

	const imageProps = getImageProps( props.attributes )
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
			blockProps={ props }
		>
			<Style.Content
				styleFunc={ createStyles( props.version ) }
				blockProps={ props }
			/>
			<div className={ contentClassNames }>
				{ props.attributes.imageUrl &&
					<Image2.Content
						className="stk-card__image"
						{ ...imageProps }
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
