<?php get_header(); ?>

  <!-- ===================== HERO ===================== -->
  <section class="hero">
    <div class="hero-skyline" role="img" aria-hidden="true" style="background-image:url('<?php echo esc_url( get_template_directory_uri() . '/assets/cities/tampa-night.jpg' ); ?>');left:-13px;top:10px;position:absolute;"></div>
    <div class="hero-ring" aria-hidden="true"></div>
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="container">
      <span class="status animate a1"><span class="dot"></span><span>NOW BOOKING</span></span>
      <p class="tagline animate a2">Crystal Clear. Every Time.</p>
      <h1 class="animate a3">Florida &amp; Arizona's Mobile <span class="accent">Windshield</span> Experts</h1>
      <p class="sub animate a4"><b>We come to you.</b> Same-day service. Insurance accepted.</p>
      <div class="hero-cta animate a5">
        <a class="btn btn-primary btn-lg" href="tel:<?php echo esc_attr( mag_phone_tel() ); ?>">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l1.6 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.6V18a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/></svg>
          Call Now
        </a>
        <a class="btn btn-ghost btn-lg" href="<?php echo esc_url( mag_booking_url() ); ?>">
          Schedule Online
          <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
        </a>
      </div>
      <div class="hero-trust animate a6">
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l4 4L19 6"/></svg>Free quotes</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l4 4L19 6"/></svg>Same-day service</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l4 4L19 6"/></svg>Insurance accepted</span>
      </div>
    </div>
  </section>

  <!-- ===================== SERVICES ===================== -->
  <section class="section" id="services">
    <div class="container">
      <div class="section-head center">
        <span class="kicker center reveal">Our Services</span>
        <h2 class="h2 reveal">Precision Auto Glass Services</h2>
        <p class="lead reveal">From rock chips to full replacements &mdash; we handle it all, right in your driveway, with OEM-quality glass and a workmanship guarantee.</p>
      </div>
      <div class="services-grid" id="servicesGrid">

        <article class="service-card reveal" data-num="01" data-service-key="windshield">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8C7 6 17 6 20 8L21 14C21.2 15 20.4 15.8 19.4 15.6 17 15.1 14.6 14.9 12 14.9 9.4 14.9 7 15.1 4.6 15.6 3.6 15.8 2.8 15 3 14L4 8Z"/><path d="M12 6.4V15"/><path d="M6 10.6C9.5 9.6 14.5 9.6 18 10.6"/></svg></span>
          <h3>Windshield Replacement</h3>
          <p>Factory-grade windshield replacement at your door. Expert install, crystal-clear visibility, done right the first time.</p>
        </article>

        <article class="service-card reveal" data-num="02" data-service-key="back-glass">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="6.5" width="17" height="11" rx="2.6"/><path d="M6.5 9.8h11"/><path d="M6.5 12h11"/><path d="M6.5 14.2h11"/></svg></span>
          <h3>Back Glass Replacement</h3>
          <p>Expert back glass replacement at your location. Defroster lines preserved, interior protected, every shard removed.</p>
        </article>

        <article class="service-card reveal" data-num="03" data-service-key="adas">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="7.2"/><circle cx="12" cy="12" r="2.6"/><path d="M12 2.6V6"/><path d="M12 18v3.4"/><path d="M2.6 12H6"/><path d="M18 12h3.4"/></svg></span>
          <h3>ADAS Calibration</h3>
          <p>Don't skip calibration. We recalibrate your vehicle's safety cameras on-site so every driver-assist feature works as intended.</p>
        </article>

      </div>
    </div>
  </section>

  <!-- ===================== WHY CHOOSE US ===================== -->
  <section class="section" id="why">
    <div class="container">
      <div class="section-head center">
        <span class="kicker center reveal">The Difference</span>
        <h2 class="h2 reveal">Why Drivers Trust Us</h2>
      </div>
      <div class="why-grid">

        <div class="why-item reveal">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8h11v8H2z"/><path d="M13 10h4l3 3.2V16h-7z"/><circle cx="7" cy="16.5" r="1.7"/><circle cx="16.4" cy="16.5" r="1.7"/></svg></span>
          <div><h3>We Come To You</h3><p>No shop visit required. Our mobile team comes to you with everything needed for a full replacement.</p></div>
        </div>

        <div class="why-item reveal">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/></svg></span>
          <div><h3>Same Day Service</h3><p>Same-day appointments available. Fast turnaround so you're not off the road longer than you need to be.</p></div>
        </div>

        <div class="why-item reveal">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 2.8v5.2c0 4.4-3 7.4-7 8.9-4-1.5-7-4.5-7-8.9V5.8L12 3Z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/></svg></span>
          <div><h3>Insurance Accepted</h3><p>All major insurance accepted. We handle the claim from start to finish so you don't have to.</p></div>
        </div>

        <div class="why-item reveal">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9.2" r="5.2"/><path d="M9.4 13.3 7.6 20l4.4-2.4L16.4 20l-1.8-6.7"/><path d="M9.8 9.2 11.3 10.7 14.4 7.6"/></svg></span>
          <div><h3>Licensed &amp; Insured</h3><p>Certified, background-checked technicians you can trust with your vehicle.</p></div>
        </div>

      </div>
    </div>
  </section>

  <!-- ===================== INSURANCE LOGO STRIP ===================== -->
  <?php get_template_part('template-parts/insurance-strip'); ?>

  <!-- ===================== TRUST SIGNALS & REVIEWS ===================== -->
  <?php get_template_part('template-parts/trust-reviews'); ?>

  <!-- ===================== FAQ ===================== -->
  <?php get_template_part('template-parts/faq'); ?>

  <!-- ===================== SERVICE AREA ===================== -->
  <section class="section area" id="area">
    <div class="container">
      <div class="section-head center" style="margin-bottom:0">
        <span class="kicker center reveal">Service Area</span>
        <h2 class="h2 reveal">Proudly Serving Florida &amp; Arizona</h2>
        <p class="lead reveal">From the Tampa Bay area to the Phoenix metro, our mobile team is ready to roll out to you.</p>
      </div>
      <div class="area-groups reveal">
        <div class="area-group">
          <span class="area-group-label">Florida</span>
          <div class="chips">
            <a class="chip" href="<?php echo esc_url( home_url('/tampa/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Tampa</a>
            <a class="chip" href="<?php echo esc_url( home_url('/st-petersburg/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>St. Petersburg</a>
            <a class="chip" href="<?php echo esc_url( home_url('/clearwater/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Clearwater</a>
            <a class="chip" href="<?php echo esc_url( home_url('/brandon/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Brandon</a>
            <a class="chip" href="<?php echo esc_url( home_url('/wesley-chapel/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Wesley Chapel</a>
            <span class="chip muted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>&amp; surrounding areas</span>
          </div>
        </div>
        <div class="area-group">
          <span class="area-group-label">Arizona</span>
          <div class="chips">
            <a class="chip" href="<?php echo esc_url( home_url('/phoenix/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Phoenix</a>
            <a class="chip" href="<?php echo esc_url( home_url('/scottsdale/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Scottsdale</a>
            <a class="chip" href="<?php echo esc_url( home_url('/mesa/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Mesa</a>
            <a class="chip" href="<?php echo esc_url( home_url('/tempe/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Tempe</a>
            <a class="chip" href="<?php echo esc_url( home_url('/chandler/') ); ?>"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Chandler</a>
            <span class="chip muted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>&amp; surrounding areas</span>
          </div>
        </div>
      </div>
    </div>
  </section>

<?php get_footer(); ?>
