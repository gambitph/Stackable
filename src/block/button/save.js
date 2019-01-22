import { applyFilters } from '@wordpress/hooks'
import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { range } from '@stackable/util'

const save = props => {
	const { className, attributes } = props
	const {
		align = 'center',
		cornerButtonRadius,
		buttons = 1,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-button-wrapper',
	], {
		[ `ugb-button--align-${ align }` ]: align,
	} )

	const saved = (
		<div className={ mainClasses }>
			{ range( 1, buttons + 1 ).map( i => {
				const {
					[ `text${ i === 1 ? '' : i }` ]: text,
					[ `size${ i === 1 ? '' : i }` ]: size = 'normal',
					[ `url${ i === 1 ? '' : i }` ]: url,
					[ `design${ i === 1 ? '' : i }` ]: design = 'basic',
					[ `color${ i === 1 ? '' : i }` ]: color,
					[ `textColor${ i === 1 ? '' : i }` ]: textColor,
					[ `icon${ i === 1 ? '' : i }` ]: icon,
					[ `newTab${ i === 1 ? '' : i }` ]: newTab,
				} = attributes
				return (
					<ButtonEdit.Content key={ i }
						align={ align }
						size={ size }
						url={ url }
						newTab={ newTab }
						color={ textColor }
						text={ text }
						backgroundColor={ color }
						borderRadius={ cornerButtonRadius }
						design={ design }
						icon={ icon }
					/>
				)
			} ) }
		</div>
	)

	return applyFilters( 'stackable.designs.button.save', saved, props )
}

export default save
