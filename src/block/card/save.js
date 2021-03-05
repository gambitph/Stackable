/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	Style, Image2,
} from '~stackable/components'
import { withVersion } from '~stackable/higher-order'
import { getImageProps } from '~stackable/helpers'
import { version as VERSION } from 'stackable'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		hasContainer,
		hasBackground,
	} = props.attributes

	const imageProps = getImageProps( props.attributes )

	const blockClassNames = classnames( [
		'stk-card',
		'stk-block',
		'stk-column',
		`stk-${ props.attributes.uniqueId }`,
	], {
		'stk-is-first': props.attributes.isFirstBlock,
		'stk-is-last': props.attributes.isLastBlock,
		'stk-block-background': hasBackground,
	} )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-column-wrapper',
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
		<div className={ blockClassNames } data-id={ props.attributes.uniqueId }>
			<Style.Content
				blockUniqueClassName={ `stk-${ props.attributes.uniqueId }` }
				blockMainClassName={ 'stk-card' }
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
		</div>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
