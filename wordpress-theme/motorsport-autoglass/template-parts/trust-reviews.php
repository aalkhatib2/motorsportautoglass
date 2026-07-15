<?php
/**
 * Google rating summary + testimonials. Static real reviews for now —
 * same three used on the original static build. Swap for real per-city
 * reviews later via ACF once Zaid confirms which reviews go where.
 */
if (!defined('ABSPATH')) exit;
$mag_reviews = array(
	array(
		'quote' => 'Steven with Motorsport Autoglass was very professional & pitched me at a gas station after I got a crack in my windshield on my trip from Miami to Tampa. He was very knowledgeable explaining the process, I got scheduled & replaced the same week, and I really appreciated the mobile repair service! Awesome company, awesome guys!',
		'name'  => 'Kailea Decker',
	),
	array(
		'quote' => 'Motorsport AutoGlass exceeded my expectations! Their team was professional, quick, and used top-notch OEM-quality glass for my windshield replacement. The mobile service was super convenient, and they handled my insurance claim seamlessly.',
		'name'  => 'Adam ALJUMAILI',
	),
	array(
		'quote' => "The best windshield Company I ever met. Quick Perfect Adjusted some camera thing on the car, which is great I was told by other companies that would take five hours It's 40 minutes Thank you so much",
		'name'  => 'G P',
	),
);
?>
<section class="section trust" id="trust">
  <div class="container">

    <div class="trust-band reveal">
      <span class="kicker center">Google Reviews</span>
      <h2 class="trust-title">Rated 5.0 by Drivers</h2>
      <div class="rating">
        <div class="rating-top">
          <span class="rating-score" data-count="5.0" data-decimals="1">0.0</span>
          <span class="rating-stars" role="img" aria-label="Rated 5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
        </div>
        <p class="rating-meta">
          <svg class="g-logo" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.55-.2-2.27H12v4.29h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.65z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.07.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09A12 12 0 0 0 12 24z"/>
            <path fill="#FBBC05" d="M5.31 14.31a7.2 7.2 0 0 1 0-4.62V6.6H1.3a12 12 0 0 0 0 10.8z"/>
            <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.43-3.43A11.99 11.99 0 0 0 12 0 12 12 0 0 0 1.3 6.6l4.01 3.09C6.25 6.86 8.89 4.75 12 4.75z"/>
          </svg>
          Based on <strong><span data-count="100">0</span> Google Reviews</strong>
        </p>
        <a class="btn btn-primary" href="https://www.google.com/maps/search/?api=1&amp;query=Motorsport+Autoglass" target="_blank" rel="noopener noreferrer">
          Read our reviews
          <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>

    <div class="reviews-head reveal">
      <span class="kicker center">In Their Words</span>
      <h3 class="reviews-title">What Drivers Are Saying</h3>
    </div>

    <div class="reviews">
      <?php foreach ($mag_reviews as $review) : ?>
        <article class="review-card reveal">
          <span class="review-stars" role="img" aria-label="Rated 5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <p class="review-quote">&#8220;<?php echo esc_html($review['quote']); ?>&#8221;</p>
          <div class="review-by">
            <span class="review-name"><?php echo esc_html($review['name']); ?></span>
            <span class="review-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
              Local Guide
            </span>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
