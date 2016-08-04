'use strict';

const mongodb = require('mongodb');

const USERS_COLLECTION = 'users';
const RANDOM_USERS_COUNT = 10;

function handleError(res, message, description, code=500) {
    console.log(`Error: ${message} ${description ? '(' + description + ')' : ''}`);
    res.status(code).json({
        error: message,
        description
    });
}

function createRandomUsers(database, count) {
    let groups = ['everyone', 'moderator', 'admin'];
    let usersCollection = database.collection(USERS_COLLECTION);
    for (let i = 0; i < count; i++) {
        let name = 'RandomUser' + (i + 1);
        usersCollection.insertOne({
            name,
            email: name + '@example.com',
            group: groups[Math.floor(Math.random() * groups.length)],
            online: false,
            avatar100: 'https://api.adorable.io/avatars/100/' + name,
        });
    }
}

module.exports = (app, database) => {
    // Имя пользователя должно быть уникальным
    database.collection(USERS_COLLECTION).createIndex({name: 1}, {unique: true});

    // Инициализация коллекции пользователей
    database.collection(USERS_COLLECTION).count((error, count) => {
        if (!error && count < RANDOM_USERS_COUNT) {
            createRandomUsers(database, RANDOM_USERS_COUNT - count);
        }
    });

    // Случайный онлайн статус при каждом запуске
    database.collection(USERS_COLLECTION).find({}).forEach((document) => {
        database.collection(USERS_COLLECTION).update({_id: document._id}, {
            $set: {
                online: Math.random() > 0.3
            }
        });
    });
    
    // Получение списка всех пользователей
    app.get('/users', (req, res) => {
        database.collection(USERS_COLLECTION).find({}).toArray((error, documents) => {
            if (error) {
                handleError(res, 'Failed do get users', error.message);
            } else {
                res.status(200).json({users: documents});
            }
        });
    });

    // Добавление нового пользователя
    app.post('/users', (req, res) => {
        let newUser = req.body;
        delete newUser._id;
        newUser.group = 'everyone';

        if (!newUser.name) {
            handleError(res, 'Invalid user data', 'Username is incorrect', 400);
        }

        database.collection(USERS_COLLECTION).insertOne(newUser, (error, result) => {
            if (error) {
                handleError(res, 'Failed to create user', error.message);
            } else {
                res.status(201).json({id: result.insertedId});
            }
        });
    });

    // Обновление профиля пользователя
    app.put('/users/:id', (req, res) => {
        let updatedUser = req.body;
        let userId = new mongodb.ObjectID(req.params.id);
        delete updatedUser._id;

        database.collection(USERS_COLLECTION).updateOne({_id: userId}, { $set: updatedUser }, (error) => {
            if (error) {
                handleError(res, 'Failed to update user', error.message);
            } else {
                res.status(204).end();
            }
        });
    });

    // Удаление пользователя
    app.delete('/users/:id', (req, res) => {
        database.collection(USERS_COLLECTION).deleteOne({_id: new mongodb.ObjectID(req.params.id)}, (error) => {
            if (error) {
                handleError(res, 'Failed to delete user', error.message);
            } else {
                console.log('Deleted user', req.params.id);
                res.status(204).end();
            }
        });
    });
};