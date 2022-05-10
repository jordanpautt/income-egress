import { UserI } from '../interfaces/user.interface';
export class User {
  static fromFireBase({ name, uid, email }: UserI) {
    return new User(uid, name, email);
  }
  constructor(
    public uid: string | undefined,
    public name: string,
    public email: string
  ) {}
}
