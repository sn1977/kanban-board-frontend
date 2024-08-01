import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { lastValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private http: HttpClient) {}

    /**
     * Logs in the user with the provided username and password.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Observable<any>} - An observable that emits the response from the login request.
     */
    public loginWithUsernameAndPassword(username: string, password: string) {
        const url = environment.baseUrl + "/login/";
        const body = {
            username: username,
            password: password,
        };
        return lastValueFrom(this.http.post(url, body));
    }
}
