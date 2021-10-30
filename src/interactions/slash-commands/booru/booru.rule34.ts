import { Interaction } from 'detritus-client'
import { translate } from '../../../utils/i18n'
import { BaseCommandOption } from '../../base'
import fetch from 'node-fetch'
import { Components, Embed, ComponentContext, ComponentButton, ComponentActionRow } from 'detritus-client/lib/utils'
import { MessageComponentButtonStyles, MessageFlags } from 'detritus-client/lib/constants'
import { error } from '../../../utils/logger'

// no import - messes with tsc (package.json is outside the source dir)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../../package.json')

export interface CommandArgs {
  query: string
}

export class BooruRule34Command extends BaseCommandOption {
  name = 'rule34'
  description = 'Query rule34.xxx'
  triggerLoadingAfter = 2000

  async onBeforeRun (context: Interaction.InteractionContext): Promise<boolean> {
    if (!context.inDm && !context.channel!.nsfw) {
      await context.editOrRespond({
        content: translate('commands.common.nsfwDisabled'),
        flags: MessageFlags.EPHEMERAL
      })
      return false
    } else return true
  }

  constructor () {
    super({
      options: [
        {
          name: 'query',
          description: 'What to search for',
          required: true,
          async onAutoComplete (context: Interaction.InteractionAutoCompleteContext): Promise<void> {
            const chunks = context.value.split(' ')
            const search = chunks.pop()
            if (search === undefined || search.length < 1) await context.respond({ choices: [] })
            const q = new URLSearchParams({
              q: search!
            })
            const url = `https://rule34.xxx/autocomplete.php?${q.toString()}`
            const json = await (await fetch(url, {
              headers: {
                Accept: 'application/json',
                'User-Agent': `wildbeast/${version as string} (+https://github.com/TheSharks/WildBeast)`
              }
            })).json()
            const choices = json.map((x: {value: string}) => ({ name: `${chunks.join(' ')} ${x.value}`.trim(), value: `${chunks.join(' ')} ${x.value}`.trim() }))
            await context.respond({ choices })
          }

        }
      ]
    })
  }

  async run (context: Interaction.InteractionContext | ComponentContext, args: CommandArgs, position: number = 0, data?: any): Promise<void> {
    const q = new URLSearchParams({
      limit: '250',
      tags: args.query.split(' ').join('+'),
      page: 'dapi',
      json: '1',
      s: 'post',
      q: 'index'
    })
    const url = `https://rule34.xxx/index.php?${q.toString()}`
    const json = data ?? await (await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': `wildbeast/${version as string} (+https://github.com/TheSharks/WildBeast)`
      }
    })).json()
    if (json.length === 0) {
      await context.editOrRespond(translate('commands.common.noResultsFor', { query: args.query }))
    } else {
      const post = json[position]
      const embed = new Embed()
        .setImage(post.file_url)
        .addField('Score', post.score, true)
        .setFooter('rule34.xxx')
      const components = new Components({
        timeout: 5 * (60 * 1000),
        onTimeout: async () => await context.editOrRespond({ components: [new ComponentActionRow({ components: [urlButton] })] }),
        onError: (context: ComponentContext, err: Error) => error(err, this.constructor.name)
      })
      components.addButton({
        emoji: '◀️',
        disabled: position === 0,
        run: async (componentContext: ComponentContext) => await this.run(componentContext, args, position - 1, json)
      })
      components.addButton({
        emoji: '▶️',
        disabled: position === json.length - 1,
        run: async (componentContext: ComponentContext) => await this.run(componentContext, args, position + 1, json)
      })
      components.addButton({
        emoji: '🔀',
        run: async (componentContext: ComponentContext) => await this.run(componentContext, args, Math.floor(Math.random() * json.length), json)
      })
      components.addButton({
        emoji: '✖️',
        style: MessageComponentButtonStyles.DANGER,
        run: async (componentContext: ComponentContext) => await componentContext.editOrRespond({ components: [new ComponentActionRow({ components: [urlButton] })] })
      })
      // workaround: detritus sets customIds even when its not needed
      const urlButton = new ComponentButton({
        style: MessageComponentButtonStyles.LINK,
        label: translate('commands.common.open'),
        url: `https://rule34.xxx/index.php?page=post&s=view&id=${post.id as string}`
      })
      delete urlButton.customId
      components.addButton(urlButton)
      // end workaround
      await context.editOrRespond({ embed, components })
    }
  }
}
