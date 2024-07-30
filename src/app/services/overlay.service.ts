import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

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

    setCurrentTicket(ticket: any) {
      this.currentTicketSource.next(ticket);
  }
}
