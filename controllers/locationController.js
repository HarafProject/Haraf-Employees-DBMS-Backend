const { default: mongoose, mongo } = require('mongoose');
const LGA = require('../models/lga');
const Zone = require("../models/zone")
// const State = require('../models/state');
const StatusCodes = require('../utils/status-codes');
// const Country = require('./../models/country');

// exports.addCountry = async (req, res, next) => {
//     try {
//         const {code, dial_code, country} = req.body
//         const check = await Country.find({ name: country }).exec();

//         if (check.length > 0) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ status: 'failed', error: 'The country already exists' });

//         }

//         const data = new Country({
//             _id:"62fa74d99f87c864e96c93c2",
//             //  mongoose.Types.ObjectId(),
//             name: country,
//             code,
//             dial_code,
//         });

//         await data.save();

//         const countries = await Country.find().sort({name: "asc"}).exec();

//         return res.status(StatusCodes.CREATED).json({
//             status: 'success',
//             message: 'You have successfully added a country',
//             countries
//         });

//     } catch (error) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//             status: 'failed',
//             error: error
//         });
//     }
// }


// exports.countries = async (req, res) => {
//     try {
//         const countries = await Country.find().sort({name: "asc"}).exec();

//         return res.status(StatusCodes.OK).json({
//             status: 'success',
//             countries
//         });
//     } catch (error) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//             status: 'failed',
//             error: error
//         });
//     }
// }

// exports.addState = async (req, res, next) => {
//     try {
//         let check = await State.find({ name: req.body.state, country: req.body.country }).exec();

//         if (check.length > 0) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 status: 'failed',
//                 error: 'The state already exists'
//             });
//         }

//         //validate the country
//         check = await Country.findById(req.body.country).exec();

//         if (check === null) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 status: 'failed',
//                 error: 'The country is not valid'
//             });
//         }

//         const data = new State({
//             _id: mongoose.Types.ObjectId(),
//             country: req.body.country,
//             name: req.body.state
//         });

//         await data.save();

//         const states = await State.find({ country: req.body.country }).sort({name: "asc"}).populate('country', '_id name').exec();

//         return res.status(StatusCodes.CREATED).json({
//             status: 'success',
//             message: 'You have successfully added a state',
//             states
//         });
//     } catch (error) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//             status: 'failed',
//             error: error
//         });
//     }


// }


// exports.states = async (req, res) => {
//     try {
//         const states = await State.find({ country: "62fa74d99f87c864e96c93c2" }).sort({name: "asc"}).populate('country', '_id name').exec();

//         return res.status(StatusCodes.OK).json({
//             status: 'success',
//             states
//         });
//     } catch (error) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//             status: 'failed',
//             error: error
//         });
//     }
// }

exports.addZone = async (req, res, next) => {

    let check = await Zone.find({ name: req.body.zone, state: req.body.state }).exec();

    if (check.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: 'failed',
            error: 'The zone already exists'
        });
    }

    const data = new Zone({
        state: req.body.state,
        name: req.body.zone
    });

    await data.save();

    const zones = await Zone.find({ state: req.body.state }).sort({ name: "asc" }).exec();

    return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'You have successfully added a zone',
        zones
    });
}


exports.zones = async (req, res) => {

    const zones = await Zone.find({ state: "630500e1c9ae75a1ce111f15" }).sort({ name: "asc" }).exec();

    return res.status(StatusCodes.OK).json({
        status: 'success',
        zones
    });

}
exports.addLGA = async (req, res) => {
    try {
        const check = await LGA.find({ state: req.body.state, name: req.body.lga }).exec();

        if (check.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failed',
                error: 'The LGA already exist'
            });
        }

        //validate the state
        const state = await State.findById(req.body.state).exec();

        if (state === null) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failed',
                error: 'The state is not valid'
            });
        }

        const data = new LGA({
            _id: mongoose.Types.ObjectId(),
            state: req.body.state,
            name: req.body.lga
        });

        await data.save();

        const lgas = await LGA.find({ state: req.body.state }).populate('state', '_id name').exec();

        return res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: 'You have successfully added a LGA',
            lgas
        });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: 'failed',
            error: error
        });
    }
}


exports.addLGAList = async (req, res) => {

    req.body.lgas.forEach(async lga => {
        const check = await LGA.find({ zone: req.body.zone, name: lga }).exec();

        if (check.length === 0) {
            //validate the state
            const zone = await Zone.findById(req.body.zone).exec();

            if (zone !== null) {
                const data = new LGA({
                    state: req.body.state,
                    zone: req.body.zone,
                    name: lga
                });

                await data.save();
            }

        }


    });


    const lgas = await LGA.find({ state: req.body.state }).sort({ name: "asc" }).populate('zone', '_id name').exec();

    return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'You have successfully added LGA(s)',
        lgas
    });
}


exports.lgas = async (req, res) => {
 
        const lgas = await LGA.find().sort({ name: "asc" }).populate('zone', '_id name').exec();

        return res.status(StatusCodes.OK).json({
            status: 'success',
            lgas
        });

}
exports.lgasByZone = async (req, res) => {
 
    const lgas = await LGA.find({ zone: req.params.zone_id }).sort({ name: "asc" }).populate('zone', '_id name').exec();

    return res.status(StatusCodes.OK).json({
        status: 'success',
        lgas
    });

}