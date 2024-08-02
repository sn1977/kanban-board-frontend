import { Component, Input, OnInit } from "@angular/core";
import { OverlayService } from "../../services/overlay.service";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { FormsModule } from "@angular/forms";
import { TicketInterface } from "../../models/ticket.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { TicketService } from "../../services/ticket.service";

@Component({
    selector: "app-ticket-form",
    standalone: true,
    imports: [CommonModule, FormsModule, BsDatepickerModule],
    templateUrl: "./ticket-form.component.html",
    styleUrls: ["./ticket-form.component.scss"],
})
export class TicketFormComponent implements OnInit {
    showOverlay: boolean = false;
    today = new Date();

    /**
     * Represents a ticket object.
     */
    @Input() ticket: TicketInterface = {
        title: "",
        description: "",
        priority: "",
        due_date: this.today,
        column_id: "",
        created_by: localStorage.getItem("user_id") || "",
        created_by_username: localStorage.getItem("username") || "",
        created_at: new Date().toISOString().split("T")[0],
        color: "",
    };

    /**
     * Indicates whether the component is in edit mode or not.
     */
    @Input() isEditMode: boolean = false;

    constructor(
        private overlayService: OverlayService,
        private http: HttpClient,
        private ticketService: TicketService
    ) {}

    /**
     * Initializes the component after Angular has initialized all data-bound properties.
     * Subscribes to the displayOverlay$ and currentTicket$ observables from the overlayService.
     * Updates the component's state based on the emitted values.
     */
    ngOnInit() {
        this.overlayService.displayOverlay$.subscribe((show) => {
            this.showOverlay = show;
        });

        this.overlayService.currentTicket$.subscribe((ticket) => {
            if (ticket) {
                this.ticket = { ...ticket };
                this.isEditMode = true;

                // Konvertiere due_date in ein JavaScript-Datum, falls es ein String ist
                if (typeof this.ticket.due_date === "string") {
                    this.ticket.due_date = new Date(this.ticket.due_date);
                }
            } else {
                this.resetTicketForm();
            }
        });
    }

    /**
     * Resets the ticket form to its initial state.
     */
    resetTicketForm() {
        this.isEditMode = false;
        this.ticket = {
            title: "",
            description: "",
            priority: "",
            due_date: this.today,
            column_id: "",
            created_by: localStorage.getItem("user_id") || "",
            created_by_username: localStorage.getItem("username") || "",
            created_at: new Date().toISOString().split("T")[0],
            color: "",
        };
    }

    /**
     * Handles the form submission event.
     * If the component is in edit mode, it calls the updateTicket method.
     * Otherwise, it calls the createTicket method.
     */
    onSubmit() {
        if (this.isEditMode) {
            this.updateTicket();
        } else {
            this.createTicket();
        }
    }

    /**
     * Creates a new ticket.
     */
    createTicket() {
        this.setColorBasedOnPriority();

        if (
            typeof this.ticket.due_date === "object" &&
            (this.ticket.due_date as any) instanceof Date
        ) {
            this.ticket.due_date = (this.ticket.due_date as Date)
                .toISOString()
                .split("T")[0];
        }

        const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        });

        this.ticketService.createTicket(this.ticket).subscribe({
            next: (response) => {
                this.cancel();
                this.reloadPage();
            },
            error: (error) => {
                console.error("Error creating ticket:", error);
                if (error.error) {
                    console.error("Backend error details:", error.error);
                }
            },
        });
    }

    /**
     * Updates the ticket by calling the ticket service's updateTicket method.
     * After a successful update, it cancels the form and reloads the page.
     * If an error occurs, it logs the error to the console.
     */
    updateTicket() {
        this.ticketService.updateTicket(this.ticket).subscribe({
            next: (response) => {
                this.cancel();
                this.reloadPage();
            },
            error: (error) => {
                console.error("Error updating ticket:", error);
            },
        });
    }

    /**
     * Sets the color of the ticket based on its priority.
     */
    setColorBasedOnPriority() {
        switch (this.ticket.priority) {
            case "Low":
                this.ticket.color = "white";
                break;
            case "Middle":
                this.ticket.color = "var(--color-fifth)";
                break;
            case "High":
                this.ticket.color = "var(--color-third)";
                break;
            default:
                this.ticket.color = "white";
                break;
        }
    }

    /**
     * Cancels the ticket form and hides the overlay.
     */
    cancel() {
        this.overlayService.hideOverlay();
    }

    /**
     * Reloads the current page.
     */
    reloadPage() {
        window.location.reload();
    }
}
