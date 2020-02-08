/**
 * Internal dependencies
 */
import SVGStackableIconTextured from './images/stackable-icon-textured.svg'
import SVGAccordionIcon from './images/accordion-icon.svg'
import SVGBlockquoteIcon from './images/blockquote-icon.svg'
import SVGBlogPostsIcon from './images/blog-posts-icon.svg'
import SVGButtonIcon from './images/button-icon.svg'
import SVGCardIcon from './images/card-icon.svg'
import SVGContainerIcon from './images/container-icon.svg'
import SVGCountUpIcon from './images/count-up-icon.svg'
import SVGCTAIcon from './images/cta-icon.svg'
import SVGDividerIcon from './images/divider-icon.svg'
import SVGExpandIcon from './images/expand-icon.svg'
import SVGFeatureGridIcon from './images/feature-grid-icon.svg'
import SVGFeatureIcon from './images/feature-icon.svg'
import SVGHeaderIcon from './images/header-icon.svg'
import SVGIconListIcon from './images/icon-list-icon.svg'
import SVGImageBoxIcon from './images/image-box-icon.svg'
import SVGNotificationIcon from './images/notification-icon.svg'
import SVGNumberBoxIcon from './images/number-box-icon.svg'
import SVGPricingBoxIcon from './images/pricing-box-icon.svg'
import SVGSeparatorIcon from './images/separator-icon.svg'
import SVGSpacerIcon from './images/spacer-icon.svg'
import SVGTeamMemberIcon from './images/team-member-icon.svg'
import SVGTestimonialIcon from './images/testimonial-icon.svg'
import SVGVideoPopupIcon from './images/video-popup-icon.svg'
import SVGUngroupContainerIcon from './images/ungroup-container-icon.svg'

/**
 * WordPress dependencies
 */
import { cloneElement, render } from '@wordpress/element'
import domReady from '@wordpress/dom-ready'
import { updateCategory } from '@wordpress/blocks'

export const colorizeIcon = SvgIcon => {
	return cloneElement( SvgIcon, {
		fill: 'url(#stackable-gradient)',
		className: 'ugb-stackable-icon-gradient',
	} )
}

// Add an icon to our block category.
if ( typeof window.wp.blocks !== 'undefined' && typeof window.wp.blocks.updateCategory !== 'undefined' ) {
	updateCategory( 'stackable', {
		icon: colorizeIcon( <SVGStackableIconTextured className="components-panel__icon" width="20" height="20" /> ),
	} )
}

// Add our SVG gradient placeholder definition that we'll reuse.
domReady( () => {
	const stackableGradient = document.createElement( 'DIV' )
	document.querySelector( 'body' ).appendChild( stackableGradient )
	render(
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="ugb-stackable-gradient"
			height="0"
			width="0"
			style={ { opacity: 0 } }
		>
			<defs>
				<linearGradient id="stackable-gradient">
					<stop offset="0%" stopColor="#8c33da" stopOpacity="1" />
					<stop offset="100%" stopColor="#f34957" stopOpacity="1" />
				</linearGradient>
			</defs>
		</svg>,
		stackableGradient
	)
} )

export const SVGStackableIcon = () => {
	return <SVGStackableIconTextured width="20" height="20" />
}

export const StackableIcon = () => {
	return colorizeIcon( <SVGStackableIconTextured width="20" height="20" /> )
}

export const AccordionIcon = () => {
	return colorizeIcon( <SVGAccordionIcon width="20" height="20" /> )
}

export const BlockquoteIcon = () => {
	return colorizeIcon( <SVGBlockquoteIcon width="20" height="20" /> )
}

export const BlogPostsIcon = () => {
	return colorizeIcon( <SVGBlogPostsIcon width="20" height="20" /> )
}
export const ButtonIcon = () => {
	return colorizeIcon( <SVGButtonIcon width="20" height="20" /> )
}

export const CardIcon = () => {
	return colorizeIcon( <SVGCardIcon width="20" height="20" /> )
}

export const ContainerIcon = () => {
	return colorizeIcon( <SVGContainerIcon width="20" height="20" /> )
}

export const CountUpIcon = () => {
	return colorizeIcon( <SVGCountUpIcon width="20" height="20" /> )
}

export const CTAIcon = () => {
	return colorizeIcon( <SVGCTAIcon width="20" height="20" /> )
}

export const DividerIcon = () => {
	return colorizeIcon( <SVGDividerIcon width="20" height="20" /> )
}

export const ExpandIcon = () => {
	return colorizeIcon( <SVGExpandIcon width="20" height="20" /> )
}

export const FeatureGridIcon = () => {
	return colorizeIcon( <SVGFeatureGridIcon width="20" height="20" /> )
}

export const FeatureIcon = () => {
	return colorizeIcon( <SVGFeatureIcon width="20" height="20" /> )
}

export const HeaderIcon = () => {
	return colorizeIcon( <SVGHeaderIcon width="20" height="20" /> )
}

export const IconListIcon = () => {
	return colorizeIcon( <SVGIconListIcon width="20" height="20" /> )
}

export const ImageBoxIcon = () => {
	return colorizeIcon( <SVGImageBoxIcon width="20" height="20" /> )
}

export const NotificationIcon = () => {
	return colorizeIcon( <SVGNotificationIcon width="20" height="20" /> )
}

export const NumberBoxIcon = () => {
	return colorizeIcon( <SVGNumberBoxIcon width="20" height="20" /> )
}

export const PricingBoxIcon = () => {
	return colorizeIcon( <SVGPricingBoxIcon width="20" height="20" /> )
}

export const SeparatorIcon = () => {
	return colorizeIcon( <SVGSeparatorIcon width="20" height="20" /> )
}

export const SpacerIcon = () => {
	return colorizeIcon( <SVGSpacerIcon width="20" height="20" /> )
}

export const TeamMemberIcon = () => {
	return colorizeIcon( <SVGTeamMemberIcon width="20" height="20" /> )
}

export const TestimonialIcon = () => {
	return colorizeIcon( <SVGTestimonialIcon width="20" height="20" /> )
}

export const VideoPopupIcon = () => {
	return colorizeIcon( <SVGVideoPopupIcon width="20" height="20" /> )
}

export const UngroupContainerIcon = () => {
	return colorizeIcon( <SVGUngroupContainerIcon width="20" height="20" /> )
}

export const GhostButtonIcon = () => <ButtonIcon />
