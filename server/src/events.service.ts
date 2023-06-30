import { Injectable } from '@nestjs/common';
import { Response } from 'express';

type EventType = 'notification' | 'data' | 'progress';

@Injectable()
export class EventsService {
  clients: Map<string, any>;

  constructor() {
    this.clients = new Map();
  }

  /**
   * Adds a client to the server's list of connected clients.
   * @param {string} id - The unique identifier of the client.
   * @param {Response} res - The response object representing the client connection.
   * @returns {void}
   */
  addClient(id: string, res: Response) {
    // Store the client's response object in a map with its corresponding ID
    this.clients.set(id, res);
    // Log a message indicating that the client has connected
    console.log(`Client ${id} connected`);
    // Configure the response headers for Server-Sent Events (SSE)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    });
    // Send an initial SSE event to the client
    return res.write(
      `event: notification\ndata: ✅ Success,Client connected \n\n`,
    );
  }

  /**
   * Sends a message of a specified event type to a client.
   * Each event should follow the SSE format.
   * ```
   * event: <event_name>
   * data: <event_content>
   * ```
   * @param {string} id - The unique identifier of the client.
   * @param {EventType} type - The type of the event to send.
   * @param {string} message - The message to send to the client.
   * @returns {void}
   */
  sendMessage(id: string, type: EventType, message: string) {
    // Retrieve the response object for the specified client ID
    const res = this.clients.get(id);
    // If the response object exists, send the message as an SSE event
    if (res) {
      res.write(`event: ${type}\ndata: ${message} \n\n`);
    }
  }

  /**
   * Removes a client from the server's list of connected clients.
   * @param {string} id - The unique identifier of the client to remove.
   * @returns {void}
   */
  removeClient(id: string) {
    // Remove the client from the map of connected clients
    this.clients.delete(id);
    // Log a message indicating that the client has disconnected
    console.log(`Client ${id} disconnected`);
  }
}
