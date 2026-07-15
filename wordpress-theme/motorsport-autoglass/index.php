<?php
/**
 * Fallback template. The site's real templates are front-page.php and
 * page-city.php (per-city landing pages) — this only renders if something
 * doesn't match those.
 */
get_header();
?>
<section class="section">
  <div class="container">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <h1 class="h2"><?php the_title(); ?></h1>
      <div><?php the_content(); ?></div>
    <?php endwhile; endif; ?>
  </div>
</section>
<?php get_footer(); ?>
