namespace imdbclone.Controllers {
    export class UserController {
      public user;
      public currentUser;
      public UserService;
      public CookieService;

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

      public login(user) {
        this.userService.login(user).then((res) => {
          this.CookieService.put('token', res.token);
          this.UserService.getUser(res._id).then((user) => {
            this.$rootScope['currentUser'] = user.user;
            console.log('-- Current User in $rootScope --');
            console.log(this.$rootScope['currentUser']);
            this.$state.go('home');
          }).catch((err) => {
            //TODO logout and notify
          });
        }).catch((err) => {
          alert('Bunk login, please try again.');
        });
      }

      public register(user) {
        this.userService.register(user).then((res) => {
          this.$state.go('login');
        }).catch((err) => {
          alert('Registration error: please try again.');
        });
      }

      public logout() {
        //destroy the cookie
        this.CookieService.remove('token');
        this.$state.go('home');
      }

      constructor(
        private userService:imdbclone.Services.UserService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private $cookies: ng.cookies.ICookiesService
      ) {
        this.UserService = userService;
        this.CookieService = $cookies;
      }
    }

    /*Home Controller =================================*/

    export class HomeController {
        public movies;
        public newMovie;
        public sendRating(movie) {
            this.movieService.editMovie(movie).then(() => {
                this.currentMovies();
            });
        }
        public movieAdd() {
            this.movieService.storeMovie(this.newMovie).then((movies) => {
                console.log(movies)
                this.currentMovies();
            }).catch((err) => {
                console.log(err)
            })
        }

        public removeMovie(movieId) {
          this.movieService.deleteMovie(movieId).then(() => {
              this.currentMovies();
          }).catch((err) => {
            console.log(err);
          });
        }

        public currentMovies() {
             this.movieService.listMovies().then((movies) => {
                this.movies = movies;
            }).catch((err) => {
                console.log(err)
            })
        }

        constructor(private movieService:imdbclone.Services.MovieService) {
           this.currentMovies();
        }
    }


    export class EditController {
        public movie;

        updateMovie() {
            this.movieService.editMovie(this.movie).then(() => {
                console.log("edited");
                this.$state.go("home");
            }).catch((err) => {
                console.log(err);
            })
        }

        constructor(
            private movieService: imdbclone.Services.MovieService,
            private $state: ng.ui.IStateService,
            private $stateParams: ng.ui.IStateParamsService
        ) {
            console.log($stateParams);
            let movieId = $stateParams['id'];
            this.movieService.getMovie(movieId).then((movie) => {
                this.movie = movie;
            }).catch((err) => {
                console.log(err);
            }) ;
        }
    }

}
