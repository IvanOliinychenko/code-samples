<?php
/*
 Filename: content-cards.php
 */
?>
<?php global $fieldName; if( have_rows($fieldName) ): ?>
  <section class="container pb-20">
    <div class="row">
    <?php while( have_rows($fieldName) ): the_row(); ?>
      <div class="py-30 col-lg-6 col-12">
        <div class="row rounded-12 border py-30 bx-pricing-card h-100 mx-0">
          <div class="col-sm-5 col-12 py-30 text-center">
            <img class="img-fluid" src="<?php the_sub_field('image'); ?>" alt="<?php the_sub_field('image_alt'); ?>" />
          </div>
          <div class="col-sm-7 col-12 py-30">
            <div class="bx-font-30 font-weight-bold bx-line-height-1"><?php the_sub_field('title'); ?></div>
            <div class="pt-20"><?php the_sub_field('text'); ?></div>
          </div>
        </div>
      </div>
      <?php endwhile; ?>
    </div>
  </section>
<?php endif; ?>