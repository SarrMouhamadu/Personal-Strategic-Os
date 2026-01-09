import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'FIXED' | 'VARIABLE' | 'EXCEPTIONAL';
  frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'PUNCTUAL';
  isPlanned: boolean;
  receiptUrl?: string;
  date: string;
}

export interface StrategicSummary {
  totals: {
    real: number;
    planned: number;
    variance: number;
  };
  categories: { [key: string]: number };
  trends: { month: string; total: number; planned: number }[];
  optimization: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = '/api/finance';

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl, {
      headers: { 'Authorization': `Bearer ${this.auth.token()}` }
    });
  }

  getStrategicSummary(): Observable<StrategicSummary> {
    return this.http.get<StrategicSummary>(`${this.apiUrl}/strategic-summary`, {
      headers: { 'Authorization': `Bearer ${this.auth.token()}` }
    });
  }

  createExpense(expense: Partial<Expense>): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense, {
      headers: { 'Authorization': `Bearer ${this.auth.token()}` }
    });
  }

  uploadReceipt(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('receipt', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload-receipt`, formData, {
      headers: { 'Authorization': `Bearer ${this.auth.token()}` }
    });
  }

  deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { 'Authorization': `Bearer ${this.auth.token()}` }
    });
  }
}
