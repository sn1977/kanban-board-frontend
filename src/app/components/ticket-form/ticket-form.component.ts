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
    dueDate: Date = new Date();

    ticket: TicketInterface = {
      title: '',
      description: '',
      priority: '',
      dueDate: new Date(),
      column_id: 1,
      created_by: '',
      created_by_username: '',
      created_at: ''
    };

    constructor(private overlayService: OverlayService, private http: HttpClient) {}

    ngOnInit() {
        this.overlayService.displayOverlay$.subscribe(show => {
            this.showOverlay = show;
        });
    }

    onSubmit() {
      console.log('Submitting ticket:', this.ticket);
      // this.ticket.column_id = this.columnId; // Setze column_id vor dem Speichern
      this.http.post('http://127.0.0.1:8000/api/tickets/create/', this.ticket).subscribe(response => {
          console.log('Ticket saved', response);
      }, error => {
          console.error('Error saving ticket', error);
      });
  }

    cancel() {
        this.overlayService.hideOverlay();
    }
}

