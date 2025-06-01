const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'temperature',
  aliases: ['temp', 'weather'],
  description: 'Get the current temperature of a city',
  async execute(message, args) {
    const city = args.join(' ');
    if (!city) return message.reply('❗ Please provide a city name.');

    const apiKey = 'e059b3064ced30668da71497d1711908';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
      const res = await axios.get(url);
      const data = res.data;

      const temp = data.main.temp;
      const feelsLike = data.main.feels_like;
      const desc = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      const humidity = data.main.humidity;
      const wind = data.wind.speed;

      const embed = new EmbedBuilder()
        .setTitle(`🌤️ Weather in ${data.name}, ${data.sys.country}`)
        .setDescription(`${capitalize(desc)}`)
        .setThumbnail(`http://openweathermap.org/img/wn/${iconCode}@2x.png`)
        .addFields(
          { name: '🌡️ Temperature', value: `${temp}°C`, inline: true },
          { name: 'Feels Like', value: `${feelsLike}°C`, inline: true },
          { name: '💧 Humidity', value: `${humidity}%`, inline: true },
          { name: '🌬️ Wind Speed', value: `${wind} m/s`, inline: true }
        )
        .setColor(0x1e90ff)
        .setFooter({ text: 'Powered by OpenWeatherMap' });

      message.channel.send({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      message.reply('⚠️ Could not fetch the weather. Please check the city name.');
    }
  },
};
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
  }
