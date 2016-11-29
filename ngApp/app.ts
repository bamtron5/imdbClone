namespace imdbclone {
  angular.module('imdbclone', ['ui.router', 'ngResource', 'ngCookies'])
    .config((
      $stateProvider: ng.ui.IStateProvider,
      $urlRouterProvider: ng.ui.IUrlRouterProvider,
      $locationProvider: ng.ILocationProvider,
      $httpProvider: ng.IHttpProvider
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

      //for authInterceptor factory
      // $httpProvider.interceptors.push('authInterceptor');
    }).run([
      '$rootScope', '$location', 'movieService', 'auth', 'userService',
      function($rootScope, $location, movieService, Auth, UserService) {

      console.log(Auth);
      console.log(movieService);
      console.log(UserService);
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

window['ngList'] = function allServices(mod, r) {
 var inj = angular.element(document).injector().get;
 if (!r) r = {};
 angular.forEach(angular.module(mod).requires, function(m) {allServices(m,r)});
 angular.forEach(angular.module(mod)._invokeQueue, function(a) {
   try { r[a[2][0]] = inj(a[2][0]); } catch (e) {}
 });
 return r;
};
