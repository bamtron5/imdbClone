namespace imdbclone.Services {

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
    export class MyService {

    }
    angular.module('imdbclone').service('myService', MyService);
    }
