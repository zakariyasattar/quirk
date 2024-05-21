const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
    const uri = "mongodb+srv://quirkhealth:gMBBJZYbw346wpk9@quirk-main.yygw4d6.mongodb.net/?retryWrites=true&w=majority&appName=quirk-main";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('quirk');
        const collection = database.collection('main');

        const documents = await collection.find({}).toArray();
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documents),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    } finally {
        await client.close();
    }
};
