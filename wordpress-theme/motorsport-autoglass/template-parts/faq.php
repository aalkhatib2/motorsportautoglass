<?php
/**
 * FAQ accordion. Also emits FAQPage JSON-LD so the schema always matches
 * what's actually on the page (the static build's schema block was hand-kept
 * in sync in <head> instead, which is prone to drifting from the answers).
 */
if (!defined('ABSPATH')) exit;
$mag_faqs = array(
	array(
		'q' => 'Will my insurance pay for a windshield replacement?',
		'a' => '<b>Yes, in most cases.</b> If you have comprehensive coverage, windshield damage is usually covered. In some states, glass claims have no deductible, so you may owe nothing. We check your coverage with your insurance company before we start, so you know the cost upfront.',
		'open' => true,
	),
	array(
		'q' => 'Do I need ADAS calibration after a new windshield?',
		'a' => '<b>If your vehicle has driver-assist features, calibration is required.</b> The windshield camera needs to be realigned after replacement so safety systems work the way they should. We take care of it on-site during your appointment.',
	),
	array(
		'q' => 'How does your mobile windshield service work?',
		'a' => "<b>We come to you.</b> You pick the location — home, work, or anywhere in our service area. Our technician arrives with everything needed and completes the replacement on-site. No shop visit and no waiting room.",
	),
	array(
		'q' => 'How long does a windshield replacement take?',
		'a' => "<b>Most jobs take 60–90 minutes.</b> You'll need to wait about an hour afterward before driving so the adhesive can set. We let you know exactly when it's safe. Vehicles that need camera calibration may take an extra 30–60 minutes.",
		'pills' => array('60–90 min install', '~1 hr safe drive-away', '+30–60 min ADAS recal'),
	),
);
?>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    <?php foreach ($mag_faqs as $i => $faq) : ?>
    { "@type": "Question", "name": <?php echo wp_json_encode( wp_strip_all_tags($faq['q']) ); ?>, "acceptedAnswer": { "@type": "Answer", "text": <?php echo wp_json_encode( wp_strip_all_tags($faq['a']) ); ?> } }<?php echo $i < count($mag_faqs) - 1 ? ',' : ''; ?>

    <?php endforeach; ?>
  ]
}
</script>

<section class="section faq" id="faq" aria-labelledby="faq-heading">
  <div class="container">
    <div class="faq-grid">

      <div class="faq-intro reveal">
        <span class="kicker">FAQ</span>
        <h2 class="h2" id="faq-heading">What Every Driver Wants to Know</h2>
        <p class="lead">From insurance and deductibles to ADAS and drive-away time &mdash; here's what drivers ask before they book.</p>
        <a class="quote-call" href="tel:<?php echo esc_attr( mag_phone_tel() ); ?>">
          <span class="qc-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l1.6 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.6V18a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/></svg>
          </span>
          <span>
            <span class="qc-label">Still have a question?</span>
            <span class="qc-num"><?php echo esc_html( mag_phone_display() ); ?></span>
          </span>
        </a>
      </div>

      <div class="faq-list">
        <?php foreach ($mag_faqs as $i => $faq) :
          $is_open = !empty($faq['open']);
          $num = str_pad($i + 1, 2, '0', STR_PAD_LEFT);
        ?>
        <article class="faq-item<?php echo $is_open ? ' is-open' : ''; ?> reveal">
          <h3 class="faq-q-wrap">
            <button class="faq-trigger" id="faq-q-<?php echo esc_attr($i); ?>" type="button" aria-expanded="<?php echo $is_open ? 'true' : 'false'; ?>" aria-controls="faq-a-<?php echo esc_attr($i); ?>">
              <span class="faq-num" aria-hidden="true"><?php echo esc_html($num); ?></span>
              <span class="faq-q"><?php echo esc_html($faq['q']); ?></span>
              <span class="faq-chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
            </button>
          </h3>
          <div class="faq-panel" id="faq-a-<?php echo esc_attr($i); ?>" role="region" aria-labelledby="faq-q-<?php echo esc_attr($i); ?>" aria-hidden="<?php echo $is_open ? 'false' : 'true'; ?>">
            <div>
              <div class="faq-answer">
                <div class="faq-answer-grid">
                  <span class="faq-answer-spacer" aria-hidden="true"><?php echo esc_html($num); ?></span>
                  <div class="faq-answer-body">
                    <div class="faq-answer-rule" aria-hidden="true"></div>
                    <div>
                      <p><?php echo wp_kses_post($faq['a']); ?></p>
                      <?php if (!empty($faq['pills'])) : ?>
                      <div class="faq-pills">
                        <?php foreach ($faq['pills'] as $pill) : ?>
                        <span class="faq-pill"><?php echo esc_html($pill); ?></span>
                        <?php endforeach; ?>
                      </div>
                      <?php endif; ?>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>
