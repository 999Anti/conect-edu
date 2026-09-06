import api from './api';
import { Application, ApplicationStatus } from '@app-types/index';

export interface CreateApplicationRequest {
  schoolId: string;
  desiredClass: string;
  studentFirstName: string;
  studentLastName: string;
  studentDOB: string;
  studentGender: string;
  studentNationality: string;
  currentSchool: string;
  currentClass: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentAddress: string;
}

export interface SubmitApplicationRequest {
  customAnswers?: Array<{
    questionId: string;
    answer: string;
  }>;
}

class ApplicationService {
  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    const response = await api.post<Application>('/applications', data);
    return response.data;
  }

  async getUserApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>('/applications');
    return response.data;
  }

  async getApplicationById(id: string): Promise<Application> {
    const response = await api.get<Application>(`/applications/${id}`);
    return response.data;
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<Application> {
    const response = await api.put<Application>(`/applications/${id}`, data);
    return response.data;
  }

  async submitApplication(
    id: string,
    data: SubmitApplicationRequest
  ): Promise<Application> {
    const response = await api.post<Application>(
      `/applications/${id}/submit`,
      data
    );
    return response.data;
  }

  async uploadDocument(
    applicationId: string,
    file: File,
    documentType: string
  ): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    await api.post(
      `/applications/${applicationId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    details?: { assessmentDate?: string; decisionNote?: string }
  ): Promise<Application> {
    const response = await api.patch<Application>(
      `/applications/${id}/status`,
      { status, ...details }
    );
    return response.data;
  }

  async withdrawApplication(id: string): Promise<Application> {
    const response = await api.post<Application>(
      `/applications/${id}/withdraw`
    );
    return response.data;
  }
}

export default new ApplicationService();
