import express = require('express');

import "reflect-metadata";
import HttpStatus from '../../base/HttpStatus';
import Promise = require('promise');
import {ProtectedRoute} from './ProtectedRoute';
import Staffs from '../../model/Staffs';
import StaffsManager from '../../model/manager/StaffsManager';
var jwt = require('express-jwt');
var jwtDecode = require('jwt-decode');

class SecurityEnforcerHelper {

    public getToken(req: express.Request){
        let token: string = null;
        token = req.headers['authorization'];
        if(token){
            token = token.split(' ')[1];
        }
        return token;
    }

    public checkToken(token: any, user: Staffs){
        try{
            var decoded = jwtDecode(token);
            return decoded["email"] == user.email;
        }
        catch(e){
            return false;
        }
    }

	private getUser(req: express.Request):Staffs{
		let user = new Staffs();
		user.token = this.getToken(req);
        user.email = ProtectedRoute.getUserEmail(req);       
        return user;
    }
    private getLocationId(req: express.Request):string{
        return req.header['locationid'];
	}

    public checkAccess(dataAccessCodes: string, req: express.Request): Promise<Staffs> {
        let user : Staffs = this.getUser(req);
        let locationId = this.getLocationId(req);
        let search = null;
        /*
        if ( user.email)
            search = { email: user.email};
        else if(user.auth0UserId)
            search = {"auth0UserId" : user.auth0UserId};
            */
        
      

        let userManager = new StaffsManager(user);
        let promise = new Promise<Staffs>((resolve, reject) => {
            let usePromise: any;
            let iterations = [];
            if (userManager.isApi()) {
                usePromise = userManager.search(search);                
            }
            else {
                usePromise = userManager.search(search);
            }
            usePromise
            .catch((e) => { 
                reject(e);
             })
            .then((httpStatus: HttpStatus<Staffs>) => {
                if (httpStatus != null && httpStatus.entity != null) {
                    let retUser =   new Staffs();
                    retUser.assign(httpStatus.entity[0]);
                  //  retUser.locationId = locationId;
                   // if (retUser.hasDataAccesCodes(dataAccessCodes) == false) {                        
                  //      reject();
                  //  }
                  //  else {
                        httpStatus.entity.token = this.getToken(req);
						let userAccess = new Staffs();
                        userAccess.assign(retUser);
                      //  if (userAccess.hasDataAccesCodes(dataAccessCodes) == false) {
                       //     reject('does not have access to access code ' + dataAccessCodes);
                       // }
					//	else{
	                        resolve(retUser);
						//}
                  //  }
                }
                else {
                    reject();
                }
            });
        });
        return promise;
    }
}


var SecurityEnforcer = new SecurityEnforcerHelper();
export default SecurityEnforcer;