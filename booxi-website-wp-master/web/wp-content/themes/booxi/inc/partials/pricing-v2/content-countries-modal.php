<?php
/*
 Filename: content-countries-modal.php
 */
?>
<?php global $fieldName; if( have_rows($fieldName) ): ?>
<div class="modal fade bx-modal" id="countries-modal" tabindex="-1" role="dialog" aria-labelledby="countries-modal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <?php while( have_rows($fieldName) ): the_row(); ?>
      <div class="modal-header pb-30 border-0">
        <div class="container-fluid">
          <div class="row">
            <div class="ml-auto text-right bx-line-height-1 p-20" data-dismiss="modal" aria-label="Close">
              <span class="bx-icon bx-icon-20 bx-icon-cross cursor-pointer"></span>
            </div>
          </div>
          <div class="row px-lg-30">
            <div class="col-12 col-lg-6 px-0 pb-30">
              <div class="bx-font-20 text-bx-gray-500 font-weight-bold"><?php the_sub_field('header_top_text'); ?></div>
              <div class="bx-font-40 text-bx-gray-700 font-weight-bold bx-line-height-1 py-lg-0"><?php the_sub_field('header_middle_text'); ?></div>
              <div class="bx-font-20 text-bx-gray-700"><?php the_sub_field('header_bottom_text'); ?></div>
            </div>
            <div class="col-12 col-lg-6 px-0 pb-lg-30 text-lg-right my-auto text-center d-flex d-sm-block flex-column">
              <a class="bx-btn bx-btn-outline-light-grey" href="<?php the_sub_field('button_left_url') ?>"><?php the_sub_field('button_left_text') ?></a>
              <a class="bx-btn bx-btn-blue ml-sm-20 mt-10 mt-sm-0" href="<?php the_sub_field('button_right_url') ?>"><?php the_sub_field('button_right_text') ?></a>
            </div>
          </div>
        </div>
      </div>
      <?php endwhile; ?>
      <?php global $countryCode; $fieldName = 'countries' ; if( have_rows($fieldName) ): ?>
      <div class="modal-body px-lg-15 pt-0 px-0 pb-50 border-dashed-top">
        <div class="container-fluid">
          <div class="row countries">
            <?php while( have_rows($fieldName) ): the_row(); $countryNames = get_sub_field('country_names'); foreach( $countryNames as $country ): ?>
            <?php $selected = false; strtolower($countryCode) == strtolower($country['value']) ? $selected = true : $selected = false; ?>
            <div class="col-12 col-lg-4 px-0">
              <div class="d-flex align-items-center py-10 px-20 cursor-pointer mx-lg-15 bx-hover country<?php echo $selected ? ' active' : ''; ?>" data-value="<?php echo $country['value']; ?>">
                <div class="bx-icon bx-icon-flags bx-icon-flags-<?php echo $country['value'] ?>"></div>
                <div class="px-15 bx-font-20 flex-grow-1 country-name"><?php echo $country['label'] ?></div>
                <div class="bx-icon bx-icon-20 bx-icon-checkmark mr-sm-20 mr-lg-0"></div>
              </div>
            </div>
            <?php endforeach;endwhile; ?>
          </div>
        </div>
      </div>
      <?php endif; ?>
    </div>
  </div>
</div>
<?php endif; ?>