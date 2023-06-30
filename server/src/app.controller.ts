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
import { NotificationsService } from './notifications.service';
import { faker } from '@faker-js/faker';
import * as fs from 'node:fs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private notificationsService: NotificationsService,
  ) {}

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

  @Get('notifications/:id')
  notifications(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    req.on('close', () => {
      this.notificationsService.removeClient(id);
    });

    return this.notificationsService.addClient(id, res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const lines = file.buffer.toString().split(/\r*\n/).filter(Boolean);
    for (const line of lines) {
      this.appService.sendMessage('1', line);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    this.notificationsService.sendMessage(
      '1',
      '✅ Success',
      'File uploaded successfully',
    );
    return {
      message: 'File uploaded successfully',
    };
  }

  @Get('csv')
  generateCsv() {
    const filePath = './data.csv';
    let csvContent = 'name,email,phone,\n';

    for (let i = 0; i < 100; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const phone = faker.phone.number();

      csvContent += `${name},${email},${phone}\n`;
    }

    fs.writeFile(filePath, csvContent, (err) => {
      if (err) {
        console.error('Error writing CSV file:', err);
      } else {
        console.log(`CSV file generated successfully at ${filePath}`);
      }
    });
  }
}
