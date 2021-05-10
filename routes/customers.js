const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    LastName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    Image: {
        type: String,
        required: true,
    },
    Tag: {
        type: String,   //hozircha stringda berib qo'ydim
        required: true
    },
    Category: {
        type: String,   //hozircha stringda berib qo'ydim
        required: true
    }

});

const Customer = mongoose.model('Customer', customerSchema);

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error)
       return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Image: req.body.Image,
        Tag: req.body.Tag,
        Category: req.body.Category
    });
    customer = await customer.save();

    res.status(201).send(customer);
});

router.get('/:id', async (req, res) => {
    let customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).send('Berilgan IDga teng bo\'lgan toifa topilamdi');

      res.send(customer);
});

router.put('/:id', async (req, res) => {
    const {error} = validateCustomer(req.body);
    if (error)
    return res.status(400).send(error.details[0].message);

    let customer = await Customer.findByIdAndUpdate(req.params.id, {FirstName: req.body.FirstName}, {
        new: true
    });

    if (!customer)
      return res.status(404).send('Berilgan IDga teng bo\'lgan toifa topilmadi');

      res.send(customer);
});

router.delete('/:id', async (req, res) => {
    let customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer)
       return res.status(404).send('Berilgan IDga teng bo\'lgan toifa topilamdi');

    res.send(customer);   
});

function  validateCustomer(customer) {
    const schema = {
        FirstName: Joi.string().min(5).max(50).required(),
        LastName: Joi.string().min(5).max(50).required(),
        Image: Joi.string().required(),
        Tag: Joi.string().required(),
        Category: Joi.string().required()

    };
    
    return Joi.validate(customer, schema);
}

module.exports = router;