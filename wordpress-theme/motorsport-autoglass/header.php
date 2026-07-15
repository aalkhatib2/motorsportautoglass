<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#1A1A1A" />
<meta name="color-scheme" content="dark" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="<?php echo esc_attr( wp_get_document_title() ); ?>" />
<meta property="og:description" content="We come to you. Same-day mobile windshield replacement & auto glass repair across Florida & Arizona. Insurance accepted." />
<meta property="og:image" content="<?php echo esc_url( get_template_directory_uri() . '/assets/logo.png' ); ?>" />

<!-- Favicon (inline SVG, no external file) -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2348CAE4'/%3E%3Cstop offset='1' stop-color='%230096C7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='4' y='4' width='56' height='56' rx='16' fill='%23141414' stroke='url(%23g)' stroke-width='2.6'/%3E%3Cpath d='M17 26c6-3.4 24-3.4 30 0l1.7 10.4c.3 1.7-1.1 3-2.8 2.7-4-.8-8.2-1.1-13.9-1.1s-9.9.3-13.9 1.1c-1.7.3-3.1-1-2.8-2.7L17 26Z' fill='none' stroke='url(%23g)' stroke-width='2.6' stroke-linejoin='round'/%3E%3Cpath d='M24 23l-3.4 14' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round' opacity='.85'/%3E%3C/svg%3E" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Local business structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "name": "Motorsport Autoglass",
  "description": "Mobile windshield replacement and auto glass repair serving the Tampa Bay area in Florida and the Phoenix metro in Arizona.",
  "telephone": "<?php echo esc_js( mag_phone_tel() ); ?>",
  "email": "info@motorsportautoglass.com",
  "logo": "<?php echo esc_url( get_template_directory_uri() . '/assets/logo.png' ); ?>",
  "image": "<?php echo esc_url( get_template_directory_uri() . '/assets/logo.png' ); ?>",
  "priceRange": "$$",
  "slogan": "Crystal Clear. Every Time.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "100",
    "bestRating": "5"
  },
  "areaServed": [
    { "@type": "State", "name": "Florida" },
    { "@type": "City", "name": "Tampa", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "St. Petersburg", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Clearwater", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Brandon", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "City", "name": "Wesley Chapel", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "State", "name": "Arizona" },
    { "@type": "City", "name": "Phoenix", "containedInPlace": { "@type": "State", "name": "Arizona" } },
    { "@type": "City", "name": "Scottsdale", "containedInPlace": { "@type": "State", "name": "Arizona" } },
    { "@type": "City", "name": "Mesa", "containedInPlace": { "@type": "State", "name": "Arizona" } },
    { "@type": "City", "name": "Tempe", "containedInPlace": { "@type": "State", "name": "Arizona" } },
    { "@type": "City", "name": "Chandler", "containedInPlace": { "@type": "State", "name": "Arizona" } }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Auto Glass Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Windshield Replacement" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Back Glass Replacement" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ADAS Calibration" } }
    ]
  }
}
</script>

<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<div class="progress" id="progress" aria-hidden="true"></div>

<!-- ===================== NAVBAR ===================== -->
<header class="nav" id="nav">
  <div class="container">
    <a class="brand" href="<?php echo esc_url( home_url('/') ); ?>">
      <img class="brand-logo brand-logo--light" src="<?php echo esc_url( get_template_directory_uri() . '/assets/logo.png' ); ?>" width="1591" height="858" alt="" aria-hidden="true" />
      <img class="brand-logo brand-logo--dark" src="<?php echo esc_url( get_template_directory_uri() . '/assets/logo-light.png' ); ?>" width="1591" height="858" alt="Motorsport Autoglass" />
    </a>
    <nav class="nav-menu">
      <a href="#services">Services</a>
      <a href="#why">Why Us</a>
      <a href="#trust">Reviews</a>
      <a href="#area">Service Areas</a>
    </nav>
    <nav class="nav-actions">
      <a class="nav-phone" href="tel:<?php echo esc_attr( mag_phone_tel() ); ?>">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l1.6 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.6V18a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/></svg>
        <?php echo esc_html( mag_phone_display() ); ?>
      </a>
      <a class="btn btn-primary" href="<?php echo esc_url( mag_booking_url() ); ?>">Get a Quote</a>
    </nav>
  </div>
</header>

<main id="top">
