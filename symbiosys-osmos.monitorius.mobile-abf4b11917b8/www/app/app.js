(function () {

    angular.module('app', ['ionic', 'ionic-datepicker', 'angularMoment', 'osmos', 'chart.js', 'rzModule']);

    //PROD = 'prod'
    //PreProd = 'preprod'
    //Local = 'local'
    var environment = 'prod';

    var baseUrl;
    switch (environment) {
        case 'prod':
            baseUrl = 'https://monitorius-api.azurewebsites.net/';
            break;
        case 'dev':
            baseUrl = 'https://monitorius-api-dev.azurewebsites.net/';
            break;
        case 'local':
            baseUrl = 'https://localhost:44397/';
            break;
        default:
            baseUrl = '';
    }

    var tokenName = "monitorius_mobile_token";
    var debug = "local";
    var appType = 'Web';

    angular.module('app').run(['$ionicPlatform', '$state', 'accountManager', function ($ionicPlatform, $state, accountManager) {

            moment.locale('fr');

            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                return accountManager.getUserInfo()
                        .catch(function(){
                            $state.go('login');
                        });

            });
        }])

    angular.module('app').config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, osmosConfigProvider) {

        moment.locale('fr');

        osmosConfigProvider.setAll({
            baseUrl: baseUrl,
            tokenName: tokenName,
            debug: debug,
            appType: appType
        });


        $ionicConfigProvider.views.transition('none');

        $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'app/vcs/menu/menu.html',
            controller: 'menuCtrl as vm'
        })
        .state('login', {
            url: '/login',
            cache: false,
            templateUrl: "app/vcs/account/login/login.html",
            controller: 'loginCtrl as vm'
        })
        .state('forgotPassword', {
            url: '/forgotPassword',
            cache: false,
            templateUrl: "app/vcs/account/forgotPassword/forgotPassword.html",
            controller: 'forgotPasswordCtrl as vm'
        })
        .state('changePassword', {
            url: '/changePassword',
            cache: false,
            templateUrl: "app/vcs/account/changePassword/changePassword.html",
            controller: 'changePasswordCtrl as vm'
        })
        .state('resetPassword', {
            url: '/resetPassword?userId&code',
            cache: false,
            templateUrl: "app/vcs/account/resetPassword/resetPassword.html",
            controller: 'resetPasswordCtrl as vm'
        })
        .state('register', {
            url: '/register',
            cache: false,
            templateUrl: "app/vcs/account/register/register.html",
            controller: 'registerCtrl as vm'
        })
        .state('confirmEmail', {
            url: '/confirmEmail?code&userId',
            cache: false,
            templateUrl: "app/vcs/account/login/login.html",
            controller: 'loginCtrl as vm'
        })

        .state('app.monitoringQuotidien', {
            url: '/monitoringQuotidien?date',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/forms/monitoringQuotidien.html",
                    controller: 'monitoringQuotidienCtrl as vm'
                }
            }
        })
        .state('app.monitoringMatinal', {
            url: '/monitoringMatinal?date',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/forms/monitoringMatinal.html",
                    controller: 'monitoringMatinalCtrl as vm'
                }
            }
        })
        .state('app.home', {
            url: '/dashboard',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/dashboard/dashboard.html",
                    controller: 'dashboardCtrl as vm'
                }
            }
        })
        .state('app.help', {
            url: '/help',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/help/help.html",
                    controller: 'helpCtrl as vm'
                }
            }
        })

        $urlRouterProvider.otherwise('/login');
    });
}());
