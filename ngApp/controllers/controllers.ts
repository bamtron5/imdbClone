namespace imdbclone.Controllers {
    export class MainController {
      public currentUser;

      logout() {
        this.userService.logout().then((res) => {
          this.$cookies.remove('token');
          this.$state.transitionTo('main.home', null, {reload: true, notify:true});
        }).catch((err) => {
          //TODO error handler
          console.log(err);
        });
      }

      constructor(
        currentUser: ng.ui.IResolvedState,
        private userService: imdbclone.Services.UserService,
        private $cookies: ng.cookies.ICookiesService,
        private $state: ng.ui.IStateService
      ) {
        this.currentUser = currentUser;
      }
    }

    export class UserController {
      public user;
      public currentUser;
      public UserService;
      public CookieService;
      public isLoggedIn;

      public login(user) {
        this.UserService.login(user).then((res) => {
          this.CookieService.put('token', res.token);
          this.$state.transitionTo('main.home', null, {reload: true, notify:true});
        }).catch((err) => {
          alert('Bunk login, please try again.');
        });
      }

      public register(user) {
        this.userService.register(user).then((res) => {
          this.$state.go('main.login');
        }).catch((err) => {
          console.log(err);
          alert('Registration error: please try again.');
        });
      }

      public logout() {
        this.UserService.logout().then((res) => {
          this.CookieService.remove('token');
          this.$state.transitionTo('main.home', null, {reload: true, notify:true});
        }).catch((err) => {
          //TODO error handler
          console.log(err);
        });

      }

      constructor(
        private userService:imdbclone.Services.UserService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private $cookies: ng.cookies.ICookiesService
      ) {
        this.UserService = userService;
        this.CookieService = $cookies;
        // this.isLoggedIn = $state.data.currentUser
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
            //console.log(err);
          });
        }

        public currentMovies() {
             this.movieService.listMovies().then((movies) => {
                this.movies = movies;
            }).catch((err) => {
                //console.log(err)
            })
        }

        constructor(
          private currentUser: ng.ui.IResolvedState,
          private movieService:imdbclone.Services.MovieService,
          private $state: ng.ui.IStateService
        ) {
           this.currentMovies();
           this.currentUser = currentUser;
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
