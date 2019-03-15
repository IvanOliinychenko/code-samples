(function () {
    angular.module('app').controller('addFundsCtrl', ['$routeParams', '$location', '$uibModal', 'moduleInjector', 'startupManager', 'tools',
        function ($routeParams, $location, $uibModal, moduleInjector, startupManager, tools) {
            var vm = this;

            var recurrentDepositTypes = {
                weekly: 'Weekly',
                biweekly: 'Biweekly',
                monthly: 'Monthly',
                quaterly: 'Quaterly'
            };

            moduleInjector.inject(['accountManager', 'tradeApiManager', 'enumsManager'], vm, injectCallback);


            function injectCallback() {
                vm.accountManager.authorizeController(vm, init);
            }

            function init() { 
                vm.bankLinks = null;
                vm.transfersFrequencies = [];
                vm.selectedBankNumber = null;
                vm.selectedFrequency = 0;
                vm.selectedBankLink = null;
                vm.pendingRequest = false;
                vm.transfer = {
                    amount: null,
                    frequency: '',
                    bankLinkId: '',
                };
                vm.steps = [
                    {
                        name: 'Amount',
                        step: 1,
                        active: true
                    },
                    {
                        name: 'Frequency',
                        step: 2,
                        active: false
                    },
                    {
                        name: 'Accounts',
                        step: 3,
                        active: false
                    },
                    {
                        name: 'Confirmation',
                        step: 4,
                        active: false
                    },
                    {
                        name: 'End',
                        step: 5,
                        active: false
                    }
                ];

                vm.previousStep = function () {
                    for (var i = vm.steps.length - 1; i > 0; i--) {
                        if (vm.steps[i].active) {
                            vm.steps[i].active = false;
                            vm.steps[i - 1].active = true;
                            break;
                        }
                    }
                };

                vm.nextStep = function () {
                    for (var i = 0; i < vm.steps.length - 1; i++) {
                        if (vm.steps[i].active) {

                            if (vm.steps[i + 1].name == 'End') {

                                vm.showConfirmDialog(function () {

                                    vm.confirmTransfer(function () {
                                        nextActive(i);
                                    });

                                }, function () {
                                    vm.pendingRequest = false;
                                }, 'sm');
                                break;
                            };

                            nextActive(i);
                            break;
                        }
                    };
                    function nextActive(i) {
                        vm.steps[i].active = false;
                        vm.steps[i + 1].active = true;
                    };
                };

                vm.activeStepName = function () {
                    for (var i = 0; i < vm.steps.length; i++) {
                        if (vm.steps[i].active) {
                            return vm.steps[i].name;
                        }
                    }
                    return null;
                };

                vm.getbankLinkIdByBankNumber = function (bankNum) {
                    if (!bankNum) return;

                    for (var i in vm.bankLinks) {
                        if (vm.bankLinks[i].bankAccountNumber === bankNum) {
                            vm.transfer.bankLinkId = vm.bankLinks[i].bankLinkId;
                            break;
                        }
                    }
                };
                 
                vm.getSelectedBankLink = function () {

                    var bankLink = _.find(vm.bankLinks, function (item) {
                        return item.bankLinkId === vm.transfer.bankLinkId;
                    });

                    return bankLink;
                };

                vm.selectedBankLinkChanged = function () {
                    vm.transfer.bankLinkId = vm.selectedBankLink;
                };

                vm.confirmTransfer = function (callbackFunc) {
                    executeDepositTransfer(callbackFunc);
                };

                vm.showConfirmDialog = function (okCallback, cancelCallback, size) {
                    var confirmDialog = $uibModal.open({
                        animation: true,
                        templateUrl: 'App/layout/confirmDialog/confirmDialog.html',
                        controller: 'confirmDialogCtrl as vm',
                        size: size,
                        windowClass: "earthly-modal",
                        backdrop: 'static'
                    });

                    confirmDialog.result.then(function (result) {
                        if (result) {
                            okCallback();
                        } else {
                            cancelCallback();
                        };
                    });
                }

                getBankLinks();
                getTransfersScheduleFrequencies();

                function setActiveTabByName(tabName) {
                    for (var i = 0; i < vm.steps.length; i++) {
                        if (vm.steps[i].active && vm.steps[i].name !== tabName) {
                            vm.steps[i].active = false;
                        }
                        if (vm.steps[i].name == tabName) {
                            vm.steps[i].active = true;
                        }

                    }
                };

                function executeDepositTransfer(callbackFunc) {
                    vm.pendingRequest = true;
                    vm.tradeApiManager.executeDepositTransfer(vm.transfer)
                        .then(function(response) {
                            vm.pendingRequest = false;
                            callbackFunc();
                        }).catch(function(response) {
                            vm.pendingRequest = false;
                            tools.setError(vm, response, true);
                            $location.path('/transfers');
                        });
                };
                
                function getBankLinks() {
                    vm.tradeApiManager.getBankLinks()
                       .then(function (response) {
                           vm.bankLinks = angular.copy(response.data);
                           vm.bankLinks = _.filter(vm.bankLinks, function (item) { return item.verified; });
                           if (vm.bankLinks[0]) {
                               vm.selectedBankLink = vm.bankLinks[0].bankLinkId;
                               vm.transfer.bankLinkId = vm.selectedBankLink;
                           }
                       }).catch(function (respone) {
                           tools.setError(vm, response, true);
                       });
                };

                function getTransfersScheduleFrequencies() {
                    vm.enumsManager.getTransfersScheduleFrequencies()
                      .then(function (response) {

                          var frequencies = angular.copy(response.data)
                          frequencies.unshift('Once');

                          vm.transfersFrequencies = frequencies;
                          vm.transfer.frequency = vm.transfersFrequencies[vm.selectedFrequency];
                      }).catch(function (respone) {
                          tools.setError(vm, response, true);
                      });

                }

                function getRecurrentDepositType() {

                    var result = null;

                    switch (vm.transfersFrequencies[vm.selectedFrequency]) {
                        case 'Every week':
                            result = recurrentDepositTypes.weekly;
                            break;
                        case 'Every 2 weeks':
                            result = recurrentDepositTypes.biweekly;
                            break;
                        case 'Every month':
                            result = recurrentDepositTypes.monthly;
                            break;
                        case 'Every quarter':
                            result = recurrentDepositTypes.quaterly;
                            break;
                        default:
                            break;
                    }

                    return result;
                }
            }

        }]);
}());