(function () {
    angular.module('app').controller('teamCtrl', ['$scope', '$q','$state', '$stateParams', '$ionicActionSheet', '$ionicModal', '$ionicPopup', '$ionicLoading', 'deviceManager', 'tools', 'teamsManager', 'accountManager', '$scope', 'usersManager', 'teamInvitesManager',
        function ($scope, $q, $state, $stateParams, $ionicActionSheet, $ionicModal, $ionicPopup, $ionicLoading, deviceManager, tools, teamsManager, accountManager, $scope, usersManager, teamInvitesManager) {

            var vm = this;
            var teamId = $stateParams.teamId;
            accountManager.initController(vm, callback);

            vm.loading = false;
            tools.watchLoading(vm);
            vm.errors = [];

            vm.showDeleteInvite = false;

            vm.teamUsers = [];
            vm.users = [];
            vm.invites = [];

            vm.contacts = [];

            function callback(userInfo) {

                $ionicModal.fromTemplateUrl('addUserToTeam.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    vm.modal = modal;
                });

                $scope.$on('$destroy', function () {
                    vm.modal.remove();
                });

                vm.openAddUserToTeamModal = function () {
                    getUsersForTeam();
                    vm.modal.show();
                };

                vm.closeAddUserToTeamModal = function () {
                    vm.modal.hide();
                };

                $ionicModal.fromTemplateUrl('chatWithTeam.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    vm.modal2 = modal;
                });

                $scope.$on('$destroy', function () {
                    vm.modal2.remove();
                });

                vm.updateData = function () {
                    getData();
                };

                vm.openChatWithTeamModal = function () {
                    vm.modal2.show();
                };

                vm.closeChatWithTeamModal = function () {
                    vm.modal2.hide();
                };

                vm.showConfirmDeleteUser = function (user) {                 

                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Delete User',
                        template: 'Do you want to delete <b>' + user.firstName + ' ' + user.lastName + '</b> ?'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {

                            vm.loading = true;
                            vm.errors = [];

                            teamsManager.deleteUserFromTeam(teamId, user.id)
                            .success(function () {

                                vm.loading = false;
                                vm.showDeleteUser = false;

                                getData();
                            })
                            .error(function (error) {

                                vm.loading = false;
                                vm.showDeleteUser = false;

                                tools.setError(vm, error, false);

                                var alertPopup = $ionicPopup.alert({
                                    title: '<b>Can not delete the user.</b>',
                                    template: vm.errors[0]
                                  });
                            });
                        }
                        else {
                            vm.showDeleteUser = false;
                        }
                    });
                };

                // Create Wallet
                vm.createWallet = function () {
                    if (!userInfo.stripeProfileComplete) {
                        var completeProfilePopup = $ionicPopup.confirm({
                            title: 'Your profile needs to be completed',
                            template: 'In order to create a wallet you need to complete your profile. Do you want to go to your profile now ?'
                        });

                        completeProfilePopup.then(function (res) {
                            if (res) {
                                $state.go('app.profile');
                            } else {

                            }
                        });
                    }
                    else if (!userInfo.hasCreditCard) {
                        var createCreditCardPopup = $ionicPopup.confirm({
                            title: 'Credit card infos need to be set',
                            template: 'In order to create a wallet you need to set credit card infos. Do you want to go to your credit card infos now ?'
                        });

                        createCreditCardPopup.then(function (res) {
                            if (res) {
                                $state.go('app.creditCard');
                            } else {

                            }
                        });
                    }
                    else {
                        $state.go('app.createWallet', { teamId: teamId });
                    }

                    console.info(this.text);
                };

                vm.deleteTeam = function () {
                    var confirmDeletePopup = $ionicPopup.confirm({
                        title: 'Delete Team',
                        template: 'By deleting this team, you will delete anything related to it. Do you want to proceed anyway?'
                    });

                    confirmDeletePopup.then(function (res) {
                        if (res) {
                            vm.errors = [];

                            teamsManager.deleteTeam(teamId)
                            .success(function () {
                                $state.go('app.teams');
                            })
                            .error(function (error) {
                                tools.setError(vm, error, false);
                                
                                var alertPopup = $ionicPopup.alert({
                                    title: '<b>Can not delete the user.</b>',
                                    template: vm.errors[0]
                                    });
                            });
                        } else {
                            console.log('You are not sure');
                        }
                    });

                    return true;
                };

                vm.goToWallet = function (wallet) {

                    if (wallet.isMember) {
                        $state.go('app.wallet', { teamId: teamId, walletId: wallet.id });
                    } else {
                        $ionicPopup.alert({
                            title: 'You are not the member of the wallet yet.',
                            template: 'Only the members who accepted the invite could access the wallet.'
                        });
                    }

                };

                vm.showConfirmDeleteInvite = function (invite) {

                    var displayName = invite.displayName;
                    if(invite.firstName && invite.lastName){
                        displayName = invite.firstName + ' ' + invite.lastName;
                    }   

                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Delete Invite',
                        template: 'Do you want to delete the invite sent to <b>' + displayName + '</b> ?'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {

                            vm.loading = true;
                            vm.errors = [];

                            teamInvitesManager.deleteTeamInvite(teamId, invite.id)
                            .success(function () {

                                vm.showDeleteInvite = false;

                                getInvites().finally(function () {
                                    vm.loading = false;
                                });

                            })
                            .error(function (error) {

                                vm.loading = false;
                                vm.showDeleteInvite = false;

                                tools.setError(vm, error, true);

                                console.error(error);
                            });
                        }
                        else {
                            vm.showDeleteInvite = false;
                        }
                    });
                };

                vm.inviteUser = function (contact) {
                    console.info('contact', contact);

                    vm.loading = true;

                    teamInvitesManager.teamInvite(teamId, contact)
                    .success(function () {

                        vm.modal.hide();

                        getInvites().finally(function () {
                            vm.loading = false;
                        });

                    })
                    .error(function (error) {

                        vm.loading = false;

                        tools.setError(vm, error, true);

                        console.error(error);
                    });
                };

                function getTeamUsers() {

                    vm.loading = true;
                    vm.errors = [];

                    return teamsManager.getTeamUsers(teamId)
                     .success(function (data) {
                         vm.teamUsers = data;

                         console.info('vm.teamUsers', vm.teamUsers);
                     })
                     .error(function (error) {
                         tools.setError(vm, error, true);
                     });

                };

                function getUsersForTeam() {

                    vm.loading = true;
                    vm.errors = [];

                    usersManager.getUsersForTeam(teamId)
                    .success(function (data) {

                        vm.loading = false;

                        vm.users = data;

                        console.info(vm.users);
                    })
                    .error(function (error) {

                        vm.loading = false;

                        tools.setError(vm, error, true);
                    });
                };

                function getInvites() {

                    vm.loading = true;
                    vm.errors = [];

                   return teamInvitesManager.getTeamInvites(teamId)
                    .success(function (data) {

                        vm.invites = data;
                        console.info('vm.invites', vm.invites);
                    })
                    .error(function (error) {

                        tools.setError(vm, error, true);

                        console.error(error);
                    });
                };

                function getTeam() {

                    vm.loading = true;
                    vm.errors = [];

                    return teamsManager.getTeam(teamId)
                     .success(function (data) {

                         vm.team = data;
                         console.info(vm.team);
                     })
                     .error(function (error) {
                         tools.setError(vm, error, true);
                     });
                };

                function getWallets() {
                    vm.loading = true;
                    vm.errors = [];

                   return teamsManager.getWallets(teamId)
                    .success(function (data) {

                        vm.wallets = data;

                        console.info(vm.wallets);
                    })
                    .error(function (error) {

                        tools.setError(vm, error, true);
                    });
                };

                getData();

                function getData() {
                    var promises = [getTeam(), getTeamUsers(), getInvites(), getWallets(), getContacts()];
                    $q.all(promises)
                    .then(function () {
                        vm.loading = false;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }

                function getContacts(){
                    deviceManager.getContacts()
                    .then(function(contacts){
                        if(contacts && contacts.length){
                            var tmp = [];
                            for(var i = 0; i < contacts.length; i++){
                                var contact = contacts[i];
                                if(contact.phoneNumbers && contact.phoneNumbers.length){
                                    for(var j = 0; j < contact.phoneNumbers.length; j++){
                                        var phoneNumber = contact.phoneNumbers[j].value;

                                        tmp.push({
                                            displayName: contact.displayName,
                                            phoneNumber: phoneNumber
                                        });
                                    }
                                }
                            }
                            vm.contacts = _.sortBy(tmp, function(item){
                                return item.displayName;
                            });
                        }
                        
                        console.info('getContacts', vm.contacts);
                    })
                    .catch(function(error){
                        console.error('getContacts', error);
                    });
                }
            };

        }]);
}());