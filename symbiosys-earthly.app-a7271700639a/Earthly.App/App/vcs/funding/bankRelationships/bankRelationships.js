(function () {
    angular.module('app').controller('bankRelationshipsCtrl', ['$location', '$uibModal', 'moduleInjector', 'startupManager', 'cacheManager', 'tools', 'logger',
        function ($location, $uibModal, moduleInjector, startupManager, cacheManager, tools, logger) {
            var vm = this;
            vm.isLoading = false;
            moduleInjector.inject(['accountManager', 'tradeApiManager'], vm, injectCallback);

            function init() {

                vm.bankLinks = null;

                vm.unlink = function (id) {
                    if (confirm(cacheManager.resources['AreYouSure'])) {
                        vm.isLoading = true;
                        vm.tradeApiManager.unlinkAch(id)
                            .then(function (response) {
                                vm.isLoading = false;
                                getBankLinks();

                            }).catch(function (response) {
                                tools.setError(vm, response, true);
                                vm.isLoading = false;
                            });
                    }
                };

                vm.openVerifyMicroDeposits = function (bankLinkId) {
                    var modalInstance = $uibModal.open({
                        animation: false,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'app/vcs/funding/bankRelationships/verifyMicroDeposits/verifyMicroDeposits.html',
                        controller: 'verifyMicroDepositsCtrl',
                        controllerAs: 'vm',
                        size: 'lg',
                        appendTo: null,
                        windowClass: "earthly-modal",
                        backdrop: 'static',
                        resolve: {
                            bankLinkId: function () {
                              return bankLinkId;
                            }
                        }
                    });

                    modalInstance.result.then(function (bankLink) {
                      getBankLinks();
                    }, function () {

                    });
                }

                getBankLinks();
                function getBankLinks() {
                    vm.isLoading = true;
                    vm.tradeApiManager.getBankLinks()
                        .then(function (response) {
                            vm.bankLinks = angular.copy(response.data);

                            vm.isLoading = false;
                        }).catch(function (response) {
                            tools.setError(vm, response, true);
                            vm.isLoading = false;
                        });
                };

                vm.addRelationship = function() {
                    if (vm.bankLinks.length < 3) {
                        $location.path('createBankRelationship');
                    } else {
                        logger.info(cacheManager.resources['BankLinkLimit']);
                    }
                }

            };

            function injectCallback() {
                vm.accountManager.authorizeController(vm, init);
            }

        }]);


}());