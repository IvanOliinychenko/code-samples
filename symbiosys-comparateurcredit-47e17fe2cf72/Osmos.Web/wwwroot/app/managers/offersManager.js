(function () {

    angular.module('app').factory('offersManager', ['httpService', 'partnersManager', function (httpService, partnersManager) {

        var urlPrefix = 'api/offers/';

        return {
            createOffer: function (offer) {
                return httpService.post({
                    url: urlPrefix,
                    data: offer
                });
            },
            getOffers: function (categoryName, amount, duration) {

                categoryName = categoryName || '';
                amount = amount || '';
                duration = duration || '';

                var url = urlPrefix + '?categoryName=' + categoryName + '&amount=' + amount + '&duration=' + duration;

                return httpService.get({
                    url: url
                });
            },
            deleteOffer: function (offerId) {
                return httpService.delete({
                    url: urlPrefix + offerId
                });
            },
            updateOffer: function (offer) {
                return httpService.put({
                    url: urlPrefix + offer.id,
                    data: offer
                });
            },
            map: function (offer) {
                offer.partner = partnersManager.map(offer.partner);
                return offer;
            }
        };

    }]);

}());