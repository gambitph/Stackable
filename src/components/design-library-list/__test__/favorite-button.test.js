import FavoriteButton from '../favorite-button'
import { render, fireEvent } from '@testing-library/react'

describe( 'FavoriteButton', () => {
	it( 'renders', () => {
		const { getByTestId } = render( <FavoriteButton /> )
		expect( getByTestId( 'empty-icon' ) ).toBeTruthy()
	} )

	it( 'renders favorite', () => {
		const { getByTestId } = render( <FavoriteButton isFavorite={ true } /> )
		expect( getByTestId( 'filled-icon' ) ).toBeTruthy()
	} )

	it( 'click works', () => {
		const { getByTestId, getByRole } = render( <FavoriteButton /> )
		expect( getByTestId( 'empty-icon' ) ).toBeTruthy()
		fireEvent.click( getByRole( 'button' ) )
		expect( getByTestId( 'filled-icon' ) ).toBeTruthy()
		fireEvent.click( getByRole( 'button' ) )
		expect( getByTestId( 'empty-icon' ) ).toBeTruthy()
	} )

	it( 'triggers onClick', () => {
		const onClick = jest.fn()
		const { getByRole } = render( <FavoriteButton onClick={ onClick } /> )
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		fireEvent.click( getByRole( 'button' ) )
		expect( onClick ).toHaveBeenCalledTimes( 1 )
	} )
} )
