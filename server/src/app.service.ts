import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  clients: Map<string, any>;

  constructor() {
    this.clients = new Map();
  }

  getHello(): string {
    return 'Hello World!';
  }

  addClient(id: string, res: Response) {
    this.clients.set(id, res);
    console.log(`Client ${id} connected`);
    return res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    });
  }

  removeClient(id: string) {
    this.clients.delete(id);
    console.log(`Client ${id} disconnected`);
  }

  sendMessage(id: string, message: string) {
    const res = this.clients.get(id);
    res.write(`data: ${message} \n\n`);
  }
}
