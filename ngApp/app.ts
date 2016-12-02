namespace imdbclone {
  angular.module('imdbclone', ['ui.router', 'ngResource', 'ngCookies'])
    .config((
      $resourceProvider: ng.resource.IResourceServiceProvider,
      $stateProvider: ng.ui.IStateProvider,
      $urlRouterProvider: ng.ui.IUrlRouterProvider,
      $locationProvider: ng.ILocationProvider,
      $httpProvider: ng.IHttpProvider
    ) => {
      // Define routes
      //
      $stateProvider
        .state('main', {
          url: '',
          abstract: true,
          templateUrl: '/ngApp/views/main.html',
          controller: imdbclone.Controllers.MainController,
          controllerAs: 'vm',
          resolve: {
            currentUser: ['userService', function(userService) {
              return userService.getCurrentUser();
            }]
          }
        })
        .state('main.home', {
          url: '/',
          parent: 'main',
          templateUrl: '/ngApp/views/home.html',
          controller: imdbclone.Controllers.HomeController,
          controllerAs: 'controller'
        })
        .state('main.edit', {
          url: '/edit/:id',
          templateUrl: '/ngApp/views/edit.html',
          controller: imdbclone.Controllers.EditController,
          controllerAs: 'controller'
        })
        .state('main.register', {
          url: '/register',
          templateUrl: '/ngApp/views/register.html',
          controller: imdbclone.Controllers.UserController,
          controllerAs: 'controller'
        })
        .state('main.login', {
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

      //for authInterceptor factory
      // $httpProvider.interceptors.push('authInterceptor');
    }).run([
      '$rootScope', '$location', 'movieService', 'auth', 'userService',
      function($rootScope, $location, movieService, Auth, UserService) {
      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on('$stateChangeStart', function (event, next) {
        console.log(`GOING TO: ${next.url}`, );
        // Auth.isLoggedInAsync(function(loggedIn) {
        //   console.log('loggedIn', loggedIn);
        //   if (next.authenticate && !loggedIn) {
        //     $location.path('/login');
        //   }
        // });
      });
  }]);
}



//TODO authInterceptor
// .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
//   return {
//     // Add authorization token to headers
//     request: function (config) {
//       config.headers = config.headers || {};
//       if ($cookieStore.get('token')) {
//         config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
//       }
//       return config;
//     },
//
//     // Intercept 401s/500s and redirect you to login
//     responseError: function(response) {
//       if(response.status === 401) {
//         $location.path('/login');
//         // remove any stale tokens
//         $cookieStore.remove('token');
//         return $q.reject(response);
//       } else if(response.status === 500){
//         $location.path('/');
//       } else {
//         return $q.reject(response);
//       }
//     }
//   };
