/**
 * Internal dependencies
 */
import SVGStackableIconTextured from './images/stackable-icon-textured.svg'
import SVGAccordionIcon from './images/accordion-icon.svg'
import SVGBlockquoteIcon from './images/blockquote-icon.svg'
import SVGBlogPostsIcon from './images/blog-posts-icon.svg'
import SVGButtonGroupIcon from './images/button-group-icon.svg'
import SVGButtonIcon from './images/button-icon.svg'
import SVGCardIcon from './images/card-icon.svg'
import SVGColumnsIcon from './images/columns-icon.svg'
import SVGColumnIcon from './images/column-icon.svg'
import SVGContainerIcon from './images/container-icon.svg'
import SVGCountUpIcon from './images/count-up-icon.svg'
import SVGCTAIcon from './images/cta-icon.svg'
import SVGDividerIcon from './images/divider-icon.svg'
import SVGExpandIcon from './images/expand-icon.svg'
import SVGFeatureGridIcon from './images/feature-grid-icon.svg'
import SVGFeatureIcon from './images/feature-icon.svg'
import SVGHeroIcon from './images/hero-icon.svg'
import SVGHeadingIcon from './images/heading-icon.svg'
import SVGIconIcon from './images/icon-icon.svg'
import SVGIconButtonIcon from './images/icon-button-icon.svg'
import SVGIconButtonsIcon from './images/icon-buttons.svg'
import SVGIconBoxIcon from './images/icon-box-icon.svg'
import SVGIconListIcon from './images/icon-list-icon.svg'
import SVGIconLabelIcon from './images/icon-label-icon.svg'
import SVGImageBoxIcon from './images/image-box-icon.svg'
import SVGLoadMoreIcon from './images/load-more.svg'
import SVGNotificationIcon from './images/notification-icon.svg'
import SVGNumberBoxIcon from './images/number-box-icon.svg'
import SVGPaginationIcon from './images/pagination.svg'
import SVGPricingBoxIcon from './images/pricing-box-icon.svg'
import SVGSeparatorIcon from './images/separator-icon.svg'
import SVGSocialButtonsIcon from './images/social-buttons.svg'
import SVGSpacerIcon from './images/spacer-icon.svg'
import SVGTeamMemberIcon from './images/team-member-icon.svg'
import SVGTestimonialIcon from './images/testimonial-icon.svg'
import SVGTextIcon from './images/text-icon.svg'
import SVGVideoPopupIcon from './images/video-popup-icon.svg'
import SVGUngroupContainerIcon from './images/ungroup-container-icon.svg'

/**
 * WordPress dependencies
 */
import { cloneElement, render } from '@wordpress/element'
import domReady from '@wordpress/dom-ready'

export const colorizeIcon = SvgIcon => {
	return cloneElement( SvgIcon, {
		fill: 'url(#stackable-gradient)',
		className: `stk-stackable-icon-gradient ${ SvgIcon.props.className || '' }`,
	} )
}

// Add our SVG gradient placeholder definition that we'll reuse.
domReady( () => {
	if ( document.querySelector( 'svg.ugb-stackable-gradient' ) ) {
		return
	}

	const stackableGradient = document.createElement( 'DIV' )
	stackableGradient.setAttribute( 'style', 'height: 0; width: 0; overflow: hidden;' )
	stackableGradient.setAttribute( 'aria-hidden', 'true' )
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

export const SVGStackableCategoryIcon = () => {
	return colorizeIcon( <SVGStackableIconTextured width="20" height="20" className="components-panel__icon" /> )
}

export const SVGStackableIcon = ( { className } ) => {
	return <SVGStackableIconTextured className={ className } width="20" height="20" />
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
	return colorizeIcon( <SVGButtonIcon width="16" height="16" /> )
}

export const ButtonGroupIcon = () => {
	return colorizeIcon( <SVGButtonGroupIcon width="16" height="16" /> )
}

export const CardIcon = () => {
	return colorizeIcon( <SVGCardIcon width="20" height="20" /> )
}

export const ColumnsIcon = () => {
	return colorizeIcon( <SVGColumnsIcon width="20" height="20" /> )
}

export const ColumnIcon = () => {
	return colorizeIcon( <SVGColumnIcon width="20" height="20" /> )
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

export const HeroIcon = () => {
	return colorizeIcon( <SVGHeroIcon width="20" height="20" /> )
}

export const HeadingIcon = () => {
	return colorizeIcon( <SVGHeadingIcon width="20" height="20" /> )
}

export const GroupContainerIcon = () => {
	return colorizeIcon( <SVGContainerIcon width="20" height="20" className="components-menu-items__item-icon" /> )
}

export const IconIcon = () => {
	return colorizeIcon( <SVGIconIcon width="20" height="20" /> )
}

export const IconButtonIcon = () => {
	return colorizeIcon( <SVGIconButtonIcon width="16" height="16" /> )
}

export const IconButtonsIcon = () => {
	return colorizeIcon( <SVGIconButtonsIcon width="16" height="16" /> )
}

export const IconBoxIcon = () => {
	return colorizeIcon( <SVGIconBoxIcon width="16" height="16" /> )
}

export const IconListIcon = () => {
	return colorizeIcon( <SVGIconListIcon width="20" height="20" /> )
}

export const IconLabelIcon = () => {
	return colorizeIcon( <SVGIconLabelIcon width="16" height="16" /> )
}

export const ImageBoxIcon = () => {
	return colorizeIcon( <SVGImageBoxIcon width="20" height="20" /> )
}

export const LoadMoreIcon = () => {
	return colorizeIcon( <SVGLoadMoreIcon width="16" height="16" /> )
}

export const NotificationIcon = () => {
	return colorizeIcon( <SVGNotificationIcon width="20" height="20" /> )
}

export const NumberBoxIcon = () => {
	return colorizeIcon( <SVGNumberBoxIcon width="20" height="20" /> )
}

export const PaginationIcon = () => {
	return colorizeIcon( <SVGPaginationIcon width="16" height="16" /> )
}

export const PricingBoxIcon = () => {
	return colorizeIcon( <SVGPricingBoxIcon width="20" height="20" /> )
}

export const SeparatorIcon = () => {
	return colorizeIcon( <SVGSeparatorIcon width="20" height="20" /> )
}

export const SocialButtonsIcon = () => {
	return colorizeIcon( <SVGSocialButtonsIcon width="16" height="16" /> )
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

export const TextIcon = () => {
	return colorizeIcon( <SVGTextIcon width="20" height="20" /> )
}

export const VideoPopupIcon = () => {
	return colorizeIcon( <SVGVideoPopupIcon width="20" height="20" /> )
}

export const UngroupContainerIcon = () => {
	return colorizeIcon( <SVGUngroupContainerIcon width="20" height="20" className="components-menu-items__item-icon" /> )
}

export const GhostButtonIcon = () => <ButtonIcon />
