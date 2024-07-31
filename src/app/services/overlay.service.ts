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

    //   setCurrentTicket(ticket: TicketInterface | null) {
    //     console.log("Setting current ticket:", ticket); // Debugging-Ausgabe
    //     this.currentTicketSource.next(ticket);
    // }

    setCurrentTicket(ticket: TicketInterface | null) {
        if (typeof ticket !== "object" || ticket === null) {
            console.error("Invalid ticket object:", ticket);
        }
        this.currentTicketSource.next(ticket);
    }
}
