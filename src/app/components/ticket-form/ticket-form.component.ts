import { Component, OnInit } from "@angular/core";
import { OverlayService } from "../../services/overlay.service";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from "@angular/forms";
import { TicketInterface } from "../../models/ticket.model";
import { HttpClient } from "@angular/common/http";

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

    ticket: TicketInterface = {
      title: '',
      description: '',
      priority: '',
      due_Date: new Date().toISOString().split('T')[0],
      column_id: 1,
      created_by: '',
      created_by_username: '',
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
      if (typeof this.ticket.due_Date === 'object' && (this.ticket.due_Date as any) instanceof Date) {
        this.ticket.due_Date = (this.ticket.due_Date as Date).toISOString().split('T')[0]; // Nur das Datum im Format 'YYYY-MM-DD'
    }

      // TODO: in Service aufrufen
      console.log('Submitting ticket:', this.ticket);

      // Entferne die Felder created_by und created_by_username, da sie im Backend gesetzt werden
      const { created_by, created_by_username, ...ticketData } = this.ticket;
      
      // this.ticket.column_id = this.columnId; // Setze column_id vor dem Speichern
      this.http.post('http://127.0.0.1:8000/api/tickets/create/', ticketData).subscribe({
          next: response => {
              console.log('Ticket saved', response);
          },
          error: error => {
              console.error('Error saving ticket', error);
          }
      });
  }

    cancel() {
        this.overlayService.hideOverlay();
    }
}

