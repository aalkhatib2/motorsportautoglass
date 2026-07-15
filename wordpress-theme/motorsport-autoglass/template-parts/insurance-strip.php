<?php
/**
 * Insurance carrier logo marquee. Static — same across every page.
 */
if (!defined('ABSPATH')) exit;
$mag_insurance_logos = array(
	array('file' => 'state-farm.svg',    'w' => 160, 'h' => 28),
	array('file' => 'geico.png',         'w' => 120, 'h' => 40),
	array('file' => 'progressive.png',   'w' => 140, 'h' => 40),
	array('file' => 'allstate.png',      'w' => 100, 'h' => 56),
	array('file' => 'usaa.png',          'w' => 80,  'h' => 56),
	array('file' => 'nationwide.png',    'w' => 120, 'h' => 56),
	array('file' => 'liberty-mutual.png','w' => 150, 'h' => 48, 'card' => true),
	array('file' => 'farmers.png',       'w' => 100, 'h' => 72),
);
?>
<section class="insurance-strip" aria-labelledby="insurance-strip-title">
  <div class="insurance-strip-head">
    <h2 class="insurance-strip-title" id="insurance-strip-title">We Accept All Major Insurance Providers</h2>
    <p class="sr-only">We work with State Farm, GEICO, Progressive, Allstate, USAA, Nationwide, Liberty Mutual, and Farmers Insurance.</p>
  </div>
  <div class="insurance-marquee" aria-hidden="true">
    <div class="insurance-marquee-track">
      <?php
      // Rendered twice back-to-back so the CSS marquee animation loops seamlessly.
      for ($pass = 0; $pass < 2; $pass++) :
        foreach ($mag_insurance_logos as $logo) :
          $class = 'insurance-logo' . (!empty($logo['card']) ? ' insurance-logo--card' : '');
          $src = get_template_directory_uri() . '/assets/insurance/' . $logo['file'];
      ?>
        <div class="<?php echo esc_attr($class); ?>"><img src="<?php echo esc_url($src); ?>" alt="" width="<?php echo esc_attr($logo['w']); ?>" height="<?php echo esc_attr($logo['h']); ?>" loading="lazy" decoding="async"></div>
      <?php
        endforeach;
      endfor;
      ?>
    </div>
  </div>
</section>
