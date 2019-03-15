<?php

if(end(explode("\\", getcwd())) == 'web_pages')
{
    require_once "../web_php/drawLang.php";
    require_once "../web_php/_page_settings.php";
    require_once "../web_php/gen_draw_content.php";
    require_once "../web_php/drawComp/controlBoxclass.php";
}

$BX_PAGE_ID = "everyone_faq";  // <-- Page ID HERE
?>
<!DOCTYPE html>
<html <?php bxLang::drawHTMLLangTag();?> >
<head>
    <title><?php echo bxLang::getMetaTitle($BX_PAGE_ID)?></title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
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

    include "../web_template/header/scripts/css/common_corporate.php";
    include "../web_template/header/scripts/js/common_js_init.php";
    include "../web_template/header/scripts/js/common_corporate_alt2.php";
    ?>

    <link rel="stylesheet" type="text/css" href="/css/legacy_nav_v2.css" />
</head>

<body onclick="utl_input_close_all()">
<?php include "../web_template/components/googleTags.php"; ?>
    <script type="text/javascript">

        <?php
        bxLang::draw_jsPageLangVar();
        bxLang::draw_jsLangSwapCallback($BX_PAGE_ID);
        ?>

        window.coreOnReady = function()
        {
            <?php
                //ControlBar_app::drawJS_initFunctionCall();
            ?>

            __loc__.fnTriggerRootState();
            delete window.coreOnReady;
        };



    </script>
    <div id="faq_all"></div>
    <div style="width:100%; height:6em;"></div>

    <?php
    $faq_content = array(
        array("title" => "faq_gen_title_01", "text" => "faq_gen_text_01"),
        array("title" => "faq_gen_title_02", "text" => "faq_gen_text_02"),
        array("title" => "faq_gen_title_03", "text" => "faq_gen_text_03"),
        array("title" => "faq_gen_title_04", "text" => "faq_gen_text_04"),
    );

    drawFaqBlock("faq_gen_01", $faq_content);

    ?>

    <?php
        ControlBar_app::drawControl_newDesign(0);
        include "../web_template/v2/common/site_footer.php";
    ?>
<?php
include "../web_template/components/end_body_insertion.php";
include "../web_template/components/end_body_trackers.php";
?>
</body>
</html>