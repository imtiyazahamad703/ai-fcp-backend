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
  ) { }

  /**
   * Find all admins in the system.
   */
  async findAllAdmins(): Promise<User[]> {
    return this.userModel.find({ role: 'admin' }).select('-password -__v').exec();
  }

  /**
   * Delete a user by ID.
   */
  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  /**
   * Find a user by their email address.
   */
  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   *    * Find a user by their MongoDB ID.
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

  /**
   * Mark a question as completed by adding it to the user's completedQuestions array.
   */
  async markQuestionCompleted(userId: string, questionId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { completedQuestions: questionId } }
    ).exec();
  }

  /**
   * Find a user by a valid reset password token.
   */
  async findByResetToken(token: string) {
    return this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).exec();
  }
}
