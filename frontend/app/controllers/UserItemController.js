angular.module('app')
    .controller('UserItemController', ($scope, Users) => {
        let groupLables = {
            admin: {text: 'Admin', class: 'info'},
            moderator: {text: 'Moderator', class: 'primary'},
            everyone: {text: 'Normal user', class: 'default'}
        }
        $scope.groupLabel = groupLables[$scope.user.group] || groupLables.everyone;

        $scope.onlineLabel = {
            class: $scope.user.online ? 'success' : 'default',
            text: $scope.user.online ? 'Online' : 'Offline'
        }

        let defaultContextMenu = [
            {text: 'Show profile', click: () => alert($scope.user.name)},
            {text: 'Add to friends', enabled: false},
            {text: 'Send message', enabled: false},
            {text: 'Manage', submenu: [
                {text: 'Manage rights', submenu: [
                    {text: 'Give admin rights', enabled: 'user.group !== "admin"', click: 'setUserGroup(user._id, "admin")'},
                    {text: 'Give moderator rights', enabled: 'user.group !== "moderator"', click: 'setUserGroup(user._id, "moderator")'},
                    {text: 'Remove rights', enabled: 'user.group !== "everyone"', click: 'setUserGroup(user._id, "everyone")'}
                ]},
                {text: 'Edit profile', enabled: 'user.group !== "admin"', submenu: [
                    {text: 'Edit name', click: () => alert('TODO EDIT: ' + $scope.user.name)},
                    {text: 'Edit email', click: () => alert('TODO EDIT: ' + $scope.user.email)}
                ]},
                {text: 'Remove user', enabled: 'user.group == "everyone"', click: () => $scope.removeUser($scope.user._id)}
            ]},
        ];

        $scope.contextMenu = defaultContextMenu;
    });