(function () {
    angular.module('app').factory('facebookManager', ['$q', 'httpService', function ($q, httpService) {

        var urlPrefix = 'api/facebook/';
        var appId = '966746760110084';

        var facebookManager =  {
            initPromis: null,
            appId: appId,
            loginStatus: null,
            getLoginStatus: function () {
                _self = this;
                var promise = new Promise(function (resolve, reject) {

                    _self.initPromis.then(function () {
                        if (_self.loginStatus) resolve(_self.loginStatus);

                        try {
                            FB.getLoginStatus(function (response) {
                                _self.loginStatus = response;
                                resolve(response);
                            });
                        } catch (e) {
                            reject(e);
                        };

                    }).catch(function () {
                        reject(e);
                    })
                });

                return promise;
            },
            login: function () {
                var _self = this;

                var promise = new Promise(function (resolve, reject) {
                    try {
                        FB.login(function (response) {
                            resolve(response);
                        }, {
                            scope: _self.allScopes,
                            auth_type: 'rerequest'
                        });
                    } catch (e) {
                        reject(e);
                    };

                });

                return promise;
            },
            allScopes: 'email',
            allFields: 'email',
            getUserInfo: function (token) {
                return;
                var _self = this;
                var data = {
                    fields: _self.allFields
                };
                if (token) data.access_token = token;

                FB.api('/me', data, function (response) {
                        console.log('FACEBOOK ME ENDPOINT >', response);
                        _self.setUserInfo(response);

                    }
                );
            },
            setUserInfo: function (args) {
                return httpService.post({
                    url: urlPrefix,
                    data: args
                });
            }

        };

        

        init();
        function init() {
            var _self = this;
            facebookManager.initPromis = new Promise(function (resolve, reject) {

                try {
                    var js,
                        d = document,
                        s = 'script',
                        id = 'facebook-jssdk',
                        fjs = document.getElementsByTagName(s)[0];
                    if (document.getElementById(id)) return;
                    js = document.createElement(s);
                    js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=" + appId;
                    fjs.parentNode.insertBefore(js, fjs);
                } catch (e) {
                    reject(e);
                };

                window.fbAsyncInit = function () {
                  resolve();
                };
            });
        };

        return facebookManager;

    }]);
}());
