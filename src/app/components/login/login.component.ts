import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router, RouterModule } from "@angular/router";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [FormsModule, RouterModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent {
    username: string = "";
    password: string = "";
    isSubmitting: boolean = false;

    constructor(private authService: AuthService, private router: Router) {}

    /**
     * Logs in the user with the provided username and password.
     * Disables input fields and buttons during the login process.
     * If the login is successful, stores the token, user ID, and username in the local storage.
     * Navigates to the "board" route.
     * If an error occurs during the login process, displays an alert with the message "Login Failed"
     * and logs the error to the console.
     * Enables input fields and buttons after the login process is complete.
     */
    async login() {
      this.isSubmitting = true; // Deaktivieren der Eingabefelder und Schaltflächen
        try {
            let resp: any = await this.authService.loginWithUsernameAndPassword(
                this.username,
                this.password
            );
            console.log(resp);
            localStorage.setItem("token", resp.token);
            localStorage.setItem("user_id", resp.user_id);  // Speichern der user_id
            localStorage.setItem("username", resp.username);  // Speichern des Benutzernamens
            this.router.navigate(["board"]);
        } catch (error) {
            alert('Login Failed');
            console.error(error);
        } finally {
          this.isSubmitting = false; // Reaktivieren der Eingabefelder und Schaltflächen
      }
        
    }
}
