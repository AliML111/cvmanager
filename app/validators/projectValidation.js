const { body, validationResult } = require('express-validator');
const BadRequestError = require('../middleware/BadRequestError');
exports.project_create_check = [
    body('name')
        .exists()
        .notEmpty().withMessage('name is require')
        .isLength({ min: 1, max: 50 }).withMessage('firstName should not be empty, should be more than one and less than 50 character')
        .trim(),
    body('description')
        .notEmpty().withMessage('description is require')
        .isLength({ min: 10 }).withMessage('des min 10 char')
        .trim(),
    function (req, res, next) {
        try {
            var errorValidation = validationResult(req);
            var errorValidation = validationResult(req);
            if (!errorValidation.isEmpty()) {
                let validationErr = errorValidation.errors.map(item => item.msg);
                throw new BadRequestError("BadRequest", validationErr);
            }
            next();
        } catch (err) {
            next(err)
        }
    }
];

exports.project_update_check = [
    body('name')
        .isLength({ min: 1, max: 50 }).withMessage('name should not be empty, should be more than one and less than 50 character')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('description')
        .isLength({ min: 10 }).withMessage('des min 10 char')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    function (req, res, next) {
        try {
            var errorValidation = validationResult(req);
            var errorValidation = validationResult(req);
            if (!errorValidation.isEmpty()) {
                let validationErr = errorValidation.errors.map(item => item.msg);
                throw new BadRequestError("BadRequest", validationErr);
            }
            next();
        } catch (err) {
            next(err)
        }
    }
];