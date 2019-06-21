import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'
import { SvgIcon } from '@stackable/components'

// Deprecated ButtonEdit.Content methods.
export * from './deprecated'

// TODO: move ButtonEdit to RichButton

const ButtonEdit = props => {
	const {
		className = '',
		size = 'normal',
		text = '',
		onChange = () => {},
		icon = null,
		design = 'basic',
		shadow = 0,
		iconPosition = '',
		hoverEffect = '',
	} = props

	const mainClasses = classnames( [
		className,
		'ugb-button',
		`ugb-button--size-${ size }`,
	], {
		[ `ugb--hover-effect-${ hoverEffect }` ]: ( design === 'basic' || design === 'ghost' ) && hoverEffect,
		[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow,
		[ `ugb-button--design-${ design }` ]: design !== 'basic',
		'ugb-button--has-icon': icon,
		[ `ugb-button--icon-position-${ iconPosition }` ]: iconPosition,
	} )

	return (
		<div>
			{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
			<a
				href="#"
				className={ mainClasses }
			>
				{ icon && design !== 'link' &&
					<SvgIcon value={ icon } />
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
					keepPlaceholderOnFocus
				/>
			</a>
		</div>
	)
}

ButtonEdit.Content = props => {
	const {
		className = '',
		size = 'normal',
		url = '',
		icon = null,
		text,
		design = 'basic',
		newTab = false,
		shadow = 0,
		iconPosition = false,
		hoverEffect = '',
		noFollow = false,
	} = props

	const mainClasses = classnames( [
		className,
		'ugb-button',
		`ugb-button--size-${ size }`,
	], {
		[ `ugb--hover-effect-${ hoverEffect }` ]: ( design === 'basic' || design === 'ghost' ) && hoverEffect,
		[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow,
		[ `ugb-button--design-${ design }` ]: design !== 'basic',
		'ugb-button--has-icon': icon,
		[ `ugb-button--icon-position-${ iconPosition }` ]: iconPosition,
	} )

	const rel = []
	if ( newTab ) {
		rel.push( 'noopener' )
		rel.push( 'noreferrer' )
	}
	if ( noFollow ) {
		rel.push( 'nofollow' )
	}

	return (
		<div>
			<a
				className={ mainClasses }
				href={ url }
				target={ newTab ? '_blank' : undefined }
				rel={ rel.join( ' ' ) }
			>
				{ icon && design !== 'link' &&
					<SvgIcon.Content value={ icon } />
				}
				<RichText.Content
					tagName="span"
					className={ design === 'link' ? '' : 'ugb-button--inner' }
					value={ text }
				/>
			</a>
		</div>
	)
}

export default ButtonEdit
