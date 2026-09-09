import api from './api';
import { School, PaginatedResponse } from '@app-types/index';

export interface SchoolFilters {
  search?: string;
  state?: string;
  city?: string;
  schoolType?: 'private' | 'public' | '';
  curriculum?: string;
  boardingOption?: string;
  gender?: string;
  minFees?: number;
  maxFees?: number;
  maxFormFee?: number;
  page?: number;
  limit?: number;
}

class SchoolService {
  async getAllSchools(filters?: SchoolFilters): Promise<PaginatedResponse<School>> {
    const response = await api.get<PaginatedResponse<School>>('/schools', {
      params: filters,
    });
    return response.data;
  }

  async getSchoolById(id: string): Promise<School> {
    const response = await api.get<School>(`/schools/${id}`);
    return response.data;
  }

  async searchSchools(query: string, limit?: number): Promise<School[]> {
    const response = await api.get<School[]>('/schools/search', {
      params: { q: query, limit },
    });
    return response.data;
  }

  async getSchoolsByState(state: string): Promise<School[]> {
    const response = await api.get<School[]>(`/schools/state/${state}`);
    return response.data;
  }

  async saveSchool(schoolId: string): Promise<void> {
    await api.post(`/schools/${schoolId}/save`);
  }

  async unsaveSchool(schoolId: string): Promise<void> {
    await api.delete(`/schools/${schoolId}/save`);
  }

  async getSavedSchools(): Promise<School[]> {
    const response = await api.get<School[]>('/schools/saved');
    return response.data;
  }

  async compareSchools(schoolIds: string[]): Promise<School[]> {
    const response = await api.post<School[]>('/schools/compare', {
      schoolIds,
    });
    return response.data;
  }
}

export default new SchoolService();
