(function () {
    angular.module('app').controller('riskSurveyCtrl', ['$location', 'moduleInjector','tools', 'cacheManager',
        function ($location, moduleInjector, tools, cacheManager) {
            var vm = this;

            moduleInjector.inject(['accountManager', 'formulasManager', 'currencyManager'], vm, injectCallback);

            function injectCallback() {
                vm.accountManager.authorizeController(vm, init);

                function init() {
                    
                }

                var totalSteps = 5;

                vm.UsdCurrency = vm.currencyManager.usd;
                vm.step = 1;
                vm.progress = function () {
                    return ((vm.step - 1) * 100) / totalSteps;
                };
                vm.nextStep = function () {
                    vm.step++;
                }
                vm.prevStep = function () {
                    vm.step--;
                }
                vm.disableNext = function () {
                    //vm.rs_step1_form.$setSubmitted();

                    if (vm.step == 2 && (!vm.surveyAnswers.age || !vm.surveyAnswers.retirementAge || vm.surveyAnswers.annualIncomes === null || vm.surveyAnswers.annualIncomes < 0)) return true;
                    else if (vm.step == 3 && !vm.surveyAnswers.portfolioDropped) return true;
                    else if (vm.step == 4 && !vm.surveyAnswers.lowerVolatility) return true;
                    else if (vm.step == 5 && !vm.surveyAnswers.hypotheticalPortfolio) return true;
                    //else if (vm.step == 4 && !vm.selectedCurrentSourcesOption) return true;
                    //else if (vm.step == 6 && !vm.selectedMoneyUsageOption) return true;
                    //else if (vm.step == 7 && vm.incomes === null || vm.incomes < 0) return true;
                    //else if (vm.step == 8 && vm.liquidNetWorth === null || vm.liquidNetWorth < 0) return true;
                    // else if (vm.step == 9 && !vm.selectedStateOption) return true;
                    else return false;
                }

                vm.surveyAnswers = cacheManager.surveyAnswers;
                
                vm.inputAge = null;
                vm.age = null;
                vm.ageCheck = function () {
                    vm.age = angular.copy(vm.surveyAnswers.age);
                    if (vm.surveyAnswers.age >= vm.maxAge) vm.age = 70;
                }
                vm.retirementAgeCheck = function () {
                    vm.retirementAge = vm.surveyAnswers.retirementAge;
                    vm.moneyNeeded = vm.surveyAnswers.retirementAge;
                    if (!vm.retirementAge) {
                        vm.retirementAge = 65;
                    }
                    else {
                            if (vm.retirementAge <= vm.age)
                                vm.retirementAge = vm.age + 1;
                    }
                }
                vm.minAge = 18;
                vm.maxAge = 70;
                vm.minMoneyNeeded = 1;
                vm.maxMoneyNeeded = 40;
                vm.selectedPortFolioOption = null;
                vm.selectedLowerVolatilityOption = null;
                vm.selectedHypotheticalPortfolios = null;
                vm.incomes = null;
                vm.selectedStateOption = null;
                vm.portfolioDroppedOptions = [
                    {
                        id: 1,
                        text: 'Buy More',
                        weight: 5
                    },
                    {
                        id: 2,
                        text: 'Do nothing',
                        weight: 4
                    },
                    {
                        id: 3,
                        text: 'Sell Some',
                        weight: 3
                    },
                    {
                        id: 4,
                        text: 'Sell Most',
                        weight: 2
                    },
                    {
                        id: 5,
                        text: 'Sell All',
                        weight: 1
                    }
                ];
                vm.lowerVolatilityOptions = [
                    {
                        id: 1,
                        text: 'Strongly Agree',
                        weight: 1
                    },
                    {
                        id: 2,
                        text: 'Somewhat Agree',
                        weight: 2
                    },
                    {
                        id: 3,
                        text: 'Neutral',
                        weight: 3
                    },
                    {
                        id: 4,
                        text: 'Somewhat Disagree',
                        weight: 4
                    },
                    {
                        id: 5,
                        text: 'Strongly Disagree',
                        weight: 5
                    }
                ];
                vm.hypotheticalPortfolios = [
                   {
                       id: 1,
                       text: 'Portfolio 1',
                       volatility: 4,
                       max: 15,
                       min: 10
                   },
                   {
                       id: 2,
                       text: 'Portfolio 2',
                       volatility: 9,
                       max: 30,
                       min: 25

                   },
                   {
                       id: 3,
                       text: 'Portfolio 3',
                       volatility: 18,
                       max: 60,
                       min: 45
                   }
                ];
                vm.tabs = [
                   {
                       id: 'Step 1',
                       active: true,
                       index: 1
                   },
                   {
                       id: 'Step 2',
                       active: false,
                       index: 2
                   },
                   {
                       id: 'Step 3',
                       active: false,
                       index: 3
                   },
                   {
                       id: 'Step 4',
                       active: false,
                       index: 4
                   },
                   {
                       id: 'Step 5',
                       active: false,
                       index: 5
                   },
                   {
                       id: 'Step 6',
                       active: false,
                       index: 6
                   },
                   {
                       id: 'Step 7',
                       active: false,
                       index: 7
                   },
                   {
                       id: 'Step 8',
                       active: false,
                       index: 8
                   },
                   {
                       id: 'Submit',
                       active: false,
                       index: 9
                   }

                ];

                vm.ageCheck();
                vm.retirementAgeCheck();

                vm.ageScore = function () {
                    if (!vm.age) return 0;
                    return Math.min((10 / (vm.maxAge - vm.minAge)) * (vm.maxAge - vm.age), 0);
                }

                vm.moneyNeededWhenScore = function () {
                    return Math.min((10 / (vm.maxMoneyNeeded - vm.minMoneyNeeded)) * (vm.moneyNeeded - vm.age - 1), 10);
                }

                vm.portFolioScore = function () {
                    var option = _.find(vm.portfolioDroppedOptions, function (item) {
                        return item.id == vm.surveyAnswers.portfolioDropped;
                    });
                    if (!option) return 0;
                    return (option.weight - 1) * 2.5;
                }

                vm.lowerVolatilityScore = function () {
                    var option = _.find(vm.lowerVolatilityOptions, function (item) {
                        return item.id == vm.surveyAnswers.lowerVolatility;
                    });
                    if (!option) return 0;
                    return (option.weight - 1) * 2.5;
                }
            
                vm.hypotheticalPortfoliosScore = function () {
                    if (!vm.surveyAnswers.hypotheticalPortfolio) return 0;
                    return (vm.surveyAnswers.hypotheticalPortfolio - 1) * 5;
                }

                vm.incomesScore = function () {
                    if (!vm.surveyAnswers.annualIncomes) return 0;
                    return Math.min(vm.surveyAnswers.annualIncomes / 10000, 10);
                }

                vm.averageScore = function () {
                    return (0.2 * vm.ageScore() + 0.15 * vm.portFolioScore() + 0.15 * vm.lowerVolatilityScore() + 0.2 * vm.moneyNeededWhenScore() + 0.15 * vm.hypotheticalPortfoliosScore()
                    + 0.15 * vm.incomesScore());
                }

                vm.allocationToStocks = function () {
                    return (
                        Math.max(
                            Math.min(
                                Math.round((                                    
                                    0.00208 * Math.pow(10 - vm.averageScore(), 3) +
                                    -0.0359 * Math.pow(10 - vm.averageScore(), 2) +
                                    0.08475 * (10 - vm.averageScore()) +
                                    0.96515) *
                                    100 / 10
                                ) * 10, 100
                            ), 0
                        ) / 100
                    );
                };

                vm.saveChanges = function () {
                    cacheManager.getSurveyAnswersFromCache = true;
                    cacheManager.riskTolerance = angular.copy(vm.allocationToStocks());
                    cacheManager.retirementAge = angular.copy(vm.surveyAnswers.retirementAge);

                    cacheManager.surveyAnswers = vm.surveyAnswers;

                    $location.path('socialIdentitySurvey');
                };

                vm.formatedIncomes = function () {
                    return vm.UsdCurrency(vm.surveyAnswers.retirementAge);
                };

                vm.formatedLiquidNetWorth = function () {
                    return vm.UsdCurrency(vm.liquidNetWorth);
                };

                vm.tabIsActive = function (tab) {
                    if (vm.step == tab.index)
                        return true;
                };
            }

        }]);
}());