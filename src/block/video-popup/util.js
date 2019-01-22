import { __ } from '@wordpress/i18n'

const playButton = {
	normal: style => <svg style={ style } xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 320"><path d="M0 0v320l256-160L0 0z" /></svg>,
	circle: style => <svg style={ style } xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40"><path d="M16 29l12-9-12-9v18zm4-29C8.95 0 0 8.95 0 20s8.95 20 20 20 20-8.95 20-20S31.05 0 20 0zm0 36c-8.82 0-16-7.18-16-16S11.18 4 20 4s16 7.18 16 16-7.18 16-16 16z" /></svg>,
	outline: style => <svg style={ style } xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 34 34"><path d="M17 34C7.6 34 0 26.4 0 17S7.6 0 17 0s17 7.6 17 17-7.6 17-17 17zm0-32C8.7 2 2 8.7 2 17s6.7 15 15 15 15-6.7 15-15S25.3 2 17 2z" /><path d="M12 25.7V8.3L27 17l-15 8.7zm2-14v10.5l9-5.3-9-5.2z" /></svg>,
}

export const playButtonTypes = [
	{ value: 'normal', label: __( 'Normal Play Button' ) },
	{ value: 'circle', label: __( 'Play Button with Circle' ) },
	{ value: 'outline', label: __( 'Outline Play Button' ) },
]

export const getPlayButton = ( name, fill = null ) => {
	return playButton[ name ]( { fill } )
}
