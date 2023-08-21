import TelegramBot from 'node-telegram-bot-api';

class TelegramBotService {
	constructor(botToken) {
		this.bot = new TelegramBot(botToken);
	}

	async sendMessage(chatId, message) {
		try {
			await this.bot.sendMessage(chatId, message);
			return true;
		} catch (error) {
			console.error('Failed to send message to Telegram bot:', error);
			return false;
		}
	}
}

export default TelegramBotService;
