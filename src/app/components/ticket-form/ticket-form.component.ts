import { Component, OnInit } from "@angular/core";
import { OverlayService } from "../../services/overlay.service";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from "@angular/forms";
import { TicketInterface } from "../../models/ticket.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
    selector: "app-ticket-form",
    standalone: true,
    imports: [
      CommonModule, 
      FormsModule,
      BsDatepickerModule
    ],
    templateUrl: "./ticket-form.component.html",
    styleUrls: ["./ticket-form.component.scss"],
})
export class TicketFormComponent implements OnInit {
    showOverlay: boolean = false;
    today = new Date();

    ticket: TicketInterface = {
      title: '',
      description: '',
      priority: '',
      due_date: this.today,
      column_id: '',
      created_by: localStorage.getItem('user_id') || '',
      created_by_username: localStorage.getItem('username') || '',
      created_at: new Date().toISOString().split('T')[0]
    };


    constructor(private overlayService: OverlayService, private http: HttpClient) {}

    ngOnInit() {
        this.overlayService.displayOverlay$.subscribe(show => {
            this.showOverlay = show;
        });
    }

    async onSubmit() {
      // Konvertiere dueDate in einen ISO-String
      if (typeof this.ticket.due_date === 'object' && (this.ticket.due_date as any) instanceof Date) {
        this.ticket.due_date.toISOString().split('T')[0]; // Nur das Datum im Format 'YYYY-MM-DD'
    }

      // TODO: in Service aufrufen
      console.log('Submitting ticket:', this.ticket);

      const token = localStorage.getItem('token');  // Token aus dem lokalen Speicher holen
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
      });

      await this.http.post('http://127.0.0.1:8000/api/tickets/create/', JSON.stringify(this.ticket), { headers }).subscribe({
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

    cancel() {
        this.overlayService.hideOverlay();
    }

    reloadPage() {
        window.location.reload();
    }
}

