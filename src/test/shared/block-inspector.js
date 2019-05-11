import { withTabbedInspector } from '@stackable/higher-order'

const blockInspectorTests = props => {
	const {
		name,
	} = props

	test( 'should match inspector tabbed controls snapshot', () => {
		const blockName = name.replace( /^\w+\//g, '' )
		const MockBlockComponent = () => <div />
		const TabbedInspectorComponent = withTabbedInspector( MockBlockComponent )
		const wrapper = shallow( <TabbedInspectorComponent blockName={ blockName } /> )

		expect( wrapper ).toMatchSnapshot()
	} )
}

export default blockInspectorTests
