<?php
/*
 Filename: content-sms-plans.php
 */
?>
<?php global $fieldName; if( have_rows($fieldName) ): while( have_rows($fieldName) ): the_row(); ?>
<section class="container pb-30">
  <div class="rounded-12-top rounded-12-bottom border overflow-hidden">
    <div class="col-xl-12">
      <div class="row cursor-pointer bg-bx-gray-100">
        <div class="col-10 font-weight-bold bx-font-20 px-20 py-15 d-flex align-items-center">
          <img class="bx-icon bx-icon-20 mr-10" src="<?php the_sub_field('icon');?>" />
          <span><?php the_sub_field('name');?></span>
        </div>
      </div>
      <?php if( have_rows('values') ): ?>
      <div class="row border-top bx-font-18">
        <div class="col-xl-12">
          <div class="row text-center">
            <?php while( have_rows('values') ): the_row(); ?>
            <div class="col-lg-3 col-md-6 mx-auto py-30 flex-column d-flex">
              <div class="<?php if(get_sub_field('is_button')){ echo 'flex-grow-1 ';} ?>flex-column d-flex">
                <?php if(get_sub_field('top_text')): ?>
                <div class="font-weight-bold bx-font-30"><?php the_sub_field('top_text');?></div>
                <?php endif; ?>
                <?php if(get_sub_field('is_button')): ?>
                  <div class="my-auto pt-10">
                    <a href="<?php the_sub_field('button_url'); ?>" class="bx-btn bx-btn-outline-blue"><?php the_sub_field('button_text'); ?></a>
                  </div>
                <?php else: ?>
                <?php $planType = get_sub_field('plan_type'); $priceInfo = getPriceInfo($planType); ?>
                  <div class="pt-10 font-weight-bold bx-font-30 text-bx-blue bx-line-height-1">
                    <div class="position-relative no-select plan-sms-<?php echo strtolower($planType); ?>">
                      <span class="currency-symbol-prefix"><?php if($priceInfo['currencySymbolPrefix']) { echo $priceInfo['currencySymbol']; }; ?></span><span class="bx-font-72 d-inline-block price price-monthly anim-rotateY"><?php echo $priceInfo['annualPrice']; ?></span><span class="bx-font-72 d-inline-block price price-annual anim-rotateY"><?php echo $priceInfo['currencySymbol']; ?></span><span class="currency-symbol-suffix"><?php if(!$priceInfo['currencySymbolPrefix']) { echo $priceInfo['currencySymbol']; }; ?></span>
                      <?php if(get_sub_field('has_price_period')): ?>
                      <div>/<span class="price-period"><?php echo $priceInfo['pricePeriod']; ?></span></div>
                      <?php endif; ?>
                    </div>
                  </div>
                <?php endif; ?>
              </div>
              <?php if(get_sub_field('bottom_text')): ?>
              <div class="pt-30"><?php the_sub_field('bottom_text');?></div>
              <?php endif; ?>
            </div>
            <?php endwhile; ?>
          </div>
        </div>
      </div>
      <?php endif; ?>
    </div>
  </div>
</section>
<?php endwhile; endif; ?>