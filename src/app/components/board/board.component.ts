import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { environment } from "../../../environments/environment";
import { lastValueFrom } from "rxjs";
import { CommonModule, NgFor } from "@angular/common";

@Component({
    selector: "app-board",
    standalone: true,
    imports: [NgFor],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.scss",
})
export class BoardComponent {
    tickets: any = [];
    error = "";

    constructor(private http: HttpClient) {}

    async ngOnInit(): Promise<void> {
        try {
            this.tickets = await this.getTickets();
            console.log(this.tickets);
        } catch (error) {
            this.error = "Fehler beim Laden!";
        }
    }

    //TODO - move to service --> TicketService
    getTickets() {
        const url = environment.baseUrl + "/tickets/";
        return lastValueFrom(this.http.get(url));
    }
}
