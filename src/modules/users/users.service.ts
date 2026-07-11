import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

// ============================
// Users Service
// ============================

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Find a user by their email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Find a user by their MongoDB ID.
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * Create a new user document.
   * Password should be pre-hashed before calling this.
   */
  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> {
    const user = new this.userModel({
      ...data,
      email: data.email.toLowerCase(),
    });
    return user.save();
  }
}
