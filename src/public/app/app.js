angular.module('Mensage', ['appRoutes', 'mainController', 'authService', 'UserController', 'UserService', 'MensageController', 'MensageService'
    , 'ngSanitize', 'ngAnimate', 'toaster', 'CategoryService','ngMaterial'])

.config(function ($httpProvider) {
    
    $httpProvider.interceptors.push('AuthInterceptor');
})