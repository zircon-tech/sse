import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class NotificationsService {
  clients: Map<string, any>;

  constructor() {
    this.clients = new Map();
  }

  addClient(id: string, res: Response) {
    this.clients.set(id, res);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    });
    return res.write(`data: [${id}] Connection successfully \n\n`);
  }

  sendMessage(id: string, message: string) {
    const res = this.clients.get(id);
    res.write(`data: ${message} \n\n`);
  }

  removeClient(id: string) {
    this.clients.delete(id);
    console.log(`Client ${id} disconnected`);
  }
}
