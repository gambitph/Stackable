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