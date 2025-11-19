
/**
 * Internal dependencies
 */
import SVGTutorialsIcon from './images/tutorials.svg'
import SVGDocsIcon from './images/docs.svg'
import SVGCommunityIcon from './images/user.svg'
import SVGArrowUpRightIcon from './images/arrow-up-right.svg'
import SVGDivider from './images/divider.svg'
import SVGQuickButtonsArrow from './images/quick-buttons-arrow.svg'
import SVGCheck from './images/check.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Icon,
	addTemplate as addTemplateIcon,
	styles as stylesIcon,
	scheduled as scheduledIcon,
	brush as brushIcon,
	blockDefault as blockDefaultIcon,
} from '@wordpress/icons'

/**
 * External dependencies
 */
import {
	i18n, guidedTourStates, isPro,
} from 'stackable'
import classNames from 'classnames'

const generalProps = [
	{
		title: __( 'Tutorials', i18n ),
		subtitle: __( 'Get to know the plugin and start your journey with our brand new Stackable Courses.', i18n ),
		link: 'https://wpstackable.com/learn/?utm_source=plugin&utm_medium=getting_started&utm_campaign=tutorial_button',
		icon: <SVGTutorialsIcon />,
	},
	{
		title: __( 'Documentation', i18n ),
		subtitle: __( 'Visit our knowledge base for troubleshooting, guides, FAQs and updates.', i18n ),
		link: 'https://docs.wpstackable.com/',
		icon: <SVGDocsIcon />,
	},
	{
		title: __( 'Community', i18n ),
		subtitle: __( 'Join our very active Stackable Community on Facebook.', i18n ),
		link: 'https://www.facebook.com/groups/wpstackable/',
		icon: <SVGCommunityIcon />,
	},
]

const essentialsProps = [
	{
		title: __( 'The Basics of Stackable Blocks', i18n ),
		subtitle: __( 'Learn how to personalize and tailor Stackable Blocks to match your website\'s unique style and design.', i18n ),
		src: 'https://www.youtube.com/embed/GsQxH_gDp1A',
		url: '#',
	},
	{
		title: __( 'Flexbox Controls', i18n ),
		subtitle: __( 'Explore the powerful Flexbox controls in Stackable that allow you to effortlessly create dynamic and responsive layouts.', i18n ),
		src: 'https://www.youtube.com/embed/73N9uXnpUJE',
		url: '#',
	},
	{
		title: __( 'How to Use Responsive and Hover State Toggles', i18n ),
		subtitle: __( 'Discover how to design responsively and style different hover styles in Stackable.', i18n ),
		src: 'https://www.youtube.com/embed/YPFWu8qwSS4',
		url: '#',
	},
	{
		title: __( 'How to Use Global Styling', i18n ),
		subtitle: __( 'Master the art of optimizing your workflow for globally styling your website to maintain consistency across all pages.', i18n ),
		src: 'https://www.youtube.com/embed/sYnNWSlQawc',
		url: '#',
	},
	{
		title: __( 'How to Use Color Schemes', i18n ),
		subtitle: __( 'Learn how to use Color Schemes to more easily manage your design colors and allow switching colors for entire sections.', i18n ),
		src: 'https://www.youtube.com/embed/b2U7E9X2yCk',
		url: '#',
	},
	{
		title: __( 'How to Use Global Typography', i18n ),
		subtitle: __( 'Unlock the full potential of typography in Stackable and gain insights on how to create visually stunning and impactful text designs.', i18n ),
		src: 'https://www.youtube.com/embed/WhctpivVlh8',
		url: '#',
	},
]

const GeneralCard = ( {
	title, subtitle, link, icon,
} ) => {
	return <a href={ link } className="s-card s-card-link" target="_blank" rel="noreferrer">
		<div className="s-icon-wrapper"> { icon } </div>
		<h3 className="s-card-title"> { title } </h3>
		<p className="s-card-subtitle"> { subtitle } </p>
		<div className="s-bottom-icon-wrapper"> <SVGArrowUpRightIcon /> </div>
	</a>
}

const EssentialsCard = ( {
	title, subtitle, src,
} ) => {
	return <div className="s-card">
		<div className="s-video-wrapper s-card-top">
			<iframe className="s-video" src={ src } title={ title } allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
		</div>
		<h3 className="s-card-title"> { title } </h3>
		<p className="s-card-subtitle"> { subtitle } </p>
	</div>
}

const QUICK_BUTTONS = [ {
	id: 'design-library',
	icon: addTemplateIcon,
	title: __( 'Build Pages in Seconds', i18n ),
	description: __( 'Jump straight into our Design Library and insert polished, pre-built sections; no more blank-page overwhelm.', i18n ),
	link: `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=design-library`,
	cta: __( 'Build Now', i18n ),
},
{
	id: 'blocks',
	icon: blockDefaultIcon,
	title: __( 'Stackable Block Settings', i18n ),
	description: __( 'Learn how to use Stackable blocks and get more out of them.', i18n ),
	link: `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=blocks`,
	cta: __( 'Use Blocks', i18n ),
},
{
	id: 'design-system',
	icon: stylesIcon,
	title: __( 'Apply Global Styles Instantly', i18n ),
	description: __( 'Set your brand\'s colors, fonts, and spacing once in the Design System; every Stackable block updates automatically.', i18n ),
	link: `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=design-system`,
	cta: __( 'Try Now', i18n ),
},
{
	id: 'site-kit',
	icon: scheduledIcon,
	title: __( 'Start with a Complete Site Kit', i18n ),
	description: __( 'Pick a ready-made website template to kickstart your project — fully built layouts and styles, just swap in your content.', i18n ),
	link: '/wp-admin/post-new.php?post_type=page',
	cta: __( 'Select Kit', i18n ),
	style: { display: 'none' },
},
{
	id: 'design-system-picker',
	icon: brushIcon,
	title: __( 'Pre-set Design Systems', i18n ),
	description: __( 'Browse curated Design System presets — apply a professional look instantly without building from scratch.', i18n ),
	link: '/wp-admin/post-new.php?post_type=page',
	cta: __( 'Pick A System', i18n ),
	style: { display: 'none' },
},
{
	id: 'block-backgrounds',
	icon: brushIcon,
	title: __( 'Block Backgrounds & Containers', i18n ),
	description: __( 'Use backgrounds to create stunning full-width sections, and containers to add boxed content for organizing your page.', i18n ),
	link: `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=block-backgrounds`,
	cta: __( 'Try Now', i18n ),
},
{
	id: 'responsive-controls',
	icon: brushIcon,
	title: __( 'Responsive Controls', i18n ),
	description: __( 'Adjust styles for desktop, tablet, and mobile — easily control layout, spacing, and appearance for a seamless experience on any device.', i18n ),
	link: `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=responsive-controls`,
	cta: __( 'Try Now', i18n ),
},
{
	id: 'hover-states',
	icon: brushIcon,
	title: __( 'Styling Hover States', i18n ),
	description: __( 'Adjust styles for different hover states — create engaging effects when users interact with your designs.', i18n ),
	link: `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=hover-states`,
	cta: __( 'Try Now', i18n ),
},
{
	id: 'advanced-hover-states',
	icon: brushIcon,
	title: __( 'Styling Hover States - Advanced', i18n ),
	description: __( 'Style containers and their contents together—apply hover effects to multiple blocks at once for seamless interactive designs.', i18n ),
	link: `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=advanced-hover-states`,
	cta: __( 'Try Now', i18n ),
},
{
	id: 'global-color-schemes',
	icon: brushIcon,
	title: __( 'Global Color Schemes', i18n ),
	description: __( 'Create and apply color schemes to your entire website—maintain consistent branding across all pages with ease.', i18n ),
	link: `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=global-color-schemes`,
	cta: __( 'Try Now', i18n ),
},
{
	id: 'block-styles',
	icon: brushIcon,
	title: __( 'Re-using Block Styles', i18n ),
	description: __( 'Re-use block styles sitewide for consistent branding. Save and quickly apply your favorite style combinations to any block.', i18n ),
	link: isPro ? `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=block-styles` : '',
	cta: __( 'Try Now', i18n ),
	premium: true,
},
{
	id: 'dynamic-content',
	icon: brushIcon,
	title: __( 'Dynamic Content', i18n ),
	description: __( 'Dynamically display content based on user interactions, site conditions, or time-based triggers.', i18n ),
	link: isPro ? `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=dynamic-content` : '',
	cta: __( 'Try Now', i18n ),
	premium: true,
},
{
	id: 'conditional-display',
	icon: brushIcon,
	title: __( 'Conditional Display', i18n ),
	description: __( 'Show or hide blocks based on specific conditions, such as user roles, device type, or custom criteria.', i18n ),
	link: isPro ? `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=conditional-display` : '',
	cta: __( 'Try Now', i18n ),
	premium: true,
},
{
	id: 'motion-effects',
	icon: brushIcon,
	title: __( 'Motion Effects', i18n ),
	description: __( 'Add animations and transitions to your blocks for a more engaging and interactive user experience.', i18n ),
	link: isPro ? `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=motion-effects` : '',
	cta: __( 'Try Now', i18n ),
	premium: true,
},
{
	id: 'custom-css',
	icon: brushIcon,
	title: __( 'Applying CSS per Block', i18n ),
	description: __( 'Add custom CSS to your blocks for precise control over their appearance and behavior.', i18n ),
	link: isPro ? `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=custom-css` : '',
	cta: __( 'Try Now', i18n ),
	premium: true,
},
{
	id: 'copy-paste-styles',
	icon: brushIcon,
	title: __( 'Copy & Paste Styles', i18n ),
	description: __( 'Quickly apply styles from one block to another for consistent design and branding.', i18n ),
	link: isPro ? `/wp-admin/post-new.php?post_type=page&content=${ __( 'Welcome to Stackable', i18n ) }&tour=copy-paste-styles` : '',
	cta: __( 'Try Now', i18n ),
	premium: true,
} ]

export const GettingStarted = () => {
	return <>
		<div className="s-body">
			<div className="s-getting-started__centered">
				<div className="tag">{ __( 'Welcome to Stackable', i18n ) }</div>
				<h2 className="title">{ __( 'Welcome to Your New Block Editor Workflow!', i18n ) }</h2>
			</div>
			<div className="s-getting-started__quick-start-wrapper">
				<div className="s-getting-started-video s-card">
					<div className="s-video-wrapper s-card-top">
						<iframe className="s-video" src="https://www.youtube.com/embed/WP2LHxGulps" title={ __( 'Getting Started', i18n ) } allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
					</div>
					<h3>{ __( 'Getting Started with Stackable', i18n ) }</h3>
					<p>{ __( 'Watch this video to get started with Stackable in within 5 minutes.', i18n ) }</p>
				</div>
				{ QUICK_BUTTONS.map( ( item, i ) => {
					return <div className="s-card" key={ i } style={ item.style ?? {} }>
						{ i === 0 && <div className="s-quick-buttons-arrow">
							<SVGQuickButtonsArrow />
							<span>{ __( 'Quick Start', i18n ) }</span>
						</div> }
						<div className="s-quick-button-icon">
							<Icon icon={ item.icon } />
						</div>
						<div className="s-quick-button-description">
							<h3>
								{ ! isPro && item.premium && <span className="stk-pulsating-circle" role="presentation" /> }
								<span>{ item.title }</span>
							</h3>
							<p>{ item.description }</p>
						</div>
						<div className="s-quick-button-button">
							<a
								href={ item.link }
								className={ classNames( 's-button s-secondary-button uppercase', {
									's-button--checked': guidedTourStates?.includes( item.id ),
									's-button--disabled': item.premium && ! isPro,
								} ) }
							>
								<span className="s-quick-button-toggle-indicator">
									<SVGCheck />
								</span>
								{ item.cta }
							</a>
						</div>
					</div>
				} ) }
			</div>

			<SVGDivider className="s-divider" />

			<div className="s-getting-started__section">
				<div className="s-card-header">
					<h2> { __( 'Resources', i18n ) } </h2>
				</div>
				<div className="s-card-container s-card-general">
					{ generalProps.map( ( item, key ) => {
						return <GeneralCard { ...item } key={ key } />
					} ) }
				</div>
			</div>
			<div className="s-getting-started__section">
				<div className="s-card-header">
					<h2> { __( 'Learn the essentials', i18n ) } </h2>
				</div>
				<div className="s-card-container s-card-essentials">
					{ essentialsProps.map( ( item, key ) => {
						return <EssentialsCard { ...item } key={ key } />
					} ) }
				</div>
			</div>
		</div>
	</>
}
