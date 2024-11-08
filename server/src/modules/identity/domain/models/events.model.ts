export class UserCreatedEvent {
  readonly email: string;
  readonly confirmationToken: string;
  readonly name: string;

  constructor(name: string, email: string, confirmationToken: string) {
    this.name = name;
    this.email = email;
    this.confirmationToken = confirmationToken;
  }
}

export class NotConfirmedEvent {
  readonly email: string;
  readonly confirmationToken: string;
  readonly name: string;

  constructor(name: string, email: string, confirmationToken: string) {
    this.name = name;
    this.email = email;
    this.confirmationToken = confirmationToken;
  }
}
