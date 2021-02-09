const express = require("express");
const routes = express.Router();

const Booking = require("../models/Booking");
const Customers = require("../models/User");



routes.route("/book_service").post(async (request, response) => {
    const booking = new Booking(request.body);

    await booking.save();

    const author = await Customers.findById({ _id: booking.author });

    author.bookings.push(booking);

    response.status(200)
        .send({ status: 200, bookings: author.bookings });

    await author.save();
});

routes.route("/mark_done").post((request, response) => {
    const booking = Booking.findById({ _id: request._id })

    if (booking) {
        booking.status = "Completed"
        booking.save().then(updatedBooking => {
            response.status(200).send({ status: 200, booking: updatedBooking })
        }).catch(error => {
            response.status(400).send({ status: 400 })
        })
    }
})

routes.route("/trial", (req, res) => {
    res.send('Testing!')
})

//FILTERED ALL ONGOINGS

routes.route("/filteredOngoing").post((req, res) => {
    var arryOfStatus = [];
    Booking.find({}).then(Filter => {
        if (!req.body.array) {
            return arryOfStatus = [];
        }
        if (!req.body.data) {
            return arryOfStatus = Filter;
        }
        arryOfStatus = Filter.filter((filtered) => {
            return filtered.status.toLocaleLowerCase().includes(req.body.data.toLocaleLowerCase());
        });
        res.status(200).send({ status: 200, message: "Status:", data: arryOfStatus })
    }).catch(error => {
        console.log(error);

    })
});


// exports.filteredOngoing = (req, res) => {
//     res.send('Testing!')
// }

// routes.route('/filteredOngoing').post((req, res) => {
//     console.log("testing:" + req.data)
// })

module.exports = routes;