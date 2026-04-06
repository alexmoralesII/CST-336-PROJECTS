import express from 'express';

import { F1Api } from '@f1api/sdk';

const f1Api = new F1Api();
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));


app.get('/',async (req, res) => {
    const nextRace = await f1Api.getNextRace();
    console.log(nextRace.race[0].schedule)
    console.log(nextRace.race[0].circuit)

    res.render('home.ejs', {nextRace: nextRace });
});

app.get('/f1Drivers', async (req, res) => {
    const driverNum = req.query.driver_number || 1;
    let url = `https://api.openf1.org/v1/drivers?driver_number=${driverNum}&session_key=latest`
    const response = await fetch(url);
    const data = await response.json();

    let driver = data[0];
    res.render('f1Drivers.ejs', { f1Drivers: driver });
})

app.get('/driverChampStatus', async (req, res) => {
    const standings = await f1Api.getCurrentDriverStandings();
    const topDriver = standings.drivers_championship[0];

    const driverNum = topDriver.driver.number;
    const response = await fetch(`https://api.openf1.org/v1/drivers?driver_number=${driverNum}&session_key=latest`);
    const data = await response.json();
    const driverImage = data[0].headshot_url;
    res.render('driverChampStatus.ejs', {driverImage: driverImage,topDriver: topDriver});
})

app.get('/fastestDriver', async (req, res) => {
    res.render('fastestDriver.ejs');
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
