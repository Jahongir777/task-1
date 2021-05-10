const express = require('express');
const customersRoute = require('./routes/customers');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ContactList', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('MongoDBga ulanish hosil qilindi...');
})
.catch((err) => {
    console.error('MongoDbga ulanish vaqtida xato ro\'y berdi...', err);
});

mongoose.set('useFindAndModify', false);
app.use(express.json());
app.use('/api/customers', customersRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`${port}chi portni eshitishni boshladim`);
});