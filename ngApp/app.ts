namespace imdbclone {

    angular.module('imdbclone', ['ui.router', 'ngResource', 'ui.bootstrap']).config((
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $locationProvider: ng.ILocationProvider
    ) => {
        // Define routes
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/ngApp/views/home.html',
                controller: imdbclone.Controllers.HomeController,
                controllerAs: 'controller'
            })
            .state('edit', {
                url: '/edit/:id',
                templateUrl: '/ngApp/views/edit.html',
                controller: imdbclone.Controllers.EditController,
                controllerAs: 'controller'
            })
            .state('register', {
              url: '/register',
              templateUrl: '/ngApp/views/register.html',
              controller: imdbclone.Controllers.UserController,
              controllerAs: 'controller'
            })
            .state('login', {
              url: '/login',
              templateUrl: '/ngApp/views/login.html',
              controller: imdbclone.Controllers.UserController,
              controllerAs: 'controller'
            })
            .state('notFound', {
                url: '/notFound',
                templateUrl: '/ngApp/views/notFound.html'
            });

        // Handle request for non-existent route
        $urlRouterProvider.otherwise('/notFound');

        // Enable HTML5 navigation
        $locationProvider.html5Mode(true);
    });



}
