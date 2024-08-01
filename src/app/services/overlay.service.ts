import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TicketInterface } from "../models/ticket.model";

@Injectable({
    providedIn: "root",
})
export class OverlayService {
    /**
     * Represents the source for displaying the overlay.
     * It is a BehaviorSubject that emits the current value and keeps track of the previous values.
     */
    private displayOverlaySource = new BehaviorSubject<boolean>(false);
    /**
     * Observable that emits the display overlay state.
     */
    public displayOverlay$ = this.displayOverlaySource.asObservable();

    /**
     * Represents the current ticket source.
     * It is a BehaviorSubject that emits the current value and all subsequent values to its subscribers.
     */
    private currentTicketSource = new BehaviorSubject<any>(null);
    /**
     * Observable representing the current ticket.
     */
    public currentTicket$ = this.currentTicketSource.asObservable();

    /**
     * Shows the overlay.
     */
    showOverlay() {
        this.displayOverlaySource.next(true);
    }

    /**
     * Hides the overlay.
     */
    hideOverlay() {
        this.displayOverlaySource.next(false);
    }

    /**
     * Sets the current ticket.
     * 
     * @param ticket - The ticket to set as the current ticket. Pass `null` to clear the current ticket.
     */
    setCurrentTicket(ticket: TicketInterface | null) {
        this.currentTicketSource.next(ticket);
    }
}
