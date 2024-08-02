import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { BoardComponent } from "./components/board/board.component";
import { RegisterComponent } from "./components/register/register.component";

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "board", component: BoardComponent },
    { path: "register", component: RegisterComponent },
];
