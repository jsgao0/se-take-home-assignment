import { Bot } from '../types';
import { v4 as uuidv4 } from 'uuid';

class BotManager {
  bots: Bot[];

  constructor() {
    this.bots = [];
  }

  addBot() {
    const newBot = {
      id: uuidv4(),
      processingOrder: null,
    };
    this.bots.push(newBot);
  }

  removeBot() {
    return this.bots.pop();
  }
}

export default BotManager;
