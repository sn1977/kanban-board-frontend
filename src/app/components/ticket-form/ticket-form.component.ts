import { Component, OnInit } from "@angular/core";
import { OverlayService } from "../../services/overlay.service";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from "@angular/forms";

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

    constructor(private overlayService: OverlayService) {}

    ngOnInit() {
        this.overlayService.displayOverlay$.subscribe(show => {
            this.showOverlay = show;
        });
    }
}

