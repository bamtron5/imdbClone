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
            currentUser: ['userService', '$cookieStore', function(userService, $cookieStore) {
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
      $httpProvider.interceptors.push('authInterceptor');
    }).factory('authInterceptor', function ($q, $cookies, $location) {
      return {
        // Add authorization token to headers
        request: function (config) {
          //because cookies are set by server to client
          //$cookieStore is worthlesss
          let cOne = document.cookie.split(';');
          let cTwo = _.map(cOne, (v) => {
             return v.split('=');
          })
          let cObj = {};
          _.forEach(cTwo, (v) => {
            cObj[v[0]] = v[1];
          });

          config.headers = config.headers || {};
          if (cObj['token']) {
            config.headers.Authorization = 'Bearer ' + cObj['token'];
          }

          console.log(config);
          return config;
        },

        // Intercept 401s/500s and redirect you to login
        responseError: function(response) {
          if(response.status === 401) {
            alert('unauthorized.  please bounce.');
            $location.path('/login');
            // good place to explain to the user why or redirect
            // remove any stale tokens
            $cookies.token;
            return $q.reject(response);
          } else {
            return $q.reject(response);
          }
        }
      }
    })

    .run([
      '$rootScope', '$location', 'movieService', 'auth', 'userService',
      function($rootScope, $location, movieService, Auth, UserService) {
      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on('$stateChangeStart', function (event, next) {
        console.log(`GOING TO: ${next.url}`);
      });
  }]);
}
