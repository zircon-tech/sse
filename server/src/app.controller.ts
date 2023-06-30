import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('sse/:id')
  sse(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    req.on('close', () => {
      this.appService.removeClient(id);
    });

    return this.appService.addClient(id, res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const [header, ...lines] = file.buffer
      .toString()
      .split(/\r*\n/)
      .filter(Boolean);
    for (const line of lines) {
      this.appService.sendMessage('1', line);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return {
      message: 'File uploaded successfully',
    };
  }
}
