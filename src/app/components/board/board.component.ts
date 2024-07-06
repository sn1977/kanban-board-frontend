import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { environment } from "../../../environments/environment";
import { lastValueFrom } from "rxjs";
import { CommonModule, NgFor } from "@angular/common";
import { OverlayService } from "../../services/overlay.service";
import { TicketFormComponent } from "../ticket-form/ticket-form.component";

@Component({
    selector: "app-board",
    standalone: true,
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.scss",
    imports: [NgFor, TicketFormComponent, CommonModule],
})
export class BoardComponent {
    tickets: any = [];
    progressTickets: any = [];
    feedbackTickets: any = [];
    doneTickets: any = [];
    error = "";
    showOverlay: boolean = false;

    constructor(
        private http: HttpClient,
        private overlayService: OverlayService
    ) {}

    async ngOnInit(): Promise<void> {
        this.overlayService.displayOverlay$.subscribe((show) => {
            this.showOverlay = show;
        });

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

    toggleNewTicketOverlay() {
        console.log("toggleNewTicketOverlay");
        this.overlayService.showOverlay();
    }

    toggleEditTicketOverlay(tickets: any) {
        console.log("toggleEditTaskOverlay");
    }

    toggleDeleteTicketOverlay(tickets: any) {
        console.log("toggleDeleteTicketOverlay");
    }

    getCardBackgroundColor(tickets: any) {
        console.log("getCardBackgroundColor");
    }
}
