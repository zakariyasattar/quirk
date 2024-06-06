const { MongoClient } = require('mongodb');
const { query } = require('query.js');

exports.handler = async function(event, context) {

    const uri = "mongodb+srv://zakariyasattar03:rVqznq9sg6mE3H0m@main.i1cpqxh.mongodb.net/?retryWrites=true&w=majority&appName=main"
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('quirk');
        const collection = database.collection('coord');

        const queryParams = JSON.parse(event.body);

        const document = await collection.findOne({ _id: queryParams.zip });
        console.log(document)

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(document),
        };
    } catch (error) {
        console.error('Error fetching documents:', error);
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
