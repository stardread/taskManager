const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

router.get('/task/:id', async function(req, res, _next) {
    
    const { id } = req.params;
    if (!id) {
        console.log("No id found in params");
        res.status(500).json({statusCode: 500, message: "Invalid parameters"});
    }

    try {

        // Connect to the db
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        console.log('Connecting database');
        await client.connect();
        const db = client.db("taskManager");
        const collection = db.collection('taskList');
        // Find the taskList by id
        const taskList = await collection.findOne({_id: new ObjectId(id)});
        // Close db connection
        console.log('Exiting database');
        client.close();

        console.log('Document of the collection :', taskList);
        taskList ? res.json(taskList) : res.status(404).json({statusCode: 404, message: `No task list found with id ${id}`});
    } catch (error) {
        console.log("get task list failed", error);
        res.status(500).json({statusCode: 500, message:"get task list failed"});
    }   
});

router.post('/addTask', async function(req, res, _next) {
    const {label, list} = req.body;
    if (!label || !list.length) {
        console.log("No id found in params");
        res.status(500).json({statusCode: 500, message: "Invalid parameters"});
    }
    try {      
         // Connect to the db
         const client = new MongoClient("mongodb://127.0.0.1:27017");
         console.log('Connecting database');
         await client.connect();
         const db = client.db("taskManager");
         const collection = db.collection('taskList');
         // Insert the taskList by id
         const taskList = await collection.insertOne({label, list});
         // Close db connection
         console.log('Exiting database');
         client.close();
         console.log(`Task ${taskList.insertedId} successfully added`);

        res.json({
            taskListId: taskList.insertedId,
            message:`Task ${taskList.insertedId} successfully added`
        });
    } catch (error) {
        console.log("add task failed");
        res.status(500).json({statusCode: 500, message:"add task failed"});
    }   
});

module.exports = router;
