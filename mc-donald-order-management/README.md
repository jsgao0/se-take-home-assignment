# McDonald's Order Management

## Thinking
At first, I've read the all requirements and tried to code directly. However, it didn't work for me as 'Process Order' was asynchronous which was not straightforward.

So, I started to split the responsibilities to different entities such as:
1. `OrderManager`: Manage the orders which can control the order index by different order types. Also provide the easy way to get orders by order status.
2. `BotManager`: Manage the bots which can add or remove bot.
3. `useOrderProcessor`: Manage the order process in one place with the above managers.

## Worth to mention
I tried to created `OrderProcessor` as a class instead of a hook, however, the instances of managers should be a reference instead of immutable state. Apart from that, to render as expected, I should use a force render method `update`. Therefore, I encapsulated it as a hook.

Second, `processOrder` method in `useOrderProcessor` is the most important part because it assigns a pending order to an idle bot only if there are at least a pending order and a bot. 

Third, there are 4 cases that `processOrder` will be executed:
1. Create an order: Push a pending order which should be taken by a bot.
2. Complete an order: Complete an order and a bot becomes idle which should take a pending order.
3. Create a bot: Push an idle bot which should take a pending order.
4. Remove a bot: Destroy a bot and push a processing order back to pending, and the pending order should be taken by other idle bot.

At last, `getProcessingBotByOrderId` is the useful way to find out if an order is being processing by any bot. I thought there was an alternative way to achieve that with an extra order status `Processing` but it's not that useful as it's just a status which is not related to the bot which takes this order.

## DEMO Recording

https://github.com/jsgao0/se-take-home-assignment/assets/7173395/641a7ca6-5311-4ceb-949a-57e769c7db17

