import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async registerUser(registerUserDto: RegisterUserDto): Promise<any> {
    const { email, password, name } = registerUserDto;

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new UnauthorizedException('Email already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return newUser;
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto): Promise<any> {
    const { email, password, name, secretKey } = registerAdminDto;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new UnauthorizedException('Invalid admin secret key');
    }

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new UnauthorizedException('Email already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return newAdmin;
  }

  async login(loginDto: LoginDto): Promise<{ role: string, accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not Found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const role = user.role;
    const accessToken = this.generateJwt(user);

    return { role, accessToken };
  }

  private generateJwt(user: any): string {
    const payload = { id: user.id, role: user.role };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
  }
}