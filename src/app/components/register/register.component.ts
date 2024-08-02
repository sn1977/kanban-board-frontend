import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router, RouterModule } from "@angular/router";

@Component({
    selector: "app-register",
    standalone: true,
    imports: [FormsModule, RouterModule],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
})
export class RegisterComponent {
    username: string = "";
    password: string = "";
    confirmPassword: string = "";
    isSubmitting: boolean = false;

    constructor(private authService: AuthService, private router: Router) {}

    /**
     * Registers a new user with the provided username and password.
     * Disables input fields and buttons during the registration process.
     * If the registration is successful, redirects to the login page.
     * If an error occurs during the registration process, displays an alert and logs the error.
     * Enables input fields and buttons after the registration process is complete.
     */
    async register() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    
      this.isSubmitting = true;
    
      try {
        const resp = await this.authService.register(this.username, this.password);
        console.log(resp);
        alert("Registration successful. Please log in.");
        this.router.navigate(["login"]);
      } catch (error) {
        alert("Registration failed");
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    }
}
