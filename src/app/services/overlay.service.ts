import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TicketInterface } from "../models/ticket.model";

@Injectable({
    providedIn: "root",
})
export class OverlayService {
    private displayOverlaySource = new BehaviorSubject<boolean>(false);
    public displayOverlay$ = this.displayOverlaySource.asObservable();

    private currentTicketSource = new BehaviorSubject<any>(null);
    public currentTicket$ = this.currentTicketSource.asObservable();

    showOverlay() {
        this.displayOverlaySource.next(true);
    }

    hideOverlay() {
        this.displayOverlaySource.next(false);
    }

    // TODO - move to service --> TicketService
    setCurrentTicket(ticket: TicketInterface | null) {
        this.currentTicketSource.next(ticket);
    }
}
