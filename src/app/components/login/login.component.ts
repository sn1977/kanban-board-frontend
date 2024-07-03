import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";


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

    constructor(private authService: AuthService) {}

    async login() {
        try {
            let resp = await this.authService.loginWithUsernameAndPassword(
                this.username,
                this.password
            );
            console.log(resp);
            
            //TODO - redirect to board page
        } catch (error) {
            console.log(error);
        }
        //TODO - disable input fields & button and enable after try catch block is done
    }
}
