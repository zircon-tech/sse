import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, NotificationsService],
})
export class AppModule {}
