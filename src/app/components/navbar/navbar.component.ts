import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-navbar",
    standalone: true,
    imports: [],
    templateUrl: "./navbar.component.html",
    styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
    constructor(private router: Router) {}

    /**
     * Logs out the user by removing the token, user ID, and username from the local storage,
     * and navigates to the login page.
     */
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        this.router.navigate(["/login"]);
    }
}
