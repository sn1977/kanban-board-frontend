import { Component, Input, OnInit } from "@angular/core";
import { OverlayService } from "../../services/overlay.service";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { FormsModule } from "@angular/forms";
import { TicketInterface } from "../../models/ticket.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

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

    @Input() isEditMode: boolean = false; // Modus: Neues Ticket oder Bearbeitung

    constructor(
        private overlayService: OverlayService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.overlayService.displayOverlay$.subscribe((show) => {
            this.showOverlay = show;
        });

        this.overlayService.currentTicket$.subscribe((ticket) => {
            if (ticket) {
                console.log("Received ticket for editing:", ticket); // Debugging-Ausgabe
                this.ticket = { ...ticket }; // Kopiere das Ticket, um es im Formular anzuzeigen
                this.isEditMode = true; // Setze den Modus auf Bearbeiten
            } else {
                this.resetTicketForm();
            }
        });
    }

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

    onSubmit() {
        console.log("isEditMode:", this.isEditMode);
        if (this.isEditMode) {
            this.updateTicket();
        } else {
            this.createTicket();
        }
    }

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

        const url = "http://127.0.0.1:8000/api/tickets/create/";
        this.http
            .post(url, JSON.stringify(this.ticket), { headers })
            .subscribe({
                next: (response) => {
                    console.log("Ticket created:", response);
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

    updateTicket() {
        const url = `${environment.baseUrl}/tickets/${this.ticket.id}/`;
        const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        });

        this.http.put(url, this.ticket, { headers }).subscribe({
            next: (response) => {
                console.log("Ticket updated:", response);
                this.cancel();
                this.reloadPage();
            },
            error: (error) => {
                console.error("Error updating ticket:", error);
            },
        });
    }

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

    cancel() {
        this.overlayService.hideOverlay();
    }

    reloadPage() {
        window.location.reload();
    }
}
