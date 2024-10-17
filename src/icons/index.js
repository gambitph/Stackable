/**
 * Internal dependencies
 */
import SVGStackableIconTextured from './images/stackable-icon-textured.svg'
import SVGAccordionIcon from './images/accordion-icon.svg'
import SVGBlockquoteIcon from './images/blockquote-icon.svg'
import SVGBlogPostsIcon from './images/blog-posts-icon.svg'
import SVGButtonGroupIcon from './images/button-group-icon.svg'
import SVGButtonIcon from './images/button-icon.svg'
import SVGCarouselIcon from './images/carousel-icon.svg'
import SVGCardIcon from './images/card-icon.svg'
import SVGColumnsIcon from './images/columns-icon.svg'
import SVGColumnIcon from './images/column-icon.svg'
import SVGContainerIcon from './images/container-icon.svg'
import SVGCountdownIcon from './images/countdown-icon.svg'
import SVGCountUpIcon from './images/count-up-icon.svg'
import SVGCTAIcon from './images/cta-icon.svg'
import SVGDividerIcon from './images/divider-icon.svg'
import SVGExpandIcon from './images/expand-icon.svg'
import SVGFeatureGridIcon from './images/feature-grid-icon.svg'
import SVGFeatureIcon from './images/feature-icon.svg'
import SVGHeroIcon from './images/hero-icon.svg'
import SVGHeadingIcon from './images/heading-icon.svg'
import SVGHorizontalScrollerIcon from './images/horizontal-scroller-icon.svg'
import SVGIconIcon from './images/icon-icon.svg'
import SVGIconButtonIcon from './images/icon-button-icon.svg'
import SVGIconButtonsIcon from './images/icon-buttons.svg'
import SVGIconBoxIcon from './images/icon-box-icon.svg'
import SVGIconListIcon from './images/icon-list-icon.svg'
import SVGIconListItemIcon from './images/icon-list-item-icon.svg'
import SVGIconLabelIcon from './images/icon-label-icon.svg'
import SVGImageIcon from './images/image-icon.svg'
import SVGImageBoxIcon from './images/image-box-icon.svg'
import SVGLoadMoreIcon from './images/load-more.svg'
import SVGMapIcon from './images/map-icon.svg'
import SVGNotificationIcon from './images/notification-icon.svg'
import SVGNumberBoxIcon from './images/number-box-icon.svg'
import SVGPaginationIcon from './images/pagination.svg'
import SVGPricingBoxIcon from './images/pricing-box-icon.svg'
import SVGProgressCircleIcon from './images/progress-circle-icon.svg'
import SVGProgressBarIcon from './images/progress-bar-icon.svg'
import SVGRepeaterIcon from './images/repeater-icon.svg'
import SVGRepeaterTemplateIcon from './images/repeater-template-icon.svg'
import SVGSeparatorIcon from './images/separator-icon.svg'
import SVGSocialButtonsIcon from './images/social-buttons.svg'
import SVGSpacerIcon from './images/spacer-icon.svg'
import SVGTableOfContentsIcon from './images/table-of-contents.svg'
import SVGTabsIcon from './images/tabs-icon.svg'
import SVGTabsContentIcon from './images/tabs-content-icon.svg'
import SVGTabsLabelIcon from './images/tabs-label-icon.svg'
import SVGTeamMemberIcon from './images/team-member-icon.svg'
import SVGTestimonialIcon from './images/testimonial-icon.svg'
import SVGTextIcon from './images/text-icon.svg'
import SVGTimelineIcon from './images/timeline-icon.svg'
import SVGVideoPopupIcon from './images/video-popup-icon.svg'
import SVGUngroupContainerIcon from './images/ungroup-container-icon.svg'

/**
 * Internal dependencies
 */
import { createRoot } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { cloneElement } from '@wordpress/element'
import domReady from '@wordpress/dom-ready'

export function colorizeIcon( SvgIcon ) {
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
	createRoot( stackableGradient ).render(
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
		</svg>
	)
} )

export function SVGStackableCategoryIcon() {
	return colorizeIcon( <SVGStackableIconTextured width="20" height="20" className="components-panel__icon" /> )
}

export function SVGStackableIcon( { className } ) {
	return <SVGStackableIconTextured className={ className } width="20" height="20" />
}

export function StackableIcon() {
	return colorizeIcon( <SVGStackableIconTextured width="20" height="20" /> )
}

export function AccordionIcon() {
	return colorizeIcon( <SVGAccordionIcon width="20" height="20" /> )
}

export function BlockquoteIcon() {
	return colorizeIcon( <SVGBlockquoteIcon width="20" height="20" /> )
}

export function BlogPostsIcon() {
	return colorizeIcon( <SVGBlogPostsIcon width="20" height="20" /> )
}

export function ButtonIcon() {
	return colorizeIcon( <SVGButtonIcon width="16" height="16" /> )
}

export function ButtonGroupIcon() {
	return colorizeIcon( <SVGButtonGroupIcon width="16" height="16" /> )
}

export function CarouselIcon() {
	return colorizeIcon( <SVGCarouselIcon width="16" height="16" /> )
}

export function CardIcon() {
	return colorizeIcon( <SVGCardIcon width="20" height="20" /> )
}

export function ColumnsIcon() {
	return colorizeIcon( <SVGColumnsIcon width="20" height="20" /> )
}

export function ColumnIcon() {
	return colorizeIcon( <SVGColumnIcon width="20" height="20" /> )
}

export function ContainerIcon() {
	return colorizeIcon( <SVGContainerIcon width="20" height="20" /> )
}

export function CountdownIcon() {
	return colorizeIcon( <SVGCountdownIcon width="20" height="20" /> )
}

export function CountUpIcon() {
	return colorizeIcon( <SVGCountUpIcon width="20" height="20" /> )
}

export function CTAIcon() {
	return colorizeIcon( <SVGCTAIcon width="20" height="20" /> )
}

export function DividerIcon() {
	return colorizeIcon( <SVGDividerIcon width="20" height="20" /> )
}

export function ExpandIcon() {
	return colorizeIcon( <SVGExpandIcon width="20" height="20" /> )
}

export function FeatureGridIcon() {
	return colorizeIcon( <SVGFeatureGridIcon width="20" height="20" /> )
}

export function FeatureIcon() {
	return colorizeIcon( <SVGFeatureIcon width="20" height="20" /> )
}

export function HeroIcon() {
	return colorizeIcon( <SVGHeroIcon width="20" height="20" /> )
}

export function HeadingIcon() {
	return colorizeIcon( <SVGHeadingIcon width="20" height="20" /> )
}

export function HorizontalScrollerIcon() {
	return colorizeIcon( <SVGHorizontalScrollerIcon width="20" height="20" /> )
}

export function GroupContainerIcon() {
	return colorizeIcon( <SVGContainerIcon width="20" height="20" className="components-menu-items__item-icon" /> )
}

export function IconIcon() {
	return colorizeIcon( <SVGIconIcon width="20" height="20" /> )
}

export function IconButtonIcon() {
	return colorizeIcon( <SVGIconButtonIcon width="16" height="16" /> )
}

export function IconButtonsIcon() {
	return colorizeIcon( <SVGIconButtonsIcon width="16" height="16" /> )
}

export function IconBoxIcon() {
	return colorizeIcon( <SVGIconBoxIcon width="16" height="16" /> )
}

export function IconListIcon() {
	return colorizeIcon( <SVGIconListIcon width="20" height="20" /> )
}
export function IconListItemIcon() {
	return colorizeIcon( <SVGIconListItemIcon width="20" height="20" /> )
}

export function IconLabelIcon() {
	return colorizeIcon( <SVGIconLabelIcon width="16" height="16" /> )
}

export function ImageIcon() {
	return colorizeIcon( <SVGImageIcon width="20" height="20" /> )
}

export function ImageBoxIcon() {
	return colorizeIcon( <SVGImageBoxIcon width="20" height="20" /> )
}

export function LoadMoreIcon() {
	return colorizeIcon( <SVGLoadMoreIcon width="16" height="16" /> )
}

export function MapIcon() {
	return colorizeIcon( <SVGMapIcon width="20" height="20" /> )
}

export function NotificationIcon() {
	return colorizeIcon( <SVGNotificationIcon width="20" height="20" /> )
}

export function NumberBoxIcon() {
	return colorizeIcon( <SVGNumberBoxIcon width="20" height="20" /> )
}

export function PaginationIcon() {
	return colorizeIcon( <SVGPaginationIcon width="16" height="16" /> )
}

export function PricingBoxIcon() {
	return colorizeIcon( <SVGPricingBoxIcon width="20" height="20" /> )
}

export function ProgressCircleIcon() {
	return colorizeIcon( <SVGProgressCircleIcon width="16" height="16" /> )
}

export function ProgressBarIcon() {
	return colorizeIcon( <SVGProgressBarIcon width="16" height="16" /> )
}

export function RepeaterIcon() {
	return colorizeIcon( <SVGRepeaterIcon width="20" height="20" /> )
}

export function RepeaterTemplateIcon() {
	return colorizeIcon( <SVGRepeaterTemplateIcon width="20" height="20" /> )
}

export function SeparatorIcon() {
	return colorizeIcon( <SVGSeparatorIcon width="20" height="20" /> )
}

export function SocialButtonsIcon() {
	return colorizeIcon( <SVGSocialButtonsIcon width="16" height="16" /> )
}

export function SpacerIcon() {
	return colorizeIcon( <SVGSpacerIcon width="20" height="20" /> )
}

export function TableOfContentsIcon() {
	return colorizeIcon( <SVGTableOfContentsIcon width="20" height="20" /> )
}

export function TabsIcon() {
	return colorizeIcon( <SVGTabsIcon width="16" height="16" /> )
}

export function TabsContentIcon() {
	return colorizeIcon( <SVGTabsContentIcon width="16" height="16" /> )
}

export function TabsLabelIcon() {
	return colorizeIcon( <SVGTabsLabelIcon width="16" height="16" /> )
}

export function TeamMemberIcon() {
	return colorizeIcon( <SVGTeamMemberIcon width="20" height="20" /> )
}

export function TestimonialIcon() {
	return colorizeIcon( <SVGTestimonialIcon width="20" height="20" /> )
}

export function TextIcon() {
	return colorizeIcon( <SVGTextIcon width="20" height="20" /> )
}

export function TimelineIcon() {
	return colorizeIcon( <SVGTimelineIcon width="16" height="16" /> )
}

export function VideoPopupIcon() {
	return colorizeIcon( <SVGVideoPopupIcon width="20" height="20" /> )
}

export function UngroupContainerIcon() {
	return colorizeIcon( <SVGUngroupContainerIcon width="20" height="20" className="components-menu-items__item-icon" /> )
}

export function GhostButtonIcon() {
	return <ButtonIcon />
}
