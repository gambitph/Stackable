import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { getIconSVGBase64 } from './util'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className } = props
	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		text,
		columns,
		gap,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list-wrapper',
	], applyFilters( 'stackable.icon-list.mainclasses', {}, design, props ) )

	const ulClasses = classnames( [
		'ugb-icon-list',
		`ugb-icon--icon-${ icon }`,
		`ugb-icon--columns-${ columns }`,
	], applyFilters( 'stackable.icon-list.ulclasses', {}, design, props ) )

	const iconSVGString = getIconSVGBase64( icon, iconShape, iconColor )
	const style = {
		'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
		'--icon-size': iconSize ? `${ iconSize }px` : undefined,
		'--gap': gap ? `${ gap }px` : undefined,
	}

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.icon-list.save.output.before', null, design, props ) }
			<RichText.Content
				tagName="ul"
				className={ ulClasses }
				style={ style }
				value={ text }
			/>
			{ applyFilters( 'stackable.icon-list.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
