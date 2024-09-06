export const addBackgroundStyles = ( blockStyleGenerator, props = {} ) => {
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

	blockStyleGenerator.addBlockStyles( 'backgroundColor', [ {
		...propsToPass,
		selector,
		hoverSelector: `${ selector }:hover`,
		styleRule: 'backgroundColor',
		attrName: 'backgroundColor',
		key: 'backgroundColor-hover',
		attrNameTemplate,
		selectorCallback,
		hoverCallback: getAttribute => {
			return getAttribute( 'backgroundColorType' ) !== 'gradient'
				? 'all' : false
		},
		valueCallback: ( value, getAttribute ) => {
			const backgroundColorType = getAttribute( 'backgroundColorType' )

			if ( backgroundColorType === 'gradient' && ( value.match( /rgba\(([^\)]*?)\s*0\s*\.?0?0?\)/ ) || value.includes( 'transparent' ) ) ) {
				return 'transparent'
			}

			return value
		},
		dependencies: [
			'backgroundColorType',
			...dependencies,
		],
	} ] )

	// To allow smaller screensizes to override the larger screensize
	// background images, we need to split these css rules to individual
	// ones: desktop, tablet and mobile

	/* Desktop */
	blockStyleGenerator.addBlockStyles( 'backgroundMediaUrl', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundImage',
		attrName: 'backgroundMediaUrl',
		key: 'backgroundMediaUrl',
		attrNameTemplate,
		format: 'url(%s)',
		responsive: [ 'desktop' ],
		valuePreCallback: value => {
			// If it's a video, don't print out the style because
			// it's handled by a video element. And this will cause
			// the video to show up twice in the network requests.
			if ( typeof value === 'string' ) {
				if ( value.match( /\.(mp4|ogg|webm)$/i ) ) {
					return undefined
				}
			}
			return value
		},
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundMediaExternalUrl', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundImage',
		attrName: 'backgroundMediaExternalUrl',
		key: 'backgroundMediaExternalUrl',
		responsive: [ 'desktop' ],
		attrNameTemplate,
		format: 'url(%s)',
	} ] )

	/* Tablet */
	blockStyleGenerator.addBlockStyles( 'backgroundMediaUrl', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundImage',
		attrName: 'backgroundMediaUrl',
		key: 'backgroundMediaUrlTablet',
		attrNameTemplate,
		format: 'url(%s)',
		responsive: [ 'tablet' ],
		valuePreCallback: value => {
			// If it's a video, don't print out the style because
			// it's handled by a video element. And this will cause
			// the video to show up twice in the network requests.
			if ( typeof value === 'string' ) {
				if ( value.match( /\.(mp4|ogg|webm)$/i ) ) {
					return undefined
				}
			}
			return value
		},
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundMediaExternalUrl', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundImage',
		attrName: 'backgroundMediaExternalUrl',
		key: 'backgroundMediaExternalUrlTablet',
		responsive: [ 'tablet' ],
		attrNameTemplate,
		format: 'url(%s)',
	} ] )

	 /* Mobile */
	blockStyleGenerator.addBlockStyles( 'backgroundMediaUrl', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundImage',
		attrName: 'backgroundMediaUrl',
		key: 'backgroundMediaUrlMobile',
		attrNameTemplate,
		format: 'url(%s)',
		responsive: [ 'mobile' ],
		valuePreCallback: value => {
			// If it's a video, don't print out the style because
			// it's handled by a video element. And this will cause
			// the video to show up twice in the network requests.
			if ( typeof value === 'string' ) {
				if ( value.match( /\.(mp4|ogg|webm)$/i ) ) {
					return undefined
				}
			}
			return value
		},
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundMediaExternalUrl', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundImage',
		attrName: 'backgroundMediaExternalUrl',
		key: 'backgroundMediaExternalUrlMobile',
		responsive: [ 'mobile' ],
		attrNameTemplate,
		format: 'url(%s)',
	} ] )

	blockStyleGenerator.addBlockStyles( 'fixedBackground', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundAttachment',
		attrName: 'fixedBackground',
		key: 'fixedBackground',
		attrNameTemplate,
		valueCallback: value => value ? 'fixed' : undefined,
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundPosition', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundPosition',
		attrName: 'backgroundPosition',
		key: 'backgroundPosition',
		attrNameTemplate,
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundRepeat', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundRepeat',
		attrName: 'backgroundRepeat',
		key: 'backgroundRepeat',
		attrNameTemplate,
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundSize', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundSize',
		attrName: 'backgroundSize',
		key: 'backgroundSize',
		attrNameTemplate,
		responsive: 'all',
		valueCallback: ( value, getAttribute, device ) => {
			if ( value === 'custom' ) {
				if ( getAttribute( 'backgroundCustomSize', device ) ) {
					return getAttribute( 'backgroundCustomSize', device ) + ( getAttribute( 'backgroundCustomSizeUnit', device ) || '%' )
				}
			}
			return value
		},
		dependencies: [
			'backgroundCustomSize',
					 'backgroundCustomSizeUnit',
					 ...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundImageBlendMode', [ {
		...propsToPass,
		selector,
		styleRule: 'backgroundBlendMode',
		attrName: 'backgroundImageBlendMode',
		key: 'backgroundImageBlendMode',
		attrNameTemplate,
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundColor', [ {
		...propsToPass,
		selector: `${ selector }:before`,
		hoverSelector: `${ selector }:hover:before`,
		styleRule: 'backgroundColor',
		attrName: 'backgroundColor',
		key: 'backgroundColor-before',
		attrNameTemplate,
		selectorCallback,
		hover: 'all',
		valuePreCallback: ( value, getAttribute, device, state ) => {
			if ( value === '' ) {
				if ( getAttribute( 'backgroundTintStrength', device, state ) ) {
					return '#000000'
				}
			}
			return value
		},
		valueCallback: ( value, getAttribute ) => {
			const isGradient = getAttribute( 'backgroundColorType' ) === 'gradient'
			return ! isGradient && value ? value : undefined
		},
		dependencies: [
			'backgroundColorType',
			'backgroundTintStrength',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundTintStrength', [ {
		...propsToPass,
		selector: `${ selector }:before`,
		hoverSelector: `${ selector }:hover:before`,
		styleRule: 'opacity',
		attrName: 'backgroundTintStrength',
		key: 'backgroundTintStrength',
		attrNameTemplate,
		hover: 'all',
		enabledCallback: getAttribute => !! ( getAttribute( 'backgroundMediaUrl', 'mobile', 'normal', true ) || getAttribute( 'backgroundMediaExternalUrl', 'mobile', 'normal', true ) ),
		valuePreCallback: ( value, getAttribute, device, state ) => {
			if ( value === '' ) {
				if ( getAttribute( 'backgroundColor', device, state ) ) {
					return 5
				}
			}
			return value
		},
		valueCallback: value => {
			return parseInt( value, 10 ) / 10
		},
		dependencies: [
			'backgroundColor',
			'backgroundMediaUrl',
			'backgroundMediaExternalUrl',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundGradientBlendMode', [ {
		...propsToPass,
		selector: `${ selector }:before`,
		styleRule: 'mixBlendMode',
		attrName: 'backgroundGradientBlendMode',
		key: 'backgroundGradientBlendMode',
		attrNameTemplate,
		enabledCallback: getAttribute => getAttribute( 'backgroundColorType' ) === 'gradient',
		dependencies: [
			'backgroundColorType',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundColor', [ {
		...propsToPass,
		selector: `${ selector }:before`,
		styleRule: 'backgroundImage',
		attrName: 'backgroundColor',
		key: 'backgroundColor-image',
		attrNameTemplate,
		enabledCallback: getAttribute => getAttribute( 'backgroundColorType' ) === 'gradient',
		dependencies: [
			'backgroundColorType',
			'backgroundColor',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'borderRadius', [ {
		...propsToPass,
		// In the editor, the background overlay can go outside the block if there's a border radius.
		renderIn: 'edit',
		selector: `${ selector }:before`,
		styleRule: 'borderRadius',
		attrName: 'borderRadius',
		key: 'borderRadius',
		attrNameTemplate,
		format: '%spx',
		enabledCallback: getAttribute =>
			getAttribute( 'backgroundColorType' ) === 'gradient' ||
			getAttribute( 'backgroundColor' ) ||
			getAttribute( 'backgroundColor', 'desktop', 'hover' ) ||
			getAttribute( 'backgroundColor', 'desktop', 'parent-hover' ),
		dependencies: [
			'backgroundColorType',
			'backgroundColor',
			...dependencies,
		],
	} ] )
}
