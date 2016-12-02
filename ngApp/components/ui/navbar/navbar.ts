namespace imdbclone.Components {
  export class Navbar {
    
  }

  const template = require('./navbar.html');
  angular.module('imdbclone').component('navbar', {
    template: template,
    controller: imdbclone.Components.Navbar
  });
}
