import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'
import { SvgIcon } from '@stackable/components'

// Deprecated ButtonEdit.Content methods.
export * from './deprecated'

const ButtonEdit = props => {
	const {
		className = '',
		align = 'center',
		size = 'normal',
		color,
		text = '',
		backgroundColor,
		borderRadius = 4,
		isSelected = null,
		onFocus = () => {},
		onChange = () => {},
		icon = null,
		design = 'basic',
		onSelect = () => {},
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
		<div
			onSelect={ onSelect }
			data-is-placeholder-visible={ RichText.isEmpty( text ) }
		>
			{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
			<a
				href="#"
				className={ mainClasses }
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
				{
					// Should be tagName="span", but div for now because of issue
					// @see https://github.com/WordPress/gutenberg/issues/7311
				}
				<RichText
					tagName="div"
					className={ design === 'link' ? '' : 'ugb-button--inner' }
					placeholder={ __( 'Button text' ) }
					value={ text }
					onChange={ onChange }
					formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
					onFocus={ onFocus }
					isSelected={ isSelected }
					keepPlaceholderOnFocus
					style={ {
						color: design === 'ghost' ? backgroundColor :
						       design === 'plain' ? backgroundColor :
						       design === 'link' ? undefined :
						       color,
					} }
				/>
			</a>
		</div>
	)
}

ButtonEdit.Content = props => {
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

export default ButtonEdit
