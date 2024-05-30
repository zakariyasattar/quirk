const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
    const uri = "mongodb+srv://quirkhealth:gMBBJZYbw346wpk9@quirk-main.yygw4d6.mongodb.net/?retryWrites=true&w=majority&appName=quirk-main";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('quirk');

        const queryParams = JSON.parse(event.body);

        const collectionName = queryParams.collectionName || 'main';
        const collection = database.collection(collectionName);

        const filter = queryParams.filter || {};
        let documents;

        if(collectionName == 'main') {
            const pipeline = [
              { $match: filter },
              {
                $group: {
                  _id: "$provider",
                  documents: { $push: "$$ROOT" }
                }
              },
              {
                $project: {
                  provider: "$_id",
                  documents: { $slice: ["$documents", 10] } // limit number of results per hospital
                }
              },
              { $unwind: "$documents" },
              { $replaceRoot: { newRoot: "$documents" } }
            ];

            documents = await collection.aggregate(pipeline).toArray();
        }

        else {
            documents = await collection.find(filter).limit(150).toArray();
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documents),
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
