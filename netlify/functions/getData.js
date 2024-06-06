const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {

    const uri = "mongodb+srv://zakariyasattar03:rVqznq9sg6mE3H0m@main.i1cpqxh.mongodb.net/?retryWrites=true&w=majority&appName=main"
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('quirk');

        const queryParams = JSON.parse(event.body);

        const collectionName = queryParams.collectionName || 'main';
        const collection = database.collection(collectionName);

        const filter = queryParams.filter || {};
        const sortParam = queryParams.sortParam || {};

        if (!sortParam || !sortParam.location || !sortParam.location.$near || !sortParam.location.$near.$geometry) {
          throw new Error('Invalid sortParam');
        }

       const { type, coordinates } = sortParam.location.$near.$geometry;
        const pipeline = [
          {
              $geoNear: {
                  near: {
                      type: type,
                      coordinates: coordinates
                  },
                  distanceField: "dist.calculated",
                  spherical: true
              }
          },
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

        const documents = await collection.aggregate(pipeline).toArray();

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
