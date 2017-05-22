angular.module('mainController', [])

.controller('MainController', function ($rootScope, $scope, $location, Auth, AuthToken, UserService, toaster) {
    var vm = this;
    
    $scope.loginData = { username: null, password: null };
    
    $rootScope.loggedIn = Auth.isLoggedIn();
    setName();
    
    function setName() {
        var user = JSON.parse(AuthToken.getUser());
        $rootScope.name = user != undefined ? user.name : null;
        $rootScope.role = user != undefined ? user.role : null;
    };
    
    $rootScope.$on('$rootChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn();
        
        Auth.getUser().then(function (data) {
            vm.user = data.data;
        });
    });
    
    $scope.doLogin = function () {
        
        var validate = false;
        var validate2 = false;
        
        if (($scope.loginData.username == null || $scope.loginData.username == "") && ($scope.loginData.password == "" || $scope.loginData.password == null)) {
            toaster.info('Mensagem', 'Usuário e senha são obrigatórios serem informados.');
            validate = true;
        }
        
        if (($scope.loginData.username == null || $scope.loginData.username == "") && !validate) {
            toaster.info('Mensagem', 'Usuário é obrigatório ser informado.');
            validate2 = true;
        }
        
        if (($scope.loginData.password == "" || $scope.loginData.password == null) && !validate) {
            toaster.info('Mensagem', 'Senha é obrigatório ser informado.');
            validate2 = true;
        }
        
        if (validate || validate2) {
            return;
        }
        
        Auth.login($scope.loginData.username, $scope.loginData.password).success(function (data) {
            if (data.success && !data.errors) {
                
                AuthToken.setUser(data.user);
                $rootScope.name = data.user.name;
                $rootScope.role = data.user.role;

                $rootScope.loggedIn = true;
                $location.path('/');
            }
            else {
                toaster.warning('Mensagem', data.message);
            }
        });
    };

    $scope.doLogout = function () {
        AuthToken.setUser();
        $rootScope.loggedIn = false;
        Auth.logout();
        $location.path('/');
    };
});