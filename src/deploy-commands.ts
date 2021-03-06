import { SlashCommandBuilder, SlashCommandMentionableOption } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId, token } from "../config.json";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  new SlashCommandBuilder()
    .setName("deez")
    .setDescription("Replies with user info!"),
  new SlashCommandBuilder()
    .setName("add")
    .setDescription("add social credit score")
    .addMentionableOption(option => option.setName('mentionable').setDescription('Mention something').setRequired(true))
    .addIntegerOption(option => option.setName('credit').setDescription('credits to add').setRequired(true)),
    new SlashCommandBuilder()
    .setName("cut")
    .setDescription("remove social credit score")
    .addMentionableOption(option => option.setName('mentionable').setDescription('Mention something').setRequired(true))
    .addIntegerOption(option => option.setName('credit').setDescription('credits to cut').setRequired(true)),
    new SlashCommandBuilder()
    .setName("check")
    .setDescription("check social credit score")
    .addMentionableOption(option => option.setName('mentionable').setDescription('Mention something').setRequired(true)),
    new SlashCommandBuilder()
    .setName("add_filter")
    .setDescription("add a filter")
    .addSubcommand(subcommand =>
      subcommand
        .setName('type')
        .setDescription('Good or bad filter')
        .addStringOption( option => 
          option.setName('type')
          .setDescription('type of filter')
          .addChoice('good','good')
          .addChoice('bad', 'bad')
          .setRequired(true)
      )
      .addStringOption(option => option.setName('filter').setDescription('A word to filter').setRequired(true))
      .addIntegerOption(option => option.setName('cost').setDescription('credits to cut').setRequired(true))),
    new SlashCommandBuilder()
    .setName("cut_filter")
    .setDescription("remove a filter")
    .addSubcommand(subcommand =>
      subcommand
        .setName('type')
        .setDescription('Good or bad filter')
        .addStringOption( option => 
          option.setName('type')
          .setDescription('type of filter')
          .addChoice('good','good')
          .addChoice('bad', 'bad')
          .setRequired(true)
      )
      .addStringOption(option => option.setName('filter').setDescription('A word to filter').setRequired(true))
      ),
    new SlashCommandBuilder()
    .setName("leader_board")
    .setDescription("Lists the leadboard of the best citizens")
].map((command) => command.toJSON());

export function bootStrapCommands() {
  const rest = new REST({ version: "9" }).setToken(token);
  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
}
