import { Button, BaseControl } from '@wordpress/components'

export const DEFAULT_COLOR_SCHEME_COLORS = {
	backgroundColor: { desktop: '' },
	headingColor: { desktop: '' },
	textColor: { desktop: '' },
	linkColor: { desktop: '' },
	accentColor: { desktop: '' },
	buttonBackgroundColor: { desktop: '' },
	buttonTextColor: { desktop: '' },
	buttonOutlineColor: { desktop: '' },
}

const NOOP = () => {}

const ColorSchemePreview = ( {
	colors, withWrapper = false, onClick = NOOP,
} ) => {
	const TagName = onClick === NOOP ? 'div' : Button
	const additionalProps = onClick === NOOP ? {} : { onClick }
	return (
		<TagName
			className="stk-global-color-scheme__preview__background"
			style={ withWrapper ? {} : { background: colors?.backgroundColor } }
			{ ...additionalProps }
		>
			<div className="stk-global-color-scheme__preview__typography">
				<span style={ { color: colors?.headingColor } }>A</span>
				<span style={ { color: colors?.textColor } }>a</span>
			</div>
			<div>
				<div
					className="stk-global-color-scheme__preview__button"
					style={ { background: `${ colors?.buttonBackgroundColor || 'var(--stk-button-background-color)' }` } }
				/>
				<div
					className="stk-global-color-scheme__preview__button"
					style={ {
						borderStyle: 'solid',
						borderWidth: '1px',
						borderColor: `${ colors?.buttonOutlineColor || colors?.buttonBackgroundColor || 'var(--stk-button-background-color)' }`,
					} }
				/>
				<div
					className="stk-global-color-scheme__preview__circle"
					style={ { backgroundColor: `${ colors?.linkColor || colors?.textColor || 'var(--stk-container-color)' }` } }
				/>
				<div
					className="stk-global-color-scheme__preview__circle"
					style={ { backgroundColor: `${ colors?.accentColor || 'var(--stk-icon-color)' }` } }
				/>
			</div>
		</TagName>
	)
}

export const ColorSchemePresetPicker = ( {
	label, presets, onPresetClick,
} ) => {
	return (
		<BaseControl label={ label } className="stk-preset-color-schemes__control">
			<div className="stk-preset-color-schemes__preset-wrapper">
				{ presets.map( ( colors, index ) => {
					return <ColorSchemePreview
						key={ index }
						colors={ colors }
						onClick={ () => onPresetClick( colors ) }
					/>
				} ) }
			</div>

		</BaseControl>
	)
}

export default ColorSchemePreview
