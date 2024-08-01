import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TicketInterface } from '../models/ticket.model';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) {}

  /**
   * Returns the HttpHeaders object with the necessary headers for making API requests.
   * The headers include the 'Content-Type' and 'Authorization' headers.
   * The 'Authorization' header is set using the token stored in the local storage.
   * 
   * @returns The HttpHeaders object with the necessary headers.
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
  }

  /**
   * Retrieves a list of tickets from the server.
   * @returns An Observable that emits an array of TicketInterface objects.
   */
  getTickets(): Observable<TicketInterface[]> {
    return this.http.get<TicketInterface[]>(`${environment.baseUrl}/tickets/`, { headers: this.getHeaders() });
  }

  /**
   * Creates a new ticket.
   * @param ticket - The ticket object to be created.
   * @returns An Observable that emits the created ticket.
   */
  createTicket(ticket: TicketInterface): Observable<TicketInterface> {
    return this.http.post<TicketInterface>(`${environment.baseUrl}/api/tickets/create/`, JSON.stringify(ticket), { headers: this.getHeaders() });
  }

  /**
   * Updates a ticket.
   * @param ticket - The ticket to be updated.
   * @returns An Observable that emits the updated ticket.
   */
  updateTicket(ticket: TicketInterface): Observable<TicketInterface> {
    return this.http.put<TicketInterface>(`${environment.baseUrl}/tickets/${ticket.id}/`, JSON.stringify(ticket), { headers: this.getHeaders() });
  }

  /**
   * Deletes a ticket with the specified ID.
   * @param ticketId - The ID of the ticket to delete.
   * @returns An Observable that completes when the ticket is successfully deleted.
   */
  deleteTicket(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/tickets/${ticketId}/`, { headers: this.getHeaders() });
  }
}