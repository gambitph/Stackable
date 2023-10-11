/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector = '',
		attrNameTemplate = '%s',
		dependencies = [],
		selectorCallback = null,
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				hoverSelector={ `${ selector }:hover` }
				styleRule="backgroundColor"
				attrName="backgroundColor"
				key="backgroundColor-hover"
				attrNameTemplate={ attrNameTemplate }
				selectorCallback={ selectorCallback }
				hoverCallback={ getAttribute => {
					return getAttribute( 'backgroundColorType' ) !== 'gradient'
						? 'all' : false
				} }
				valueCallback={ ( value, getAttribute ) => {
					const backgroundColorType = getAttribute( 'backgroundColorType' )

					if ( backgroundColorType === 'gradient' && ( value.match( /rgba\(([^\)]*?)\s*0\s*\.?0?0?\)/ ) || value.includes( 'transparent' ) ) ) {
						return 'transparent'
					}

					return value
				} }
				dependencies={ [
					'backgroundColorType',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="backgroundImage"
				attrName="backgroundMediaUrl"
				key="backgroundMediaUrl"
				attrNameTemplate={ attrNameTemplate }
				format="url(%s)"
				responsive="all"
				valuePreCallback={ value => {
					// If it's a video, don't print out the style because
					// it's handled by a video element. And this will cause
					// the video to show up twice in the network requests.
					if ( typeof value === 'string' ) {
						if ( value.match( /\.(mp4|ogg|webm)$/i ) ) {
							return undefined
						}
					}
					return value
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="backgroundImage"
				attrName="backgroundMediaExternalUrl"
				key="backgroundMediaExternalUrl"
				responsive="all"
				attrNameTemplate={ attrNameTemplate }
				format="url(%s)"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="backgroundAttachment"
				attrName="fixedBackground"
				key="fixedBackground"
				attrNameTemplate={ attrNameTemplate }
				valueCallback={ value => value ? 'fixed' : undefined }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="backgroundPosition"
				attrName="backgroundPosition"
				key="backgroundPosition"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="backgroundRepeat"
				attrName="backgroundRepeat"
				key="backgroundRepeat"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="backgroundSize"
				attrName="backgroundSize"
				key="backgroundSize"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				valueCallback={ ( value, getAttribute, device ) => {
					if ( value === 'custom' ) {
						if ( getAttribute( 'backgroundCustomSize', device ) ) {
							return getAttribute( 'backgroundCustomSize', device ) + ( getAttribute( 'backgroundCustomSizeUnit', device ) || '%' )
						}
					}
					return value
				} }
				dependencies={ [
					'backgroundCustomSize',
					 'backgroundCustomSizeUnit',
					 ...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="backgroundBlendMode"
				attrName="backgroundImageBlendMode"
				key="backgroundImageBlendMode"
				attrNameTemplate={ attrNameTemplate }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector }:before` }
				hoverSelector={ `${ selector }:hover:before` }
				styleRule="backgroundColor"
				attrName="backgroundColor"
				key="backgroundColor-before"
				attrNameTemplate={ attrNameTemplate }
				selectorCallback={ selectorCallback }
				hover="all"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( value === '' ) {
						if ( getAttribute( 'backgroundTintStrength', device, state ) ) {
							return '#000000'
						}
					}
					return value
				} }
				valueCallback={ ( value, getAttribute ) => {
					const isGradient = getAttribute( 'backgroundColorType' ) === 'gradient'
					return ! isGradient && value ? value : undefined
				} }
				dependencies={ [
					'backgroundColorType',
					'backgroundTintStrength',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector }:before` }
				hoverSelector={ `${ selector }:hover:before` }
				styleRule="opacity"
				attrName="backgroundTintStrength"
				key="backgroundTintStrength"
				attrNameTemplate={ attrNameTemplate }
				hover="all"
				enabledCallback={ getAttribute => !! ( getAttribute( 'backgroundMediaUrl', 'mobile', 'normal', true ) || getAttribute( 'backgroundMediaExternalUrl', 'mobile', 'normal', true ) ) }
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( value === '' ) {
						if ( getAttribute( 'backgroundColor', device, state ) ) {
							return 5
						}
					}
					return value
				} }
				valueCallback={ value => {
					return parseInt( value, 10 ) / 10
				} }
				dependencies={ [
					'backgroundColor',
					'backgroundMediaUrl',
					'backgroundMediaExternalUrl',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector }:before` }
				styleRule="mixBlendMode"
				attrName="backgroundGradientBlendMode"
				key="backgroundGradientBlendMode"
				attrNameTemplate={ attrNameTemplate }
				enabledCallback={ getAttribute => getAttribute( 'backgroundColorType' ) === 'gradient' }
				dependencies={ [
					'backgroundColorType',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector }:before` }
				styleRule="backgroundImage"
				attrName="backgroundColor"
				key="backgroundColor-image"
				attrNameTemplate={ attrNameTemplate }
				enabledCallback={ getAttribute => getAttribute( 'backgroundColorType' ) === 'gradient' }
				dependencies={ [
					'backgroundColorType',
					'backgroundColor',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				// In the editor, the background overlay can go outside the block if there's a border radius.
				renderIn="edit"
				selector={ `${ selector }:before` }
				styleRule="borderRadius"
				attrName="borderRadius"
				key="borderRadius"
				attrNameTemplate={ attrNameTemplate }
				format="%spx"
				enabledCallback={ getAttribute =>
					getAttribute( 'backgroundColorType' ) === 'gradient' ||
					getAttribute( 'backgroundColor' ) ||
					getAttribute( 'backgroundColor', 'desktop', 'hover' ) ||
					getAttribute( 'backgroundColor', 'desktop', 'parent-hover' ) }
				dependencies={ [
					'backgroundColorType',
					'backgroundColor',
					...dependencies,
				] }
			/>
		</>
	)
}

export const BackgroundStyle = props => {
	return <Styles { ...props } />
}

BackgroundStyle.Content = props => {
	return <Styles { ...props } />
}
