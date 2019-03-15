(function () {
    angular.module('app', ['ngRoute', 'ngCookies', 'ngSanitize', 'ui.bootstrap', 'ui.tinymce', 'naif.base64', 'osmos']);

    angular.module('app').config(['$routeProvider', '$locationProvider', 'osmosConfigProvider',
        function ($routeProvider, $locationProvider, osmosConfigProvider) {

            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('!');

            osmosConfigProvider.defaultTitle = "Comparateur Credit";

            $routeProvider
                .when('/', {
                    templateUrl: 'app/vcs/home/home.html',
                    controller: 'homeCtrl as vm',
                    reloadOnSearch: false,
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('', null);
                        }
                    }
                })
                .when('/login', {
                    templateUrl: 'app/vcs/login/login.html',
                    controller: 'loginCtrl as vm',
                    reloadOnSearch: false,
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('login', null);
                        }
                    }
                })
                .when('/offers', {
                    reloadOnSearch: false,
                    inAdminMenu: true,
                    templateUrl: 'app/vcs/offers/offers.html',
                    controller: 'offersCtrl as vm',
                    name: 'Offres',
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('offers', $route.current.params.category);
                        }
                    },
                })
                .when('/categories', {
                    reloadOnSearch: false,
                    inAdminMenu: true,
                    templateUrl: 'app/vcs/categories/categories.html',
                    controller: 'categoriesCtrl as vm',
                    name: 'Categories',
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('categories', null);
                        }
                    }
                })
                .when('/partners', {
                    templateUrl: 'app/vcs/partners/partners.html',
                    controller: 'partnersCtrl as vm',
                    reloadOnSearch: false,
                    name: 'Partenaires',
                    inAdminMenu: true,
                    resolve: {
                        metaTags: function (metaTagsManager) {
                            return metaTagsManager.setTitle('partners', null);
                        }
                    },
                })
                .when('/partners/:name', {
                    templateUrl: 'app/vcs/partners/partner.html',
                    controller: 'partnerCtrl as vm',
                    reloadOnSearch: false,
                    inAdminMenu: false,
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('partners', $route.current.params.name);
                        }
                    },
                })
                .when('/articles', {
                    reloadOnSearch: false,
                    inAdminMenu: true,
                    templateUrl: 'app/vcs/articles/articles.html',
                    controller: 'articlesCtrl as vm',
                    name: 'Articles',
                    resolve: {
                        metaTags: function (metaTagsManager) {
                            return metaTagsManager.setTitle('articles', null);
                        }
                    },
                })
                .when('/articles/:articleId', {
                    templateUrl: 'app/vcs/articles/article.html',
                    controller: 'articleCtrl as vm',
                    reloadOnSearch: false,
                    inAdminMenu: false,
                    resolve: {
                        metaTags: function ($route,metaTagsManager) {
                            return metaTagsManager.setTitle('articles',$route.current.params.articleId);
                        }
                    },
                })
                .when('/dictionary', {
                    templateUrl: 'app/vcs/dictionary/dictionary.html',
                    controller: 'dictionaryCtrl as vm',
                    reloadOnSearch: false,
                    name: 'Dictionnaire',
                    inAdminMenu: true,
                    resolve: {
                        metaTags: function (metaTagsManager) {
                            return metaTagsManager.setTitle('dictionary', null);
                        }
                    },
                })
                .when('/dictionary/:itemId', {
                    templateUrl: 'app/vcs/dictionary/item.html',
                    controller: 'itemCtrl as vm',
                    reloadOnSearch: false,
                    inAdminMenu: false,
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('dictionary',$route.current.params.itemId);
                        }
                    },
                })
                .when('/simulation/:type', {
                    templateUrl: 'app/vcs/simulation/simulation.html',
                    controller: 'simulationCtrl as vm',
                    reloadOnSearch: false,
                    name: 'Simulation',
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('simulation',$route.current.params.type);
                        }
                    },
                })
                .when('/subscribers', {
                    reloadOnSearch: false,
                    inAdminMenu: true,
                    templateUrl: 'app/vcs/subscribers/subscribers.html',
                    controller: 'subscribersCtrl as vm',
                    name: 'Subscribers',
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('subscribers', null);
                        }
                    }
                })
                .when('/metaTags', {
                    reloadOnSearch: false,
                    inAdminMenu: true,
                    templateUrl: 'app/vcs/metaTags/metaTags.html',
                    controller: 'metaTagsCtrl as vm',
                    name: 'Meta Tags',
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('metaTags', null);
                        }
                    }
                })
                .when('/staticPages/:title', {
                    reloadOnSearch: false,
                    inAdminMenu: false,
                    templateUrl: 'app/vcs/staticPages/staticPages.html',
                    controller: 'staticPagesCtrl as vm',
                    name: 'Static Pages',
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('staticPages', $route.current.params.title);
                        }
                    },

                })
                .when('/tests', {
                    reloadOnSearch: false,
                    inAdminMenu: false,
                    templateUrl: 'app/vcs/tests/tests.html',
                    controller: 'testsCtrl as vm',
                    resolve: {
                        metaTags: function ($route, metaTagsManager) {
                            return metaTagsManager.setTitle('tests', null);
                        }
                    }
                })
                .otherwise({ redirectTo: '/' });

        }]);
}());