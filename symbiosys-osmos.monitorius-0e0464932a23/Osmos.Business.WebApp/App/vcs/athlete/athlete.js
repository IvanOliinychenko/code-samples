(function () {
    angular.module('app').controller('athleteCtrl', ['$location', '$routeParams', 'athletesManager', function ($location, $routeParams, athletesManager) {
        var vm = this;
        vm.athlete = null;
        vm.error = null;

        if ($routeParams.athleteId) getAthlete();
        
        vm.goToAthleteForms = function () {
            $location.path('athleteForms/'+ $routeParams.athleteId);
        }

        function getAthlete() {
            vm.error = null;
            athletesManager.getAthlete($routeParams.athleteId).then(function (response) {
                vm.athlete = angular.copy(response.data);
            }).catch(function (response) {
                console.error("Failed to get athlete.", response);
                if (!response.data) {
                    vm.error = 'Server is not available.';
                } else if (response.data.message) {
                    vm.error = response.data.message;
                } else {
                    vm.error = response.data;
            };
            })
        };

    }]);
}());