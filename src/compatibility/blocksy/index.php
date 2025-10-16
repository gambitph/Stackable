<?php
/**
 * Global Color Schemes
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_blocksy_global_color_schemes_compatibility' ) ) {
	function stackable_blocksy_global_color_schemes_compatibility( $styles, $scheme, $selectors, $mode, $classes ) {
		/**
		 * This is WIP. Blocksy is not supported yet.
		 */

		/*
		if ( in_array( 'stk--is-blocksy-theme', $classes ) ) {
				$bg_property = '--stk-button-background-color';
				$text_property = '--stk-button-text-color';

				$states = array(
					'desktop' => [],
					'desktopParentHover' => []
				);

				foreach( $states as $state => $_ ) {
					if ( $GLOBAL_COLOR_SCHEMES_CLASS->has_value( $scheme, 'buttonBackgroundColor', $state ) ) {
						$states[ $state ][ $bg_property ] = $scheme[ 'buttonBackgroundColor' ][ $state ];
					}

					if ( $GLOBAL_COLOR_SCHEMES_CLASS->has_value( $scheme, 'buttonTextColor', $state ) ) {
						$states[ $state ][ $text_property ] = $scheme[ 'buttonTextColor' ][ $state ];
					}
				}

				// Add a new selector with higher specificity
				$desktop_button_selector = '';
				$parent_hover_button_selector = '';
				$parent_hover_selector = array();

				if ( isset( $selectors[ 'desktopParentHover' ] ) ) {
					$parent_hover_selector = is_array( $selectors[ 'desktopParentHover' ] ) ? $selectors[ 'desktopParentHover' ] : array( $selectors[ 'desktopParentHover' ] );
				}

				switch ( $mode ) {
					case 'background':
						$desktop_button_selector = implode(", ", array(
							$selectors[ 'desktop' ] . ' > :where(.stk-button-group) > .stk-block-button',
							$selectors[ 'desktop' ] . ' > :where(.stk-container) > :where(.stk-inner-blocks) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > .stk-block-button',
						) );

						if (isset( $selectors[ 'desktopParentHover' ] )) {
							$parent_hover_button_selector = implode(", ", array_map( function ( $s ){ return "$s > :where(.stk-button-group) > .stk-block-button, $s > :where(.stk-container) > :where(.stk-inner-blocks) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > .stk-block-button"; }, $parent_hover_selector ) );
						}
						break;
					case 'container':
						$desktop_button_selector = $selectors[ 'desktop' ] . ' > :where(.stk-inner-blocks) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > .stk-block-button';

						if (isset( $selectors[ 'desktopParentHover' ] )) {
							$parent_hover_button_selector = implode(", ", array_map( function ( $s ){ return "$s > :where(.stk-inner-blocks) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > .stk-block-button"; }, $parent_hover_selector ) );
						}
						break;
					default:
						$desktop_button_selector = $selectors[ 'desktop' ] . ' :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > .stk-block-button';
				}

				if ( count( $states[ 'desktop' ] ) ) {
					$styles[] = array(
						'selector'     => $desktop_button_selector,
						'declarations' => $states[ 'desktop' ]
					);
				}

				if ( count( $states[ 'desktopParentHover' ] ) && isset( $selectors[ 'desktopParentHover' ] ) ) {
					$parent_hover_selector = is_array( $selectors[ 'desktopParentHover' ] ) ? $selectors[ 'desktopParentHover' ] : array( $selectors[ 'desktopParentHover' ] );

					$styles[] = array(
						'selector'     => $parent_hover_button_selector,
						'declarations' => $states[ 'desktopParentHover' ]
					);
				}
			}
		*/

		return $styles;
	}

	add_filter( 'stackable.global-settings.global-color-schemes.add-theme-compatibility', 'stackable_blocksy_global_color_schemes_compatibility', 10, 6 );
}

if ( ! function_exists( 'stackable_blocksy_theme_global_styles' ) ) {
	function stackable_sanitize_css_string( $css ) {
		if ( ! is_string( $css ) ) {
			return '';
		}

		// sanitize css content
		$css = wp_strip_all_tags( $css );
		$css = preg_replace('/\bexpression\s*\([^)]*\)/i', '', $css);
		$css = preg_replace('/\bjavascript\s*:/i', '', $css);

		// Only allow URLs from the theme directory
		$theme_uri = preg_quote( get_template_directory_uri(), '/' );
		$css = preg_replace_callback(
			'/url\(\s*[\'"]?\s*(https?:\/\/[^\'")]+)\s*[\'"]?\s*\)/i',
			function( $matches ) use ( $theme_uri ) {
				if ( preg_match( "/^{$theme_uri}/i", $matches[1] ) ) {
					return $matches[0]; // Keep theme URLs
				}
				return 'url("")'; // Remove others
			},
			$css
		);

		// Block unsafe tokens
		$css = preg_replace('/\b(?:eval|mocha)\b(\s*:|\s*\()/i', '/* blocked */$1', $css);

		// Block behavior and vendor-prefixed behavior
		$css = preg_replace('/(?<![a-zA-Z0-9-])(?:-+[a-zA-Z]*behavior|behavior)\b(\s*:|\s*\()/i', '/* blocked */$1', $css);

		// Remove redundant semicolons
		$css = preg_replace('/;+/', ';', $css);

		// Remove empty rule blocks (e.g. ".selector { }")
		$css = preg_replace('/[^{]+\{\s*\}/m', '', $css);

		// Normalize spacing and line breaks
		$css = preg_replace('/\s+/', ' ', $css);
		$css = trim($css);

		return $css;
	}

	function stackable_blocksy_theme_global_styles( $styles ) {

		if ( function_exists( 'blocksy_manager' ) ) {
			$blocksy_css = blocksy_manager()->dynamic_css->load_backend_dynamic_css([
				'echo' => false
			] );

			$styles .= $blocksy_css;
		}

		if ( class_exists( 'Blocksy_Static_Css_Files' ) ) {
			$blocksy_static_files = ( new Blocksy_Static_Css_Files() )->all_static_files();

			$blocksy_static_files = array_filter(
				$blocksy_static_files,
				function( $file ) {
					return isset( $file['id'] ) && in_array( $file['id'], array( 'ct-main-styles', 'ct-stackable-styles' ), true );
				}
			);

			$styles_from_files = '';
			foreach ( $blocksy_static_files as $file ) {
				if ( isset( $file['url'] ) ) {
					// Normalize and validate the path to prevent traversal
					$file_url = ltrim( $file['url'], '/' );
					$file_path = get_template_directory() . '/' . $file_url;
					$file_path = realpath( $file_path );
					$theme_dir = realpath( get_template_directory() );

					// Ensure the resolved path is within the theme directory
					if ( ! $file_path || strpos( $file_path, $theme_dir ) !== 0 ) {
						continue;
					}

					if ( file_exists( $file_path ) && is_readable( $file_path ) ) {
						$extension = strtolower( pathinfo( $file_path, PATHINFO_EXTENSION ) );
						if ( $extension !== 'css' ) {
							continue;
						}
						$content = file_get_contents( $file_path );
						if ( $content !== false ) {
							$styles_from_files .= $content;
						}

					}
				}
			}

			if ( $styles_from_files ) {
				// sanitize styles from files
				$styles_from_files = stackable_sanitize_css_string( $styles_from_files );
				$styles .= $styles_from_files;
			}
		}

		return $styles;
	}

	add_filter( 'stackable.design-library.global-theme-styles', 'stackable_blocksy_theme_global_styles' );
}
