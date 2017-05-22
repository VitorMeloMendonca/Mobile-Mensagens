angular.module('CategoryService', [])

.factory('CategoryService', function ($http) {
    
    var categoryFactory = {};
    
    categoryFactory.all = function () {
        
        var category =  new Array (
                "Amizade",
                "Amor",
                "Aniversário",
                "Casamento",
                "Descupla esfarrapada",
                "Falecimento",
                "Motivacionais",
                "Nascimento",
                "Picantes",
                "Religiosa"
            );
                
        return category;
    };
    
    return categoryFactory;
})