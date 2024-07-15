/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Transform,
	Typography,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const typographyOptions = {
	selector: '.stk-block-timeline__date',
	hoverSelector: '.stk-block-timeline__date:hover',
}

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ [ '', '~ .stk-block-timeline' ] } // Also set the succeeding ones.
				styleRule="--line-accent-bg-location"
				attrName="timelineAnchor"
				key="timelineAnchor"
				format="%s%"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--gap"
				attrName="timelineGap"
				key="timelineGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-dot-border-radius"
				attrName="timelineDotBorderRadius"
				key="timelineDotBorderRadius"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-dot-size"
				attrName="timelineDotSize"
				key="timelineDotSize"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-bg-width"
				attrName="timelineThickness"
				key="timelineThickness"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--content-line"
				attrName="timelineOffset"
				key="timelineOffset"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-accent-bg-color"
				attrName="timelineAccentColor"
				key="timelineAccentColor"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-accent-bg-color-2"
				attrName="timelineAccentColor2"
				key="timelineAccentColor2"
				enabledCallback={ getAttribute => getAttribute( 'timelineAccentColorType' ) === 'gradient' }
				dependencies={ [ 'timelineAccentColorType', ...dependencies ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-bg-color"
				attrName="timelineBackgroundColor"
				key="timelineBackgroundColor"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-inner-blocks:after"
				styleRule="top"
				attrName="blockPadding"
				key="timeline-blockPadding-top"
				responsive="all"
				valuePreCallback={ ( value, getAttribute, device ) => {
					const getInherited = true
					const padding = getAttribute( 'blockPadding', device, 'normal', getInherited )
					const top = padding && padding?.top !== '' ? padding?.top : ( device === 'mobile' ? 0 : 16 )
					if ( device === 'mobile' ) {
						return `${ top + 16 }px`
					}

					if ( padding?.top === padding?.bottom ) {
						return ''
					}

					const bottom = padding && padding?.bottom !== '' ? padding?.bottom : 16
					return `calc(${ top }px + (100% - ${ top }px - ${ bottom }px)/2)`
				} }
				unitCallback={ () => '' }
				dependencies={ [ 'blockPadding', ...dependencies ] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-inner-blocks:after"
				styleRule="bottom"
				attrName="blockPadding"
				key="timeline-blockPadding-bottom"
				enabledCallback={ getAttribute => getAttribute( 'timelineIsLast' ) === true }
				responsive="all"
				valuePreCallback={ ( value, getAttribute, device ) => {
					const getInherited = true
					const padding = getAttribute( 'blockPadding', device, 'normal', getInherited )
					const top = padding && padding?.top !== '' ? padding?.top : ( device === 'mobile' ? 0 : 16 )
					const bottom = padding && padding?.bottom !== '' ? padding?.bottom : ( device === 'mobile' ? 0 : 16 )
					if ( device === 'mobile' ) {
						return `calc(${ bottom }px + (100% - ${ top + bottom }px) - 16px)`
					}

					if ( top === bottom ) {
						return ``
					}

					return `calc(${ bottom }px + (100% - ${ top }px - ${ bottom }px)/2)`
				} }
				unitCallback={ () => '' }
				dependencies={ [ 'timelineIsLast', 'blockPadding', ...dependencies ] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-block-timeline__middle"
				styleRule="marginTop"
				attrName="blockPadding"
				key="timeline-blockPadding-marginTop"
				responsive="all"
				valuePreCallback={ ( value, getAttribute, device ) => {
					const getInherited = true
					const padding = getAttribute( 'blockPadding', device, 'normal', getInherited )
					if ( device === 'mobile' ) {
						return padding ? `${ padding?.top }px` : ''
					}
					return ''
				} }
				unitCallback={ () => '' }
				dependencies={ [ 'blockPadding', ...dependencies ] }
			/>
		</>
	)
}

const MemoizedStyles = memo( Styles )

const BlockStyles = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<MarginBottom.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<MemoizedStyles { ...props } />
		</>
	)
} )

BlockStyles.defaultProps = {
	version: '',
}

BlockStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<BlockDiv.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
