const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planetModel = require('./planets.schema');
const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          await planetModel.updateOne({
            keplerName: data.kepler_name,
          }, {
            keplerName: data.kepler_name,
          }, {
            upsert: true,
          });
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const planetCount = (await getAllPlanets()).length
        console.log(`${planetCount} habitable planets found!`);
        resolve();
      });
  })
}

async function getAllPlanets() {
  return await planetModel.find({});
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
}
