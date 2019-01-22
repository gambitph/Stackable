import counterUp from 'counterup2'
import domReady from '@wordpress/dom-ready'

domReady( () => {
	require( 'waypoints/lib/noframework.waypoints.js' )
	const elems = document.querySelectorAll( '.ugb-countup .ugb-counter, .ugb-countup__counter' )
	elems.forEach( el => {
		el.classList.add( 'ugb-countup--hide' )
		new Waypoint( {
			element: el,
			handler: function() {
				counterUp( el )
				el.classList.remove( 'ugb-countup--hide' )
				this.destroy()
			},
			offset: 'bottom-in-view',
		} )
	} )
} )
