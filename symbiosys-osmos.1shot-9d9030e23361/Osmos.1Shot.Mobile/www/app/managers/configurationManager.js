(function () {
    angular.module('app').factory('configurationManager', ['httpService', function (httpService) {

        return {
            config: null,
            getConfiguration: function () {

                var self = this;

                var promise = new Promise(function (resolve, reject) {

                    if (self.config) {
                        resolve(self.config);
                    }
                    else {
                        httpService.get({
                            url: 'api/configuration'
                        })
                        .success(function (data) {
                            self.config = data;
                            resolve(data);
                        })
                        .error(function (error) {
                            reject(error);
                        });
                    }

                });

                return promise;
            }
        };

    }]);
}());