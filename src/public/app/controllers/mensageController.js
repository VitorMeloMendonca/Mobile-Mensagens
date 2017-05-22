angular.module('MensageController', ['MensageService'])

.controller('MensageController', function ($scope, MensageService, CategoryService, $location, $window, toaster, $mdDialog, AuthToken) {
    
    $scope.mensageData = {};
    $scope.mensages = [];
    $scope.EditMode = false;
    $scope.index = null;
    $scope.user = {};
    getRole();
    
    function getRole() {
        $scope.user = JSON.parse(AuthToken.getUser());
        $scope.role = $scope.user != undefined ? $scope.user.role : null;
    };
    
    $scope.categories = CategoryService.all();
    
    $scope.Save = function () {
        
        if ($scope.EditMode && $scope.mensageData._id != null) {
            MensageService.update($scope.mensageData).then(function (response) {
                if (response.data.errors) {
                    toaster.info('Mensagem', response.data.message);
                }
                else {
                    $scope.mensages[$scope.index] = response.data.mensage;
                    toaster.success('Mensagem', response.data.message);
                    clean();
                }
            });
        }
        else {
            
            $scope.mensageData.idUser = $scope.user._id;

            MensageService.create($scope.mensageData).then(function (response) {

                if (response.data.errors) {
                    toaster.info('Mensagem', response.data.message);
                }
                else {
                    clean();
                    $scope.mensages.push(response.data.mensage);
                    toaster.success('Mensagem', response.data.message);
                }
            });
        }
    };
    
    $scope.Edit = function (item, index) {
        $scope.mensageData = { _id: item._id, category: item.category , text: item.text, author: item.author };
        $scope.EditMode = true;
        $scope.index = index;
    };
    
    $scope.Remove = function (item, index) {
        MensageService.remove(item).then(function (response) {
            if (response.data.errors) {
                toaster.info('Mensagem', response.data.message);
            }
            else {
                clean();
                $scope.mensages.splice(index, 1);
                toaster.success('Mensagem', response.data.message);
            }
        });
    };
    
    $scope.Clean = function () {
        clean();
    };
    
    $scope.Disable = function (item, index) {
        updateStatus(false, item, index)
    };
    
    $scope.Able = function (item, index) {
        updateStatus(true, item, index);
    };
    
    function updateStatus(status, item, index) {
        
        item.isActive = status;
        MensageService.UpdateStatus(item).then(function (response) {
            if (response.data.errors) {
                toaster.info('Mensagem', response.data.message);
            }
            else {
                $scope.mensages[$scope.index] = response.data.mensage;
                toaster.success('Mensagem', response.data.message);
                clean();
            }
        });
    };
    
    function clean() {
        $scope.mensageData = { _id: null, category: "", text: null, author: null };
        $scope.EditMode = false;
        $scope.index = null;
    };
    
    MensageService.all().then(function (response) {
        $scope.mensages = response.data;
    });
})

.controller('DialogController', function ($scope, $mdDialog) {
});
