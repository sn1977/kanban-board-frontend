import { Component } from "@angular/core";
import { CommonModule, NgFor } from "@angular/common";
import { OverlayService } from "../../services/overlay.service";
import { TicketFormComponent } from "../ticket-form/ticket-form.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { TicketInterface } from "../../models/ticket.model";
import { TicketService } from "../../services/ticket.service";

@Component({
  selector: "app-board",
  standalone: true,
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
  imports: [NgFor, TicketFormComponent, CommonModule, NavbarComponent]
})
export class BoardComponent {
  tickets: TicketInterface[] = [];
  todoTickets: TicketInterface[] = [];
  progressTickets: TicketInterface[] = [];
  feedbackTickets: TicketInterface[] = [];
  doneTickets: TicketInterface[] = [];
  error = "";
  showOverlay: boolean = false;
  isEditMode: boolean = false;
  currentTicket: TicketInterface | null = null;

  constructor(
    private overlayService: OverlayService,
    private ticketService: TicketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.overlayService.displayOverlay$.subscribe((show) => {
      this.showOverlay = show;
    });

    try {
      this.ticketService.getTickets().subscribe(
        (tickets) => {
          this.tickets = tickets;
          this.filterTicketsByColumn();
        },
        (error) => {
          this.error = "Fehler beim Laden!";
          console.error("Error loading tickets:", error);
        }
      );
    } catch (error) {
      this.error = "Fehler beim Laden!";
    }
  }

  toggleNewTicketOverlay() {
    this.overlayService.setCurrentTicket(null);
    this.overlayService.showOverlay();
  }

  toggleEditTicketOverlay(ticket: TicketInterface) {
    this.overlayService.setCurrentTicket(ticket);
    this.overlayService.showOverlay();
  }

  toggleDeleteTicketOverlay(ticket: TicketInterface) {
    if (confirm(`Möchten Sie das Ticket "${ticket.title}" wirklich löschen?`)) {
      this.ticketService.deleteTicket(ticket.id!).subscribe({
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
      (ticket) => ticket.column_id === "column-todo"
    );
    this.progressTickets = this.tickets.filter(
      (ticket) => ticket.column_id === "column-progress"
    );
    this.feedbackTickets = this.tickets.filter(
      (ticket) => ticket.column_id === "column-feedback"
    );
    this.doneTickets = this.tickets.filter(
      (ticket) => ticket.column_id === "column-done"
    );
  }
}