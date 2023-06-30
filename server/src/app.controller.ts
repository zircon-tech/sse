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
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import * as fs from 'node:fs';
import { AppService } from './app.service';
import { EventsService } from './events.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly events: EventsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('sse/:client')
  sse(
    @Param('client') client: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    req.on('close', () => {
      this.events.removeClient(client);
    });

    return this.events.addClient(client, res);
  }

  @Post('upload/:client')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('client') client: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const lines = file.buffer.toString().split(/\r*\n/).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      this.events.sendMessage(
        client,
        'progress',
        parseInt(`${(i * 100) / lines.length}`).toString(),
      );
      this.events.sendMessage(client, 'data', lines[i]);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    this.events.sendMessage(client, 'progress', '100');
    this.events.sendMessage(
      client,
      'notification',
      '✅ Success,File uploaded successfully',
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
