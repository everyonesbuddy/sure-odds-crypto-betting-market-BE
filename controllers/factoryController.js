const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Code = require('../models/codeModel');
const Pickem1 = require('../models/pickem1Model');
const Pickem2 = require('../models/pickem2Model');
const authController = require('./authController');

const filterObj = (obj, ...unWantedProps) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (!unWantedProps.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.filterObj = filterObj;

exports.getAll = (model) => {
  return catchAsync(async (req, res) => {
    let docs;
    if (model === Pickem1 || model === Pickem2) {
      docs = await model
        .find()
        .select(
          '+teamPicked +spreadLine +league +pickType +selectedGameId +email'
        );
    } else {
      docs = await model.find();
    }

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs,
    });
  });
};

exports.getOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await model.findById(req.params.id);

    if (!doc) {
      return next(new AppError('There is no document with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
};

exports.createOne = (model) => {
  return catchAsync(async (req, res, next) => {
    if (model === User) {
      const filteredBody = filterObj(req.body, 'role');
      req.body = filteredBody;
    }

    const doc = await model.create(req.body);

    if (model === User) {
      doc.password = undefined;
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
};

exports.updateOne = (model) => {
  return catchAsync(async (req, res, next) => {
    if (model === User) {
      req.body = filterObj(
        req.body,
        'userName',
        'role',
        'password',
        'passwordConfirm'
      );
    }

    if (model === Code) {
      req.body = filterObj(req.body, 'code');
    }

    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('There is no document with that id', 404));
    }

    if (model === User) {
      authController.createSendToken(doc, 200, res);
    } else {
      res.status(200).json({
        status: 'success',
        data: doc,
      });
    }
  });
};

exports.deleteOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id, req.body);

    if (!doc) {
      return next(new AppError('There is no document with that id', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

exports.setId = (model) => {
  return catchAsync(async (req, res, next) => {
    if (model === User) {
      req.params.id = req.user._id;
    }
    next();
  });
};
