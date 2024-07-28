// export class Ticket {
//     title: string = '';
//     description: string = '';
//     created_at: string = '';
//     due_date: string = '';
//     priority: string = '';
//     column_id: number = 0;
//     created_by: string = '';
//     created_by_username: string = '';
// }

// ticket.model.ts
export interface TicketInterface {
  title: string;
  description: string;
  priority: string;
  due_Date: string;
  created_at: string;
  column_id: number;
  created_by: string;
  created_by_username: string;
}