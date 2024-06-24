import { v4 as uuidv4 } from 'uuid';

export class User{
  id: string;
  name: string;
  role: string;
  email: string;
  password: string;

  constructor(name: string, role: string, email: string, password: string, id?: string) {
    this.id = id ? id : uuidv4(); // Generates a UUID if not provided
    this.name = name;
    this.role = role;
    this.email = email;
    this.password = password;
  }
}