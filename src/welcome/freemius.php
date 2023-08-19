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
		<div class="s-header-wrap">
			<?php
			Stackable_Welcome_Screen::print_header();
			Stackable_Welcome_Screen::print_premium_button();
			Stackable_Welcome_Screen::print_tabs();
			?>
		</div>
		<h1 aria-hidden="true" class="s-admin-notice-marker"></h1>
		<?php
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
		<div class="s-header-wrap">
			<?php
			Stackable_Welcome_Screen::print_header();
			Stackable_Welcome_Screen::print_premium_button();
			Stackable_Welcome_Screen::print_tabs();
			?>
		</div>
		<h1 aria-hidden="true" class="s-admin-notice-marker"></h1>
		<?php
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
		<div class="s-header-wrap">
			<?php
			Stackable_Welcome_Screen::print_header();
			Stackable_Welcome_Screen::print_premium_button();
			Stackable_Welcome_Screen::print_tabs();
			?>
		</div>
		<h1 aria-hidden="true" class="s-admin-notice-marker"></h1>
		<?php
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
