/*! https://mths.be/base64 v?? by @mathias | MIT license */
(function(root){

    // Detect free variables `exports`.
    var freeExports = typeof exports == 'object' && exports;

    // Detect free variable `module`.
    var freeModule = typeof module == 'object' && module &&
        module.exports == freeExports && module;

    // Detect free variable `global`, from Node.js or Browserified code, and use
    // it as `root`.
    var freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
    }

    /*--------------------------------------------------------------------------*/

    var InvalidCharacterError = function(message) {
        this.message = message;
    };
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';

    var error = function(message) {
        // Note: the error messages used throughout this file match those used by
        // the native `atob`/`btoa` implementation in Chromium.
        throw new InvalidCharacterError(message);
    };

    var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // http://whatwg.org/html/common-microsyntaxes.html#space-character
    var REGEX_SPACE_CHARACTERS = /<%= spaceCharacters %>/g;

    // `decode` is designed to be fully compatible with `atob` as described in the
    // HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
    // The optimized base64-decoding algorithm used is based on @atk’s excellent
    // implementation. https://gist.github.com/atk/1020396
    var decode = function(input) {
        input = String(input)
            .replace(REGEX_SPACE_CHARACTERS, '');
        var length = input.length;
        if (length % 4 == 0) {
            input = input.replace(/==?$/, '');
            length = input.length;
        }
        if (
            length % 4 == 1 ||
                // http://whatwg.org/C#alphanumeric-ascii-characters
                /[^+a-zA-Z0-9/]/.test(input)
            ) {
            error(
                'Invalid character: the string to be decoded is not correctly encoded.'
            );
        }
        var bitCounter = 0;
        var bitStorage;
        var buffer;
        var output = '';
        var position = -1;
        while (++position < length) {
            buffer = TABLE.indexOf(input.charAt(position));
            bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
            // Unless this is the first of a group of 4 characters…
            if (bitCounter++ % 4) {
                // …convert the first 8 bits to a single ASCII character.
                output += String.fromCharCode(
                    0xFF & bitStorage >> (-2 * bitCounter & 6)
                );
            }
        }
        return output;
    };

    // `encode` is designed to be fully compatible with `btoa` as described in the
    // HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
    var encode = function(input) {
        input = String(input);
        if (/[^\0-\xFF]/.test(input)) {
            // Note: no need to special-case astral symbols here, as surrogates are
            // matched, and the input is supposed to only contain ASCII anyway.
            error(
                'The string to be encoded contains characters outside of the ' +
                    'Latin1 range.'
            );
        }
        var padding = input.length % 3;
        var output = '';
        var position = -1;
        var a;
        var b;
        var c;
        var d;
        var buffer;
        // Make sure any padding is handled outside of the loop.
        var length = input.length - padding;

        while (++position < length) {
            // Read three bytes, i.e. 24 bits.
            a = input.charCodeAt(position) << 16;
            b = input.charCodeAt(++position) << 8;
            c = input.charCodeAt(++position);
            buffer = a + b + c;
            // Turn the 24 bits into four chunks of 6 bits each, and append the
            // matching character for each of them to the output.
            output += (
                TABLE.charAt(buffer >> 18 & 0x3F) +
                    TABLE.charAt(buffer >> 12 & 0x3F) +
                    TABLE.charAt(buffer >> 6 & 0x3F) +
                    TABLE.charAt(buffer & 0x3F)
                );
        }

        if (padding == 2) {
            a = input.charCodeAt(position) << 8;
            b = input.charCodeAt(++position);
            buffer = a + b;
            output += (
                TABLE.charAt(buffer >> 10) +
                    TABLE.charAt((buffer >> 4) & 0x3F) +
                    TABLE.charAt((buffer << 2) & 0x3F) +
                    '='
                );
        } else if (padding == 1) {
            buffer = input.charCodeAt(position);
            output += (
                TABLE.charAt(buffer >> 2) +
                    TABLE.charAt((buffer << 4) & 0x3F) +
                    '=='
                );
        }

        return output;
    };

    var bxe_base64 = {
        'encode': encode,
        'decode': decode,
        'version': '<%= version %>'
    };

    root.bxe_base64 = bxe_base64;
}(this));

(function(window, undefined){
    var version = '1.1.3';
    var document = window.document;

    //PRIVATE SCOPE

    //Vars ////////////////////////////////////////////////////
    var global_scope = this;
    var bxe_debug = false;
    var isReady = false;
    var readyBound = false;

    var constW = 960;
    var constH = 575;
    var bxLang = null;

    var dom_book_button = null; //mystery use
    var dom_viewport = null;
    var ext_win = null; // Global variable -- points to new window instance

    var bt_text = {eng: 'Book Now', fre : 'Rendez-vous'};
    var supported_lang = ['eng', 'fre', 'spa', 'por', 'nld'];
    var defText_btnLabel = {eng: 'Book Now', fre : 'Rendez-vous', spa: 'Reservar ahora', por: 'Agende Agora', nld: 'Boek nu'};

    var timer_delay = 15000;
    var loading_timer = null;
    var useExtWin = false; // global config flag to open popup if true
    var isCurrentlyExtWin = false; // bool flag if book now is currently a popup (for mobile exception)

    var bxeWCount = 0;
    var bxeLastKey = null;
    var bxeLastLang = null;

    var regex_url = /((https?:\/\/|ftp:\/\/|www\.|[^\s:=]+@www\.).*?[a-z_\/0-9\-\#=&])(?=(\.|,|;|\?|\!)?("|'|«|»|\[|\s|\r|\n|$))/i;

    var page_referrer = null;
    var url_on_booked = null;
    var url_on_cancel = null;
    var ga_tracking_code = null;

    var postMessageTarget = null;
    var postHandshakeReceived = false;
    var postTargetOrigin = null;
    
    var bookingFlow = null;
    var eventDate = null;

    var targetDomain = 'https://dev-site.booxi.com/';
    //var targetDomain = 'https://site.booxi.com/';
    //var targetDomain = 'http://localhost:9999/';

    var remote_origin = '';
 
    //dev
    var targetServer = 'https://booxi-server.appspot.com/';

    //prod
    //var targetServer = 'https://booxi-api.appspot.com/';

    //Methods /////////////////////////////////////////////////



    //UTIL Methods

    function utlAddSlashes(str)
    {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }

    function utlAsString(val)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            return '';

        return (''+val);
    }

    function utlIsVarString(testVar)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            return false;

        return ( Object.prototype.toString.call( testVar ) === '[object String]' );
    }

    function utlAsInt(val)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            return 0;

        var num = parseInt(val, 10);
        return (isNaN(num)) ? 0 : num;
    }

    function utlAsInt_nullOnNaN(val)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            return null;

        var num = parseInt(val, 10);

        if(isNaN(num))
            return null;

        return  num;
    }

    function utlIsVarObject(testVar)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            return false;

        return ( Object.prototype.toString.call( testVar ) === '[object Object]' );
    }

    function utlIsVarFunction(testVar)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            return false;

        return ( Object.prototype.toString.call( testVar ) === '[object Function]' );
    }

    function utlIsVarDomElement(testVar)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            return false;

        return (testVar instanceof Node);
    }

    function utlEvalAsBool(val)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            return false;

        if(typeof val == "boolean")
            return val;

        if(typeof val == "string")
            return ((''+val).toLowerCase() === 'true');

        return false;
    }

    function utlSmartDecodeJson(val, onFailReturnVal)
    {
        var jsonObj = {};

        if(utlIsVarObject(val) === true)
            return val;

        if((val === undefined) || (val === null) || (val === ''))
        {
            return (onFailReturnVal !== undefined) ? onFailReturnVal : jsonObj;
        }

        if( utlIsVarString(val) !== true )
        {
            return (onFailReturnVal !== undefined) ? onFailReturnVal : val; // in case already parsed
        }

        try { jsonObj = JSON.parse(val); }
        catch (e)
        {
            if(onFailReturnVal !== undefined)
                return onFailReturnVal;
        }

        return jsonObj;
    }

    function utlSmartEncodeJson(val)
    {
        if( utlIsVarString(val) === true )
            return val;

        return JSON.stringify(val);
    }

    function utlLC(str) { return (''+str).toLowerCase(); }
    function utlUC(str) { return (''+str).toUpperCase(); }

    function utlHexStringValidator(val)
    {
        if(utlIsVarString(val) !== true)
            return false;

        var pattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        return pattern.test(val);
    }

    function delegate(scope, func, data)
    {
        if(func === undefined) return function(){};
        return function()
        {
            var args = Array.prototype.slice.apply(arguments).concat(data);
            func.apply(scope, args);
        };
    }

    // ================================================================================================================

    //v2
    function getDefault_btnLabel(useLang)
    {
        if(defText_btnLabel[utlAsString(utlLC(useLang))] !== undefined)
            return defText_btnLabel[utlAsString(utlLC(useLang))];

        return defText_btnLabel.eng;
    }

    //v2
    function invalidateButton_byProfileID(profileID)
    {
        var btList = window.document.getElementsByClassName("bx_bn_button");

        for(var i = 0; i < btList.length; i++)
        {
            if(btList[i].getAttribute('data-bx-prof-id') === profileID)
                btList[i].setAttribute('data-bn-state', 'inactive');
        }
    }

    //v2
    function removeButton_byProfileID(profileID)
    {
        var btList = window.document.getElementsByClassName("bx_bn_button");

        var p;

        for(var i = 0; i < btList.length; i++)
        {
            if(btList[i].getAttribute('data-bx-prof-id') === profileID)
            {
                p = btList[i].parentNode;
                p.removeChild(btList[i])
            }
        }
    }

    //ok
    function fnCreate_bookButtonTarget(ele, setDisabled)
    {
        var dom_book_button = ele;

        var key = ele.getAttribute('data-key');
        var lang_val = ele.getAttribute('data-lang');

        if(validateApiKey((''+key)) === false)
        {
            fnLogToServer('LOG_ERR', 'fnCreate_bookButtonTarget', 'Api Key attribute missing or invalid on button html.');
            log_debug('Error : The book now button no longer has a api key attribute or the key is invalid.');
            return;
        }

        if(lang_val === null)
        {
            log_debug('Warning : The book now button does not have a language attribute. Using default : ' + bxLang);
            lang_val = bxLang;
        }

        if(dom_book_button == null)
        {
            fnLogToServer('LOG_ERR', 'fnCreate_bookButtonTarget', 'Book Now button dom container element is null, the button cannot be activated.');
            log_debug('Error : Book Now button dom container element is null, the button cannot be activated.');
            return;
        }

        var button_label = bt_text[lang_val];

        var keyProp = ' data-key="'+key+'" onclick="bxe_core.clickBMW(this);"';

        if(setDisabled === true)
            keyProp = 'data-key="inactive"';

        var h = '';

        h += '<div class="bxe_book_button" data-lang="'+lang_val+'" '+keyProp+'>';
        h += '<div class="button_inner">';
        h += '<span>'+button_label+'</span>';
        h += '</div>';
        h += '<div class="ico">';
        h += '<div class="ico_inner"></div>';
        h += '</div>';
        h += '</div>';

        dom_book_button.innerHTML = h;
    }

    // new v2 method good
    function genBN_buttonHtml(btnLabel, bnProfile)
    {
        var showIcon = true;

        if(bnProfile.showIcon !== undefined)
            showIcon = utlEvalAsBool(bnProfile.showIcon);

        var profileID = bnProfile.profile_id;

        var use_class = 'bx_bn_button';
        if(showIcon === true)
            use_class += ' use_bx_ico';

        if(bnProfile.customCSS !== undefined)
            use_class += ' ' + bnProfile.customCSS;

        var clickCall = "booxiController.open('"+profileID+"')";

        //useFontColor useBackgroundColor useBorderColor

        var inlineStyle = '';

        if(bnProfile.useFontColor !== undefined)
        {
            if(utlHexStringValidator(bnProfile.useFontColor) === true)
                inlineStyle += 'color: ' + bnProfile.useFontColor + '; ';
        }

        if(bnProfile.useBackgroundColor !== undefined)
        {
            if(utlHexStringValidator(bnProfile.useBackgroundColor) === true)
                inlineStyle += 'background-color: ' + bnProfile.useBackgroundColor + '; ';
        }

        if(bnProfile.useBorderColor !== undefined)
        {
            if(utlHexStringValidator(bnProfile.useBorderColor) === true)
                inlineStyle += 'border: 1px solid ' + bnProfile.useBorderColor + '; ';
        }

        if(inlineStyle.length > 0)
            inlineStyle = 'style="' +inlineStyle+ '"';

        var h = '';
        h += '<div class="'+use_class+'" '+inlineStyle+' data-bx-prof-id="'+profileID+'" onclick="'+clickCall+'">';
        h += btnLabel;
        h += '</div>';

        return h;
    }

    //v2
    function injectBN_buttonByDomID(domID, bnProfile)
    {
        var domTarget = document.getElementById(domID);

        if(domTarget === null)
        {
            log_debug('The element ID : ' + domID + ' cannot be located in the document. The button cannot be created.');
            return;
        }

        if(bnProfile.profile_id === undefined)
        {
            log_debug('Internal error, cannot create button');
            return;
        }

        var useLang = bnProfile.lang || 'eng';
        var uselabel = bxe_core.getButtonLabel_byLang(useLang);

        if(bnProfile.button_label !== undefined)
            uselabel = bnProfile.button_label;


        var btnHtml = genBN_buttonHtml(uselabel, bnProfile);  //bnProfile.profile_id, btn_class
        domTarget.innerHTML = btnHtml;
    }

    function injectBN_buttonByDomEle(domEle, bnProfile)
    {
        if(utlIsVarDomElement(domEle) !== true)
        {
            log_debug('The variable provided is not a valid Document Element object. The button cannot be created.');
            return;
        }

        if(bnProfile.profile_id === undefined)
        {
            log_debug('Internal error, cannot create button');
            return;
        }

        var useLang = bnProfile.lang || 'eng';
        var uselabel = bxe_core.getButtonLabel_byLang(useLang);

        if(bnProfile.button_label !== undefined)
            uselabel = bnProfile.button_label;


        var btnHtml = genBN_buttonHtml(uselabel, bnProfile);  //bnProfile.profile_id, btn_class
        domEle.innerHTML = btnHtml;
    }




    //v2
    function applyBN_clickToButton(domID, profileID)
    {
        var domTarget = document.getElementById(domID);

        if(domTarget === null)
        {
            log_debug('The element ID : ' + domID + ' cannot be located in the document. Cannot apply click behavior');
            return;
        }


        var clickCall = "booxiController.open('"+profileID+"')";

        domTarget.setAttribute('data-bx-prof-id', profileID);


        var btnClick = delegate(booxiController, booxiController.openEvt, [profileID]);

        domTarget.removeEventListener("click", btnClick, false);
        domTarget.addEventListener("click", btnClick, false);

    }

    function validateApiKey(key_value)
    {
        var key = utlAsString(key_value);

        var rgx = /^[A-Za-z0-9]{32}$/;
        return rgx.test(key);
    }

    function validateSingleKeyInstance(key, preWrappedCallback)
    {
        if(validateApiKey(key) !== true)
        {
            if( (preWrappedCallback !== undefined) && (preWrappedCallback !== null) )
                preWrappedCallback(null);

            return;
        }

        var path = targetServer+'php/getMerchant.php';
        var dataStr = 'what=booknow_state&client_type=BWC&apikey='+key;

        fnAjaxReq__ALT(path, dataStr, preWrappedCallback)
    }

    //ok
    function fnCreate_viewport()
    {
        if(useExtWin == true)
            return;

        dom_viewport = document.getElementById('bx-viewport');

        if(dom_viewport === null)
        {
            var vp = document.createElement("DIV");
            vp.id = 'bx-viewport';
            document.body.appendChild(vp);
            dom_viewport = document.getElementById('bx-viewport');
        }

        if(dom_viewport === null)
            useExtWin = true;
    }



    //ok
    function fnAction_displayBookNow()
    {
        if(loading_timer != null)
        {
            clearTimeout(loading_timer);
            loading_timer = null;
        }

        if(dom_viewport === null)
        {
            fnLogToServer('LOG_ERR', 'fnAction_displayBookNow', 'The dom_viewport is null, cannot display book now!');
            log_debug('Warning : The viewport is null, the html viewport element might be missing.');
            return;
        }

        //its an iFrame
        if(isCurrentlyExtWin !== true)
        {
            //Display is iFrame

            dom_viewport.setAttribute('data-is-open', 'true');

            //tell book now to update itself
            var iframe = document.getElementById("bx_bnv_iframe");
            iframe.contentWindow.postMessage("displayActive", targetDomain);
            iframe.style.zIndex = "1";
            iframe.style.zIndex = "auto";
            iframe.style.width = "100%";
        }


    }

    // //  isCurrentlyExtWin, ext_win

    //ok
    function fnAction_closeBookNow_generic()
    {
        if(isCurrentlyExtWin === true)
        {
            if(ext_win !== null)
            {
                ext_win.close();
                ext_win = null;
            }
        }
        else
            dom_viewport.setAttribute('data-is-open', 'false');
    }

    function fnAction_notAvailable()
    {
        fnAction_closeBookNow_generic();
        var noServiceMessage = (bxLang == 'fre') ? 'Service non disponible.' : 'Service not available.';
        alert(noServiceMessage);
    }

    //ok
    function fnAction_closeBookNow_booked(bookingData)
    {
        if(url_on_booked !== null)
        {
            var url = fnBuildRedirectUrl(url_on_booked, bookingData);

            if(isCurrentlyExtWin === true)
                ext_win.location = url;
            else
                window.location = url;
        }
        else
            fnAction_closeBookNow_generic();
    }

    //ok
    function fnAction_closeBookNow(bookingData)
    {
        if(url_on_cancel !== null)
        {
            var url = fnBuildRedirectUrl(url_on_cancel, bookingData);

            if(isCurrentlyExtWin === true)
                ext_win.location = url;
            else
                window.location = url;
        }
        else
            fnAction_closeBookNow_generic();
    }

    function fnBuildRedirectUrl(url, data) {

        if(!url) return '';
        var bookingData = '';
        var urlParts = url.split('?');
        var urlParams = '';
        var buildedUrl = urlParts[0];

        if(data && Object.keys(data).length) {
            bookingData = bxe_base64.encode(JSON.stringify(data));
        }

        if(urlParts[1]) {
            urlParams = urlParts[1];
        }

        if(page_referrer) {
            if(urlParams) urlParams += '&';
            urlParams += 'referrer_url=' + encodeURIComponent(page_referrer);
        }
        
        if(bookingData) {
            if(urlParams) urlParams += '&';
            urlParams += 'booking_data=' + bookingData;
        }

        if(urlParams) {
            buildedUrl += '?' + urlParams;
        }
       
        return buildedUrl;
    }

    function fnLoadingFailure()
    {
        fnAction_closeBookNow_generic();
        var noServiceMessage = (bxLang == 'fre') ? 'Service non disponible.' : 'Service not available.';
        alert(noServiceMessage);
    }

    function fnLoadingTimeout()
    {
        if(isCurrentlyExtWin !== true)
        {
            fnAction_closeBookNow_generic();
            fnLogToServer('LOG_ERR', 'fnLoadingTimeout', 'booxi server failed to respond within the time delay.');
            log_debug('Loading Timeout : the server is taking too long to load book now');
        }
    }

    function fnAjaxReq(path, dataStr, callback)
    {
        var r = new XMLHttpRequest();
        r.onreadystatechange = function()
        {
            if(this.readyState == this.DONE)
            {
                if(this.status == 200 && this.response != null)
                {
                    if( (callback !== undefined) && (callback !== null) )
                        callback.call(global_scope, this.response );
                }
            }
        };

        r.open("POST", path, true);
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        r.send(dataStr);
    }

    function fnAjaxReq__ALT(path, dataStr, callback)
    {
        var r = new XMLHttpRequest();
        r.onreadystatechange = function()
        {
            if(this.readyState == this.DONE)
            {
                if(this.status == 200 && this.response != null)
                {
                    if( (callback !== undefined) && (callback !== null) )
                        callback(this.response);
                }
            }
        };

        r.open("POST", path, true);
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        r.send(dataStr);
    }

    //good
    function fnGenEncodedUrlArgs(bonusArgs)
    {
        var paramNotEmpty = false;
        var baseParam = {};

        if(arguments[0] !== undefined)
        {
            paramNotEmpty = true;
            baseParam = bonusArgs;
        }

        if(page_referrer !== null)
        {
            paramNotEmpty = true;
            baseParam.page_ref = page_referrer;
        }

        if(url_on_booked !== null)
        {
            paramNotEmpty = true;
            baseParam.url_booked = url_on_booked;
        }

        if(url_on_cancel !== null)
        {
            paramNotEmpty = true;
            baseParam.url_cancel = url_on_cancel;
        }

        if(ga_tracking_code !== null)
        {
            paramNotEmpty = true;
            baseParam.ga_tracker = ga_tracking_code;
        }

        //shortcut
        if(paramNotEmpty !== true)
            return null;

        var queryString = bxe_base64.encode(JSON.stringify(baseParam));
        return queryString;
    }
    // debug_logger /////////////////////////////////////////////////////////////////////////////

    function fnLogToServer(priority, method, msg)
    {
        // LOG_EMERG, LOG_ALERT, LOG_CRIT, LOG_ERR, LOG_WARNING, LOG_NOTICE, LOG_INFO, LOG_DEBUG

        var host = window.location.hostname;
        var msgSend = '[host='+host+']: ' + msg;
        var param_str = 'priority='+priority+'&file=bxe_core.js&method='+method+'&msg='+msgSend;
        //fnAjaxReq(targetDomain+"web_php/log.php",param_str, null);
    }

    //ok
    function log_debug(msg)
    {
        if(bxe_debug !== true)
            return;

        console.log('[booxi debug] ' + msg);
    }

    //v2
    function singleKeyValidationHandler(response, labelID)
    {
        var keyValid = true;

        if(response === null)
            keyValid = false;
        else
        {
            var resObj = utlSmartDecodeJson(response, null);
            if(resObj === null)
                keyValid = false;
            else
            {
                if(resObj.booknow_state != "active")
                {
                    keyValid = false;
                }
            }
        }

        if(labelID == 'default_key' )
        {
            bxe_core.defKeyIsValid = keyValid;
            bxe_core.postValidationInit();
        }
        else
        {
            bxe_core.updateKeyStatus_forProfile(labelID, keyValid);
        }
    }

    // POST MESSAGE HANLDERS ------------------

    //ok
    function receiveMessage(evt)
    {
        var responseObj = evt.data;

        pm_evalHandshake(responseObj);

        //Catch Legacy Messages & Ignore
        if(utlIsVarObject(responseObj) === false)
        {
            return;
        }

        bxe_core.postResultHandler(responseObj);
        switch(responseObj.bn_state)
        {
            case "bookReady" :
                //fnAction_displayBookNow();
                //this case is no longer needed, it is handled in post handshake --> pm_evalHandshake()
                break;
            case "bookClose" :
                fnAction_closeBookNow(evt.data.bookingData);
                break;
            case "notAvailable" :
                fnAction_notAvailable(evt.data.bookingData);
                break;
            case "bookClose_booked" :
                fnAction_closeBookNow_booked(evt.data.bookingData);
                break;
        }
    }

    function setAndEnable_postMessaging(target, targetOrigin)
    {
        postTargetOrigin = targetOrigin;
        postMessageTarget = target;
        postHandshakeReceived = false;

        setTimeout(pm_performHandshake, 500);
    }

    function pm_performHandshake()
    {
        if(postMessageTarget === null)
            return;

        if(postHandshakeReceived === false)
        {
            postMessageTarget.postMessage("handshake", postTargetOrigin);
            setTimeout(pm_performHandshake, 1000);
        }
    }

    function pm_evalHandshake(responseMsg)
    {
        if(postHandshakeReceived === true)
            return;

        if(responseMsg == 'handshake_received')
        {
            postHandshakeReceived = true;
            fnAction_displayBookNow();
        }

    }

    //Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('http://192.168.0.208:8080') does not match the recipient window's origin ('http://localhost:15080').

    // PUBLIC SCOPE //////////////////////////////////////////////////////////////////////////////

    var bxe = function()
    {
        this.isReady = false;
        this.handlerObj = null;
        this.bookDefList = {};
        this.callbackOnClose = null;
        this.localized_labels = null;

        this.bxLang = 'eng';
        this.bxZIndex_ovr = null;
        this.defApiKey = null;
        this.defKeyIsValid = false;

        this.default_button_id = null;
        this.create_default_button = true;
        this.defaultCssOverride = null;
        this.defaultShowIcon = true;

        this.defaultFontColor = null;
        this.defaultBackgroundColor = null;
        this.defaultBorderColor = null;
    };

    bxe.prototype.genRandomProfileId = function()
    {
        var base = 'bnt_';
        var profID = null;

        while(profID === null)
        {
            profID = base + Math.floor((Math.random() * 10000) + 1);

            if(this.bookDefList[profID] !== undefined)
                profID = null;
        }

        return profID;
    };

    bxe.prototype.evalBookNowResponseState = function(bnState)
    {
        switch( utlAsString(bnState) )
        {
            case "bookClose" :
                return 'Booking Canceled';
            case "notAvailable" :
                return 'Not Available';
            case "bookClose_booked" :
                return 'Booking Success';
        }

        return 'Not Available';
    };

    bxe.prototype.postResultHandler = function(postData)
    {
        if(this.callbackOnClose === null)
            return;

        // Book Now Opened -- invalid for onClose
        if(postData.bn_state == 'bookReady')
            return;

        var resp = {
            bookingStatus: this.evalBookNowResponseState(postData.bn_state),
            bookingSuccessful: false
        };

        if(resp.bookingStatus == 'Booking Success')
        {
            resp.bookingSuccessful = true;
        }

        if(postData.bookingData !== undefined)
        {
            if(postData.bookingData.bookingId !== undefined)
            {
                resp.bookingId = postData.bookingData.bookingId;
            }

            if(postData.bookingData.eventCalId !== undefined)
            {
                resp.eventCalId = postData.bookingData.eventCalId;
            }

            if(postData.bookingData.bookingType !== undefined)
            {
                resp.bookingType = postData.bookingData.bookingType
            }

            if(postData.bookingData.staffId !== undefined)
            {
                resp.staffId = postData.bookingData.staffId;
            }

            if(postData.bookingData.serviceId !== undefined)
            {
                resp.serviceId = postData.bookingData.serviceId;
            }

            if(postData.bookingData.serviceName !== undefined)
            {
                resp.serviceName = postData.bookingData.serviceName;
            }

            if(postData.bookingData.staffFirstname !== undefined)
            {
                resp.staffFirstname = postData.bookingData.staffFirstname;
            }

            if(postData.bookingData.staffLastname !== undefined)
            {
                resp.staffLastname = postData.bookingData.staffLastname;
            }

            if(postData.bookingData.datetime !== undefined)
            {
                resp.datetime = postData.bookingData.datetime;
            }

            if(postData.bookingData.attendeeCount !== undefined)
            {
                resp.attendeeCount = postData.bookingData.attendeeCount;
            }

            if(postData.bookingData.categoryName !== undefined)
            {
                resp.categoryName = postData.bookingData.categoryName;
            }

            if(postData.bookingData.clientData !== undefined) {
                resp.clientData = postData.bookingData.clientData;
            }
        }

        this.callbackOnClose(resp);
    };

    bxe.prototype.getButtonLabel_byLang = function(lng)
    {
        if(this.localized_labels === null)
        {
            log_debug('Warning -- localized labels are null, using default labels.');
            return getDefault_btnLabel(lng);
        }

        if(this.localized_labels[utlLC(lng)] !== undefined)
            return this.localized_labels[utlLC(lng)];
        else
        {
            log_debug('Warning -- no label defined for lang code : ' + lng + ' reverting to english');
            return this.localized_labels.eng;
        }
    };

    bxe.prototype.validateDefApiKey = function(cfg)
    {
        this.defKeyIsValid = false;

        if( (cfg.apiKey === undefined) || (cfg.apiKey === null) || (cfg.apiKey === '') )
        {
            // Technically not valid, but API key can still be defined on button
            this.defApiKey = null;
            return;
        }

        if(utlIsVarString(cfg.apiKey) !== true)
        {
            log_debug('Critical Error - Configuration setting apiKey has been rejected, this value is required for online booking. The value must be of type string.');
            return;
        }

        this.defApiKey = cfg.apiKey;

        if( validateApiKey(cfg.apiKey) === true)
        {
            this.defKeyIsValid = "TESTING";
            this.authenticateApiKey(this.defApiKey, 'default_key');
        }
        else
            log_debug('Critical Error - Configuration setting apiKey has been rejected, this value is required for online booking. The value did not match the expected pattern, please make sure the value was entered properly.');
    };

    bxe.prototype.authenticateApiKey = function(api_key, labelID)
    {
        validateSingleKeyInstance(api_key, delegate(global_scope, singleKeyValidationHandler, [labelID]));
    };

    bxe.prototype.evalReferrerPage = function()
    {
        page_referrer = document.referrer;
        try
        {
            if(self != top)
                page_referrer = parent.document.referrer;
        }
        catch (e)
        {}
    };

    bxe.prototype.validateBxLangArg = function(lang)
    {
        if(utlIsVarString(lang) !== true)
        {
            log_debug('Warning - Configuration setting language has been rejected, using default value : eng.  The value must be a valid string.');
            return 'eng';
        }

        switch(utlLC(lang))
        {
            case 'en' :
            case 'eng' :
                return 'eng';
            case 'fr' :
            case 'fre' :
                return 'fre';
            case 'es' :
            case 'spa' :
                return 'spa';
            case 'pt' :
            case 'por' :
                return 'por';
            case 'nl' :
            case 'nld' :
                return 'nld';
        }

        log_debug('Warning - Configuration setting language has been rejected, using default value : eng.  The value must be one of the following supported values : eng, fre, spa, por, nld');
        return 'eng';
    };

    bxe.prototype.validateBookingFlow = function(bookingFlow)
    {
        switch(bookingFlow)
        {
            case 'locations' :
                return true;
        }

        log_debug('Warning - Configuration setting bookingFlow has been rejected, "'+bookingFlow+'" is not a valid value. The value must be one of the following supported values : locations');
        return false;
    };

    bxe.prototype.validateEventDate = function(eventDate)
    {
        if(isNaN(Date.parse(eventDate))){   
            log_debug('Warning - event date: "'+eventDate+'" is not a valid date');
            return false;
        };
        return true;
    };

    bxe.prototype.evalLocalizedLabelList = function(obj)
    {
        var tmp = {};
        var cnt = supported_lang.length;

        for(var i = 0; i < cnt; i++)
        {
            if(obj[utlAsString(supported_lang[i])] !== undefined)
                tmp[utlAsString(supported_lang[i])] = obj[utlAsString(supported_lang[i])];
            else
                tmp[utlAsString(supported_lang[i])] = defText_btnLabel[utlAsString(supported_lang[i])];
        }

        this.localized_labels = tmp;
    };

    bxe.prototype.setDefaultButtonLabel = function(label_tx)
    {
        this.localized_labels[utlAsString(this.bxLang)] = label_tx;
    };

    bxe.prototype.evalAndParseConfig = function(cfg)
    {
        this.evalLocalizedLabelList({}); // init default labels
        // PROPERTIES INTERFACE

        // PUBLIC
        if('language' in cfg)
        {
            this.bxLang = this.validateBxLangArg(cfg.language);
        }

        if('timeoutDelay' in cfg)
        {
            var tmpDelay = utlAsInt_nullOnNaN(cfg.timeoutDelay);

            if( (tmpDelay === null) || (tmpDelay < 0) )
            {
                tmpDelay = 0;
                log_debug('Warning - Configuration setting tmpDelay has been rejected, using default timeout. The value must be a positive numeric value.');
            }

            timer_delay = tmpDelay + 10000;
        }

        if('usePopup' in cfg)
        {
            useExtWin = utlEvalAsBool(cfg.usePopup);
        }

        if('redirectUriBooked' in cfg)
        {
            if(regex_url.test(cfg.redirectUriBooked))
                url_on_booked = cfg.redirectUriBooked;
            else
                log_debug('Warning - Configuration setting redirectUriBooked has been rejected, using default timeout. The value must be a a valid url, ex : http://www.google.com');
        }

        if('redirectUriClosed' in cfg)
        {
            if(regex_url.test(cfg.redirectUriClosed))
                url_on_cancel = cfg.redirectUriClosed;
            else
                log_debug('Warning - Configuration setting redirectUriClosed has been rejected, using default timeout. The value must be a a valid url, ex : http://www.google.com');
        }

        if('gaCode' in cfg)
        {
            if(utlIsVarString(cfg.gaCode) === true)
                ga_tracking_code = cfg.gaCode;
            else
                log_debug('Warning - Configuration setting gaCode has been rejected. The value must be a valid string time.');
        }

        if('onClosed' in cfg)
        {
            if(utlIsVarFunction(cfg.onClosed) === true)
                this.callbackOnClose = cfg.onClosed;
            else
                log_debug('Warning - Configuration setting onClosed has been rejected. The value must be a valid type function.');
        }

        if('buttonTargetId' in cfg)
        {
            if(utlIsVarString(cfg.buttonTargetId) === true)
                this.default_button_id = cfg.buttonTargetId;
            else
                log_debug('Warning - Configuration setting buttonTargetId has been rejected. The value must be a valid string time.');
        }

        if('useDefaultButton' in cfg)
        {
            this.create_default_button = utlEvalAsBool(cfg.useDefaultButton);
        }

        if('localizedButtonText' in cfg)
        {
            if(utlIsVarObject(cfg.localizedButtonText) === true)
                this.evalLocalizedLabelList(cfg.localizedButtonText);
            else
            {
                if(utlIsVarString(cfg.localizedButtonText) === true)
                    this.setDefaultButtonLabel(cfg.localizedButtonText);
                else
                    log_debug('Warning - Configuration setting localizedButtonText has been rejected. The value must be a valid object type or string.');
            }
        }

        if('buttonText' in cfg)
        {
            if(utlIsVarString(cfg.buttonText) === true)
                this.setDefaultButtonLabel(cfg.buttonText);
            else
                log_debug('Warning - Configuration setting buttonText has been rejected. The value must be a valid string.');
        }

        if('showIcon' in cfg)
        {
            this.defaultShowIcon = utlEvalAsBool(cfg.showIcon);
        }

        // PRIVATE SETTINGS ------------------------------

        if('iframeZIndex' in cfg)
        {
            var zIndex = utlAsInt_nullOnNaN(cfg.iframeZIndex);
            if(zIndex !== null)
            {
                if(zIndex > 0)
                    this.bxZIndex_ovr = zIndex;
                else
                    log_debug('Warning - Configuration setting iframeZIndex has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Configuration setting iframeZIndex has been rejected. The value must be a positive numeric value');
        }

        if('fontColor' in cfg)
        {
            if(utlHexStringValidator(cfg.fontColor) === true)
                this.defaultFontColor = cfg.fontColor;
            else
            {
                this.defaultFontColor = null;
                log_debug('Warning - Configuration setting fontColor has been rejected. Must be a valid html hex color string, ex: #FFFFF;');
            }
        }

        if('backgroundColor' in cfg)
        {
            if(utlHexStringValidator(cfg.backgroundColor) === true)
                this.defaultBackgroundColor = cfg.backgroundColor;
            else
            {
                this.defaultBackgroundColor = null;
                log_debug('Warning - Configuration setting backgroundColor has been rejected. Must be a valid html hex color string, ex: #FFFFF;');
            }
        }

        if('borderColor' in cfg)
        {
            if(utlHexStringValidator(cfg.borderColor) === true)
                this.defaultBorderColor = cfg.borderColor;
            else
            {
                this.defaultBorderColor = null;
                log_debug('Warning - Configuration setting borderColor has been rejected. Must be a valid html hex color string, ex: #FFFFF;');
            }
        }

        if('cssClass' in cfg)
        {
            if(utlIsVarString(cfg.cssClass) === true)
                this.defaultCssOverride = cfg.cssClass;
            else
                log_debug('Warning - Configuration setting cssClass has been rejected. The value must be a valid string type.');
        }
    };

    bxe.prototype.parseProfileProps = function(defProps)
    {
        var tmpVal = null;
        var tmpObj = {};

        if('apiKey' in defProps)
        {
            if(utlIsVarString(defProps.apiKey) === true)
            {
                if(validateApiKey(defProps.apiKey) === true)
                    tmpObj.api_key = defProps.apiKey;
                else
                    log_debug('Warning - Button setting apiKey has been rejected. The value does not match the expected pattern, please make sure the key was properly entered.');
            }
            else
                log_debug('Warning - Button setting apiKey has been rejected. The value must be a valid string type.');
        }

        if('language' in defProps)
        {
            tmpObj.lang  = this.validateBxLangArg(defProps.language);
        }

        if('buttonText' in defProps)
        {
            if(utlIsVarString(defProps.buttonText) === true)
                tmpObj.button_label = defProps.buttonText;
            else
                log_debug('Warning - Button setting buttonText has been rejected. The value must be a valid string type.');
        }

        if('showIcon' in defProps)
        {
            tmpObj.showIcon  = utlEvalAsBool(defProps.showIcon);
        }

        if('serviceCategoryId' in defProps)
        {
            tmpVal = utlAsInt_nullOnNaN(defProps.serviceCategoryId);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    tmpObj.service_category  = tmpVal;
                else
                    log_debug('Warning - Button setting serviceCategoryId has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Button setting serviceCategoryId has been rejected. The value must be of numeric (int) type.');

        }

        if('serviceId' in defProps)
        {
            tmpVal = utlAsInt_nullOnNaN(defProps.serviceId);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    tmpObj.service  = tmpVal;
                else
                    log_debug('Warning - Button setting serviceId has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Button setting serviceId has been rejected. The value must be of numeric (int) type.');
        }

        if('staffId' in defProps)
        {
            tmpVal = utlAsInt_nullOnNaN(defProps.staffId);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    tmpObj.staff  = tmpVal;
                else
                    log_debug('Warning - Button setting staffId has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Button setting staffId has been rejected. The value must be of numeric (int) type.');
        }

        // NEW - support for group reservation argument
        if('eventCalId' in defProps)
        {
            tmpVal = utlAsInt_nullOnNaN(defProps.eventCalId);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    tmpObj.eventCalId  = tmpVal;
                else
                    log_debug('Warning - Open book setting eventCalId has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Open book setting eventCalId has been rejected. The value must be of numeric (int) type.');
        }

        // NEW - support for attendee count argument
        if('attendeeCount' in defProps)
        {
            tmpVal = utlAsInt_nullOnNaN(defProps.attendeeCount);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    tmpObj.numPeople  = tmpVal;
                else
                    log_debug('Warning - Open book setting attendeeCount has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Open book setting attendeeCount has been rejected. The value must be of numeric (int) type.');
        }

        // NEW - support for store locations
        if('bookingFlow' in defProps)
        {
            if(this.validateBookingFlow(defProps.bookingFlow) === true){
                tmpObj.bookingFlow = defProps.bookingFlow;
            };
        }

        // NEW - support for event date
        if('eventDate' in defProps)
        {
            if(this.validateEventDate(defProps.eventDate) === true){
                tmpObj.eventDate = defProps.eventDate;
            };
        }


        // PRIVATE PROPERTIES -----------------------------------
        if('cssClass' in defProps)
        {
            if(utlIsVarString(defProps.cssClass) === true)
                tmpObj.customCSS  = defProps.cssClass;
            else
                log_debug('Warning - Button setting cssClass has been rejected. The value must be a valid string type.');
        }

        if('fontColor' in defProps)
        {
            if(utlHexStringValidator(defProps.fontColor) === true)
                tmpObj.useFontColor  = defProps.fontColor;
            else
                log_debug('Warning - Button setting fontColor has been rejected. Must be a valid html hex color string, ex: #FFFFF;');
        }

        if('backgroundColor' in defProps)
        {
            if(utlHexStringValidator(defProps.backgroundColor) === true)
                tmpObj.useBackgroundColor  = defProps.backgroundColor;
            else
                log_debug('Warning - Button setting backgroundColor has been rejected. Must be a valid html hex color string, ex: #FFFFF;');
        }

        if('borderColor' in defProps)
        {
            if(utlHexStringValidator(defProps.borderColor) === true)
                tmpObj.useBorderColor  = defProps.borderColor;
            else
                log_debug('Warning - Button setting borderColor has been rejected. Must be a valid html hex color string, ex: #FFFFF;');
        }

        if('clientData' in defProps)
        {
            tmpObj.clientData = defProps.clientData;
        }

        return tmpObj;
    };

    // Exposed Methods
    bxe.prototype.addBookDef = function(idLabel, btnProps)
    {
        if(idLabel == 'default_key' )
        {
            log_debug('Warning -- The label "default_key" is reserved, profile definition was not created.');
            return;
        }

        if(arguments[1] === undefined)
            btnProps = {};

        var defProps = this.parseProfileProps(btnProps);

        if(defProps.lang === undefined)
            defProps.lang = this.bxLang;

        if( (defProps.customCSS === undefined) && (this.defaultCssOverride !== null))
            defProps.customCSS = this.defaultCssOverride;

        if(defProps.showIcon === undefined)
            defProps.showIcon = this.defaultShowIcon;

        if( (defProps.useFontColor === undefined) && (this.defaultFontColor !== null))
            defProps.useFontColor = this.defaultFontColor;

        if( (defProps.useBackgroundColor === undefined) && (this.defaultBackgroundColor !== null))
            defProps.useBackgroundColor = this.defaultBackgroundColor;

        if( (defProps.useBorderColor === undefined) && (this.defaultBorderColor !== null))
            defProps.useBorderColor = this.defaultBorderColor;

        defProps.useDefaultKey = false;
        if(defProps.api_key === undefined)
            defProps.useDefaultKey = true;
        else
        {
            defProps.keyIsValid = false;
            defProps.keyIsValid = "TESTING";
            this.authenticateApiKey(defProps.api_key, idLabel);
        }

        this.bookDefList[utlAsString(idLabel)] = defProps;
    };

    bxe.prototype.createRawButton = function(domID, btnProps)
    {
        if(arguments[1] === undefined)
            btnProps = {};

        var profID = this.genRandomProfileId();
        this.addBookDef(profID, btnProps);
        this.createInjectProfileBN_buttonToDom(domID, profID);
        return profID;
    };

    // new
    bxe.prototype.createRawButton_inDomEle = function(domEle, btnProps)
    {
        if(arguments[1] === undefined)
            btnProps = {};

        var profID = this.genRandomProfileId();
        this.addBookDef(profID, btnProps);
        this.createInjectProfileBN_buttonToDomElement(domEle, profID);
        return profID;
    };

    bxe.prototype.createRawClick  = function(domID, btnProps)
    {
        if(arguments[1] === undefined)
            btnProps = {};

        var profID = this.genRandomProfileId();
        this.addBookDef(profID, btnProps);

        this.applyProfileBN_buttonToDom(domID, profID);
        return profID;
    };

    bxe.prototype.removeBookDef   = function(profileID)
    {
        if(this.bookDefList[utlAsString(profileID)] !== undefined)
            delete this.bookDefList[utlAsString(profileID)];

        removeButton_byProfileID(profileID);
    };

    bxe.prototype.parseOpenCommand = function(bookDefObj, cmdObj)
    {
        if(utlIsVarObject(cmdObj) !== true)
            return bookDefObj;

        var tmpVal = null;
        //customRequest, language, serviceCategoryId, serviceId, staffId

        if('apiKey' in cmdObj)
        {
            bookDefObj.api_key = cmdObj.apiKey;
            bookDefObj.useDefaultKey = false;
        }

        if('customRequest' in cmdObj)
        {
            if(utlIsVarString(cmdObj.customRequest) === true )
            {
                bookDefObj.book_notes = utlAddSlashes(cmdObj.customRequest);
            }
        }

        if('language' in cmdObj)
        {
            tmpVal = this.validateBxLangArg(cmdObj.language);
            if(utlLC(tmpVal) == utlLC(cmdObj.language))
                bookDefObj.lang = tmpVal;
        }

        if('serviceCategoryId' in cmdObj)
        {
            tmpVal = utlAsInt_nullOnNaN(cmdObj.serviceCategoryId);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    bookDefObj.service_category  = tmpVal;
                else
                    log_debug('Warning - Open book setting serviceCategoryId has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Open book setting serviceCategoryId has been rejected. The value must be of numeric (int) type.');

        }

        if('serviceId' in cmdObj)
        {
            tmpVal = utlAsInt_nullOnNaN(cmdObj.serviceId);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    bookDefObj.service  = tmpVal;
                else
                    log_debug('Warning - Open book setting serviceId has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Open book setting serviceId has been rejected. The value must be of numeric (int) type.');
        }

        if('staffId' in cmdObj)
        {
            tmpVal = utlAsInt_nullOnNaN(cmdObj.staffId);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    bookDefObj.staff  = tmpVal;
                else
                    log_debug('Warning - Open book setting staffId has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Open book setting staffId has been rejected. The value must be of numeric (int) type.');
        }

        // NEW - support for group reservation argument
        if('eventCalId' in cmdObj)
        {
            tmpVal = utlAsInt_nullOnNaN(cmdObj.eventCalId);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    bookDefObj.eventCalId  = tmpVal;
                else
                    log_debug('Warning - Open book setting eventCalId has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Open book setting eventCalId has been rejected. The value must be of numeric (int) type.');
        }

        // NEW - support for attendee count argument
        if('attendeeCount' in cmdObj)
        {
            tmpVal = utlAsInt_nullOnNaN(cmdObj.attendeeCount);
            if(tmpVal !== null)
            {
                if(tmpVal > 0)
                    bookDefObj.numPeople  = tmpVal;
                else
                    log_debug('Warning - Open book setting attendeeCount has been rejected. The value must be a positive numeric value');
            }
            else
                log_debug('Warning - Open book setting attendeeCount has been rejected. The value must be of numeric (int) type.');
        }

        // NEW - support for store locations
        if('bookingFlow' in cmdObj)
        {
            if(this.validateBookingFlow(cmdObj.bookingFlow) === true){
                bookDefObj.bookingFlow = cmdObj.bookingFlow;
            };
        }

        // NEW - support for event date
        if('eventDate' in cmdObj)
        {
            if(this.validateEventDate(cmdObj.eventDate) === true){
                bookDefObj.eventDate = cmdObj.eventDate;
            };
        }

        if('clientData' in cmdObj)
        {
            bookDefObj.clientData = cmdObj.clientData
        }

        return bookDefObj;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
    };

    bxe.prototype.executeBookDef  = function(profileID)
    {
        if( (this.bookDefList[utlAsString(profileID)] === undefined) && (profileID != 'default_key'))
        {
            log_debug('The profile id "'+profileID+'" is not defined. Book Now launch terminated.');
            return;
        }

        var key = this.defApiKey;
        var keyValid = this.defKeyIsValid;

        var bookDef = (profileID == 'default_key') ? this.getDefaultAsProfile() : this.bookDefList[utlAsString(profileID)];


        // Custom options on open ////////////////////
        if(arguments[1] !== undefined)
            bookDef = this.parseOpenCommand(bookDef, arguments[1]);

        if( (bookDef.useDefaultKey !== true) || (key === null))
        {
            key = bookDef.api_key;
            keyValid = bookDef.keyIsValid;
        }

        if( (key === null) || (keyValid !== true))
        {
            log_debug('Warning - Configuration setting apiKey has not been defined or button profile api_key is invalid. Custom profile key will be used (if defined)');
            //return;
        }

        var lang = (bookDef.lang !== undefined) ? bookDef.lang : this.bxLang;
        var bookDefArgs = this.parseBookDefSettings(bookDef);
        ////
        if(window.WURFL === undefined)
        {
            bxeLastKey = key;
            bxeLastLang = lang;
            setTimeout(retryBxeLoad, 200);
            fnLogToServer('LOG_WARNING', 'clickBMW', 'WURLF is not defined');
            return;
        }

        isCurrentlyExtWin = useExtWin; //set current window state

        //If mobile open as popup always -- media queries and other factors conflict iframe overlays onb mobile
        if(window.WURFL.is_mobile === true)
            isCurrentlyExtWin = true;

        if(isCurrentlyExtWin === true)
            this.loadBN_extWin(key, lang, bookDefArgs); // open as popup
        else
            this.loadBN_innerWin(key, lang, bookDefArgs); // open as iframe
    };

    bxe.prototype.updateKeyStatus_forProfile = function(profileID, state)
    {
        if(this.bookDefList[utlAsString(profileID)] === undefined)
        {
            log_debug('There is no definition of the id : ' + profileID);
            return;
        }

        this.bookDefList[utlAsString(profileID)].keyIsValid = state;


        if(state === false)
        {
            invalidateButton_byProfileID(profileID);
        }
    };

    // used by booxiController
    bxe.prototype.open = function(id) { this.executeBookDef(id); };

    bxe.prototype.getDefaultAsProfile = function(profileID)
    {
        var tmp = {
            lang: this.bxLang,
            useDefaultKey: true,
            showIcon: this.defaultShowIcon
        };

        if(this.defaultCssOverride !== null)
            tmp.customCSS = this.defaultCssOverride;

        if(this.defaultFontColor !== null)
            tmp.useFontColor = this.defaultFontColor;

        if(this.defaultBackgroundColor !== null)
            tmp.useBackgroundColor = this.defaultBackgroundColor;

        if(this.defaultBorderColor !== null)
            tmp.useBorderColor = this.defaultBorderColor;

        return tmp;
    };

    bxe.prototype.getValidatedProfile = function(profileID)
    {
        if(profileID == 'default_key')
            return this.getDefaultAsProfile();

        if(this.bookDefList[utlAsString(profileID)] === undefined)
        {
            log_debug('There is no definition of the id : ' + profileID);
            return false;
        }

        var bookDef = this.bookDefList[utlAsString(profileID)];

        if(bookDef.keyIsValid === false)
        {
            log_debug('The api key for profile '+profileID+' is invalid. Cannot create button.');
            return false;
        }

        return bookDef;
    };

    bxe.prototype.createInjectProfileBN_buttonToDom = function(domID, profileID)
    {
        var bookDef = this.getValidatedProfile(profileID);
        if(bookDef === false)
            return;

        bookDef.profile_id = profileID;
        injectBN_buttonByDomID(domID, bookDef);
    };

    // new
    bxe.prototype.createInjectProfileBN_buttonToDomElement = function(domEle, profileID)
    {
        var bookDef = this.getValidatedProfile(profileID);
        if(bookDef === false)
            return;

        bookDef.profile_id = profileID;
        injectBN_buttonByDomEle(domEle, bookDef);
    };

    bxe.prototype.applyProfileBN_buttonToDom = function(domID, profileID)
    {
        var bookDef = this.getValidatedProfile(profileID);
        if(bookDef === false)
            return;

        bookDef.profile_id = profileID;
        applyBN_clickToButton(domID, profileID);
    };

    bxe.prototype.parseBookDefSettings = function(obj)
    {
        var bonusArgs = {};

        if(obj.service_category !== undefined)
            bonusArgs.cat_id = obj.service_category;

        if(obj.service !== undefined)
            bonusArgs.sv_id = obj.service;

        if(obj.staff !== undefined)
            bonusArgs.stf_id = obj.staff;

        if(obj.book_notes !== undefined)
            bonusArgs.book_notes = obj.book_notes;

        // NEW for group events
        if(obj.eventCalId !== undefined)
            bonusArgs.cal_id = obj.eventCalId;

        // NEW for num attendees
        if(obj.numPeople !== undefined)
            bonusArgs.numPeople = obj.numPeople;

        // NEW for store locations
        if(obj.bookingFlow !== undefined)
            bonusArgs.bookingFlow = obj.bookingFlow;

        // NEW for event date
        if(obj.eventDate !== undefined)
            bonusArgs.eventDate = obj.eventDate;

            if(obj.clientData !== undefined)
            {
    
                var tmp = {};
    
                if(obj.clientData.clientIsAttendee !== undefined)
                    tmp.host_attend = obj.clientData.clientIsAttendee;
    
                if(obj.clientData.firstname !== undefined)
                    tmp.cfname = obj.clientData.firstname;
    
                if(obj.clientData.lastname !== undefined)
                    tmp.clname = obj.clientData.lastname;
    
                if(obj.clientData.email !== undefined)
                    tmp.cemail = obj.clientData.email;
    
                if(obj.clientData.phone !== undefined)
                    tmp.cphone = obj.clientData.phone;
    
                if(obj.clientData.phoneCC !== undefined)
                    tmp.cphone_cc = obj.clientData.phoneCC;
    
                if(obj.clientData.emailReminder !== undefined)
                    tmp.cpref_email = obj.clientData.emailReminder;
    
                if(obj.clientData.smsReminder !== undefined)
                    tmp.cpref_sms = obj.clientData.smsReminder;
    
                if(obj.clientData.customRequest !== undefined)
                    tmp.cnote = obj.clientData.customRequest;
    
                if(obj.clientData.address !== undefined)
                    tmp.cstreet = obj.clientData.address;
    
                if(obj.clientData.city !== undefined)
                    tmp.ccity = obj.clientData.city;
    
                if(obj.clientData.provState !== undefined)
                    tmp.cstate = obj.clientData.provState;
    
                if(obj.clientData.country !== undefined)
                    tmp.ccountry = obj.clientData.country;
    
                if(obj.clientData.pczip !== undefined)
                    tmp.cpostal = obj.clientData.pczip;
    
                if(obj.clientData.membershipId !== undefined)
                    tmp.cmember_id = obj.clientData.membershipId;
    
                if(obj.clientData.customerId !== undefined)
                    tmp.ccust_id = obj.clientData.customerId;
    
                if(obj.clientData.hideClientForm !== undefined)
                    tmp.b_hide_cform = obj.clientData.hideClientForm;
    
                bonusArgs.cf_data = tmp;
            }
      


        return bonusArgs;
    };

    bxe.prototype.init = function(props)
    {
        //Get the Debug Setting before anything else!!!
        if('enableConsoleLogging' in props)
            bxe_debug = utlEvalAsBool(props.enableConsoleLogging);

        this.validateDefApiKey(props);
        this.evalReferrerPage();
        this.evalAndParseConfig(props);

        fnCreate_viewport();
        this.isReady = true;
    };

    bxe.prototype.postValidationInit = function()
    {
        if(this.defKeyIsValid === false)
        {
            this.invalidateDefaultKeyButton();
            return;
        }

        if(this.default_button_id !== null)
        {
            if(this.create_default_button === true)
                this.createInjectProfileBN_buttonToDom(this.default_button_id, 'default_key');

            //else
            //    this.applyProfileBN_buttonToDom(this.default_button_id, 'default_key');
        }
    };

    bxe.prototype.invalidateDefaultKeyButton = function()
    {
        for(var i in this.bookDefList)
        {
            if(this.bookDefList[i].useDefaultKey === true)
                invalidateButton_byProfileID(i);
        }
    };

    bxe.prototype.getScreenSize = function()
    {
        var e = window, a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        var h = e[ a+'Height'];
        var w = e[ a+'Width' ];

        return {w: w, h: h};
    };

    bxe.prototype.delayLoadCheck = function()
    {
        bxeWCount++;
        if( (window.WURFL === undefined) && (bxeWCount > 5) )
        {
            setTimeout(retryBxeLoad, 200);
            fnLogToServer('LOG_WARNING', 'delayLoadCheck', 'WURLF is not defined');
            log_debug('WURLF is not defined');
            return;
        }

        isCurrentlyExtWin = useExtWin; //set current window state

        //If mobile open as popup always -- media queries and other factors conflict iframe overlays onb mobile
        if(window.WURFL !== undefined)
        {
            if(window.WURFL.is_mobile === true)
                isCurrentlyExtWin = true;
        }

        if(isCurrentlyExtWin === true)
            this.loadBN_extWin(bxeLastKey, bxeLastLang);
        else
            this.loadBN_innerWin(bxeLastKey, bxeLastLang);
    };



    bxe.prototype.loadBN_extWin = function(key, lang)
    {
        if(validateApiKey((''+key)) === false)
        {
            fnLogToServer('LOG_ERR', 'loadBN_extWin', 'The apikey is invalid on call to loadBN_extWin');
            log_debug('The book now button is missing the "data-key" attribute,or the api key used is invalid');
            return;
        }

        var url = targetDomain+'book_v2.html?key='+key+'&lang='+lang+'&remote_origin='+remote_origin;

        var encodedArg = fnGenEncodedUrlArgs();
        if(arguments[2] !== undefined)
            encodedArg = fnGenEncodedUrlArgs(arguments[2]);

        if(encodedArg !== null)
            url += '&cfg=' + encodedArg;

        var screenSize = this.getScreenSize();
        var left = (screenSize.w/2)-(constW/2);
        var top = (screenSize.h/2)-(constH/2);

        var winArgs = 'toolbar=no, location=no, directories=no, status=no, titlebar=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+constW+', height='+constH+', top='+top+', left='+left;

        // ext_win is a global var that servers as a pointer to new window instance
        ext_win = window.open(url, 'booxi', winArgs);

        setAndEnable_postMessaging(ext_win, targetDomain); //handles post messaging first contact with booxi
    };

    bxe.prototype.loadBN_innerWin = function(key, lang)
    {
        if(validateApiKey((''+key)) === false)
        {
            fnLogToServer('LOG_ERR', 'loadBN_innerWin', 'The apikey is invalid on call to loadBN_innerWin');
            log_debug('The book now button is missing the "data-key" attribute,or the api key used is invalid');
            return;
        }

        var url = targetDomain+'book_v2.html?key='+key+'&lang='+lang+'&remote_origin='+remote_origin;

        if(this.bxZIndex_ovr != null)
            dom_viewport.style.zIndex = this.bxZIndex_ovr;

        var encodedArg = fnGenEncodedUrlArgs();
        if(arguments[2] !== undefined)
            encodedArg = fnGenEncodedUrlArgs(arguments[2]);

        if(encodedArg !== null)
            url += '&cfg=' + encodedArg;

        url = encodeURI(url);

        var loader = document.createElement("DIV");
        loader.className = 'loading_bar';
        loader.appendChild( document.createElement("SPAN") );
        var iframe = document.createElement("IFRAME");
        iframe.id = 'bx_bnv_iframe';
        iframe.src = url;
        dom_viewport.innerHTML = '';
        dom_viewport.appendChild(loader);
        dom_viewport.appendChild(iframe);

        dom_viewport.setAttribute('data-is-open', 'loading');
        loading_timer = setTimeout(fnLoadingFailure, timer_delay);

        setAndEnable_postMessaging(iframe.contentWindow, targetDomain); //handles post messaging first contact with booxi
    };

    bxe.prototype.get_version = function()
    {
        console.log('bxe_core version : ' + version);
    };

    // == Private Class =============================
    var bxe_core = new bxe();

    // == Public Accessor ======================================================================================
    var bxHandler = function(){};
    bxHandler.prototype.configure = function(configObj)
    {
        if(bxe_core.handlerObj !== null)
            return bxe_core.handlerObj;
        else
        {
            bxe_core.init(configObj);
            var tmpHandler = generateHandler();
            bxe_core.handlerObj = tmpHandler;
            return tmpHandler;
        }
    };

    bxHandler.prototype.open = function(profID)
    {
        if( (arguments[0] === undefined) || (arguments[0] === null) )
            profID = "default_key";

        if(utlIsVarObject(arguments[1]) === true)
            bxe_core.executeBookDef(profID, arguments[1]);
        else
            bxe_core.executeBookDef(profID);
    };


    bxHandler.prototype.openEvt = function(evt, profID)
    {
        bxe_core.executeBookDef(profID);
    };

    bxHandler.prototype.book = function()
    {
        bxe_core.executeBookDef("default_key");
    };


    // == Anonymous Interface ==================== ========================================  <-----   PUBLIC HANDLER METHODS
    function generateHandler()
    {
        /* ===  HANDLER RESTRICTED SCOPE  === */
        function addBookNowDefinition(idLabel, defObj) { return bxe_core.addBookDef(idLabel, defObj); }
        function removeBookNowDefinition(idLabel) { bxe_core.removeBookDef(idLabel); }
        function runBookNow_byLabel(idLabel) { return bxe_core.executeBookDef(idLabel); }
        function createBN_btn_byID(domID, idLabel) {  bxe_core.createInjectProfileBN_buttonToDom(domID, idLabel); }
        function createBN_rawButton(domID, props) { return bxe_core.createRawButton(domID, props); }
        function applyBN_btn_byID(domID, idLabel) {  bxe_core.applyProfileBN_buttonToDom(domID, idLabel); }
        function createBN_rawClickEvent(domID, props) { bxe_core.createRawClick(domID, props); }

        function createBN_rawButton_domEle(domEle, props) { return bxe_core.createRawButton_inDomEle(domEle, props); }


        // Public Interface
        var bxe_handler = function(){};
        bxe_handler.prototype.addingBookingProfile = function(idLabel, defObj){ return addBookNowDefinition(idLabel, defObj); };
        bxe_handler.prototype.removeBookingProfile = function(idLabel){ removeBookNowDefinition(idLabel); };
        bxe_handler.prototype.openWithBookingProfile = function(idLabel){ return runBookNow_byLabel(idLabel); };
        bxe_handler.prototype.generateButtonByProfile = function(domID, idLabel){ return createBN_btn_byID(domID, idLabel); };
        bxe_handler.prototype.createBookingButton = function(domID, props){ return createBN_rawButton(domID, props); };

        // PRIVATE METHOD
        bxe_handler.prototype.applyBtnClickByProfile = function(domID, idLabel){ return applyBN_btn_byID(domID, idLabel); };
        bxe_handler.prototype.addDefaultBookNowClickHandlerTo = function(domID, props){ createBN_rawClickEvent(domID, props); };

        //new
        bxe_handler.prototype.createBookingButton_domEle = function(domEle, props){ return createBN_rawButton_domEle(domEle, props); };


        return new bxe_handler();
    }

    // addBookProfile  removeBookingProfile  book_byProfile  generateButton_byProfile
    // applyBtnClick_byProfile  applyBtnClick_byProfile  createBookingButton applyBookClick

    window.booxiController = new bxHandler();

    // ON READY ////////////////////////////////////////////////////////////////////////////////////

    //eval if ready
    if( (document.readyState === "interactive") || (document.readyState === "complete") )
    {
        readyBound = true;
        isReady = true;
        DOMReadyCallback();
    }
    else
        document.addEventListener("DOMContentLoaded", readyCheck);

    function readyCheck()
    {
        readyBound = false;
        isReady = false;
        if(document.readyState === "interactive" || document.readyState === "complete")
        {
            readyBound = true;
            isReady = true;
            DOMReadyCallback();
        }
    }

    function retryBxeLoad()
    {
        bxe.delayLoadCheck();
    }

    function DOMReadyCallback()
    {
        remote_origin = window.location.protocol  + "//" + window.location.host;
        window.addEventListener("message", receiveMessage, false);
        log_debug('DOM Ready : Attempting to initialize bxe_core');
        wInit();
    }

    function wInit()
    {
        if(bxe_core.isReady === true)
        {
            fnLogToServer('LOG_WARNING', 'wInit', 'wInit called but bxe_core is already ready.');
            return;
        }

        if(window.bxApiInit !== undefined)
        {
            log_debug('Calling bxApiInit...');
            window.bxApiInit();
        }
        else
        {
            log_debug('Error : bxApiInit is not defined, retrying in 250ms');
            setTimeout(wInit, 250);
        }
   
    }


})(window, undefined);


