import { Component, Input, OnInit } from "@angular/core";
import { OverlayService } from "../../services/overlay.service";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { FormsModule } from "@angular/forms";
import { TicketInterface } from "../../models/ticket.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
                this.ticket = { ...ticket }; // Kopieren der Ticketdaten in das Formular
            }
        });
    }

    //   async onSubmit() {
    //     // Setze die Farbe basierend auf der Priorität
    //     this.setColorBasedOnPriority();

    //     // Konvertiere due_date in einen ISO-String und stelle sicher, dass das Format YYYY-MM-DD ist
    //     if (typeof this.ticket.due_date === 'object' && (this.ticket.due_date as any) instanceof Date) {
    //       this.ticket.due_date = (this.ticket.due_date as Date).toISOString().split('T')[0]; // Nur das Datum im Format 'YYYY-MM-DD'
    //   }

    //     // TODO: in Service aufrufen
    //     console.log('Submitting ticket:', this.ticket);

    //     const token = localStorage.getItem('token');  // Token aus dem lokalen Speicher holen
    //     const headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'Authorization': `Token ${token}`
    //     });

    // //     await this.http.post('http://127.0.0.1:8000/api/tickets/create/', JSON.stringify(this.ticket), { headers }).subscribe({
    // //         next: (response) => {
    // //             console.log('Ticket saved', response);
    // //             this.cancel();
    // //             this.reloadPage();
    // //         },
    // //         error: (error) => {
    // //             console.error('Error saving ticket', error);
    // //             if (error.error) {
    // //                 console.error('Backend error details:', error.error);
    // //             }
    // //         }
    // //     });
    // // }

    // const url = this.isEditMode ? `http://127.0.0.1:8000/api/tickets/${this.ticket.id}/` : 'http://127.0.0.1:8000/api/tickets/create/';

    //     await this.http.post(url, JSON.stringify(this.ticket), { headers }).subscribe({
    //         next: (response) => {
    //             console.log('Ticket saved', response);
    //             this.cancel();
    //             this.reloadPage();
    //         },
    //         error: (error) => {
    //             console.error('Error saving ticket', error);
    //             if (error.error) {
    //                 console.error('Backend error details:', error.error);
    //             }
    //         }
    //     });
    // }

    async onSubmit() {
      this.setColorBasedOnPriority();
  
      if (typeof this.ticket.due_date === 'object' && (this.ticket.due_date as any) instanceof Date) {
          this.ticket.due_date = (this.ticket.due_date as Date).toISOString().split('T')[0];
      }
  
      console.log('Submitting ticket:', this.ticket);
  
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
      });
  
      const url = this.isEditMode ? `http://127.0.0.1:8000/api/tickets/${this.ticket.id}/` : 'http://127.0.0.1:8000/api/tickets/create/';
      const method = this.isEditMode ? 'PUT' : 'POST';
  
      await this.http.request(method, url, { body: JSON.stringify(this.ticket), headers }).subscribe({
          next: (response) => {
              console.log('Ticket saved', response);
              this.cancel();
              this.reloadPage();
          },
          error: (error) => {
              console.error('Error saving ticket', error);
              if (error.error) {
                  console.error('Backend error details:', error.error);
              }
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
