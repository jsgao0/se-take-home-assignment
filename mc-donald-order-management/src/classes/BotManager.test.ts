import BotManager from "./BotManager";

describe('BotManager', () => {
  it('should add a bot', () => {
    const botManager = new BotManager();
    botManager.addBot();
    expect(botManager.bots.length).toBe(1);
  });

  it('should remove a bot', () => {
    const botManager = new BotManager();
    botManager.addBot();
    botManager.addBot();
    const newestBot = botManager.bots[botManager.bots.length - 1];
    const removedBot = botManager.removeBot();
    expect(removedBot).toBe(newestBot);
    expect(botManager.bots.length).toBe(1);
  });
});
