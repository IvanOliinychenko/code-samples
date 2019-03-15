<?php
/*
 Filename: content-features.php
 */
?>
<?php global $fieldName; if( have_rows($fieldName) ): ?>
<section class="container px-xs-0 pb-20 pt-15" id="features-section">
  <?php $i = 0; while( have_rows($fieldName) ): the_row(); ?>
  <div class="feature-container border-left-0-xs border-right-0-xs no-rounded-xs overflow-hidden">
    <div class="col-xl-12">
      <div class="row feature-group bx-hover cursor-pointer <?php if($i == 0){echo 'collapsed';} ?>" data-toggle="collapse" data-target="#collapse-features-<?php echo $i ?>" aria-expanded="<?php echo $i == 0 ? 'true' : 'false'; ?>" aria-controls="collapse-features-<?php echo $i ?>">
        <div class="col-10 font-weight-bold bx-font-20 px-20 py-15 d-flex align-items-center">
          <img class="bx-icon bx-icon-20 mr-10" src="<?php the_sub_field('icon');?>" />
          <span><?php the_sub_field('name');?></span>
        </div>
        <div class="col-2 d-flex justify-content-end align-self-center">
          <span class="bx-icon bx-icon-20 bx-icon-chevron"></span>
        </div>
      </div>
      <div class="collapse row <?php if($i == 0){echo 'show';} ?>" id="collapse-features-<?php echo $i ?>">
        <?php if( have_rows('values') ): while( have_rows('values') ): the_row(); ?>
        <div class="col-xl-12">
          <div class="row feature-row border-top bx-font-18">
            <div class="col-lg-4 col-9 col-md-10 px-20 py-15">
              <span class="feature-name"><?php the_sub_field('name'); ?><?php if(get_sub_field('has_hint')): ?><span class="bx-icon bx-icon-20 bx-icon-info cursor-pointer ml-10" data-toggle="tooltip" data-placement="top" title="<?php if(the_sub_field('hint_text')); ?>"></span><?php endif; ?></span>
            </div>
            <?php if( have_rows('icon_type') ): $j = 0; while( have_rows('icon_type') ): the_row(); ?>
            <div class="col-lg-1 col-3 col-md-2 d-flex <?php echo $j == 0 ? 'd-flex' : 'offset-lg-2'; ?> justify-content-end align-self-center feature">
            <?php if(get_sub_field('is_text')): ?><span class="font-weight-bold text-bx-blue anim-rotateY"><?php the_sub_field('text'); ?></span>  <?php else: ?><span class="bx-icon bx-icon-20 bx-icon-<?php the_sub_field('icon'); ?> anim-rotateY"></span><?php endif; ?><?php if(get_sub_field('has_hint')): ?><span class="bx-icon bx-icon-20 bx-icon-info cursor-pointer ml-10" data-toggle="tooltip" data-placement="top" title="<?php if(the_sub_field('hint_text')); ?>"></span><?php endif; ?>
            </div>
            <?php $j++; endwhile; endif; ?>
          </div>
        </div>
        <?php endwhile; endif; ?>
      </div>
    </div>
  </div>
  <?php $i++; endwhile; ?>
</section>
<?php endif; ?>