angular.module('app', ['ngRoute', 'ngCookies', 'ngIdle', 'ngTagsInput', 'ngFileSaver', 'ui.bootstrap', 'rzModule', 'oc.lazyLoad', 'osmos']);

var environment = 'prod';

var baseUrl;

switch (environment) {
    case 'prod':
        baseUrl = 'https://earthly-api.azurewebsites.net/';
        break;
    case 'staging':
        baseUrl = 'https://earthly-api-staging.azurewebsites.net/';
        break;
    case 'local':
        baseUrl = 'https://localhost:44329/';
        break;
    default:
        baseUrl = '';
}

var tokenName = "frame_mobile_token";
var debug = "local";
var appType = 'Web';

angular.module('app').constant('CONFIG', {
    appName: 'Earthly App',
    appVersion: '1.2.71'
})

angular.module('app').config(['$routeProvider', '$ocLazyLoadProvider', 'CONFIG', 'IdleProvider', 'TitleProvider', 'osmosConfigProvider',
    function ($routeProvider, $ocLazyLoadProvider, CONFIG, IdleProvider, TitleProvider, osmosConfigProvider) {

        osmosConfigProvider.setAll({
            baseUrl: baseUrl,
            tokenName: tokenName,
            debug: debug,
            appType: appType
        });

        console.info('CONFIG', CONFIG);

        var versionQS = CONFIG ? '?v=' + CONFIG.appVersion : '';

        $ocLazyLoadProvider.config({
            debug: false,
            modules: [
                {
                    name: 'fakeDataManager',
                    files: ['App/managers/fakeDataManager.js' + versionQS]
                },
                {
                    name: 'accountManager',
                    files: ['App/managers/accountManager.js' + versionQS]
                },
                {
                    name: 'enumsManager',
                    files: ['App/managers/enumsManager.js' + versionQS]
                },
                {
                    name: 'formulasManager',
                    files: ['App/managers/formulasManager.js' + versionQS]
                },
                {
                    name: 'tradeApiManager',
                    files: ['App/managers/tradeApiManager.js' + versionQS]
                },
                {
                    name: 'currencyManager',
                    files: ['App/managers/currencyManager.js' + versionQS]
                },
                {
                    name: 'accountInfoManager',
                    files: ['App/managers/accountInfoManager.js' + versionQS]
                },
                {
                    name: 'stocksManager',
                    files: ['App/managers/stocksManager.js' + versionQS]
                },
                {
                    name: 'performanceManager',
                    files: ['App/managers/performanceManager.js' + versionQS]
                },
                {
                    name: 'delayedActionsManager',
                    files: ['App/managers/delayedActionsManager.js' + versionQS]
                },
                {
                    name: 'fundManager',
                    files: ['App/managers/fundManager.js' + versionQS]
                }]
        });

        IdleProvider.idle(900);
        TitleProvider.enabled(false);

        $routeProvider
            .when('/', {
                redirectTo: "holdings"
            })
            .when('/holdings', {
                templateUrl: 'App/vcs/holdings/holdings.html' + versionQS,
                controller: 'holdingsCtrl as vm',
                name: 'Holdings',
                iconColor: 'ed4d4d', // Red
                iconRef: 'chart-donut',
                showInMenu: true,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/holdings/holdings.js' + versionQS);
                    }
                }
            })
            .when('/socialIdentity', {
                templateUrl: 'App/vcs/socialIdentity/socialIdentity.html' + versionQS,
                controller: 'socialIdentityCtrl as vm',
                name: 'Earthly(DNA)',
                iconColor: '00d848', // Green
                iconRef: 'dna',
                showInMenu: true,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/socialIdentity/socialIdentity.js' + versionQS);
                    }
                }
            })

            .when('/reviseProjection', {
                templateUrl: 'App/vcs/projection/reviseProjection/reviseProjection.html' + versionQS,
                controller: 'reviseProjectionCtrl as vm',
                name: 'Foresight',
                iconColor: 'ff9b00', // Pink
                iconRef: 'eye',
                showInMenu: true,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['App/vcs/projection/reviseProjection/reviseProjection.js' + versionQS, 'App/vcs/projection/projection.js' + versionQS]);
                    }
                }
            })
            .when('/performance', {
                templateUrl: 'App/vcs/performance/performance.html' + versionQS,
                controller: 'performanceCtrl as vm',
                name: 'Performance',
                iconColor: '00abe4', // Blue
                iconRef: 'trending-up',
                showInMenu: true,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/performance/performance.js' + versionQS);
                    }
                }
            })
            .when('/activity', {
                templateUrl: 'App/vcs/activity/activity.html' + versionQS,
                controller: 'activityCtrl as vm',
                name: 'Activity',
                iconColor: 'ae57ca', // Violet
                iconRef: 'view-list',
                showInMenu: true,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/activity/activity.js' + versionQS);
                    }
                }
            })
            .when('/accountInfo', {
                templateUrl: 'App/vcs/accountInfo/accountInfo.html' + versionQS,
                controller: 'accountInfoCtrl as vm',
                name: 'Account info',
                iconColor: '',
                iconRef: '',
                showInMenu: false,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/accountInfo/accountInfo.js' + versionQS);
                    }
                }
            })
            .when('/robinhoodAccount', {
                templateUrl: 'App/vcs/register/robinhoodAccount/robinhoodAccount.html' + versionQS,
                controller: 'robinhoodAccountCtrl as vm',
                name: 'robinhoodAccount',
                iconColor: '',
                iconRef: '',
                showInMenu: false,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/register/robinhoodAccount/robinhoodAccount.js' + versionQS);
                    }
                }
            })
            .when('/createBankRelationship', {
                templateUrl: 'App/vcs/funding/createBankRelationship/createBankRelationship.html' + versionQS,
                controller: 'createBankRelationshipCtrl as vm',
                name: 'CreateBankRelationship',
                iconColor: '',
                iconRef: '',
                showInMenu: false,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/funding/createBankRelationship/createBankRelationship.js' + versionQS);
                    }
                }
            })
            .when('/bankRelationships', {
                templateUrl: 'App/vcs/funding/bankRelationships/bankRelationships.html' + versionQS,
                controller: 'bankRelationshipsCtrl as vm',
                name: 'BankRelationships',
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/funding/bankRelationships/bankRelationships.js' + versionQS);
                    }
                }
            })
            //.when('/verifyMicroDeposits/:id', {
            //    templateUrl: 'App/vcs/funding/verifyMicroDeposits/verifyMicroDeposits.html',
            //    controller: 'verifyMicroDepositsCtrl as vm',
            //    name: 'VerifyMicroDeposits',
            //    iconColor: '',
            //    iconRef: '',
            //    showInMenu: false,
            //    roles: ['User'],
            //    resolve: {
            //        deps: function ($ocLazyLoad) {
            //            return $ocLazyLoad.load('App/vcs/funding/verifyMicroDeposits/verifyMicroDeposits.js');
            //        }
            //    }
            //})
            //funding
            .when('/addFunds', {
                templateUrl: 'App/vcs/funding/addFunds/addFunds.html' + versionQS,
                controller: 'addFundsCtrl as vm',
                name: 'Funding',
                iconColor: 'fef048', // Yellow
                iconRef: 'download',
                showInMenu: true,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/funding/addFunds/addFunds.js' + versionQS);
                    }
                }
            })
            .when('/transfers', {
                templateUrl: 'App/vcs/funding/transfers/transfers.html' + versionQS,
                controller: 'transfersCtrl as vm',
                showInMenu: false,
                roles: ['User'],
                reloadOnSearch: false,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/funding/transfers/transfers.js' + versionQS);
                    }
                }
            })
            .when('/withdrawFunds', {
                templateUrl: 'App/vcs/funding/withdrawFunds/withdrawFunds.html' + versionQS,
                controller: 'withdrawFundsCtrl as vm',
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/funding/withdrawFunds/withdrawFunds.js' + versionQS);
                    }
                }
            })
            .when('/totalReturnDetails', {
                templateUrl: 'App/vcs/totalReturnDetails/totalReturnDetails.html' + versionQS,
                controller: 'totalReturnDetailsCtrl as vm',
                name: 'totalReturnDetails',
                iconColor: '',
                iconRef: '',
                showInMenu: false,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/totalReturnDetails/totalReturnDetails.js' + versionQS);
                    }
                }
            })
            .when('/performanceDetails', {
                templateUrl: 'App/vcs/performanceDetails/performanceDetails.html' + versionQS,
                controller: 'performanceDetailsCtrl as vm',
                name: 'performanceDetails',
                iconColor: '',
                iconRef: '',
                showInMenu: false,
                roles: ['User'],
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/performanceDetails/performanceDetails.js' + versionQS);
                    }
                }
            })
            // Public

            .when('/tests', {
                templateUrl: 'App/vcs/tests/tests.html' + versionQS,
                controller: 'testsCtrl as vm',
                public: true,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/tests/tests.js' + versionQS);
                    }
                }
            })

            .when('/login', {
                templateUrl: 'App/vcs/login/login.html' + versionQS,
                controller: 'loginCtrl as vm',
                name: 'Login',
                iconColor: '',
                iconRef: '',
                public: true,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/login/login.js' + versionQS);
                    }
                }
            })
            .when('/register', {
                templateUrl: 'App/vcs/register/register.html' + versionQS,
                controller: 'registerCtrl as vm',
                name: 'Register',
                iconColor: '',
                iconRef: '',
                public: true,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/register/register.js' + versionQS);
                    }
                    //redirect: function (startupManager) {
                    //    //startupManager.logout('/riskSurvey/1');
                    //    startupManager.logout('/login');
                    //}

                }
            })
            .when('/surveys', {
                redirectTo: "riskSurvey"
            })
            .when('/riskSurvey', {
                templateUrl: 'App/vcs/surveys/riskSurvey.html' + versionQS,
                controller: 'riskSurveyCtrl as vm',
                name: 'Risk Survey',
                iconColor: '',
                iconRef: '',
                public: true,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/surveys/riskSurvey.js' + versionQS);
                    }
                }
            })
            .when('/socialIdentitySurvey', {
                templateUrl: 'App/vcs/surveys/socialIdentitySurvey.html' + versionQS,
                controller: 'socialIdentitySurveyCtrl as vm',
                name: 'Earthly(DNA) Survey',
                iconColor: '',
                iconRef: '',
                public: true,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/surveys/socialIdentitySurvey.js' + versionQS);
                    }
                }
            })
            .when('/surveysResult', {
                templateUrl: 'App/vcs/surveys/surveysResult.html' + versionQS,
                controller: 'surveysResultCtrl as vm',
                name: 'Surveys Result',
                iconColor: '',
                iconRef: '',
                public: true,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/surveys/surveysResult.js' + versionQS);
                    }
                }
            })
            .when('/createAccount', {
                templateUrl: 'App/vcs/register/createAccount/createAccount.html' + versionQS,
                controller: 'createAccountCtrl as vm',
                name: 'Create Account',
                iconColor: '',
                iconRef: '',
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/register/createAccount/createAccount.js' + versionQS);
                    }
                }
            })
            .when('/newPassword', {
                templateUrl: 'App/vcs/login/newPassword/newPassword.html' + versionQS,
                controller: 'newPasswordCtrl as vm',
                name: 'NewPassword Form',
                iconColor: '',
                iconRef: '',
                public: true,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/login/newPassword/newPassword.js' + versionQS);
                    }
                }
            })
            .when('/resetPassword', {
                templateUrl: 'App/vcs/login/resetPassword/resetPassword.html' + versionQS,
                controller: 'resetPasswordCtrl as vm',
                name: 'ResetPassword Form',
                iconColor: '',
                iconRef: '',
                public: true,
                resolve: {
                    deps: function ($ocLazyLoad) {
                        return $ocLazyLoad.load('App/vcs/login/resetPassword/resetPassword.js' + versionQS);
                    }
                }
            })
            .otherwise({ redirectTo: '/' });

    }]).run(function (Idle, $interval, startupManager, utilsManager, cacheManager, httpService) {
        

        utilsManager.getTokenName().then(function (resp) {
            httpService.tokenName = resp.data.tokenName;
        }).catch(function (err) {
            console.error('utilsManager.getTokenName', err);
        });

        // start watching when the app runs. also starts the Keepalive service by default.
        Idle.watch();

        var stop = $interval(function () {
            startupManager.getUserInfo();
        }, 60000);

    });