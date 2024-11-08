import Bot from 'model/Bot';

import 'service/monitorService';
import 'service/translationsService';

const bot = new Bot();
bot.start();
