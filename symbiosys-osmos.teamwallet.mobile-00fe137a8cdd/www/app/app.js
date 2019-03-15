(function () {
    var dev = true;

    var baseUrl = 'https://localhost:44352/';
    var environment = 'production';

    switch (environment) {
        case 'local':
            baseUrl =  'https://localhost:44352/';
            break;
        case 'staging': 
            baseUrl =  'https://tw-api-staging.azurewebsites.net/';
            break;
            //prod and staging are switch in deployment
        case 'production':
            baseUrl = 'https://tw-api.azurewebsites.net/';
        default:
            break;
    }

    angular.module('osmos')
      .value('baseUrl', baseUrl)
      .value('tokenName', 'teamWallet')
      .value('dev', dev);

    angular.module('app', ['ionic', 'ngCordova', 'ui.mask', 'osmos'])

    .run(['$ionicPlatform', '$http', '$rootScope', 'configManager', 'baseUrl', 'tools', 'notificationsManager',
        function ($ionicPlatform, $http, $rootScope, configManager, baseUrl, tools, notificationsManager) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                var loadingBetweenRoutes = {
                    loading: false
                };

                tools.watchLoading(loadingBetweenRoutes);
                $rootScope.$on('$stateChangeStart', function () {
                    loadingBetweenRoutes.loading = true;
                });

                $rootScope.$on('$stateChangeSuccess', function () {
                    loadingBetweenRoutes.loading = false;
                });

                notificationsManager.registerPlugin();
            });

            return $http({
                method: 'get',
                url: baseUrl + 'api/config/'
            }).then(function successCallback(response) {

                console.info('config', response.data);

                var publicKey = response.data;
                Stripe.setPublishableKey(response.data.stripeApiPublicKey);

                configManager.twMulFees = response.data.twMulFees;
                configManager.stripeMulFees = response.data.stripeMulFees;
                configManager.stripeAddFees = response.data.stripeAddFees;

            }, function errorCallback(response) {
                console.error('getting stripe public key error : ', response);
            });
        }])

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.views.transition('none');

        $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'app/vcs/layout/menu.html',
            controller: 'menuCtrl as vm',
            resolve: {
                userInfo: function ($state, accountManager) {
                    return accountManager.getUserInfo();
                }
            }
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
            controller: 'forgotPasswordCtrl as vm',
        })
        .state('resetPassword', {
            url: '/resetPassword',
            cache: false,
            templateUrl: "app/vcs/account/resetPassword/resetPassword.html",
            controller: 'resetPasswordCtrl as vm',
            params: {
                phone: null
            },
        })
        .state('verifyPhone', {
            url: '/verifyPhone',
            cache: false,
            templateUrl: "app/vcs/account/verifyPhone/verifyPhone.html",
            controller: 'verifyPhoneCtrl as vm',
            params: {
                phone: null,
                password: null
            },
        })
        .state('emailSent', {
            url: '/emailSent',
            cache: false,
            templateUrl: "app/vcs/account/emailSent/emailSent.html",
            controller: 'emailSentCtrl as vm'
        })
        .state('register', {
            url: '/register',
            cache: false,
            templateUrl: "app/vcs/account/register/register.html",
            controller: 'registerCtrl as vm'
        })
        .state('app.intro', {
            url: '/intro',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/layout/intro.html",
                    controller: 'introCtrl as vm'
                }
            }
        })
        .state('app.profile', {
            url: '/profile',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/profile/profile.html",
                    controller: 'profileCtrl as vm'
                }
            }
        })
        .state('app.creditCard', {
            url: '/creditCard',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/creditCard/creditCard.html",
                    controller: 'creditCardCtrl as vm'
                }
            }
        })
        .state('app.setCard', {
            url: '/setCard?edit',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/creditCard/setCard.html",
                    controller: 'setCardCtrl as vm'
                }
            }
        })
        .state('app.teams', {
            url: '/teams',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/teams/teams.html",
                    controller: 'teamsCtrl as vm'
                }
            }
        })
        .state('app.team', {
            url: '/teams/:teamId',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/teams/team.html",
                    controller: 'teamCtrl as vm'
                }
            }
        })
        .state('app.createWallet', {
            url: '/teams/:teamId/createWallet',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/teams/createWallet.html",
                    controller: 'createWalletCtrl as vm'
                }
            }
        })
        .state('app.wallet', {
            url: '/teams/:teamId/wallets/:walletId',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/teams/wallet.html",
                    controller: 'walletCtrl as vm'
                }
            }
        })
        .state('app.teamInvites', {
            url: '/teams/:teamId/invites',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/teams/teamInvites.html",
                    controller: 'teamInvitesCtrl as vm'
                }
            }
        })
        .state('app.walletInvites', {
            url: '/teams/:teamId/wallets/:walletId/invites',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/teams/walletInvites.html",
                    controller: 'walletInvitesCtrl as vm'
                }
            }
        })
        .state('app.invites', {
            url: '/invites?tab',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "app/vcs/invites/invites.html",
                    controller: 'invitesCtrl as vm'
                }
            }
        });

        $urlRouterProvider.otherwise('/app/teams');
    });
}());
