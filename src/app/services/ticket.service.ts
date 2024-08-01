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

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
  }

  getTickets(): Observable<TicketInterface[]> {
    return this.http.get<TicketInterface[]>(`${environment.baseUrl}/tickets/`, { headers: this.getHeaders() });
  }

  createTicket(ticket: TicketInterface): Observable<TicketInterface> {
    return this.http.post<TicketInterface>(`${environment.baseUrl}/api/tickets/create/`, JSON.stringify(ticket), { headers: this.getHeaders() });
  }

  updateTicket(ticket: TicketInterface): Observable<TicketInterface> {
    return this.http.put<TicketInterface>(`${environment.baseUrl}/tickets/${ticket.id}/`, JSON.stringify(ticket), { headers: this.getHeaders() });
  }

  deleteTicket(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/tickets/${ticketId}/`, { headers: this.getHeaders() });
  }
}