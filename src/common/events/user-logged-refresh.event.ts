export class UserLoggedRefreshEvent {
  constructor(
    public readonly lastActiveDate: string,
    public readonly deviceId: string,
  ) {}
}
