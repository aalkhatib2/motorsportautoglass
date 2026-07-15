  </main><!-- #top -->

  <!-- ===================== FOOTER ===================== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">

        <div class="foot-col foot-brand">
          <a class="brand" href="<?php echo esc_url( home_url('/') ); ?>">
            <img class="brand-logo" src="<?php echo esc_url( get_template_directory_uri() . '/assets/logo-light.png' ); ?>" width="1591" height="858" alt="Motorsport Autoglass" />
          </a>
          <p class="foot-tag">Mobile auto glass &amp; windshield replacement serving Florida &amp; Arizona. <em>Crystal Clear. Every Time.</em></p>
          <span class="foot-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 2.8v5.2c0 4.4-3 7.4-7 8.9-4-1.5-7-4.5-7-8.9V5.8L12 3Z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/></svg><span>Licensed &amp; Insured &middot; FL &amp; AZ</span></span>
        </div>

        <div class="foot-col">
          <h4>Services</h4>
          <ul class="foot-list">
            <li><a href="#services">Windshield Replacement</a></li>
            <li><a href="#services">Back Glass Replacement</a></li>
            <li><a href="#services">ADAS Calibration</a></li>
          </ul>
        </div>

        <div class="foot-col foot-contact">
          <h4>Contact</h4>
          <ul class="foot-list">
            <li><a href="tel:<?php echo esc_attr( mag_phone_tel() ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l1.6 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.6V18a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/></svg><span class="big"><?php echo esc_html( mag_phone_display() ); ?></span></a></li>
            <li><a href="mailto:info@motorsportautoglass.com"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>info@motorsportautoglass.com</a></li>
            <li><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/></svg>Same-day service available</span></li>
          </ul>
        </div>

      </div>
      <div class="footbar">
        <span>&copy; <span id="year"><?php echo esc_html( date('Y') ); ?></span> Motorsport Autoglass. All rights reserved.</span>
        <span class="cities"><strong>Florida</strong> &mdash; Tampa &middot; St. Petersburg &middot; Clearwater &middot; Brandon &middot; Wesley Chapel &nbsp;&middot;&nbsp; <strong>Arizona</strong> &mdash; Phoenix &middot; Scottsdale &middot; Mesa &middot; Tempe &middot; Chandler</span>
      </div>
    </div>
  </footer>

  <!-- ===================== FLOATING CALL (mobile) ===================== -->
  <a class="fab" id="fab" href="tel:<?php echo esc_attr( mag_phone_tel() ); ?>" aria-label="Call Motorsport Autoglass">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l1.6 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.6V18a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/></svg>
  </a>

<?php wp_footer(); ?>
</body>
</html>
