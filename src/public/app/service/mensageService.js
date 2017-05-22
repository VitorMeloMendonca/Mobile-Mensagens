angular.module('MensageService', [])

.factory('MensageService', function ($http) {
    
    var mensageFactory = {};

    mensageFactory.create = function (mensagemData) {
        return $http.post('/nodeAPI/SaveMensage', mensagemData);
    };
    
    mensageFactory.update = function (mensagemData) {
        return $http.post('/nodeAPI/UpdateMensage', mensagemData);
    };
    
    mensageFactory.UpdateStatus = function (mensagemData) {
        return $http.post('/nodeAPI/UpdateStatusMensage', mensagemData);
    };
    
    mensageFactory.remove = function (mensagemData) {
        return $http.post('/nodeAPI/RemoveMensage', mensagemData);
    };
    
    mensageFactory.all = function () {
        return $http.get('/nodeAPI/AllMensages');
    };

    return mensageFactory;
})