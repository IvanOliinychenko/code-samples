angular.module('app', ['ngRoute', 'osmos', 'chart.js']);

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

var tokenName = "frame_mobile_token";
var debug = "local";
var appType = 'Web';


angular.module('app').run(['accountManager', function (accountManager) {
    accountManager.getUserInfo();
}]);


angular.module('app').config(['$routeProvider', 'osmosConfigProvider', 'ChartJsProvider', function ($routeProvider, osmosConfigProvider, ChartJsProvider) {

    moment.locale('fr-ca');

    osmosConfigProvider.setAll({
        baseUrl: baseUrl,
        tokenName: tokenName,
        debug: debug,
        appType: appType
    });

    ChartJsProvider.setOptions({responsive: true });

    $routeProvider
    .when('/home', {
        templateUrl: 'App/vcs/home/home.html',
        controller: 'homeCtrl as vm',
        name: 'Home',
        showHeader: false,
        resolve: {
            userInfo: function ($location, accountManager) {
                return accountManager.getUserInfo().then(function (response) {
                    if (!response) $location.path('login');
                })
            },
        }
    })
    .when('/login', {
        templateUrl: 'app/vcs/account/login/login.html',
        controller: 'loginCtrl as vm',
        name: 'Login',
        showHeader: false,
    })
    .when('/resetPassword', {
        templateUrl: 'app/vcs/account/resetPassword/resetPassword.html',
        controller: 'resetPasswordCtrl as vm',
        name: 'Reset password',
        showHeader: false,
    })
    .when('/changePassword', {
        templateUrl: 'app/vcs/account/changePassword/changePassword.html',
        controller: 'changePasswordCtrl as vm',
        name: 'Change password',
        showHeader: false,
    })
    .when('/athletes', {
        templateUrl: 'app/vcs/athletes/athletes.html',
        controller: 'athletesCtrl as vm',
        name: 'Athletes',
        showHeader: true,
        resolve: {
            userInfo: function ($location, accountManager) {
                return accountManager.getUserInfo().then(function (response) {
                    if (!response) $location.path('login');
                })
            },
        }
    })
    .when('/athlete/:athleteId', {
        templateUrl: 'app/vcs/athlete/athlete.html',
        controller: 'athleteCtrl as vm',
        name: 'Athlete',
        showHeader: true,
        resolve: {
            userInfo: function ($location, accountManager) {
                return accountManager.getUserInfo().then(function (response) {
                    if (!response) $location.path('login');
                })
            },
        }
    })
    .when('/athleteForms/:athleteId', {
        templateUrl: 'app/vcs/athleteForms/athleteForms.html',
        controller: 'athleteFormsCtrl as vm',
        name: 'Athlete forms',
        showHeader: true,
        resolve: {
            userInfo: function ($location, accountManager) {
                return accountManager.getUserInfo().then(function (response) {
                    if (!response) $location.path('login');
                })
            },
        }
    })
    .when('/confirmEmail', {
        templateUrl: 'app/vcs/account/confirmEmail/confirmEmail.html',
        controller: 'confirmEmailCtrl as vm',
        name: 'Email Confirmation',
    })
    .otherwise({
        redirectTo: '/home'
    });

}]);