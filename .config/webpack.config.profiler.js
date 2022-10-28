/**
 * This profiler config makes it such that we're building the production of
 * Stackable (so we get the actual speed without the debugging stuff in a
 * development build), but we're keeping the names of of classes and components
 * so that when we check the React profiler, we see the components better
 * instead of just seeing minified names.
 */
const config = require( './webpack.config.prod' )
const TerserPlugin = require( 'terser-webpack-plugin' )

// To use profiling, we need to keep the names of methods: https://kentcdodds.com/blog/profile-a-react-app-for-performance
// This is how to change the minimizer settings: https://webpack.js.org/configuration/optimization/#optimizationminimizer
module.exports = config.map( config => {
	if ( ! config.optimization ) {
		config.optimization = {}
	}
	config.optimization['minimizer'] = [
		new TerserPlugin( {
			parallel: true,
			terserOptions: {
				// All options: https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
				keep_classnames: true,
				keep_fnames: true,
			},
		} ),
	]
	return config
} )
