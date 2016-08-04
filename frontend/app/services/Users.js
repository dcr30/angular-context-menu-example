angular.module('app')
    .factory('Users', ($resource) => {
        return $resource('http://localhost:3000/users/:id', null, {
            update: { method: 'PUT' }
        });
    });