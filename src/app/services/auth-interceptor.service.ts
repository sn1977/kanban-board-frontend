import {
  HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private router: Router) {}

    /**
     * Intercepts HTTP requests and adds the authorization token to the request headers, if available.
     * If the request returns a 401 error, it navigates to the login page.
     * @param request - The intercepted HTTP request.
     * @param next - The next HTTP handler in the chain.
     * @returns An observable of the HTTP event.
     */
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem("token");
        if (token) {
            // Wenn ein Token vorhanden ist, füge es dem Authorization-Header hinzu
            request = request.clone({
                setHeaders: {
                    Authorization: `Token ${token}`,
                },
            });
        }
        // Leite die Anfrage weiter, unabhängig davon, ob ein Token vorhanden ist oder nicht
        return next.handle(request).pipe(
            catchError((err) => {
              if (err instanceof HttpErrorResponse) { //NOTE - evtl. nicht nötig!!!!
                if (err.status === 401) {
                    // Wenn der Fehlerstatus 401 ist, navigiere zur Login-Seite
                    this.router.navigate(["login"]);
                }
              }
                return throwError(() => err);
            })
        );
    }
}
