import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsService } from './events.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventsService],
})
export class AppModule {}
