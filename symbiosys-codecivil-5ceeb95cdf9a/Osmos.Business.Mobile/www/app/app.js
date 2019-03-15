/// <reference path="vcs/tabs/tabs.html" />
//PROD = 'prod'
//PreProd = 'preprod'
//Local = 'local'
var environment = 'prod';

var baseUrl;
switch (environment) {
    case 'prod':
        baseUrl = 'https://codecivil-api.azurewebsites.net/';
        break;
    case 'dev':
        baseUrl = 'https://codecivil-api-dev.azurewebsites.net/';
        break;
    case 'local':
        baseUrl = 'https://localhost:44397/';
        break;
    default:
        baseUrl = '';
}

var tokenName = "codeCivil_mobile_token";
var debug = "local";
var appType = 'Web';


angular.module('app', ['ionic', 'osmos', "pascalprecht.translate"]).value('baseUrl', baseUrl)

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, osmosConfigProvider, $translateProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position("bottom");

    osmosConfigProvider.setAll({
        baseUrl: baseUrl,
        tokenName: tokenName,
        debug: debug,
        appType: appType
    });

    $stateProvider
      .state('tabs', {
          url: "/tab",
          abstract: true,
          templateUrl: "app/vcs/tabs/tabs.html"
      }).state('tabs.home', {
          url: "/home",
          views: {
              'tab-home': {
                  templateUrl: "app/vcs/tabs/home/homeTab.html",
                  controller: 'homeTabCtrl as vm'
              }
          }
      }).state('tabs.book', {
          url: "/book/:id",
          views: {
              'tab-home': {
                  templateUrl: "app/vcs/tabs/book/book.html",
                  controller: 'bookCtrl as vm'
              }
          }
      }).state('tabs.title', {
          url: "/title/:id",
          views: {
              'tab-home': {
                  templateUrl: "app/vcs/tabs/title/title.html",
                  controller: 'titleCtrl as vm'
              }
          }
      }).state('tabs.chapter', {
          url: "/chapter/:id",
          views: {
              'tab-home': {
                  templateUrl: "app/vcs/tabs/chapter/chapter.html",
                  controller: 'chapterCtrl as vm'
              }
          }
      }).state('tabs.article', {
          url: "/article/:id",
          views: {
              'tab-home': {
                  templateUrl: "app/vcs/tabs/article/article.html",
                  controller: 'tabArticleCtrl as vm'
              }
          }
      }).state('tabs.number', {
          url: "/number",
          views: {
              'number-tab': {
                  templateUrl: "app/vcs/tabs/number/number.html",
                  controller: 'numberCtrl as vm'
              }
          }
      }).state('tabs.search', {
          url: "/search/:type/:searchString",
          views: {
              'number-tab': {
                  templateUrl: "app/vcs/tabs/search/search.html",
                  controller: 'searchTabCtrl as vm'
              }
          }
      }).state('tabs.articleSearch', {
          url: "/search/article/:id",
          views: {
              'number-tab': {
                  templateUrl: "app/vcs/tabs/article/article.html",
                  controller: 'tabArticleCtrl as vm'
              }
          }
      }).state('tabs.alpha', {
          url: "/alpha",
          views: {
              'alpha-tab': {
                  templateUrl: "app/vcs/tabs/alpha/alpha.html",
                  controller: 'alphaCtrl as vm'
              }
          }
      }).state('tabs.searchAlpha', {
          url: "/searchAlpha/:type/:searchString",
          views: {
              'alpha-tab': {
                  templateUrl: "app/vcs/tabs/search/search.html",
                  controller: 'searchTabCtrl as vm'
              }
          }
      }).state('tabs.articleSearchAlpha', {
          url: "/searchAlpha/article/:id",
          views: {
              'alpha-tab': {
                  templateUrl: "app/vcs/tabs/article/article.html",
                  controller: 'tabArticleCtrl as vm'
              }
          }
      }).state('tabs.about', {
          url: "/about",
          views: {
              'about-tab': {
                  templateUrl: "app/vcs/tabs/about/about.html",
                  controller: 'aboutCtrl as vm'
              }
          }
      });


    $urlRouterProvider.otherwise("/tab/home");

    //$stateProvider.state('home', {
    //  url: '/home',
    //  templateUrl: 'app/vcs/home/home.html',
    //  controller: 'homeCtrl as vm'
    //}).state('article', {
    //  url: '/article/:id/:lastPage/:param',
    //  templateUrl: 'app/vcs/article/article.html',
    //  controller: 'articleCtrl as vm'
    //}).state('search', {
    //    url: '/search/:searchString',
    //    templateUrl: 'app/vcs/search/search.html',
    //    controller: 'searchCtrl as vm'
    //});

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/home');

    $translateProvider.translations("en", resource_en);

    $translateProvider.translations("fr", resource_fr);

});
