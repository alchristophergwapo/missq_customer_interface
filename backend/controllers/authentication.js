const express = require("express");
const routes = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "secretkey23456";

const Customer = require("../models/User");

const multer = require('multer');

const DIR = '../backend/public/images';

// var ObjectId = require('mongodb').ObjectID;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log(req);
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

routes.route("/profile").post((req, res) => {
    console.log("id :: ", req.body.id)

    Customer.findOne({ _id: req.body.id }).then((user) => {
        user.name = req.body.name;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.email = req.body.email;
        user.save().then(updatedUser => {
            console.log("Updated user: ", updatedUser);
            if (updatedUser) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: updatedUser._id }, SECRET_KEY, {
                    expiresIn: expiresIn
                });
                res.status(200).send({
                    user: updatedUser,
                    access_token: accessToken,
                    expires_in: expiresIn,
                });
            }
        })

    })

})

routes.post("/register", upload.array('img[]', 3), (request, response) => {

    const url = request.protocol + "://" + request.hostname + ':' + 8080 + '/' + 'public/images/';

    let pass = bcrypt.hashSync(request.body.password);

    let account = new Customer(request.body);

    account['password'] = pass;
    account['picture'] = url + request.body.picture;
    account['id_image'] = url + request.body.id_image;
    // // console.log(request.file);

    account
        .save()
        .then(user => {
            if (user) {
                response
                    .status(200)
                    .json({
                        user: user,
                        status: 200
                    });
                console.log('User created: ', user);
            } else {
                response.status(400).send({ status: 200, message: 'Cannot create user!' })
            }

        })
        .catch(error => {
            console.log("Error => ", error);
            response.status(400).send("Failed to store to database!", error.body);
        });
});

routes.route("/login").post((req, res) => {
    Customer.findOne({ email: req.body.email })
        .populate({
            path: "bookings",
            select: "service_booking service_location cost notes schedule status"
        })
        .then(user => {
            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
                expiresIn: expiresIn
            });

            if (user) {
                console.log("nisud dri na part");
                let passMatch = bcrypt.compareSync(req.body.password, user.password);
                if (passMatch) {
                    console.log("pass matching password")
                    res
                        .status(200)
                        .send({
                            user: user,
                            access_token: accessToken,
                            expires_in: expiresIn,
                            status: 200
                        });
                } else {
                    console.log("password doesn't match!!")
                    res
                        .status(400)
                        .send({ error: "Password doesn't match!", status: 400 });
                    // res.flash('error', " Password doesn't match!")
                }
            } else {
                res.status(400).send({ status: 400 });
            }
        })
        .catch(error => {
            console.log("Error ", error);
        });
});

module.exports = routes;