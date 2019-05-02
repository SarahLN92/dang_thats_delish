const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index');
    req.flash('error', 'Soemthing Happened');
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add store'});
};


exports.createStore = async (req, res) => {
    const store = new Store(req.body);
    await store.save();
    req.flash('success', `Successfully Created ${store.name} care to leave a review?`);
    res.redirect('/');
};

exports.getStores = async (req, res) => {
    //Query the DB for a list of all stores
    const stores =  await Store.find();
    res.render('stores', {title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
    //find the store given the id
        const store = await Store.findOne({_id: req.params.id });
    //confirm they are the owner of the store

    //render out the edit form so the user can update their store
        res.render('editStore', { title: `Edit ${store.name}`, store: store});
};

exports.updateStore = async (req, res) => {
    //find and update the store
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true, //return the new store instead of the old one
        runValidators: true
    }).exec(); // run the query
    req.flash('success', `Successfully updated ${store.name}. <a href="/store/${store.slug}"> View Store!</a>`);
    //redirect them to the store & say it worked!
    res.redirect(`/stores/${store._id}/edit`);
};