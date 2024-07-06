import { Component, OnInit } from "@angular/core";
import { OverlayService } from "../../services/overlay.service";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
    selector: "app-ticket-form",
    standalone: true,
    imports: [
      CommonModule, 
      BsDatepickerModule
    ],
    templateUrl: "./ticket-form.component.html",
    styleUrl: "./ticket-form.component.scss",
})
export class TicketFormComponent {
}
