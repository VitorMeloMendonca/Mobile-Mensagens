angular.module('UserService', [])

.factory('UserService', function ($http) {
    
    var userFactory = {};
    
    userFactory.create = function (userData) {
        return $http.post('/nodeAPI/signup', userData);
    };
    
    userFactory.update = function (userData) {
        return $http.post('/nodeAPI/UpdateUser', userData);
    };
    
    userFactory.remove = function (userData) {
        return $http.post('/nodeAPI/RemoveUser', userData);
    };

    userFactory.all = function () {
        return $http.get('/nodeAPI/users');
    };
    
    userFactory.UserByUsername = function (params) {
        return $http.get('/nodeAPI/UserByUsername/', { params: { username: params.username }});
    };
    
    userFactory.UpdateRole = function (userData) {
        return $http.post('/nodeAPI/UpdateRoleUser', userData);
    };

    return userFactory;

});