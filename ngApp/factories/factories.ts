namespace imdbclone.Factories {
  export class Auth {
    public currentUser;
    public $cookieService;
    private userResource;
    private loginResource;

    // if(this.$cookieService.get('token')) {
    //   this.currentUser = User.get();
    // }

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional
     * @return {Promise}
     */

    login(user, callback) {
      let cb = callback || angular.noop;
      let credentials = {
        email: user.email,
        password: user.password
      }

      return this.loginResource(user).$promise;
    }

    /**
     * Delete access token and user info
     *
     * @param  {Function}
     */
    logout() {
      this.$cookieService.remove('token');
      this.currentUser = {};
    }

    /**
     * Gets all available info on authenticated user
     *
     * @return {Object} user
     */
    getCurrentUser() {
      return this.currentUser;
    }

    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    isLoggedIn() {
      return !!this.currentUser;
    }

    /**
     * Waits for this.currentUser to resolve before checking if user is logged in
     */
    isLoggedInAsync(cb) {
      if(this.currentUser.hasOwnProperty('$promise')) {
        this.currentUser.$promise.then(function() {
          cb(true);
        }).catch(function() {
          cb(false);
        });
      } else if(this.currentUser.hasOwnProperty('role')) {
        cb(true);
      } else {
        cb(false);
      }
    }
    /**
     * Get auth token
     */
    getToken() {
      return this.$cookieService.get('token');
    }

    constructor(
      private $cookies: ng.cookies.ICookiesService,
      private $resource: ng.resource.IResourceService
    ) {
      this.$cookieService = $cookies;
      this.loginResource = $resource('/api/Login/Local');
      this.userResource = $resource('/api/:id');
    }
  }

  angular.module('imdbclone').factory('auth', () =>  Auth);
}
