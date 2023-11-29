import { hexToRgba } from '~stackable/util'
import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.4.5',
		versionDeprecated: '',
	}
	const {
		isCircle = false,
		dependencies = [],
	} = props

	const selector = isCircle ? '.stk-progress-circle' : '.stk-progress-bar'

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="--progress-max"
				attrName="progressMax"
				key="progressMax"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				renderIn="save"
				styleRule="--progress-value"
				attrName="progressValue"
				key="progressValue"
				format={ ! isCircle ? '%s%' : undefined }
			/>
			{ ! isCircle && (
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="--progress-color-1"
					attrName="progressColor1"
					key="progressColor1-bar"
					dependencies={ [
						'progressColorType',
						'progressColor2',
						...dependencies,
					] }
				/>
			) }
			{ isCircle && (
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="--progress-color-1"
					attrName="progressColor1"
					key="progressColor1-circle"
					dependencies={ [
						'progressColorType',
						'progressColor2',
						...dependencies,
					] }
					renderIn="save"
					valuePreCallback={ ( value, getAttribute ) => {
						if ( getAttribute( 'progressColorType' ) === 'gradient' ) {
							const uniqueId = getAttribute( 'uniqueId' )
							return `url(#gradient-${ uniqueId })`
						}
						return value
					} }
				/>
			) }
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="--progress-background"
				attrName="progressBackgroundColor"
				key="progressBackgroundColor"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="--progress-size"
				attrName="progressSize"
				key="progressSize"
				format="%spx"
			/>
			{ /* Only use these stylRules when it's a circular progress */ }
			{ isCircle &&
				<>
					<BlockCss
						{ ...propsToPass }
						selector={ selector }
						renderIn="edit"
						styleRule="--progress-color-1"
						attrName="progressColor1"
						key="progressColor1-circle-var"
						valuePreCallback={ ( value, getAttribute ) => {
							if ( getAttribute( 'progressColorType' ) === 'gradient' ) {
								// generate custom identifier on the editor as uniqueId can be blank.
								// This happens when adding block with default block styling created.
								// should use uniqueId upon saving
								const color1 = getAttribute( 'progressColor1' ) || '-'
								const color2 = getAttribute( 'progressColor2' ) || '-'
								const direction = getAttribute( 'progressColorGradientDirection' ) || ''
								const customGradientId = ( color1 + color2 + direction ).replace( /[^0-9A-Z]+/gi, '' )
								return `url(#gradient-${ customGradientId })`
							}
							return value
						} }
						dependencies={ [
							 'progressColorType',
							 'progressColor2',
							 'progressColorGradientDirection',
							 ...dependencies,
						] }
					/>
					<BlockCss
						{ ...propsToPass }
						selector={ selector }
						styleRule="--progress-rounded"
						attrName="progressRounded"
						key="progressRounded"
						valuePreCallback={ value => {
							if ( typeof value === 'string' || value === false ) {
								return undefined
							}
							return 'round'
						} }
					/>
					<BlockCss
						{ ...propsToPass }
						selector={ selector }
						responsive="all"
						styleRule="--progress-thickness"
						attrName="progressThickness"
						key="progressThickness"
						format="%spx"
					/>
				</>
			}
			{ /* Only use these stylRules for progress bars */ }
			{ ! isCircle &&
				<>
					<BlockCss
						{ ...propsToPass }
						selector={ selector }
						styleRule="--progress-bar-width"
						attrName="progressWidth"
						key="progressWidth"
						hasUnits="%"
						responsive="all"
						dependencies={ [
							'progressWidthUnit',
							...dependencies,
						] }
					/>
					<BlockCss
						{ ...propsToPass }
						selector={ selector }
						styleRule="--progress-border-radius"
						attrName="progressBorderRadius"
						key="progressBorderRadius"
						hasUnits="px"
					/>
					<BlockCss
						{ ...propsToPass }
						selector={ selector }
						styleRule="--progress-bar-border-radius"
						attrName="progressApplyBarRadius"
						key="progressApplyBarRadius"
						valuePreCallback={ ( value, getAttribute ) => {
							const borderRadius = getAttribute( 'progressBorderRadius' )
							return value ? borderRadius : undefined
						} }
						format="%spx"
						dependencies={ [
							'progressBorderRadius',
							...dependencies,
						] }
					/>
					<BlockCss
						{ ...propsToPass }
						selector=".stk-progress-bar__bar.stk--has-background-overlay:before"
						styleRule="mixBlendMode"
						attrName="progressColorGradientBlendMode"
						key="progressColorGradientBlendMode"
						enabledCallback={ getAttribute => getAttribute( 'progressColorType' ) === 'gradient' }
						dependencies={ [
							'progressColorType',
							...dependencies,
						] }
					/>
					<BlockCss
						{ ...propsToPass }
						selector=".stk-progress-bar__bar.stk--has-background-overlay:before"
						styleRule="backgroundImage"
						attrName="progressColor1"
						key="progressColor1-overlay"
						enabledCallback={ getAttribute => getAttribute( 'progressColorType' ) === 'gradient' }
						valueCallback={ ( value, getAttribute ) => {
							if ( ! getAttribute( 'progressColor2' ) ) {
								return undefined
							}
							// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
							const defaultColor1 = hexToRgba( getAttribute( 'progressColor2' ) || '#ffffff', 0 )
							const defaultColor2 = hexToRgba( getAttribute( 'progressColor1' ) || '#3498db', 0 )

							// Gradient location.
							const color1Location = `${ getAttribute( 'progressColorGradientLocation1' ) || '0' }%`
							const color2Location = `${ getAttribute( 'progressColorGradientLocation2' ) || '100' }%`

							const directionAngle = getAttribute( 'progressColorGradientDirection' )
							const angle = typeof directionAngle === 'string' ? '90deg' : `${ directionAngle }deg`

							return `linear-gradient(${ angle }, ${ getAttribute( 'progressColor1' ) || defaultColor1 } ${ color1Location }, ${ getAttribute( 'progressColor2' ) || defaultColor2 } ${ color2Location })`
						} }
						dependencies={ [
							'progressColorType',
							'progressColor1',
							'progressColor2',
							'progressColorGradientLocation1',
							'progressColorGradientLocation2',
							'progressColorGradientDirection',
							...dependencies,
						] }
					/>
				</>
			}
		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}
