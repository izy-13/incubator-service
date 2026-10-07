export class DeviceDeletedEvent {
  constructor(
    public readonly deviceId: string,
    public readonly isDeleteAllExcludeCurrent: boolean = false,
  ) {}
}
