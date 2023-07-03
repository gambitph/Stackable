
/**
 * Internal dependencies
 */
import SVGTutorialsIcon from './images/tutorials.svg'
import SVGDocsIcon from './images/docs.svg'
import SVGCommunityIcon from './images/user.svg'
import SVGArrowUpRightIcon from './images/arrow-up-right.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

const generalProps = {
	label: 'general',
	content: [
		{
			title: __( 'Tutorials', i18n ),
			subtitle: __( 'Get to know the plugin and start your journey with our brand new Stackable Courses.', i18n ),
			link: '#',
			icon: <SVGTutorialsIcon />,
		},
		{
			title: __( 'Documentation and Support', i18n ),
			subtitle: __( 'Get assistance with troubleshooting, guides, FAQs, and updates.', i18n ),
			link: '#',
			icon: <SVGDocsIcon />,
		},
		{
			title: __( 'Community', i18n ),
			subtitle: __( 'Join our very active Stackable Community on Facebook.', i18n ),
			link: '#',
			icon: <SVGCommunityIcon />,
		},
	],
}

const essentialsProps = {
	label: 'essentials',
	content: [
		{
			title: __( 'How to Add Blocks', i18n ),
			subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
			src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
			url: '#',
		},
		{
			title: __( 'How to Customize Blocks', i18n ),
			subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
			src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
			url: '#',
		},
		{
			title: __( 'How to Use Copy & Paste Styles', i18n ),
			subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
			src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
			url: '#',
		},
		{
			title: __( 'Introduction to Wireframes', i18n ),
			subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
			src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
			url: '#',
		},
		{
			title: __( 'How to Use the Design Library', i18n ),
			subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
			src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
			url: '#',
		},
		{
			title: __( 'How to Use the Column Blocks', i18n ),
			subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
			src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
			url: '#',
		},
	],
	headerTitle: __( 'Learn the essentials', i18n ),
	headerSubtitle: __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat tempus sollicitudin rhoncus pretium tellus.', i18n ),
}

const Section = props => {
	const Card = ( {
		title, subtitle, link, icon = '', src = '',
	} ) => {
		return <div className="s-card">
			{ props.label === 'general'
				? <div className="s-icon-wrapper"> { icon } </div>
				: <div className="s-video-wrapper">
					<iframe className="s-video" src={ src } title={ title } allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
				</div>
			}
			<h3 className="s-card-title"> { title } </h3>
			<p className="s-card-subtitle"> { subtitle } </p>
			<div className="s-card-link">
				<a href={ link }>
					{ props.label === 'general' ? <SVGArrowUpRightIcon />
						: __( 'Watch Video', i18n )
					}
				</a>
			</div>
		</div>
	}

	return <Fragment>
		{ props.label !== 'general' &&
			<div className="s-card-header">
				<h2> { props.headerTitle } </h2>
				<p> { props.headerSubtitle } </p>
			</div>
		}
		<div className={ `s-card-container s-card-${ props.label }` }>
			{ props.content.map( ( item, key ) => {
				return <Card { ...item } key={ key } />
			} ) }
		</div>
	</Fragment>
}

export const GettingStarted = () => {
	return <>
		<div className="s-body">

			<div className="s-getting-started__centered">
				<h2 className="title"> { __( 'Stackable offers you a wide range of', i18n ) } <span> { __( 'beautifully designed', i18n ) } </span> { __( 'blocks and layouts.', i18n ) } </h2>
				<p className="subtitle">{ __( 'From eye-catching image galleries to engaging testimonials and powerful call-to-action sections, our blocks make it easy to build professional-looking pages without any coding knowledge.', i18n ) } </p>

				<div className="s-video-wrapper s-getting-started-video">
					<iframe className="s-video" src="https://www.youtube.com/embed/MaXOZ-1UIvs" title="Getting Started" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
				</div>

				<div className="s-button-container"><a href="/wp-admin/post-new.php?post_type=page" target="_new" className="s-button s-secondary-button uppercase">
					{ __( 'Create a new page', i18n ) }
				</a></div>
			</div>

			<div className="s-getting-started__section">
				<Section { ...generalProps } />
			</div>
			<div className="s-getting-started__section">
				<Section { ...essentialsProps } />
			</div>

			<div className="s-getting-started__footer-banner">
				<div className="s-banner-wrapper">
					<div className="s-banner-content">
						<h2> { __( 'Check out our library of tutorials and guides', i18n ) } </h2>
						<p> { __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat tempus sollicitudin rhoncus pretium tellus.', i18n ) } </p>
					</div>
					<div className="s-button-container"><a href="https://wpstackable.com/learn/" target="_new" className="s-button s-secondary-button">
						{ __( 'Go to Stackable Learn', i18n ) }
					</a></div>
				</div>
			</div>
		</div>
	</>
}
