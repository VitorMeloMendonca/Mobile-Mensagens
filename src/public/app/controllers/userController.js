angular.module('UserController', ['UserService'])

.controller('UserController', function ($scope, UserService, $location, $window, toaster ) {
    
    $scope.index = null;

    $scope.Edit = function (item, index) {
        $scope.userData = { _id: item._id, name: item.name , username: item.username , password: null };
        $scope.EditMode = true;
        $scope.index = index;
    };
    
    $scope.Remove = function (item, index) {

        UserService.remove(item).then(function (response) {
            $scope.userData = {};
            
            if (response.data.errors) {
                toaster.info('Usuário', response.data.message);
            }
            else {
                $scope.userData = { _id: null, name: null, username: null , password: null };
                $scope.EditMode = false;
                $scope.users.splice(index, 1);
                toaster.success('Usuário', response.data.message);
            }
        });
    };
    
    $scope.UnAdmin = function (item, index) {
        changeRole('user', item, index);
    };
    
    $scope.Admin = function (item, index) {
        changeRole('admin', item, index);
    };
    
    function changeRole(status, item, index) {
    
        item.role = status;
        UserService.UpdateRole(item).then(function (response) {
            if (response.data.errors) {
                toaster.info('Usuário', response.data.message);
            }
            else {
                $scope.users[$scope.index] = response.data.user;
                toaster.success('Usuário', response.data.message);
                clean();
            }
        });
    };
    
    $scope.Clean = function () {
        $scope.userData = { _id: null, name: null, username: null , password: null };
        $scope.EditMode = false;
        $scope.index = null;
    };
    
    UserService.all().success(function (data) {
        $scope.users = data;
    });
    
    $scope.SignUp = function () {
        
        if ($scope.EditMode) {
            UserService.update($scope.userData).then(function (response) {
                if (response.data.errors) {
                    toaster.info('Usuário', response.data.message);
                }
                else {
                    $scope.userData = { _id: null, name: null, username: null , password: null };
                    $scope.EditMode = false;
                    $scope.users[$scope.index] = response.data.user
                    toaster.success('Usuário', response.data.message);
                }
            });
        }
        else {
            UserService.create($scope.userData).then(function (response) {
                
                if (response.data.errors || response.data.errmsg) {
                    toaster.info('Usuário', response.data.errmsg);
                }
                else {
                    $scope.userData = { _id: null, name: null, username: null , password: null };
                    $scope.EditMode = false;
                    toaster.success('Usuário', response.data.message);
                    $scope.users.push(response.data.user);
                    $window.localStorage.setItem('token', response.data.token);
                }
            });
        }
    };

});