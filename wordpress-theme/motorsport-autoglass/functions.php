<?php
/**
 * Motorsport Autoglass theme setup.
 */

if (!defined('ABSPATH')) exit;

function mag_setup() {
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
}
add_action('after_setup_theme', 'mag_setup');

function mag_enqueue_assets() {
	wp_enqueue_style(
		'mag-style',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get('Version')
	);

	wp_enqueue_style(
		'mag-fonts',
		'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap',
		array(),
		null
	);

	wp_enqueue_script(
		'mag-main',
		get_template_directory_uri() . '/assets/main.js',
		array(),
		filemtime(get_template_directory() . '/assets/main.js'),
		true
	);
}
add_action('wp_enqueue_scripts', 'mag_enqueue_assets');

/**
 * Performance: strip WP overhead this theme doesn't use.
 */
// Emoji detection script + styles (runs on every page, never needed here).
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

function mag_trim_assets() {
	// Block-editor CSS — templates are hand-coded, Gutenberg styles unused.
	wp_dequeue_style('wp-block-library');
	wp_dequeue_style('classic-theme-styles');
	wp_dequeue_style('global-styles');

	// Contact Form 7 loads its CSS/JS on every page; only keep it where a form renders.
	if (!is_page(array('book', 'quote', 'contact'))) {
		wp_dequeue_style('contact-form-7');
		wp_dequeue_script('contact-form-7');
		wp_dequeue_script('swv');
	}
}
add_action('wp_enqueue_scripts', 'mag_trim_assets', 100);

/**
 * Phone number and business constants — single source of truth for templates.
 */
function mag_phone_display() { return '(813) 838-5104'; }
function mag_phone_tel() { return '+18138385104'; }
function mag_booking_url() { return home_url('/book/'); }
