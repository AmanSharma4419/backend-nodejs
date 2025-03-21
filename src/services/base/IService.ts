export abstract class BaseService {
  constructor(public serviceName: string) {}

  protected handleError(error: Error): never {
    throw error;
  }
} 