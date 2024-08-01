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

    @Input() isEditMode: boolean = false; 

    constructor(
        private overlayService: OverlayService,
        private http: HttpClient,
        private ticketService: TicketService
    ) {}

    ngOnInit() {
        this.overlayService.displayOverlay$.subscribe((show) => {
            this.showOverlay = show;
        });
  
      this.overlayService.currentTicket$.subscribe((ticket) => {
        if (ticket) {
          this.ticket = { ...ticket }; 
          this.isEditMode = true; 
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
          }
        });
    }

    updateTicket() {
      this.ticketService.updateTicket(this.ticket).subscribe({
        next: (response) => {
          this.cancel();
          this.reloadPage();
        },
        error: (error) => {
          console.error("Error updating ticket:", error);
        }
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
