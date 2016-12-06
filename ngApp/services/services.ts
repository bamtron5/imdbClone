namespace imdbclone.Services {

    export class UserService {
      private LoginResource;
      private LogoutResource;
      private RegisterResource;
      public UserResource;
      private isLoggedIn;

      public login(user) {
        return this.LoginResource.save(user).$promise;
      }

      public logout() {
        return this.LogoutResource.get().$promise;
      }

      public register(user) {
        return this.RegisterResource.save(user).$promise;
      }

      public getUser(id) {
        return this.UserResource.get(id).$promise;
      }

      public getCurrentUser() {
        return this.$resource('/api/currentuser').get().$promise;
      }

      constructor(private $resource: ng.resource.IResourceService) {

        this.LogoutResource = $resource('/api/Logout/Local');
        this.LoginResource = $resource('/api/Login/Local');
        this.RegisterResource = $resource('/api/Register');
        this.UserResource = $resource('/api/users/:id');
      }
    }

    angular.module('imdbclone').service('userService', UserService);

    /*Movie Service =================================*/


    export class MovieService {
        private MovieResource;
        public storeMovie(movie) {
            return this.MovieResource.save(movie).$promise;
        }
        public deleteMovie(movieId) {
            return this.MovieResource.remove({_id:movieId}).$promise;
        }
        public getMovie(movieId) {
            return this.MovieResource.get({_id:movieId}).$promise;
        }

        public editMovie(movie) {
            return this.MovieResource.save({_id:movie.id}, movie).$promise;
        }

        public listMovies() {
            return this.MovieResource.query().$promise;
        }

        constructor($resource: ng.resource.IResourceService) {
            this.MovieResource = $resource('/api/movies/:_id');
        }
    }
    angular.module('imdbclone').service('movieService', MovieService);
}
