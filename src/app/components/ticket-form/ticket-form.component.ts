import { Component, OnInit } from "@angular/core";
import { OverlayService } from "../../services/overlay.service";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from "@angular/forms";
import { Ticket } from "../../models/ticket.model";
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

    ticket: Ticket = {
      title: '',
      description: '',
      priority: '',
      dueDate: new Date()
    };

    constructor(private overlayService: OverlayService, private http: HttpClient) {}

    ngOnInit() {
        this.overlayService.displayOverlay$.subscribe(show => {
            this.showOverlay = show;
        });
    }

    saveTicket() {
      this.http.post('api/tickets/create/', this.ticket).subscribe(response => {
        console.log('Ticket saved', response);
      }, error => {
        console.error('Error saving ticket', error);
      });
    }

    // saveTicket() {
    //   let ticket = {};
    //   Object.assign(ticket, { title: 'New Ticket', description: 'Ticket description' });
    //   // Weitere Logik...
    //   console.log(ticket);
      
    // }

    cancel() {
        this.overlayService.hideOverlay();
    }
}

