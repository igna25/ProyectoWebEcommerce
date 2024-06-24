import { QueryResult } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../Entities/User';
import { sql } from '@vercel/postgres';

class UsersRepository {
    async getUserById(userId: string): Promise<User | undefined> {
      try {
        const query = await sql<User>`SELECT * FROM users WHERE id = ${userId}`;
        return query.rows[0];
      } catch (error) {
        console.error(`Failed to fetch user with ID ${userId}:`, error);
        throw new Error(`Failed to fetch user with ID ${userId}.`);
      }
    }
  
    async createUser(name: string, role: string, email: string, password: string): Promise<string> {
      try {
        const userId = uuidv4();
        await sql`
          INSERT INTO users(id, name, role, email, password) 
          VALUES (${userId}, ${name}, ${role}, ${email}, ${password})
        `;
        return userId;
      } catch (error) {
        console.error('Failed to create user:', error);
        throw new Error('Failed to create user.');
      }
    }
  
    async updateUser(userId: string, name: string, role: string, email: string, password: string): Promise<void> {
      try {
        await sql`
          UPDATE users 
          SET name = ${name}, role = ${role}, email = ${email}, password = ${password} 
          WHERE id = ${userId}
        `;
      } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user.');
      }
    }
  
    async deleteUser(userId: string): Promise<void> {
      try {
        await sql`
          DELETE FROM users 
          WHERE id = ${userId}
        `;
      } catch (error) {
        console.error('Failed to delete user:', error);
        throw new Error('Failed to delete user.');
      }
    }
  
    async getAllUsers(): Promise<User[]> {
      try {
        const query = await sql<User>`SELECT * FROM users`;
        return query.rows;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw new Error('Failed to fetch users.');
      }
    }

    async getUsersByName(userName: string): Promise<User> {
      try {
        const query = await sql<User>`SELECT * FROM users WHERE name = ${userName}`;
        return query.rows[0];
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw new Error('Failed to fetch users.');
      }
    }
  }
  
  export default UsersRepository;
  