(function () {

    angular.module('app').controller('createWalletCtrl', ['$state', '$stateParams', 'tools', 'accountManager', 'teamsManager',
        function ($state, $stateParams, tools, accountManager, teamsManager) {

            var vm = this;

            var teamId = $stateParams.teamId;

            accountManager.initController(vm, callback);

            function callback(userInfo) {
                vm.loading = false;
                tools.watchLoading(vm);
                vm.errors = [];

                vm.bankTransitNumber = '';
                vm.bankInstitutionNumber = '';

                vm.model = {
                    name: '',
                    bankAccountHolderName: userInfo.firstName + ' ' + userInfo.lastName,
                    bankAccountNumber: '',
                    bankAccountRoutingNumber: '',
                    teamId: teamId
                };

                vm.createWallet = function () {

                    vm.loading = true;
                    vm.errors = [];
                    vm.model.bankAccountRoutingNumber = vm.bankTransitNumber + vm.bankInstitutionNumber;

                    teamsManager.createWallet(teamId, vm.model)
                    .success(function () {
                        $state.go('app.team', { teamId: teamId });
                    })
                    .error(function (error) {
                        tools.setError(vm, error, true);
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
                };
            }

        }]);

}());