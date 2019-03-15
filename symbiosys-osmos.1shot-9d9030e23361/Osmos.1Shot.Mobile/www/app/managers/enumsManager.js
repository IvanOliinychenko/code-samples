(function () {
    angular.module('app').factory('enumsManager', ['httpService', function (httpService) {
        var urlPrefix = 'api/enums/';

        return {
            getReportTypes: function () {
                return httpService.get({
                    url: urlPrefix + 'reportTypes'
                });
            }
        };
    }]);
}());