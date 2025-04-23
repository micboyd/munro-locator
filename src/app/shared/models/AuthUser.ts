import { BaseUser } from "./BaseUser";

export class AuthUser extends BaseUser {
    password: string;

    constructor(init?: Partial<AuthUser>) {
      super(init);
      Object.assign(this, init);
    }
  }
