import { Injectable } from '@angular/core';
import Staffs from '../../../../../at-common/model/Staffs';
import StaffsManager from '../../../../../at-common/model/manager/StaffsManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import { AuthencationState } from '../entities/state.entity';
import { ObservableInput, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { loadUnAuthencation } from '../actions/authentication.action';
import { RequestException } from '../entities/error.entity';

@Injectable()

export class AuthencationService {

    constructor() {
    }

    async login(staffs): Promise<HttpStatus<Staffs>> {
        const staffsManager = new StaffsManager(null);
        staffsManager.classInfo.endPoint = staffsManager.classInfo.endPoint.concat('/login');
        return staffsManager.insert(staffs);
    }

    loadAuthencation(): AuthencationState {
        let token: string;
        let result: AuthencationState = {logged:false};
        token = localStorage.getItem('id_token');
        if (localStorage.getItem('id_token')) {
            const jwtHelper = new JwtHelperService();
            try {
                if (jwtHelper.isTokenExpired(token)) {
                    localStorage.removeItem('id_token');
                } else {
                    const decodedToken = jwtHelper.decodeToken(token);
                    result.logged = true;
                    result.token = decodedToken.token;
                    if (decodedToken.roleId) {
                        result.role = decodedToken.roleId;
                    }                   
                    if (decodedToken._id) {
                        result._id = decodedToken._id;
                    }
                }
            } catch (e) {}
        }

        return result;
    }

    handleAuthError<T>(error: RequestException, other: ObservableInput<T>): ObservableInput<T> {
        if (error.code === HttpStatus.UNAUTHORISED) return of(loadUnAuthencation(error));
        return other;
    }   

    async onForgotPassword(staffs): Promise<HttpStatus<Staffs>> {
        const staffsManager = new StaffsManager(null);
        staffsManager.classInfo.endPoint = staffsManager.classInfo.endPoint.concat('/forgotPassword');
        return staffsManager.insert(staffs);
    }

    async onResetPassword(staffs): Promise<HttpStatus<Staffs>> {
        const staffsManager = new StaffsManager(null);
        staffsManager.classInfo.endPoint = staffsManager.classInfo.endPoint.concat('/resetPassword');
        return staffsManager.insert(staffs);
    }
}
