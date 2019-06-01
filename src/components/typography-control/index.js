import { AdvancedRangeControl, ButtonIconPopoverControl, FontFamilyControl, FontSizeControl, WhenResponsiveScreen } from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { SelectControl } from '@wordpress/components'

const TypographyControl = props => {
	return (
		<Fragment>
			<ButtonIconPopoverControl
				label={ props.label }
				onReset={ props.onReset }
				allowReset={
					props.fontFamily ||
					props.fontSize || props.tabletFontSize || props.mobileFontSize ||
					props.fontWeight ||
					props.textTransform ||
					props.lineHeight || props.tabletLineHeight || props.mobileLineHeight ||
					props.letterSpacing
				}
			>
				{ props.onChangeFontFamily && (
					<FontFamilyControl
						label={ __( 'Font Family' ) }
						onChange={ props.onChangeFontFamily }
						value={ props.fontFamily }
					/>
				) }
				{ props.onChangeFontSize && (
					<Fragment>
						<WhenResponsiveScreen>
							<FontSizeControl
								label={ __( 'Size' ) }
								onChange={ props.onChangeFontSize }
								value={ props.fontSize }
								allowReset={ true }
								unit={ props.fontSizeUnit }
								onChangeUnit={ props.onChangeFontSizeUnit }
								{ ...props.fontSizeProps }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="tablet">
							<FontSizeControl
								label={ __( 'Size' ) }
								onChange={ props.onChangeTabletFontSize }
								value={ props.tabletFontSize }
								allowReset={ true }
								unit={ props.tabletfontSizeUnit }
								onChangeUnit={ props.onChangeTabletFontSizeUnit }
								{ ...props.fontSizeProps }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="mobile">
							<FontSizeControl
								label={ __( 'Size' ) }
								onChange={ props.onChangeMobileFontSize }
								value={ props.mobileFontSize }
								allowReset={ true }
								unit={ props.mobilefontSizeUnit }
								onChangeUnit={ props.onChangeMobileFontSizeUnit }
								{ ...props.fontSizeProps }
							/>
						</WhenResponsiveScreen>
					</Fragment>
				) }
				{ props.onChangeFontWeight && (
					<SelectControl
						label={ __( 'Weight' ) }
						options={ [
							{ label: '100', value: '100' },
							{ label: '200', value: '200' },
							{ label: '300', value: '300' },
							{ label: '400', value: '400' },
							{ label: '500', value: '500' },
							{ label: '600', value: '600' },
							{ label: '700', value: '700' },
							{ label: '800', value: '800' },
							{ label: '900', value: '900' },
							{ label: __( 'Default' ), value: '' },
							{ label: __( 'Normal' ), value: 'normal' },
							{ label: __( 'Bold' ), value: 'bold' },
						] }
						onChange={ props.onChangeFontWeight }
						value={ props.fontWeight }
					/>
				) }
				{ props.onChangeTextTransform && (
					<SelectControl
						label={ __( 'Transform' ) }
						options={ [
							{ label: __( 'Default' ), value: '' },
							{ label: __( 'Uppercase' ), value: 'uppercase' },
							{ label: __( 'Lowercase' ), value: 'lowercase' },
							{ label: __( 'Capitalize' ), value: 'capitalize' },
							{ label: __( 'Normal' ), value: 'normal' },
						] }
						onChange={ props.onChangeTextTransform }
						value={ props.textTransform }
					/>
				) }
				{ props.onChangeLineHeight && (
					<Fragment>
						<WhenResponsiveScreen>
							<AdvancedRangeControl
								label={ __( 'Line-Height' ) }
								units={ [ 'px', 'em' ] }
								min={ [ 1, 0.1 ] }
								max={ [ 100, 10 ] }
								step={ [ 1, 0.1 ] }
								allowReset={ true }
								value={ props.lineHeight }
								onChange={ props.onChangeLineHeight }
								unit={ props.lineHeightUnit }
								onChangeUnit={ props.onChangeLineHeightUnit }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="tablet">
							<AdvancedRangeControl
								label={ __( 'Line-Height' ) }
								units={ [ 'px', 'em' ] }
								min={ [ 1, 0.1 ] }
								max={ [ 100, 10 ] }
								step={ [ 1, 0.1 ] }
								allowReset={ true }
								value={ props.tabletLineHeight }
								onChange={ props.onChangeTabletLineHeight }
								unit={ props.tabletLineHeightUnit }
								onChangeUnit={ props.onChangeTabletLineHeightUnit }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="mobile">
							<AdvancedRangeControl
								label={ __( 'Line-Height' ) }
								units={ [ 'px', 'em' ] }
								min={ [ 1, 0.1 ] }
								max={ [ 100, 10 ] }
								step={ [ 1, 0.1 ] }
								allowReset={ true }
								value={ props.mobileLineHeight }
								onChange={ props.onChangeMobileLineHeight }
								unit={ props.mobileLineHeightUnit }
								onChangeUnit={ props.onChangeMobileLineHeightUnit }
							/>
						</WhenResponsiveScreen>
					</Fragment>
				) }
				{ props.onChangeLetterSpacing && (
					<AdvancedRangeControl
						label={ __( 'Letter Spacing' ) }
						min={ -5 }
						max={ 10 }
						step={ 0.1 }
						allowReset={ true }
						onChange={ props.onChangeLetterSpacing }
						value={ props.letterSpacing }
					/>
				) }
			</ButtonIconPopoverControl>
			{/* A second font size option. */}
			{ props.showSecondFontSize && props.onChangeFontSize && (
				<Fragment>
					<WhenResponsiveScreen>
						<FontSizeControl
							label={ __( 'Size' ) }
							onChange={ props.onChangeFontSize }
							value={ props.fontSize }
							allowReset={ true }
							unit={ props.fontSizeUnit }
							onChangeUnit={ props.onChangeFontSizeUnit }
							{ ...props.fontSizeProps }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<FontSizeControl
							label={ __( 'Size' ) }
							onChange={ props.onChangeTabletFontSize }
							value={ props.tabletFontSize }
							allowReset={ true }
							unit={ props.tabletfontSizeUnit }
							onChangeUnit={ props.onChangeTabletFontSizeUnit }
							{ ...props.fontSizeProps }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<FontSizeControl
							label={ __( 'Size' ) }
							onChange={ props.onChangeMobileFontSize }
							value={ props.mobileFontSize }
							allowReset={ true }
							unit={ props.mobilefontSizeUnit }
							onChangeUnit={ props.onChangeMobileFontSizeUnit }
							{ ...props.fontSizeProps }
						/>
					</WhenResponsiveScreen>
				</Fragment>
			) }
		</Fragment>
	)
}

TypographyControl.defaultProps = {
	label: __( 'Typography' ),
	showSecondFontSize: true,
	fontFamily: '',
	fontSize: '',
	tabletFontSize: '',
	mobileFontSize: '',
	fontSizeUnit: 'px',
	tabletFontSizeUnit: 'px',
	mobileFontSizeUnit: 'px',
	fontWeight: '',
	textTransform: '',
	lineHeight: '',
	tabletLineHeight: '',
	mobileLineHeight: '',
	lineHeightUnit: 'em',
	tabletLineHeightUnit: 'em',
	mobileLineHeightUnit: 'em',
	letterSpacing: '',
	fontSizeProps: {},
	onReset: () => {},
	onChangeFontFamily: () => {},
	onChangeFontSize: () => {},
	onChangeTabletFontSize: () => {},
	onChangeMobileFontSize: () => {},
	onChangeFontSizeUnit: () => {},
	onChangeTabletFontSizeUnit: () => {},
	onChangeMobileFontSizeUnit: () => {},
	onChangeFontWeight: () => {},
	onChangeTextTransform: () => {},
	onChangeLineHeight: () => {},
	onChangeTabletLineHeight: () => {},
	onChangeMobileLineHeight: () => {},
	onChangeLineHeightUnit: () => {},
	onChangeTabletLineHeightUnit: () => {},
	onChangeMobileLineHeightUnit: () => {},
	onChangeLetterSpacing: () => {},
}

export default TypographyControl
