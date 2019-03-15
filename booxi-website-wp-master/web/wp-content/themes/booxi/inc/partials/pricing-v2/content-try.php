<?php
/*
 Filename: content-try.php
 */
?>
<?php global $fieldName; if( have_rows($fieldName) ): while( have_rows($fieldName) ): the_row(); ?>
<section class="border-dashed-top bg-bx-gray-100">
  <div class="container pb-80 pt-100 text-center">
    <div class="row text-center">
      <div class="col-xl-12 bx-font-50 font-weight-bold text-bx-gray-500 bx-line-height-1"><?php the_sub_field('title'); ?></div>
    </div>
    <div class="row text-center">
      <div class="col-xl-12 bx-font-20 pt-10 d-flex flex-column d-sm-block">
        <span><?php the_sub_field('subtitle_left'); ?></span><span class="mx-10 border-left d-inline-block h-50"></span><span><?php the_sub_field('subtitle_right'); ?></span>
      </div>
    </div>
    <?php if(get_sub_field('has_button')): ?>
    <div class="row text-center">
      <div class="col-xl-12 text-center pt-30">
        <a href="<?php the_sub_field('button_url'); ?>" class="bx-btn bx-btn-blue"><?php the_sub_field('button_text'); ?></a>
      </div>
    </div>
  </div>
  <?php endif; ?>
</section>
<?php endwhile; endif; ?>