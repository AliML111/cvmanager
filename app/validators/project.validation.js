import { body, param } from 'express-validator';

import generalValidator from '../helper/validator.js';

class ProjectValidation {
    create() {
        return [
            body('company_id')
                .notEmpty()
                .withMessage('company.validations.company_id_required')
                .isMongoId()
                .withMessage('company.validations.company_id_invalid')
                .trim(),
            body('manager_id')
                .notEmpty()
                .withMessage('company.validations.manager_id_required')
                .isMongoId()
                .withMessage('company.validations.manager_id_invalid')
                .trim(),
            body('name')
                .notEmpty()
                .withMessage('project.validations.project_name_required')
                .isLength({ min: 3, max: 50 })
                .withMessage('project.validations.project_name_length')
                .trim(),
            body('description')
                .isLength({ min: 10, max: 100 })
                .withMessage('project.validations.project_description_length')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            generalValidator
        ];
    }

    update() {
        return [
            param('id')
                .notEmpty()
                .withMessage('project.validations.project_id_required')
                .isMongoId()
                .withMessage('project.validations.project_id_invalid')
                .trim(),
            body('name')
                .isLength({ min: 1, max: 50 })
                .withMessage('project.validations.project_name_length')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            body('company_id')
                .isMongoId()
                .withMessage('company.validations.company_id_invalid')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            body('manager_id')
                .isMongoId()
                .withMessage('company.validations.manager_id_invalid')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            body('description')
                .isLength({ min: 10, max: 100 })
                .withMessage('project.validations.project_description_length')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            generalValidator
        ];
    }

    find() {
        return [
            param('id')
                .notEmpty()
                .withMessage('project.validations.project_id_required')
                .isMongoId()
                .withMessage('project.validations.project_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id')
                .notEmpty()
                .withMessage('project.validations.project_id_required')
                .isMongoId()
                .withMessage('project.validations.project_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    manager() {
        return [
            param('id')
                .notEmpty()
                .withMessage('project.validations.project_id_required')
                .isMongoId()
                .withMessage('project.validations.project_id_invalid')
                .trim(),
            body('manager_id')
                .notEmpty()
                .withMessage('company.validations.manager_id_required')
                .isMongoId()
                .withMessage('company.validations.manager_id_invalid')
                .trim(),
            generalValidator
        ]
    }
}

export default new ProjectValidation();
