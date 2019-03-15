<?php
/*
 Filename: content-bar.php
 */
?>
<?php global $fieldName; if( have_rows($fieldName) ): ?>
<section id="pricing-bar" class="bg-bx-white w-100">
  <div class="container position-relative">
    <div class="row text-center bx-font-20 font-weight-bold">
      <div class="col-4 col-lg-3 d-none d-lg-flex pr-0">
        <?php if( have_rows('price_header') ): while( have_rows('price_header') ): the_row(); ?>
        <label class="switch-light bx-switch w-100 align-self-center">
          <input type="checkbox" class="change-billing">
          <span>
            <span class="bx-btn"><?php the_sub_field('price_switcher_annual_text');?></span>
            <span class="bx-btn"><?php the_sub_field('price_switcher_monthly_text');?></span>
            <a></a>
          </span>
        </label>
        <?php endwhile; endif; ?>
      </div>
      <?php $i = 0; while( have_rows($fieldName) ): the_row(); if($i > 0): ?>
      <?php $planType = get_sub_field('plan_type'); $priceInfo = getPriceInfo($planType); ?>
      <div class="col-4 col-lg-3 no-select price-plan plan-<?php echo strtolower($planType); ?> <?php echo get_sub_field('active_initially') ? 'active' : ''; ?>">
        <div class="py-15">
          <?php if(get_sub_field('top_text')): ?>
          <div class="price-plan-name bx-line-height-1 text-bx-gray-600 bx-font-18"><?php the_sub_field('top_text');?></div>
          <?php endif; ?>
          <div class="text-bx-blue d-none d-md-block position-relative bx-line-height-1">
            <span class="currency-symbol-prefix"><?php if($priceInfo['currencySymbolPrefix']) { echo $priceInfo['currencySymbol']; }; ?></span><span class="bx-font-28 d-inline-block price price-monthly anim-rotateY"><?php echo $priceInfo['monthlyPrice']; ?></span><span class="bx-font-28 d-inline-block price price-annual anim-rotateY"><?php echo $priceInfo['annualPrice']; ?></span><span class="currency-symbol-suffix"><?php if(!$priceInfo['currencySymbolPrefix']) { echo $priceInfo['currencySymbol']; }; ?></span><?php if(!empty($priceInfo['pricePeriod'])): ?><span>/<span class="price-period"><?php echo $priceInfo['pricePeriod']; ?></span></span><?php endif; ?><?php if(get_sub_field('has_hint')): ?><span class="bx-icon bx-icon-20 bx-icon-info cursor-pointer ml-10" data-toggle="tooltip" data-placement="top" title="<?php if(the_sub_field('hint_text')); ?>"></span><?php endif; ?>
          </div>
        </div>
        <div class="col-8 mx-auto bg-bx-blue highlight-bar d-xs-block d-lg-none"></div>
      </div>
      <?php endif; $i++; endwhile; ?>
    </div>
  </div>
</section>
<?php endif; ?>