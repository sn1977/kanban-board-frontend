export interface TicketInterface {
  id?: number; 
  title: string;
  description: string;
  priority: string;
  due_date: string |Date; 
  created_at: string;
  column_id: string;
  created_by: string;
  created_by_username: string;
  color: string;
}
