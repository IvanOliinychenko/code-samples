(function () {
    angular.module('app').controller('bookCtrl', ['$scope', 'apiManager', '$location', '$translate', '$stateParams', '$filter', function ($scope, apiManager, $location, $translate, $stateParams, $filter) {
        var vm = this;
        $scope.$on('dataUpdated', function (event, args) {
            vm.loadData();
        });

        //refresh data on going back
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.$broadcast('dataUpdated');
        })

        vm.loadData = function () {
            vm.bookId = $stateParams.id;

            vm.book = apiManager.searchById(vm.bookId, apiManager.data);
            vm.titles = vm.book.titles;

            vm.viewTitle = $filter('translate')('BOOK') + ' ' + vm.book.label;
        };

        vm.loadData();
    }]);
}());