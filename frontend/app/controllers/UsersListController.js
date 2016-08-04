angular.module('app')
    .controller('UsersListController', ($scope, Users) => {
        $scope.updateUsersList = () => {
            Users.get().$promise.then((result) => $scope.users = result.users);
        }

        $scope.removeUser = (id) => {
            Users.delete({id}).$promise.then(() => $scope.updateUsersList());
        }

        $scope.setUserGroup = (id, group) => {
            if (!id || !group) {
                return;
            }
            Users.update({id}, {group}).$promise.then(() => $scope.updateUsersList());
        }

        $scope.updateUsersList();
    });