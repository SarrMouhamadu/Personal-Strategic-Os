import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

export interface AuditLog {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details: any;
  userId: string;
  timestamp: string;
}

export interface SecurityReport {
  totalLogs: number;
  sensitiveAccessCount: number;
  modificationCount: number;
  latestLogs: AuditLog[];
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = '/api/audit';

  getAllLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(this.apiUrl, {
      headers: { 'Authorization': `Bearer ${this.auth.token()}` }
    });
  }

  getSecurityReport(): Observable<SecurityReport> {
    return this.http.get<SecurityReport>(`${this.apiUrl}/security-report`, {
      headers: { 'Authorization': `Bearer ${this.auth.token()}` }
    });
  }
}
