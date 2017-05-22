angular.module('ListMensagesController', ['MensageService'])

.controller('ListMensagesController', function ($scope, MensageService, CategoryService, $scope) {
    
    
    $scope.categories = CategoryService.all();

    $scope.Edit = function (mensageData) {
        //mensageData.text = 'Feliz aniversário.';

        MensageService.update(mensageData).then(function (response) {
            $scope.mensages = response.data;
        });
    }

    $scope.Remove = function (id) {
        console.log(id);
    }

    MensageService.all().then(function (response) {
        $scope.mensages = response.data;
    });
})