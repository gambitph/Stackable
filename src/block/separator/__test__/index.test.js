import { blockEditRender, blockSaveRender } from '@stackable/test/helpers'
import { name, settings } from '../'
import { applyFilters } from '@wordpress/hooks'

describe( `${ settings.title } block`, () => {
	test( 'Inspector layouts snapshot', () => {
		const inspector = applyFilters( 'stackable.separator.edit.inspector.layout.before', null, {
			setAttributes: () => {}, attributes: {},
		} )
		expect( inspector ).toMatchSnapshot()
	} )

	test( 'Inspector style snapshot', () => {
		const inspector = applyFilters( 'stackable.separator.edit.inspector.style.before', null, {
			setAttributes: () => {}, attributes: {},
		} )
		expect( inspector ).toMatchSnapshot()
	} )

	test( 'Edit render snapshot', () => {
		const wrapper = blockEditRender( name, settings )
		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'Save render snapshot', () => {
		const wrapper = blockSaveRender( name, settings )
		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'Save render with attributes snapshot', () => {
		const attributes = {
			design: 'wave-2',
		}
		const wrapper = blockSaveRender( name, settings, attributes )
		expect( wrapper ).toMatchSnapshot()
	} )
} )
