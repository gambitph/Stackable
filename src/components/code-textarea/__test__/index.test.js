/**
 * Internal dependencies
 */
import CodeTextarea from '../'

describe( 'Code Textarea', () => {
	test( 'should render correctly', () => {
		expect( shallow( <CodeTextarea /> ) ).toMatchSnapshot()
	} )

	test( 'should display default props', () => {
		const wrapper = shallow( <CodeTextarea /> )
		expect( wrapper.find( 'textarea' ).props().value ).toBe( '' )
	} )

	test( 'should display value', () => {
		const props = {
			value: `abc
line2`,
		}
		const wrapper = shallow( <CodeTextarea { ...props } /> )
		expect( wrapper.find( 'textarea' ).props().value ).toBe( props.value )
	} )

	test( 'should trigger onChange callback', () => {
		const onChange = jest.fn()
		const props = {
			value: 'testing',
			onChange,
		}
		const wrapper = shallow( <CodeTextarea { ...props } /> )
		wrapper.find( 'textarea' ).simulate( 'change', 'New value' )
		expect( onChange ).toHaveBeenCalledWith( 'New value' )
	} )
} )
