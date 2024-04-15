import Db from '../Backend/helpers/db.ts';
import "dotenv/config";

const mongoConnectionString = process.env.MONGO_CONNECTIONSTRING;

const db = new Db(mongoConnectionString);

const detailedListFighters = await db.getDb().then(async db => {
    const detailedListFighters = db.collection('detailedfighters');
    return await detailedListFighters.insertMany(detailedFighters);
});
console.log(collection)