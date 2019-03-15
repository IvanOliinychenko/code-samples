<?php
if(end(explode("\\", getcwd())) == 'web_pages')
{
    require_once "../web_php/drawLang.php";
    require_once "../web_php/_page_settings.php";
    require_once "../web_php/gen_draw_content.php";
    require_once "../web_php/drawComp/controlBoxclass.php";
}

$BX_PAGE_ID = "technology";  // <-- Page ID HERE
?>
<!DOCTYPE html>
<html <?php bxLang::drawHTMLLangTag();?>>
<head>
    <title><?php echo bxLang::getMetaTitle($BX_PAGE_ID)?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="msvalidate.01" content="259E429701F098F26DD63884F93A95A7" />
    <?php
    drawMetaRobots();
    bxLang::drawLangMetaCannonical($BX_PAGE_ID);

    include "../web_template/header/viewport_all.php";
    include "../web_template/header/favicon_all.php";
    include "../web_template/header/meta_common_all.php";

    bxLang::drawMetaDescription($BX_PAGE_ID);

    include "../web_template/header/rich_snippet_google.php";
    include "../web_template/header/rich_snippet_facebook.php";
    include "../web_template/header/rich_snippet_twitter.php";
    include "../web_template/components/googleTags_head.php";

    echo '<script src="https://www.booxi.com/api/booknow.js"></script>';
    include "../web_template/header/scripts/css/common_corporate.php";
    include "../web_template/header/scripts/js/common_js_init.php";
    include "../web_template/header/scripts/js/common_corporate_alt2.php";
    ?>

    <link rel="stylesheet" type="text/css" href="/css/page_custom/for_tech.css" />
    <link rel="stylesheet" type="text/css" href="/css/legacy_nav_v2.css" />
</head>

<body onclick="utl_input_close_all()">
<?php include "../web_template/components/googleTags.php"; ?>
<script type="text/javascript">

    function checkCtrlBar()
    {
        setTimeout(hideLBX, 0);
    }

    <?php
    bxLang::draw_jsPageLangVar();
    bxLang::draw_jsLangSwapCallback($BX_PAGE_ID);
    ?>

    window.coreOnReady = function()
    {
        <?php
            //ControlBar_app::drawJS_initFunctionCall();
        ?>

        __gevt__.fnRegister('scroll', trigHideLBX);

        core.fnCheck_isMobile();
        __8trk__.mxpTrack("PV Techno");

        __loc__.fnTriggerRootState();
        delete window.coreOnReady;
    };

    //&nbsp;


    var bnHandler = null;
    window.bxApiInit = function()
    {
        bnHandler = booxiController.configure({apiKey:'2zjqOA6u17hU16Y7I6i89s67m1819JJ5'});
        bnHandler.addingBookingProfile('book-en', {apiKey:'2zjqOA6u17hU16Y7I6i89s67m1819JJ5', language:'eng'});
        bnHandler.addingBookingProfile('book-fr', {apiKey:'6b5G6153SI30M5x244Son603jb64e110', language:'fre'});
    };

    function openBookNow()
    {
        if(bnHandler === null)
            return;

        var bnProfile = 'book-en';

        if(core.defLang == 'fre')
            bnProfile = 'book-fr';

        booxiController.open(bnProfile);
    }
</script>

<div id="overview" class="p_ank"></div>
<div class="cbar W"></div>
<div class="hero_box">
    <div class="hb_inner" data-img="1">
        <div class="crossfade_layer"></div>
        <div class="gradLayer bk_gradV_EE0_EE1"></div>
    </div>
    <div class="hb_content">
        <div class="pgbox hb_content_pad">

            <div class="vcenter ovr_H">
                <div class="vc_inner fnt_col555">
                    <h1 class="nodef lh_SS tx_alg_C ovr_LR_A">
                        <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_01", "tx_type_SS fnt_w7");?>
                    </h1>
                    <div class="sprow1"></div>
                    <h2 class="nodef lh_Sp tx_alg_C ovr_LR_B">
                        <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_02", "tx_type_S");?>
                    </h2>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="bk_gradV_EE_FF br_dash_bot_D9">
    <div class="pgbox">
        <div id="bar_ank"></div>
        <div class="offset_top">
            <div class="bxRel_mxStc">
                <div class="pgb_nr">
                    <!-- href="#content" id_hash="content_api" onclick="fnNavSlide(this);" -->
                    <div class="fbx3 no_ul bxStc_mxRel">
                        <a class="fbx3_bkg bkg_colFFF bx_shadw1" href="#online_marketplace" id_hash="online_marketplace" onclick="fnNavSlide(this);">
                            <div class="W H bkg_hovGrad"></div>
                        </a>
                        <div class="bxRel padB_LR_2e avoid-clicks">
                            <div class="sprow2"></div>
                            <div class="feat_tile_icon bxRel" data-icon-img="directory"></div>
                            <div class="sprow1"></div>
                            <div class="lh_B fnt_col555 fnt_w7 tx_alg_C">
                                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_03", "tx_type_B");?>
                            </div>
                            <div class="vmob">
                                <div class="sprow1"></div>
                                <div class="lh_C fnt_col999 fnt_w3 tx_alg_C">
                                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_04", "tx_type_C");?>
                                </div>
                                <div class="sprow2"></div>
                                <div class="sprow1"></div>
                            </div>
                        </div>
                    </div><!--
                    --><div class="fbx3 no_ul bxStc_mxRel">
                        <a class="fbx3_bkg bkg_colFFF bx_shadw1" href="#appointment_booking" id_hash="appointment_booking" onclick="fnNavSlide(this);">
                            <div class="W H bkg_hovGrad"></div>
                        </a>
                        <div class="bxRel padB_LR_2e avoid-clicks">
                            <div class="sprow2"></div>
                            <div class="feat_tile_icon bxRel" data-icon-img="appointments"></div>
                            <div class="sprow1"></div>
                            <div class="lh_B fnt_col555 fnt_w7 tx_alg_C">
                                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_05", "tx_type_B");?>
                            </div>
                            <div class="vmob">
                                <div class="sprow1"></div>
                                <div class="lh_C fnt_col999 fnt_w3 tx_alg_C">
                                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_06", "tx_type_C");?>
                                </div>
                                <div class="sprow2"></div>
                                <div class="sprow1"></div>
                            </div>
                        </div>
                    </div><!--
                    --><div class="fbx3 no_ul bxStc_mxRel">
                        <a class="fbx3_bkg bkg_colFFF bx_shadw1" href="#appointment_dispatch" id_hash="appointment_dispatch" onclick="fnNavSlide(this);">
                            <div class="W H bkg_hovGrad"></div>
                        </a>
                        <div class="bxRel padB_LR_2e avoid-clicks">
                            <div class="sprow2"></div>
                            <div class="feat_tile_icon bxRel" data-icon-img="dispatch"></div>
                            <div class="sprow1"></div>
                            <div class="lh_B fnt_col555 fnt_w7 tx_alg_C">
                                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_07", "tx_type_B");?>
                            </div>
                            <div class="vmob">
                                <div class="sprow1"></div>
                                <div class="lh_C fnt_col999 fnt_w3 tx_alg_C">
                                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_08", "tx_type_C");?>
                                </div>
                                <div class="sprow2"></div>
                                <div class="sprow1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pgb_nr hmob avoid-clicks">
                    <div class="fbx3">
                        <div class="bxRel padB_LR_2e">
                            <div class="sprow1"></div>
                            <div class="lh_C fnt_col999 fnt_w3 tx_alg_C">
                                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_04", "tx_type_C");?>
                            </div>
                            <div class="sprow2"></div>
                        </div>
                    </div><!--
                --><a class="fbx3">
                        <div class="bxRel padB_LR_2e">
                            <div class="sprow1"></div>
                            <div class="lh_C fnt_col999 fnt_w3 tx_alg_C">
                                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_06", "tx_type_C");?>
                            </div>
                            <div class="sprow2"></div>
                        </div>
                    </a><!--
                --><a class="fbx3">
                        <div class="bxRel padB_LR_2e">
                            <div class="sprow1"></div>
                            <div class="lh_C fnt_col999 fnt_w3 tx_alg_C">
                                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_08", "tx_type_C");?>
                            </div>
                            <div class="sprow2"></div>
                        </div>
                    </a>
                </div>
            </div>

        </div>


        <!-- Slide 0 -->
        <div class="sprow3"></div>
        <div class="sprow3"></div>
        <div class="pgb_nr tx_alg_C padLR_cent_cust">
            <div class="lh_S fnt_col555 fnt_w7 tx_alg_C">
                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_09", "tx_type_S");?>
            </div>
            <div class="sprow2"></div>
            <div class="lh_Sp fnt_col555 fnt_w3 tx_alg_C">
                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_10", "tx_type_S");?>
            </div>
        </div>
        <div class="sprow3"></div>
        <div class="sprow3"></div>
    </div>
    <div class="sprow2"></div>
    <div class="pricing_image"></div>
</div>

<!-- Slide 1 -->
<div id="online_marketplace" class="p_ank"></div>
<div class="feat_section_icon" data-icon-img="directory"></div>
<div class="pgbox br_dash_bot_D9 bk_gradV_FF_F5 hideXY">
    <div class="bxRel">
        <div class="sprow10"></div>
        <div class="pgb_nr bxBorder padLR_cent_cust">
            <div class="lh_S fnt_col555 fnt_w7 tx_alg_C">
                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_11", "tx_type_S");?>
            </div>
            <div class="sprow2"></div>
            <div class="lh_Sp fnt_col555 fnt_w3 tx_alg_C">
                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_12", "tx_type_S");?>
            </div>
        </div>
    </div>

    <div class="sprow3"></div>
    <div class="sprow1"></div>

    <!-- slide area -->

    <div class="pgb_nr bxRel">
        <div class="fbx2 hmob_in">
            <div class="promo_img p_img_1 bxAbs_TB eye_hover" onclick="showLBX('/img/technology/feature_2_preview.png')"></div>
        </div><!--
        --><div class="fbx2 padB_L4 pad_mX">
            <div class="sprow4"></div>
            <div class="W bxRel">
                <div class="bxAbs_TB ico_badge ico_bullet">
                    <div class="inner_badge" data-img="1"></div>
                </div>
                <div class="W bullet_text lh_Bp fnt_col555 tx_alg_L">
                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_13", "tx_type_B");?>
                </div>
            </div>
            <div class="sprow2"></div>
            <div class="W bxRel">
                <div class="bxAbs_TB ico_badge ico_bullet">
                    <div class="inner_badge" data-img="2"></div>
                </div>
                <div class="W bullet_text lh_Bp fnt_col555 tx_alg_L">
                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_14", "tx_type_B");?>
                </div>
            </div>
            <div class="sprow2"></div>
            <div class="W bxRel">
                <div class="bxAbs_TB ico_badge ico_bullet">
                    <div class="inner_badge" data-img="3"></div>
                </div>
                <div class="W bullet_text lh_Bp fnt_col555 tx_alg_L">
                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_15", "tx_type_B");?>
                </div>
            </div>

            <div class="sprow4"></div>
        </div>
        <div class="promo_img_mob vmob p_img_1"></div>
    </div>

    <!-- slide end -->
    <div class="sprow3"></div>
    <div class="sprow3"></div>

    <div class="bxRel_mxStc">
        <div class="pgb_nr">
            <div class="tbx2m1_p2 bxStc_mxRel">
                <a class="tbx2m1_p2_bkg bkg_colFFF bx_shadw1 curPnt" <?php bxLang::utlDrawLinkProps('fordev', '#directory_api')  ?> >
                    <div class="bxAbs_TB box_img_left" data-img="1"></div>
                    <div class="W H bkg_hovGrad"></div>
                </a>
                <div class="sprow3"></div>
                <div class="sprow3"></div>
                <div class="bxRel W box_left avoid-clicks">
                    <div class="lh_Cp fnt_col555 fnt_w7 tx_alg_L">
                        <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_16", "tx_type_C");?>
                    </div>
                    <div class="vmob">
                        <div class="sprow1"></div>
                        <div class="lh_Cp fnt_col999 fnt_w3 tx_alg_L">
                            <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_17", "tx_type_C");?>
                        </div>
                        <div class="sprow3"></div>
                        <div class="sprow3"></div>
                    </div>
                </div>
            </div><!--
            --><div class="tbx2m1_p2 bxStc_mxRel">
                <div class="tbx2m1_p2_bkg bkg_colFFF bx_shadw1">
                    <div class="bxAbs_TB box_book vcenter">
                        <div class="vc_inner tx_alg_R">
                            <?php uieDraw_textButton(array("btn_type" => "green", "bx_lang" => "biz_page_14", "inject"=>'onclick="openBookNow();"')); ?>
                        </div>
                    </div>
                </div>
                <div class="sprow3"></div>
                <div class="sprow3"></div>
                <div class="bxRel W box_right">
                    <div class="lh_Cp fnt_col555 fnt_w7 tx_alg_L">
                        <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_18", "tx_type_C");?>
                    </div>
                    <div class="vmob">
                        <div class="sprow1"></div>
                        <div class="lh_Cp fnt_col999 fnt_w3 tx_alg_L">
                            <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_19", "tx_type_C");?>
                        </div>
                        <div class="sprow3"></div>
                        <div class="sprow3"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pgb_nr bxRel hmob avoid-clicks">
            <div class="tbx2m1_p2 avoid-clicks">
                <div class="sprow1"></div>
                <div class="lh_Cp fnt_col999 fnt_w3 tx_alg_L box_left">
                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_17", "tx_type_C");?>
                </div>
                <div class="sprow3"></div>
                <div class="sprow3"></div>
            </div><!--
            --><div class="tbx2m1_p2">
                <div class="sprow1"></div>
                <div class="lh_Cp fnt_col999 fnt_w3 tx_alg_L box_right">
                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_19", "tx_type_C");?>
                </div>
                <div class="sprow3"></div>
                <div class="sprow3"></div>
            </div>
        </div>
    </div>

    <div class="sprow3"></div>
    <div class="sprow3"></div>
    <div class="sprow3"></div>
</div>

<!-- Slide 2 -->
<div id="appointment_booking" class="p_ank"></div>
<div class="feat_section_icon" data-icon-img="appointments"></div>
<div class="pgbox br_dash_bot_D9 bk_gradV_FF_F5 hideXY">
    <div class="sprow3"></div>
    <div class="sprow3"></div>
    <div class="sprow3"></div>
    <div class="sprow1"></div>
    <div class="pgb_nr padLR_cent_cust">
        <div class="lh_S fnt_col555 fnt_w7 tx_alg_C">
            <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_20", "tx_type_S");?>
        </div>
        <div class="sprow2"></div>
        <div class="lh_Sp fnt_col555 fnt_w3 tx_alg_C">
            <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_21", "tx_type_S");?>
        </div>
    </div>
    <div class="sprow3"></div>
    <div class="sprow3"></div>
    <div class="pgb_nr">
        <div class="fbx3 tx_alg_C">
            <div class="W bxRel img_pad_LR eye_hover" onclick="showLBX('/img/technology/feature_3_a_preview.png')">
                <div class="bkg_radiant"></div>
                <img class="W bxRel" src="/img/technology/feature_3_a.png">
            </div>
            <div class="grad_line"></div>
            <div class="ico_badge badge_offset_A">
                <div class="inner_badge" data-img="2"></div>
            </div>
            <div class="lh_Bp fnt_col555 padB_LR_2e">
                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_22", "tx_type_B");?>
            </div>
            <div class="sprow3 vmob"></div>
            <div class="sprow3 vmob"></div>
        </div><!--
        --><div class="fbx3 tx_alg_C">
            <div class="W bxRel img_pad_LR eye_hover" onclick="showLBX('/img/technology/feature_3_b_preview.png')">
                <div class="bkg_radiant"></div>
                <img class="W bxRel" src="/img/technology/feature_3_b.png">
            </div>
            <div class="grad_line"></div>
            <div class="ico_badge badge_offset_A">
                <div class="inner_badge" data-img="4"></div>
            </div>
            <div class="lh_Bp fnt_col555 padB_LR_2e">
                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_23", "tx_type_B");?>
            </div>
            <div class="sprow3 vmob"></div>
            <div class="sprow3 vmob"></div>
        </div><!--
        --><div class="fbx3 tx_alg_C">
            <div class="W bxRel img_pad_LR eye_hover" onclick="showLBX('/img/technology/feature_3_c_preview.png')">
                <div class="bkg_radiant"></div>
                <img class="W bxRel" src="/img/technology/feature_3_c.png">
            </div>
            <div class="grad_line"></div>
            <div class="ico_badge badge_offset_A">
                <div class="inner_badge" data-img="5"></div>
            </div>
            <div class="lh_Bp fnt_col555 padB_LR_2e">
                <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_24", "tx_type_B");?>
            </div>
            <div class="sprow3 vmob"></div>
            <div class="sprow3 vmob"></div>
        </div>
    </div>

    <div class="sprow3"></div>
    <div class="sprow3"></div>

    <div class="bxRel_mxStc">
        <div class="pgb_nr">
            <div class="tbx2m1_p2 bxStc_mxRel">
                <a class="tbx2m1_p2_bkg bkg_colFFF bx_shadw1 curPnt" <?php bxLang::utlDrawLinkProps('fordev', '#appointment_api')  ?> >
                    <div class="bxAbs_TB box_img_left"></div>
                    <div class="W H bkg_hovGrad"></div>
                </a>
                <div class="sprow3"></div>
                <div class="sprow3"></div>
                <div class="bxRel W box_left avoid-clicks">
                    <div class="lh_C fnt_col555 fnt_w7 tx_alg_L">
                        <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_25", "tx_type_C");?>
                    </div>
                    <div class="vmob">
                        <div class="sprow1"></div>
                        <div class="lh_Cp fnt_col999 fnt_w3 tx_alg_L">
                            <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_26", "tx_type_C");?>
                        </div>
                        <div class="sprow3"></div>
                        <div class="sprow3"></div>
                    </div>
                </div>
            </div><!--
            --><div class="tbx2m1_p2 bxStc_mxRel">
                <div class="tbx2m1_p2_bkg bkg_colFFF bx_shadw1">
                    <div class="bxAbs_TB box_book vcenter">
                        <div class="vc_inner tx_alg_R">
                            <?php uieDraw_textButton(array("btn_type" => "green", "bx_lang" => "biz_page_14", "inject"=>'onclick="openBookNow();"')); ?>
                        </div>
                    </div>
                </div>
                <div class="sprow3"></div>
                <div class="sprow3"></div>
                <div class="bxRel W box_right">
                    <div class="lh_C fnt_col555 fnt_w7 tx_alg_L">
                        <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_27", "tx_type_C");?>
                    </div>
                    <div class="vmob">
                        <div class="sprow1"></div>
                        <div class="lh_Cp fnt_col999 fnt_w3 tx_alg_L">
                            <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_28", "tx_type_C");?>
                        </div>
                        <div class="sprow3"></div>
                        <div class="sprow3"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pgb_nr bxRel hmob avoid-clicks">
            <div class="tbx2m1_p2">
                <div class="sprow1"></div>
                <div class="lh_Cp fnt_col999 fnt_w3 tx_alg_L box_left">
                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_26", "tx_type_C");?>
                </div>
                <div class="sprow3"></div>
                <div class="sprow3"></div>
            </div><!--
            --><div class="tbx2m1_p2">
                <div class="sprow1"></div>
                <div class="lh_Cp fnt_col999 fnt_w3 tx_alg_L box_right">
                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_28", "tx_type_C");?>
                </div>
                <div class="sprow3"></div>
                <div class="sprow3"></div>
            </div>
        </div>
    </div>

    <div class="sprow3"></div>
    <div class="sprow3"></div>
    <div class="sprow3"></div>
</div>


<!-- Slide 3 -->
<div id="appointment_dispatch" class="p_ank"></div>
<div class="feat_section_icon" data-icon-img="dispatch"></div>
<div class="pgbox bk_gradV_FF_F5 hideXY">
    <div class="sprow3"></div>
    <div class="sprow3"></div>
    <div class="sprow3"></div>
    <div class="sprow1"></div>
    <div class="pgb_nr padLR_cent_cust">
        <div class="lh_S fnt_col555 fnt_w7 tx_alg_C">
            <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_29", "tx_type_S");?>
        </div>
        <div class="sprow2"></div>
        <div class="lh_Sp fnt_col555 fnt_w3 tx_alg_C">
            <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_30", "tx_type_S");?>
        </div>
    </div>
    <div class="sprow3"></div>
    <div class="sprow3"></div>

    <!-- add stuff here -->
    <div class="pgb_nr">

        <div class="tbx33_66">
            <div class="W bxRel padB_LR_20p feat4_area eye_hover" onclick="showLBX('/img/technology/feature_4_a_preview.png')">
                <div class="bkg_radiant"></div>
                <div class="feat4_imgwrap hmob">
                    <div class="feat4_imgA"></div>
                </div>
                <img class="W bxRel vmob" src="/img/technology/feature_4_a.png">
            </div>
            <div class="grad_line"></div>
            <div class="padB_LR_2e tx_alg_C">
                <div class="ico_badge badge_offset_B">
                    <div class="inner_badge" data-img="4"></div>
                </div>
                <div class="lh_Bp fnt_col555 tx_alg_C">
                    <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_31", "tx_type_B");?>
                </div>
            </div>
            <div class="sprow3 vmob"></div>
            <div class="sprow3 vmob"></div>
        </div><!--
        --><div class="tbx33_66">
            <div class="W bxRel feat4_area eye_hover" onclick="showLBX('/img/technology/feature_4_b_preview.png')">
                <div class="bkg_radiant"></div>
                <div class="W H bxRel feat4_imgB hmob"></div>
                <img class="W bxRel vmob" src="/img/technology/feature_4_b.png">
            </div>
            <div class="grad_line"></div>
            <div class="W">
                <div class="fbx2x2 padB_LR_2e tx_alg_C">
                    <div class="ico_badge badge_offset_B">
                        <div class="inner_badge" data-img="6"></div>
                    </div>
                    <div class="lh_Bp fnt_col555">
                        <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_32", "tx_type_B");?>
                    </div>
                </div><!--
                --><div class="fbx2x2 padB_LR_2e tx_alg_C">
                    <div class="ico_badge badge_offset_B">
                        <div class="inner_badge" data-img="3"></div>
                    </div>
                    <div class="lh_Bp fnt_col555">
                        <?php bxLang::utlWrpSpanByBxLangClass("tek_gen_33", "tx_type_B");?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="sprow3"></div>
    <div class="sprow3"></div>

    <?php
    uieDraw_footerTile(array(

        array("icon" => "developers", "title" => "ft_a_04", "text" => "ft_b_04", "link" => "fordev"),
        array("icon" => "business", "title" => "ft_a_05", "text" => "ft_b_05", "link" => "business"),
        array("icon" => "partners", "title" => "fp_gen_05", "text" => "ft_b_13", "link" => "associations")

    ));
    ?>
    <div class="sprow5"></div>
</div>




<?php
    ControlBar_app::drawControl_newDesign();
    include "../web_template/v2/common/site_footer.php";
    include "../web_template/components/end_body_insertion.php";
    include "../web_template/components/end_body_trackers.php";
?>

<div id="bx-viewport"></div>
</body>
</html>