import api from './api';

export interface InitializePaymentRequest {
  applicationId: string;
  amount: number;
  email: string;
}

export interface InitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyPaymentRequest {
  reference: string;
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    paid_at: string;
  };
}

class PaymentService {
  async initializePayment(
    data: InitializePaymentRequest
  ): Promise<InitializePaymentResponse> {
    const response = await api.post<InitializePaymentResponse>(
      '/payments/initialize',
      data
    );
    return response.data;
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    const response = await api.post<VerifyPaymentResponse>(
      '/payments/verify',
      { reference }
    );
    return response.data;
  }

  async getPaymentHistory(): Promise<any[]> {
    const response = await api.get('/payments/history');
    return response.data;
  }
}

export default new PaymentService();
