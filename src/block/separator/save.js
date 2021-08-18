/**
 * Internal dependencies
 */
import { SeparatorStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
} from '~stackable/block-components'
import {
	Separator2,
} from '~stackable/components'

export const Save = props => {
	const {
		className,
		attributes,
	} = props

	const {
		separatorDesign,
		separatorInverted,
	} = attributes

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-separator',
		responsiveClass,
		'stk--no-padding',
	] )

	const separatorClassNames = classnames( [
		'stk-separator__wrapper',
		'stk-block-separator__svg-inner',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<SeparatorStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div className="stk-block-separator__top-pad" />
			<div className={ separatorClassNames }>
				<Separator2.Content
					design={ separatorDesign }
					inverted={ separatorInverted }
				/>
			</div>
			<div className="stk-block-separator__bottom-pad" />
		</BlockDiv.Content>
	)
}

export default withVersion( VERSION )( Save )
