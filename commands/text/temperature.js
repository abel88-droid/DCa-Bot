
const axios = require('axios');

module.exports = {
  name: 'temperature',
  aliases: ['temp', 'weather'],
  description: 'Get current temperature of a city.',
  async execute(message, args) {
    const city = args.join(' ');
    if (!city) return message.reply('❗ Please provide a city name.');

    const apiKey = 'b191cb1cecffd0a83908d97e8106743d';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
      const res = await axios.get(url);
      const temp = res.data.main.temp;
      const desc = res.data.weather[0].description;
      const icon = res.data.weather[0].icon;
      const weatherEmoji = getEmoji(icon);

      message.channel.send(`${weatherEmoji} The current temperature in **${city}** is **${temp}°C** with **${desc}**.`);
    } catch (err) {
      console.error(err);
      message.reply('⚠️ Could not fetch the weather. Please check the city name or try again later.');
    }
  },
};


function getEmoji(icon) {
  if (icon.includes('01')) return '☀️';
  if (icon.includes('02') || icon.includes('03') || icon.includes('04')) return '☁️';
  if (icon.includes('09') || icon.includes('10')) return '🌧️';
  if (icon.includes('11')) return '⛈️';
  if (icon.includes('13')) return '❄️';
  if (icon.includes('50')) return '🌫️';
  return '🌡️';
}
