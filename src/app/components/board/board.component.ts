import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { environment } from "../../../environments/environment";
import { lastValueFrom } from "rxjs";
import { CommonModule, NgFor } from "@angular/common";
import { OverlayService } from "../../services/overlay.service";
import { TicketFormComponent } from "../ticket-form/ticket-form.component";
import { TicketInterface } from "../../models/ticket.model";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
    selector: "app-board",
    standalone: true,
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.scss",
    imports: [NgFor, TicketFormComponent, CommonModule, NavbarComponent],
})
export class BoardComponent {
    tickets: any = [];
    todoTickets: any = [];
    progressTickets: any = [];
    feedbackTickets: any = [];
    doneTickets: any = [];
    error = "";
    showOverlay: boolean = false;
    isEditMode: boolean = false; 
    currentTicket: any = null; 

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
            this.filterTicketsByColumn();
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
        this.overlayService.setCurrentTicket(null); // Setze das aktuelle Ticket auf null
        this.overlayService.showOverlay();
    }

    toggleEditTicketOverlay(ticket: TicketInterface) {
        this.overlayService.setCurrentTicket(ticket); // Setze das aktuelle Ticket für die Bearbeitung
        this.overlayService.showOverlay();
    }


    toggleDeleteTicketOverlay(ticket: TicketInterface) {

  
      if (confirm(`Möchten Sie das Ticket "${ticket.title}" wirklich löschen?`)) {
        const url = `${environment.baseUrl}/tickets/${ticket.id}/`;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
        
        this.http.delete(url, { headers }).subscribe({
          next: () => {
            console.log(`Ticket ${ticket.id} deleted successfully`);
            this.removeTicketFromView(ticket);
          },
          error: (error) => {
            console.error(`Error deleting ticket ${ticket.id}`, error);
          }
        });
      }
    }
  
    removeTicketFromView(ticket: TicketInterface) {
      this.tickets = this.tickets.filter((t: TicketInterface) => t.id !== ticket.id);
      this.filterTicketsByColumn();
    }

    getCardBackgroundColor(color: string) {
        return color;
    }

    filterTicketsByColumn() {
        this.todoTickets = this.tickets.filter(
            (ticket: any) => ticket.column_id === "column-todo"
        );
        this.progressTickets = this.tickets.filter(
            (ticket: any) => ticket.column_id === "column-progress"
        );
        this.feedbackTickets = this.tickets.filter(
            (ticket: any) => ticket.column_id === "column-feedback"
        );
        this.doneTickets = this.tickets.filter(
            (ticket: any) => ticket.column_id === "column-done"
        );
    }
}
