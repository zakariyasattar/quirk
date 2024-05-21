// netlify/functions/getDocuments.js
const mongoose = require('mongoose');

const uri = "mongodb+srv://quirkhealth:gMBBJZYbw346wpk9@quirk-main.yygw4d6.mongodb.net/?retryWrites=true&w=majority&appName=quirk-main";

let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    cachedDb = client;
    return client;
};

const yourSchema = new mongoose.Schema({
    // Define your schema here
    provider: { type: String, required: true },
    street_address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    code: { type: String, required: true },
    service: { type: String, required: true },
    cash_rate: { type: mongoose.Schema.Types.Mixed, required: true },
    plans: [String]

});

const Model = mongoose.model('Model', yourSchema);

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        await connectToDatabase();
        const documents = await Model.find().exec();
        return {
            statusCode: 200,
            body: JSON.stringify(documents),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch documents' }),
        };
    }
};
