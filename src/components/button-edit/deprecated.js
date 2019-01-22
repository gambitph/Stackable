import classnames from 'classnames'
import { RichText } from '@wordpress/editor'
import { SvgIcon } from '@stackable/components'

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
				<SvgIcon
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
			<SvgIcon
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

export const DeprecatedButtonContent_1_1 = props => {
	const {
		align = 'center',
		size = 'normal',
		url = '',
		color,
		text,
		backgroundColor,
		borderRadius,
	} = props

	const style = {
		backgroundColor: backgroundColor,
		borderRadius: borderRadius + 'px',
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

export const DeprecatedButtonContent_0_7 = props => {
	const {
		url, text, textAlignment, color, textColor, size, cornerButtonRadius,
	} = props.attributes

	const buttonStyle = {
		backgroundColor: color,
		color: textColor,
		borderRadius: cornerButtonRadius + 'px',
	}

	return (
		<div className={ `ugb-button-${ textAlignment }` }>
			<a href={ url } className={ `wp-ugb-button ugb-button-${ size }` } style={ buttonStyle }>
				{ text }
			</a>
		</div>
	)
}
