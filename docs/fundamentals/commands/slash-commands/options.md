---
description: Add selectable options to your commands
---

# Options

![](<../../../.gitbook/assets/afbeelding (2).png>)

Options are the primary way to take user input for slash commands, they're type-checked on Discord's side, so type safety is guaranteed!

## In practise

```typescript
import { Interaction } from 'detritus-client'
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants'

import { BaseSlashCommand } from '../base'

export interface CommandArgs {
  dice?: number
  sides?: number
}

export default class DiceCommand extends BaseSlashCommand {
  description = 'Roll some dice'
  name = 'dice'

  constructor () {
    super({
      options: [
        {
          type: ApplicationCommandOptionTypes.INTEGER,
          name: 'dice',
          description: 'The number of dice to roll (default: 1)',
          required: false
        },
        {
          type: ApplicationCommandOptionTypes.INTEGER,
          name: 'sides',
          description: 'The number of sides on the dice (default: 6)',
          required: false
        }
      ]
    })
  }

  async run (context: Interaction.InteractionContext, args: CommandArgs): Promise<void> {
    const { dice, sides } = args
    const diceCount = dice ?? 1
    const diceSides = sides ?? 6

    let total = 0
    for (let i = 0; i < diceCount; i++) {
      total += Math.floor(Math.random() * diceSides) + 1
    }

    await context.editOrRespond(`${context.user.username} rolled ${diceCount}d${diceSides} and got ${total}`)
  }
}

```
