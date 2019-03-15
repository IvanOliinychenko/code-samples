<?php
/*
 Filename: content-header.php
 */
$countryName = 'United states';
$currencyShortCode = 'USD';
global $countryCode;

if( have_rows('countries') ){ 
  while( have_rows('countries') ){ 
    the_row();
    foreach( get_sub_field('country_names') as $country ){ 
      if( strtolower($countryCode) == strtolower($country['value'])){
        $countryName = $country['label'];
        $currencyShortCode = get_sub_field('currency_short_code');
      } 
    }
  }
} 
?>
<?php global $fieldName; if( have_rows($fieldName) ): while( have_rows($fieldName) ): the_row(); ?>
<section class="bx-icon-hero-center pt-100 pb-100">
  <div class="container pt-100 pb-20">
    <div class="row">
      <div class="col-xl-12 bx-font-50 text-center font-weight-bold text-bx-gray-700 bx-line-height-1"><?php the_sub_field('title');?></div>
    </div>
    <div class="row">
      <div class="col-xl-4 col-lg-5 col-md-12 offset-xl-3 offset-lg-2 pt-30 d-flex flex-column align-items-center align-items-lg-end">
        <label class="switch-light bx-switch">
            <input type="checkbox" class="change-billing">
            <span>
              <span class="bx-btn"><?php the_sub_field('price_switcher_annual_text'); ?></span>
              <span class="bx-btn"><?php the_sub_field('price_switcher_monthly_text'); ?></span>
              <a></a>
            </span>
        </label>
      </div>
      <div class="col-xl-5 col-lg-2 col-md-12 pt-30 text-center text-lg-left">
        <a href="<?php the_sub_field('button_url');?>" class="bx-btn bx-btn-blue"><?php the_sub_field('button_text');?></a>
      </div>
    </div>
    <div class="row pt-30">
      <div class="col-xl-12 text-center d-flex flex-column d-sm-block">
        <span><span><?php the_sub_field('plan_for'); ?></span> <span id="header-country-name"><?php echo $countryName; ?></span> <span><?php the_sub_field('listed_in'); ?></span> <span id="header-currency-short-code"><?php echo $currencyShortCode; ?></span>. <u class="text-bx-blue cursor-pointer d-block d-sm-inline" data-toggle="modal" data-target="#countries-modal"><?php the_sub_field('change_country_text');?></u></span>
      </div>
    </div>
  </div>
</section>
<?php endwhile;endif; ?>