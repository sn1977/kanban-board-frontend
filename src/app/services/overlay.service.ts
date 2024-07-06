import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class OverlayService {
    private displayOverlaySource = new BehaviorSubject<boolean>(false);
    public displayOverlay$ = this.displayOverlaySource.asObservable();

    showOverlay() {
        this.displayOverlaySource.next(true);
    }

    hideOverlay() {
        this.displayOverlaySource.next(false);
    }
}
