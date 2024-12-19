export enum OrderFilter {
  DATE_NEW_OLD = 1,
  DATE_OLD_NEW = 2,
  TOTAL_LOW_HIGH = 3,
  TOTAL_HIGH_LOW = 4,
}

export type OrderParams = {
  usrId: string;
  min_date: Date;
  max_date: Date;
  order_filter: OrderFilter;
  perPage: number;
  pageNumber: number;
  skip?: number;
  take?: number;
};
