export class Schema {
  public details?: any;
  public message?: string;
  public status: number = 500;

  constructor(props: Schema) {
    Object.assign(this, props);
  }
}
