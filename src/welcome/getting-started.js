
/**
 * Internal dependencies
 */
import SVGTutorialsIcon from './images/tutorials.svg'
import SVGDocsIcon from './images/docs.svg'
import SVGCommunityIcon from './images/user.svg'
import SVGArrowUpRightIcon from './images/arrow-up-right.svg'
import SVGDivider from './images/divider.svg'
import SVGQuickButtonsArrow from './images/quick-buttons-arrow.svg'

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
} from '@wordpress/icons'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

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

export const GettingStarted = () => {
	return <>

		<div className="s-body">
			<div className="s-getting-started__centered">
				<div className="tag">{ __( 'Welcome to Stackable', i18n ) }</div>
				{ /* <h2 className="title">{ __( 'Let\'s build something amazing!', i18n ) }</h2> */ }
				<h2 className="title">{ __( 'Welcome to Your New Block Editor Workflow!', i18n ) }</h2>
			</div>
			<div className="s-getting-started__quick-start-wrapper">

				<div className="s-quick-buttons-wrapper">
					<div className="s-quick-buttons-arrow">
						<SVGQuickButtonsArrow />
						<span>{ __( 'Quick Start', i18n ) }</span>
					</div>
					<div className="s-card">
						<div className="s-quick-button-icon">
							<Icon icon={ addTemplateIcon } />
						</div>
						<div className="s-quick-button-description">
							<h3>{ __( 'Build Pages in Seconds', i18n ) }</h3>
							<p>{ __( 'Jump straight into our Design Library and insert polished, pre-built sections — no more blank-page overwhelm.', i18n ) }</p>
						</div>
						<div className="s-quick-button-button">
							<a href="/wp-admin/post-new.php?post_type=page&tour=design-library-welcome" className="s-button s-secondary-button uppercase">
								{ __( 'Build Now', i18n ) }
							</a>
						</div>
					</div>

					<div className="s-card">
						<div className="s-quick-button-icon">
							<Icon icon={ stylesIcon } />
						</div>
						<div className="s-quick-button-description">
							<h3>{ __( 'Apply Global Styles Instantly', i18n ) }</h3>
							<p>{ __( 'Set your brand\'s colors, fonts, and spacing once in the Design System — every Stackable block updates automatically.', i18n ) }</p>
						</div>
						<div className="s-quick-button-button">
							<a href="/wp-admin/post-new.php?post_type=page&tour=design-system-welcome" className="s-button s-secondary-button uppercase">
								{ __( 'Try Now', i18n ) }
							</a>
						</div>
					</div>

					{ /* TODO: Hide this for now */ }
					<div className="s-card" style={ { display: 'none' } }>
						<div className="s-quick-button-icon">
							<Icon icon={ scheduledIcon } />
						</div>
						<div className="s-quick-button-description">
							<h3>{ __( 'Start with a Complete Site Kit', i18n ) }</h3>
							<p>{ __( 'Pick a ready-made website template to kickstart your project — fully built layouts and styles, just swap in your content.', i18n ) }</p>
						</div>
						<div className="s-quick-button-button">
							<a href="/wp-admin/post-new.php?post_type=page" className="s-button s-secondary-button uppercase">
								{ __( 'Select Kit', i18n ) }
							</a>
						</div>
					</div>

					{ /* TODO: Hide this for now */ }
					<div className="s-card" style={ { display: 'none' } }>
						<div className="s-quick-button-icon">
							<Icon icon={ brushIcon } />
						</div>
						<div className="s-quick-button-description">
							<h3>{ __( 'Pre-set Design Systems', i18n ) }</h3>
							<p>{ __( 'Browse curated Design System presets — apply a professional look instantly without building from scratch.', i18n ) }</p>
						</div>
						<div className="s-quick-button-button">
							<a href="/wp-admin/post-new.php?post_type=page" className="s-button s-secondary-button uppercase">
								{ __( 'Pick A System', i18n ) }
							</a>
						</div>
					</div>
				</div>

				<div className="s-getting-started-video s-card">
					<div className="s-video-wrapper s-card-top">
						<iframe className="s-video" src="https://www.youtube.com/embed/WP2LHxGulps" title={ __( 'Getting Started', i18n ) } allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
					</div>
					<h3>{ __( 'Getting Started with Stackable', i18n ) }</h3>
					<p>{ __( 'Watch this video to get started with Stackable in within 5 minutes.', i18n ) }</p>
				</div>
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
