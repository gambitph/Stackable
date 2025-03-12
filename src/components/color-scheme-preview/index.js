import { Button, BaseControl } from '@wordpress/components'

export const DEFAULT_COLOR_SCHEME_COLORS = {
	backgroundColor: { desktop: 'var(--stk-container-background-color, #fff)' },
	headingColor: { desktop: '' },
	textColor: { desktop: '' },
	linkColor: { desktop: '' },
	accentColor: { desktop: 'var(--stk-accent-color, #008de4)' },
	buttonColor: { desktop: 'var(--stk-button-background-color, #008de4)' },
	buttonTextColor: { desktop: 'var(--stk-button-text-color, #fff)' },
	buttonOutlineColor: { desktop: 'var(--stk-button-background-color, #008de4)' },
}

export const DEFAULT_BACKGROUND_COLOR_SCHEME_COLORS = {
	...DEFAULT_COLOR_SCHEME_COLORS,
	backgroundColor: { desktop: 'var(--stk-block-background-color, #fff)' },
}

const NOOP = () => {}

const ColorSchemePreview = ( { colors, onClick = NOOP } ) => {
	const TagName = onClick === NOOP ? 'div' : Button
	const additionalProps = onClick === NOOP ? {} : { onClick }
	return (
		<TagName
			className="stk-global-color-scheme__preview__background"
			style={ { backgroundColor: colors?.backgroundColor } }
			{ ...additionalProps }
		>
			<div className="stk-global-color-scheme__preview__typography">
				<span style={ { color: colors?.headingColor } }>A</span>
				<span style={ { color: colors?.textColor } }>a</span>
			</div>
			<div>
				<div
					className="stk-global-color-scheme__preview__button"
					style={ { backgroundColor: colors?.buttonColor } }
				/>
				<div
					className="stk-global-color-scheme__preview__button"
					style={ {
						borderStyle: 'solid',
						borderWidth: '1px',
						borderColor: colors?.buttonOutlineColor,
					} }
				/>
			</div>
		</TagName>
	)
}

export const PresetColorSchemesPicker = ( {
	label, presets, onPresetClick,
} ) => {
	return (
		<BaseControl label={ label } >
			<div className="stk-preset-color-schemes__preset-wrapper">
				{ presets.map( ( colors, index ) => {
					return <ColorSchemePreview key={ index } colors={ colors } onClick={ () => onPresetClick( colors ) } />
				} ) }
			</div>
		</BaseControl>
	)
}

export default ColorSchemePreview
