export type Domain = 'kg' | 'uz' | 'ru';

export type HttpHeader = {
  Authorization?: string;
  'Content-Type'?: string;
  'Country-Code': 'uz' | 'kg';
  accept?: string;
  'Accept-Language'?: string;
  Origin?: string;
};

export type TError = {
  message: string;
  status: number;
  statusText?: string;
  response: any;
};
