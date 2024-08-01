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

  /**
   * Initializes the component.
   * This method is called after the component has been created and initialized.
   * It subscribes to the `displayOverlay$` observable from the `overlayService`
   * and retrieves the tickets from the `ticketService`.
   * If an error occurs during the retrieval of tickets, an error message is displayed.
   */
  async ngOnInit(): Promise<void> {
    this.overlayService.displayOverlay$.subscribe((show) => {
      this.showOverlay = show;
    });

    try {
      this.ticketService.getTickets().subscribe({
        next: (tickets) => {
          this.tickets = tickets;
          this.filterTicketsByColumn();
        },
        error: (error) => {
          this.error = "Fehler beim Laden!";
          console.error("Error loading tickets:", error);
        }
      });
    } catch (error) {
      this.error = "Fehler beim Laden!";
    }
  }

  /**
   * Toggles the visibility of the new ticket overlay.
   * Sets the current ticket to null and shows the overlay.
   */
  toggleNewTicketOverlay() {
    this.overlayService.setCurrentTicket(null);
    this.overlayService.showOverlay();
  }

  /**
   * Toggles the edit ticket overlay and sets the current ticket.
   * @param ticket - The ticket to be edited.
   */
  toggleEditTicketOverlay(ticket: TicketInterface) {
    this.overlayService.setCurrentTicket(ticket);
    this.overlayService.showOverlay();
  }

  /**
   * Toggles the delete ticket overlay and prompts the user for confirmation before deleting the ticket.
   * 
   * @param ticket - The ticket to be deleted.
   */
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

  /**
   * Removes a ticket from the view.
   * @param ticket - The ticket to be removed.
   */
  removeTicketFromView(ticket: TicketInterface) {
    this.tickets = this.tickets.filter((t: TicketInterface) => t.id !== ticket.id);
    this.filterTicketsByColumn();
  }

  /**
   * Returns the background color for a card based on the provided color.
   * 
   * @param color - The color to be used as the background color for the card.
   * @returns The background color for the card.
   */
  getCardBackgroundColor(color: string) {
    return color;
  }

  /**
   * Filters the tickets based on their column ID and assigns them to respective properties.
   */
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