<?php
/**
 * Add our admin page design across the Freemius pages.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Account page.
add_filter( 'fs_templates/account.php_stackable-ultimate-gutenberg-blocks', function( $output ) {
	ob_start();
	?>
	<div class="wrap">
		<?php
		Stackable_Welcome_Screen::print_header( __( 'Stackable Account', STACKABLE_I18N ) );
		Stackable_Welcome_Screen::print_tabs();
		echo $output;
		?>
		</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	return $output;
} );

// Affiliatoin page.
add_filter( 'fs_/forms/affiliation.php_stackable-ultimate-gutenberg-blocks', function( $output ) {
	ob_start();
	?>
	<div class="wrap">
		<?php
		Stackable_Welcome_Screen::print_header( __( 'Become an Affiliate', STACKABLE_I18N ) );
		Stackable_Welcome_Screen::print_tabs();
		echo $output;
		?>
		</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	return $output;
} );

// Contact page.
add_filter( 'fs_templates/contact.php_stackable-ultimate-gutenberg-blocks', function( $output ) {
	ob_start();
	?>
	<div class="wrap">
		<?php
		Stackable_Welcome_Screen::print_header( __( 'Contact Us', STACKABLE_I18N ) );
		Stackable_Welcome_Screen::print_tabs();
		echo $output;
		?>
		</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	return $output;
} );

// Pricing page.
add_filter( 'fs_templates/pricing.php_stackable-ultimate-gutenberg-blocks', function( $output ) {
	ob_start();
	?>
	<div class="wrap">
		<?php
		echo $output;
		?>
		</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	return $output;
} );

// Checkout page.
add_filter( 'fs_templates/checkout.php_stackable-ultimate-gutenberg-blocks', function( $output ) {
	ob_start();
	?>
	<div class="wrap">
		<?php
		echo $output;
		?>
		</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	return $output;
} );
