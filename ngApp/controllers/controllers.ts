namespace imdbclone.Controllers {
    export class UserController {
      public helloworld;
      public user;

      public login(user) {
        this.userService.login(user).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
      }

      public register(user) {
        this.userService.register(user).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
      }

      constructor(private userService:imdbclone.Services.UserService) {
        this.helloworld = 'helloworld';
      }
    }

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
           this.currentMovies()
        }
    }


    export class EditController {
        public movie;

        updateMovie() {
            this.movieService.editMovie(this.movie).then(() => {
                console.log("edited");
                this.$state.go("home");
            }).catch((err) => {
                console.log(err)
            })
        }

        constructor(
            private movieService: imdbclone.Services.MovieService,
            private $state: ng.ui.IStateService,
            private $stateParams: ng.ui.IStateParamsService
        ) {
            console.log($stateParams)
            let movieId = $stateParams['id'];
            this.movieService.getMovie(movieId).then((movie) => {
                this.movie = movie;
            }).catch((err) => {
                console.log(err);
            }) ;
        }
    }

}
