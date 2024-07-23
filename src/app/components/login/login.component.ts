import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent {
    username: string = "";
    password: string = "";

    constructor(private authService: AuthService, private router: Router) {}

    async login() {
        try {
            let resp: any = await this.authService.loginWithUsernameAndPassword(
                this.username,
                this.password
            );
            console.log(resp);
            localStorage.setItem("token", resp.token);
            this.router.navigate(["board"]);
        } catch (error) {
            alert('Login Failed');
            console.error(error);
        }
        //TODO - disable input fields & button and enable after try catch block is done
    }
}
