(function () {
    angular.module('app').controller('verifyMicroDepositsCtrl', function ($uibModalInstance, tools, tradeApiManager, bankLinkId, logger) {

        var vm = this;
        vm.isLoading = false;

        vm.microDeposit = {
            firstAmoutOfCents: '',
            secondAmountOfCents: ''
        };

        vm.verify = function (uri) {
            var data = {
                id: bankLinkId,
                md1: vm.microDeposit.firstAmountOfCents,
                md2: vm.microDeposit.secondAmountOfCents
            };
            vm.isLoading = true;
            tradeApiManager.verifyMicroDeposits(data)
                .then(function (response) {
                    logger.success('Success.');
                    vm.isLoading = false;
                    $uibModalInstance.close();
                }).catch(function (response) {
                    vm.isLoading = false;
                    tools.setError(vm, response, true);
                });
        };

        vm.getTestMicroDeposit = function () {
            tradeApiManager.getTestMicroDeposit(bankLinkId)
                .then(function (resp) {
                    vm.microDeposit = {
                        firstAmountOfCents: parseFloat(resp.data.md1),
                        secondAmountOfCents: parseFloat(resp.data.md2)
                    }
                });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.getTestMicroDeposit();

    });
})();