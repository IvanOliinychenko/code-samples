(function () {
    angular.module('app').controller('indexCtrl', ['$translate', 'booksService', function ($translate, booksService) {
        var vm = this;

        vm.languages = {
            fr: 'fr',
            en: 'en'
        };

        vm.currentLang = localStorage.getItem("preferedLanguage") || vm.languages.fr;

        angular.forEach(vm.languages, function (value) {
            booksService.getBooks(value, true);
        })

        $translate.use(vm.currentLang);

        vm.changeLanguage = function() {
            var langKey = '';

            switch (vm.currentLang) {
                case vm.languages.en:
                    langKey = vm.languages.fr;
                    break;
                case vm.languages.fr:
                    langKey = vm.languages.en;
                    break;
                default:
                    langKey = vm.languages.fr;
                    break;
            };

            booksService.getBooks(langKey, true).then(function () {
                vm.currentLang = langKey;
                $translate.use(vm.currentLang);
                localStorage.setItem("preferedLanguage", langKey);
            })
        };

    }]);
}());

