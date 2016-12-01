import * as mongoose from 'mongoose';
import * as acl from 'acl';
import * as mongodb from 'mongodb';
import * as colors from 'colors';

//config for mongo connection
export default class Permission {
  public static backend;

  public static setPermission(dbc) {
    //INFO
    //create the acl instance.
    //this method should be set ONCE mongodb has successfully connected
    this.backend = new acl(new acl.mongodbBackend(dbc.connection.db, 'acl_'));


    console.log('\n-==settingPermissions==-\n'.yellow);
    this.backend.allow('user', 'movies', ['get', 'post', 'put', 'delete']);
    console.log('¯\_(ツ)_/¯ - log yourself'.red);
    //ONE TIME COMMANDS TO REMOVE AN `allow` param from a resource
    //make sure you remove it from the allow command and `rs` you nodemon
    // this.backend.removeAllow('user', 'movies', ['delete']);
    // console.log('\n-==removingPermissions==-\n'.red);
    console.log('\n-==permissionsSet==-\n'.yellow);


    //
    // this.backend.isAllowed('583f9eb5d80ac112a898a61a', 'movies', 'delete', function(err, result) {
    //   console.log('\n-==Can the user \'Jim\' w/ a user role delete movies?==-\n'.cyan);
    //   if(err) console.log('Error: '.yellow, err);
    //   console.log('Allowed?: '.yellow, result);
    // });

    //permission check movies for user role permissions
    // this.backend.allowedPermissions('583f9eb5d80ac112a898a61a', 'movies', function(err, permissions){
    //   console.log('Permissions: '.yellow, JSON.stringify(permissions, null, 3).gray);
    // });


    //check for all roles of user
    // this.backend.roleUsers('user', (err, results) => {
    //   console.log('Users w/ \'user\' role: '.yellow, JSON.stringify(results, null, 3).gray);
    // });
  }
}
