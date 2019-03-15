(function () {
    angular.module('app').factory('dictionaryManager', ['httpService', function (httpService) {

        var key = 'dictionary';

        var urlPrefix = 'api/' + key + '/';

        var db = new Dexie('comparateur_credit');
        db.version(1).stores({
            statics: ''
        });

        return {
            entities: null,
            getRemoteDictionary: function (vm) {

                var self = this;

                return httpService.get({
                    url: urlPrefix
                })
                    .then(function (response) {
                        if (response.data) {

                            var entities = angular.copy(response.data);

                            vm[key] = angular.copy(entities);

                            self.entities = angular.copy(entities);

                            db.statics.put(entities, key);
                        }
                    });
            },
            getDictionaryPromise: function () {
                var self = this;

                var promise = new Promise(function (resolve, reject) {

                    if (self.entities) {
                        resolve(self.entities);
                    }

                    db.statics.get(key)
                        .then(data => {

                            if (!data) {
                                throw new Error();
                            }

                            resolve(data);
                        })
                        .catch(error => {
                            return httpService.get({
                                url: urlPrefix
                            })
                                .then(function (response) {
                                    if (response.data) {

                                        var entities = angular.copy(response.data);
                                        self.entities = angular.copy(entities);
                                        db.statics.put(entities, key);

                                        resolve(entities);
                                    }
                                });
                        });

                });

                return promise;
            },
            getDictionary: function (vm, remote) {

                var self = this;

                if (self.entities) {
                    vm[key] = angular.copy(self.entities);
                }

                if (remote) {
                    self.getRemoteDictionary(vm);
                }
                else {
                    db.statics.get(key)
                        .then(data => {
                            vm[key] = angular.copy(data);
                            $rootScope.$apply();

                            self.entities = angular.copy(data);

                            self.getRemoteDictionary(vm);
                        })
                        .catch(error => {
                            self.getRemoteDictionary(vm);
                        });
                }
            },
            getItem: function (itemId) {
                var self = this;

                var promise = new Promise(function (resolve, reject) {

                    db.statics.get(key)
                        .then(data => {

                            self.entities = angular.copy(data);

                            console.info('self.entities', self.entities);

                            self._getItemPartial(itemId, resolve, reject);
                        })
                        .catch(error => {
                            return httpService.get({
                                url: urlPrefix
                            })
                                .then(function (response) {
                                    if (response.data) {

                                        var entities = angular.copy(response.data);
                                        self.entities = angular.copy(entities);
                                        db.statics.put(entities, key);

                                        self._getItemPartial(itemId, resolve, reject);
                                    }
                                });
                        });
                });

                return promise;
            },
            _getItemPartial: function (itemId, resolve, reject) {

                var self = this;

                var item = _.find(self.entities, function (i) {
                    return i.id === itemId;
                });

                console.info('item', item);

                if (!item) {
                    var error = {
                        config: null,
                        data: {
                            message: 'Not Found.'
                        },
                        headers: null,
                        status: 404,
                        statusText: null
                    };

                    reject(error);
                }

                resolve(item);
            },
            createItem: function (dictionaryItem) {
                return httpService.post({
                    url: urlPrefix,
                    data: dictionaryItem
                });
            },
            updateItem: function (item) {
                return httpService.put({
                    url: urlPrefix + item.id,
                    data: item
                });
            },
            deleteItem: function (itemId) {
                return httpService.delete({
                    url: urlPrefix + itemId
                });
            }
        };

    }]);
}());