// producerController.js

const e = require('express');
const { getAll } = require('../models/producerModel');


exports.getAllProducers = async (req, res) => {
  try {
      const data = await getAll();

      res.status(200).json({ status: 'success', data });
  } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
  }
};