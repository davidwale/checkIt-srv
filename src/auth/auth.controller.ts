import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseDto } from '../response/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async registerUser(
    @Body() RegisterUserDto: RegisterUserDto,
  ): Promise<ResponseDto<any>> {
    await this.authService.registerUser(RegisterUserDto);
    return new ResponseDto('success', 'User created successfully', null);
  }

  @Post('admin/register')
  async registerAdmin(
    @Body() RegisterAdminDto: RegisterAdminDto,
    @Body('adminKey') adminKey: string,
  ): Promise<ResponseDto<any>> {
    if (adminKey !== process.env.ADMIN_KEY) {
      throw new BadRequestException('Invalid admin key');
    }

    await this.authService.registerAdmin(RegisterAdminDto);
    return new ResponseDto('success', 'Admin created successfully', null);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseDto<any>> {
    const result = await this.authService.login(loginDto);
    return new ResponseDto('success', 'Login successful', result);
  }
}
