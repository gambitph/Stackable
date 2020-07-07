/**
 * External dependencies
 */
import classnames from 'classnames'
import { SvgIcon } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'

export const DeprecatedButtonContent_1_15_5 = props => {
	const {
		className = '',
		align = 'center',
		size = 'normal',
		url = '',
		icon = null,
		color,
		text,
		backgroundColor,
		borderRadius,
		design = 'basic',
		newTab = false,
	} = props

	const style = {
		borderRadius: design === 'link' ? undefined :
		              design === 'plain' ? undefined :
		              borderRadius + 'px',
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		borderColor: design === 'ghost' ? backgroundColor : undefined,
		color: design === 'ghost' ? backgroundColor :
		       design === 'plain' ? backgroundColor :
		       design === 'link' ? undefined :
		       color,
	}
	style.backgroundColor = design === 'ghost' ? undefined : style.backgroundColor
	style.backgroundColor = design === 'plain' ? undefined : style.backgroundColor
	style.backgroundColor = design === 'link' ? undefined : style.backgroundColor

	const mainClasses = classnames( [
		className,
		'ugb-button',
		`ugb-button--align-${ align }`,
		`ugb-button--size-${ size }`,
	], {
		[ `ugb-button--design-${ design }` ]: design !== 'basic',
		'ugb-button--has-icon': icon,
	} )

	return (
		<div>
			<a
				className={ mainClasses }
				href={ url }
				style={ style }
				target={ newTab ? '_blank' : undefined }
				rel={ newTab ? 'noopener noreferrer' : undefined }
			>
				{ icon && design !== 'link' &&
					<SvgIcon.Content
						value={ icon }
						style={ {
							color: design === 'ghost' ? backgroundColor :
							       design === 'plain' ? backgroundColor :
							       color,
						} }
					/>
				}
				<RichText.Content
					tagName="span"
					className={ design === 'link' ? '' : 'ugb-button--inner' }
					style={ {
						color: design === 'ghost' ? backgroundColor :
						       design === 'plain' ? backgroundColor :
						       design === 'link' ? undefined :
						       color,
					} }
					value={ text }
				/>
			</a>
		</div>
	)
}
