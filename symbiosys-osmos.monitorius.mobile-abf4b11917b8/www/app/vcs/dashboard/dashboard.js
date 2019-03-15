(function () {
    angular.module('app').controller('dashboardCtrl', ['$scope', '$ionicPopup', 'chartsManager', function ($scope, $ionicPopup, chartsManager) {
        var vm = this;

        var сhartLineSelect = null;
        var chartPlugins = {
          afterInit: function (chartInstance) {
              if (chartInstance.config.options.hiddenSlices !== undefined) {
                  angular.forEach(chartInstance.config.options.hiddenSlices, function (val, key) {
                      angular.forEach(chartInstance.data.datasets, function (dataset, datasetKey) {
                          if (dataset.label == val) dataset.hidden = true;
                      })
                  })

                  chartInstance.update();
              }
          },
          afterDraw: function (chart) {
              if (!chart.data.datasets[0] || !chart.data.datasets[0].data[0]) {

                  var ctx = chart.chart.ctx;
                  var width = chart.chart.width;
                  var height = chart.chart.height
                  chart.clear();

                  ctx.save();
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.font = '18px "Helvetica Neue", Helvetica, Arial, sans-serif';
                  ctx.fillText('S’il vous plait remplir le formulaire.', width / 2, height / 2);
                  ctx.restore();
              }
          }
        };

        Chart.pluginService.register(chartPlugins);


        vm.generalChartColors = ["#D0021B", "#F5A623", "#CC4DE6", "#4A90E2"];
        vm.generalChartSelected = ['Health', 'Fatigue', 'SleepQuality', 'Appetite'];


        vm.questionDefinitions = null;
        vm.weightUsgData = null;
        vm.generalChartSeries = [];
        vm.weightUsgSeries = ['weight', 'usg'];
        vm.generalChartData = null;

        vm.generalChartOptions = {
            hiddenSlices: [],
            elements: {
                line: {
                    fill: false
                },

            },
            tooltips: {
                enabled: false,
            },
            animation: false,
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10,
                        autoSkip: false,
                        //maxRotation: 0,
                        //minRotation: 0
                    },
                    type: 'time',
                    time: {
                        minUnit: 'day',
                        displayFormats: {
                            'millisecond': 'MMM DD',
                            'second': 'MMM DD',
                            'minute': 'MMM DD',
                            'hour': 'MMM DD',
                            'day': 'MMM DD',
                            'week': 'MMM DD',
                            'month': 'MMM DD',
                            'quarter': 'MMM DD',
                            'year': 'MMM DD',
                        }
                    },
                }],
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        min: 1,
                        max: 5,
                        callback: function (label, index, labels) {
                            if (Number.isInteger(label)) {
                                return label;
                            } else {
                                return ' ';
                            }

                        },
                    }
                }]
            }
        };
        vm.weightUsgOptions = {
            hiddenSlices: [],
            elements: {
                line: {
                    fill: false
                },

            },
            animation: false,
            tooltips: {
                enabled: false,
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10,
                        autoSkip: false,
                        //maxRotation: 0,
                        //minRotation: 0
                    },
                    type: 'time',
                    time: {
                        minUnit: 'day',
                        displayFormats: {
                            'millisecond': 'MMM DD',
                            'second': 'MMM DD',
                            'minute': 'MMM DD',
                            'hour': 'MMM DD',
                            'day': 'MMM DD',
                            'week': 'MMM DD',
                            'month': 'MMM DD',
                            'quarter': 'MMM DD',
                            'year': 'MMM DD',
                        }
                    },
                }],
                yAxes: [{
                    position: "left",
                    "id": "y-axis-0"
                }, {
                    ticks: {
                        min: 1.000,
                        max: 1.050
                    },
                    position: "right",
                    "id": "y-axis-1"
                }]
            }
        };
        
        vm.getQuestionDefinitionText = function (id) {
            for (var i in vm.questionDefinitions) {
                if (vm.questionDefinitions[i].id == id) {
                    return vm.questionDefinitions[i].shortText;
                } 
            };
        };

        vm.showChartLineSelect = function () {
            сhartLineSelect = $ionicPopup.show({
                templateUrl: 'app/layout/lineSelect.html',
                scope: $scope,
                cssClass: 'line-select-container',
            });
        };

        vm.submitModal = function () {
            getGeneralChart();
            сhartLineSelect.close();
        };

        vm.closeChartLineSelect = function () {
            сhartLineSelect.close();
        };

        vm.selectLine = function (id) {
            var indexOf = vm.generalChartOptions.hiddenSlices.indexOf(id);

            if (indexOf !== -1) {
                vm.generalChartOptions.hiddenSlices.splice(indexOf, 1)
            } else {
                vm.generalChartOptions.hiddenSlices.push(id)
            }
        };

        getGeneralChart();
        getQuestionDefinitions();
        getWeightUsg();

        vm.setGeneralChartData = function (responseData) {
            if (!responseData || responseData.length == 0) return;
            var data = [];
            var series = [];
            angular.forEach(responseData, function (question, questionKey) {
                series.push(question.id);
                var index = vm.generalChartSelected.indexOf(question.id);
                angular.forEach(question.data, function (obj, key) {
                    if (!data[index]) data[index] = [];
                    data[index].push({
                        x: moment(obj.date),
                        y: obj.value,
                        id: question.id
                    });
                })
            })
            vm.generalChartSeries = series;
            vm.generalChartData = data;
        };


        vm.setWeightUsgData = function (responseData) {
            if (!responseData || responseData.length == 0) return;

            var data = [[],[]];
            angular.forEach(responseData, function (obj, questionKey) {
                data[0].push({
                    x: moment(obj.date),
                    y: obj.weight,
                    id: 'weight',
                    yAxisID: "y-axis-0",
                });
                data[1].push({
                    x: moment(obj.date),
                    y: obj.usg,
                    id: 'usg',
                    yAxisID: "y-axis-1",
                });
            })
            vm.weightUsgData = data;
        };

        function getQuestionDefinitions() {
            chartsManager.getQuestionDefinitions()
            .then(function (response) {
                vm.questionDefinitions = angular.copy(response.data);
            })
            .catch(function (response) {
                console.error(response);
            });
        };

        function getWeightUsg() {
            chartsManager.getWeightUsg({ days: 7 })
            .then(function (response) {
                if (!response || !response.data || response.data.length == 0) {
                    vm.weightUsgData = [null];
                } else {
                    vm.setWeightUsgData(angular.copy(response.data));
                };
            })
            .catch(function (response) {
                console.error(response);
            });
        };

        function getGeneralChart() {
            chartsManager.getTrsqChart({ query: vm.generalChartSelected.toString(), days: 7})
            .then(function (response) {
                if (!response || !response.data || response.data.length == 0) {
                    vm.generalChartData = [null];
                } else {
                    vm.setGeneralChartData(angular.copy(response.data));
                };
            })
            .catch(function (response) {
                console.error(response);
            });
        };
    }])
}());