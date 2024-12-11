const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { fetchWeatherData } = require('../services/fetchWeatherData');

module.exports = {
    name: 'w_forecast',
    description: 'Nampilin forecast cuaca.',
    options: [
        {
            name: 'lokasi',
            type: ApplicationCommandOptionType.String,
            description: 'provinsi yang mau ditampilin (nama full). Contoh : Jakarta Barat, Surakarta, Surabaya',
            required: true,
        },
    ],

    async execute(interaction, client) {
        try {
            const selectedLocation = interaction.options.getString('lokasi');

            const { locationData, weatherData } = await fetchWeatherData(selectedLocation);

            // console.log(`LocationData : ${locationData}`)
            // console.log(`weatherData : ${weatherData}`)

            const asciiTable = generateAsciiWeatherTable(weatherData);

            const message = `Forecast of : ${locationData.desa}: \n${asciiTable}`;

            console.log(message)
            interaction.reply({
                content: message
            });
        } catch (error) {
            console.error('Gagal fetch / proses data:', error);

            interaction.reply({
                content: 'Gagal fetch / proses data.',
                ephemeral: true,
            });
        }
    },



    // async execute(interaction, client) {
    //     try {
    //         const selectedLocation = interaction.options.getString('lokasi');

    //         const { locationData, weatherData } = await fetchWeatherData(selectedLocation, selectedParam); // Fetch data

    //         const selectedParameterLong = idMapping[selectedParam];

    //         // console.log('labels', labels);
    //         // console.log('locationName', locationName);
    //         // console.log('parameterData', parameterData);

    //         const getColorScale = (value) => {
    //             const colorScale = [
    //                 'rgb(6, 62, 114)',
    //                 'rgb(34, 112, 192)',
    //                 'rgb(57, 196, 234)',
    //                 'rgb(0, 255, 193)',
    //                 'rgb(0, 224, 71)',
    //                 'rgb(250, 255, 66)',
    //                 'rgb(255, 173, 13)',
    //                 'rgb(255, 108, 0)',
    //                 'rgb(179, 58, 0)',
    //                 'rgb(252, 38, 42)',
    //                 'rgb(226, 0, 34)',
    //                 'rgb(255, 0, 203)',
    //                 'rgb(201, 0, 154)',
    //                 'rgb(121, 0, 123)',
    //             ];

    //             const index = Math.min(Math.max(parseInt(value) - 1, 0), colorScale.length - 1);
    //             return colorScale[index];
    //         };
    //         const backgroundColor = parameterData.map(value => getColorScale(value));


    //         const data = {
    //             labels: labels,
    //             datasets: [
    //                 {
    //                     label: locationName,
    //                     data: parameterData,
    //                     borderColor: 'rgb(75, 192, 192)',
    //                     backgroundColor: backgroundColor,
    //                     tension: 0.3,
    //                 }
    //             ]
    //         };

    //         const renderer = new ChartJSNodeCanvas({ type: 'jpg', width: 1000, height: 400, backgroundColour: 'white' });
    //         const image = await renderer.renderToBuffer({
    //             type: selectedParam === 'weather' ? 'bar' : 'line',
    //             data: data,
    //         });

    //         const attachment = new AttachmentBuilder(image, { name: 'graph.png' });


    //         // console.log(`labels : ${labels}`);
    //         // console.log(`areaData :`);
    //         // console.log(areaData);
    //         // console.log(`parameterData : ${parameterData}`)

    //         const chartEmbed = new EmbedBuilder()
    //             .setTitle(`Prediksi ${selectedParameterLong}`)
    //             .setFields({ name: 'Lokasi', value: locationName })
    //             .setFooter({ text: 'Data provided by BMKG at https://data.bmkg.go.id/prakiraan-cuaca/' })
    //         chartEmbed.setImage("attachment://graph.png");


    //         interaction.reply({
    //             embeds: [chartEmbed],
    //             files: [attachment]
    //         });
    //     } catch (error) {
    //         console.error('Gagal fetch / proses data:', error);

    //         interaction.reply({
    //             content: 'Gagal fetch / proses data.',
    //             ephemeral: true,
    //         });
    //     }
    // },
};

function generateAsciiWeatherTable(weatherData) {
    const dayTitle = "|WEATHER FORECAST|";
    const separator = "+----------------------------------------------------------------------------------+";
    const footer = "|                                                                                  |";
    const footerSeparator = "-----------------------------------------------------------------------------------+";
    let asciiTable = ``;
    asciiTable += `| Time           | Weather Description | Temperature      | Wind             |\n`;

    console.log(weatherData)
    weatherData.forEach((forecasts) => {
        forecasts.forEach((forecast) => {
            const timeLabel = new Date(forecast.datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const weatherDesc = forecast.weather_desc_en || 'N/A';
            const temperature = `${forecast.t}°C`;
            const wind = `${forecast.wd} → ${forecast.wd_to}`;

            asciiTable += `| ${timeLabel.padEnd(15)} | ${weatherDesc.padEnd(17)} | ${temperature.padEnd(17)} | ${wind.padEnd(17)} |\n`;
        });
    });

    asciiTable += separator;

    console.log(asciiTable)

    console.log(asciiTable.length)

    return asciiTable;
}

function formatTime(datetime) {
    const date = new Date(datetime);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${suffix}`;
}