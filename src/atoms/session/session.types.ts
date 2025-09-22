export type BaseType = {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
};

export type Event = BaseType & {
  title: string;
  imagePath?: string;
  isPopular?: boolean;
  organizationId?: number;
  theater?: Theater;
  ageRestriction?: string;
  description?: string;
  duration?: string;
  isActive: 'ACTIVE' | 'COMPLETED' | 'AWAITING_CLARIFICATION';
  isFree?: boolean;
};

export type DiscountMethodName =
  | 'payment_method_event'
  | 'event_ticket_quantity';

export type DiscountMethod = {
  id: number;
  name: DiscountMethodName;
  requiredFields: string[];
};

export type DiscountPayload = {
  eventId: number;
  paymentMethodCode: string;
};

export type Discount = {
  id: number;
  countryId: number;
  discountId: number;
  discountType: 'FIXED' | 'PERCENT';
  discountAmount: number;
  method: DiscountMethod;
  payload: DiscountPayload;
  quantity: number;
};

export type Session = BaseType & {
  dateTime: string;
  event?: Event;
  minPrice?: number | null;
  slug: string;
  isInformational?: boolean;
  ticketTypes?: SessionTicketType[];
  leftTicketsCount?: number;
  scheme?: Scheme;
  theater?: Theater;
  language: string | null;
  otherSessions?: OtherSession[];
  hall?: Hall;
  maxTicketsPerCustomer: number;
  status: string;
  discounts: Discount[];
  outerSessionId?: number;
};

export type OtherSession = {
  dateTime: string;
  slug: string;
  language: null | string;
};

export type SessionTicketType = BaseType & {
  price: number;
  quantity: number;
  title: string;
  description?: string;
};

export type Hall = {
  id: number;
  title: string;
};

export type SeatScheme = BaseType & {
  color: string;
  htmlId: string;
  price: number;
  schemeSectorId: number | null;
};

export type OrderItem = BaseType & {
  status?: string;
  ticketSeatId?: number;
  ticketAreaId?: number;
  htmlId: string;
  schemeSectorId: number | null;
};

export type AreaSchema = {
  htmlId: string;
  id: number;
  title: string;
};

export type Sector = {
  id: number;
  title: string;
  hallId: number;
  parentId: number;
  htmlPath: string;
  sectorId: string;
};

export type Area = BaseType & {
  color: string;
  quantity: number | null;
  price: number;
  schemeArea: AreaSchema;
};

export type Scheme = BaseType & {
  htmlPath: string;
  seats: SeatScheme[];
  areas: Area[];
  sectors: Sector[] | null;
};

export type Theater = {
  address: TheaterAddress;
  title: string;
  region: TheaterRegion;
  theaterType: TheaterType;
};

export type TheaterAddress = BaseType & {
  title: string;
  locationLat?: number;
  locationLng?: number;
};

export type TheaterRegion = BaseType & {
  title: string;
};

export type TheaterType = BaseType & {
  title: string;
};
