const db = require('./config.js'); // Import the configuration file for the database
const modules = require('../modules/modules'); // Import the modules for web crawling
const COLLECTIONS = require('./collections.js'); // Import the collections from the database
const Fuse = require('fuse.js'); // Import the Fuse.js library for searching and filtering data
let request = require('request');
const util = require('util');
const requestPromise = util.promisify(request);
const ObjectId = require('mongodb').ObjectID; // Import the ObjectId method from the MongoDB library

module.exports = {
    addIndex: async (urlData) => { // Method to add a new page to the index
        try {
            const page = await db.get().collection(COLLECTIONS.INDEX).findOne({ url: urlData.href }); // Check if the page is already in the index

            if (page) { // If the page is already in the index, throw an error
                throw { error: 'Page is already indexed!' };
            }

            const pageData = await modules.crawl(urlData); // Get the page data by crawling the URL

            if (!pageData.title && !pageData.description) { // If the page data does not contain a title or description, throw an error
                throw { error: "You can't index this page!" };
            }

            const insertData = await db.get().collection(COLLECTIONS.INDEX).insertOne(pageData); // Insert the page data into the index

            return { message: 'Page indexed successfully.' }; // Return a success message
        } catch (err) {
            console.error(err); // Log any errors
            throw err; // Throw the error
        }
    }
};
