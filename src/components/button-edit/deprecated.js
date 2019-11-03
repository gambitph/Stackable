/**
 * Internal dependencies
 */
import { SvgIcon_1_17_3 } from '../svg-icon/deprecated'

/**
 * External dependencies
 */
import classnames from 'classnames'

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
					<SvgIcon_1_17_3.Content
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

export const DeprecatedButtonContent_1_12 = props => {
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
			>
				{ icon && design !== 'link' &&
					<SvgIcon_1_17_3.Content
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

export const DeprecatedButtonContent_1_9_1 = props => {
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
		`ugb-button-${ align }`,
		`ugb-button-${ size }`,
	], {
		[ `ugb-${ design }-button` ]: design !== 'basic',
		'ugb-has-icon': icon,
	} )

	return (
		<div>
			<a
				className={ mainClasses }
				href={ url }
				style={ style }
			>
				{ icon && design !== 'link' &&
				<SvgIcon_1_17_3
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
					className={ design === 'link' ? '' : 'ugb-button-inner' }
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

export const DeprecatedButtonContent_1_10 = DeprecatedButtonContent_1_9_1

export const DeprecatedButtonContent_1_9 = props => {
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
	} = props

	const style = {
		borderRadius: borderRadius + 'px',
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		borderColor: design === 'ghost' ? backgroundColor : undefined,
	}
	style.backgroundColor = design === 'ghost' ? undefined : style.backgroundColor
	style.backgroundColor = design === 'plain' ? undefined : style.backgroundColor
	style.backgroundColor = design === 'link' ? undefined : style.backgroundColor

	const mainClasses = classnames( [
		className,
		'ugb-button',
		`ugb-button-${ align }`,
		`ugb-button-${ size }`,
	], {
		[ `ugb-${ design }-button` ]: design !== 'basic',
		'ugb-has-icon': icon,
	} )

	return (
		<div className={ mainClasses } style={ style }>
			{ icon && design !== 'link' &&
			<SvgIcon_1_17_3
				value={ icon }
				style={ {
					color: design === 'ghost' ? backgroundColor :
						design === 'plain' ? backgroundColor :
							color,
				} }
			/>
			}
			<RichText.Content
				tagName="a"
				className={ design === 'link' ? '' : 'ugb-button-inner' }
				href={ url }
				style={ {
					color: design === 'ghost' ? backgroundColor :
						design === 'plain' ? backgroundColor :
							design === 'link' ? undefined :
								color,
				} }
				value={ text }
			/>
		</div>
	)
}

export const DeprecatedButtonContent_1_4 = props => {
	const {
		className = '',
		align = 'center',
		size = 'normal',
		url = '',
		color,
		text,
		backgroundColor,
		borderRadius,
	} = props

	const style = {
		borderRadius: borderRadius + 'px',
		backgroundColor: backgroundColor ? backgroundColor : undefined,
	}

	const mainClasses = classnames( [
		className,
		'ugb-button',
		`ugb-button-${ align }`,
		`ugb-button-${ size }`,
	] )

	return (
		<div className={ mainClasses } style={ style }>
			<RichText.Content
				tagName="a"
				className={ `ugb-button-inner` }
				href={ url }
				style={ { color } }
				value={ text }
			/>
		</div>
	)
}

export const DeprecatedButtonContent_1_1_2 = props => {
	const {
		align = 'center',
		size = 'normal',
		url = '', color, text, backgroundColor, borderRadius,
	} = props

	const style = {
		borderRadius: borderRadius + 'px',
	}
	if ( backgroundColor ) {
		style.backgroundColor = backgroundColor
	}
	return (
		<div className={ `ugb-button ugb-button-${ align } ugb-button-${ size }` } style={ style }>
			<RichText.Content
				tagName="a"
				className={ `ugb-button-inner` }
				href={ url }
				style={ { color } }
				value={ text }
			/>
		</div>
	)
}
