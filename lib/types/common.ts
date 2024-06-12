export enum STATUS {
    SUCCESS = 'success',
    FAILURE = 'failure'
  }
  export type DataResponse<T> = {
    status: STATUS,
    data?: T,
    meta?: any
  }