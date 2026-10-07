export class UserLoggedInEvent {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly ip: string | string[],
    public readonly title: string,
    public readonly lastActiveDate: string,
  ) {}
}
