const Contract = require("../models/contract.model");
const {
  contractValidation,
  updateContractValidation,
} = require("../validations/contract.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const Course = require("../models/course.model");
const Student = require("../models/student.model");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { error, value } = contractValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const {
      name,
      start_time,
      end_time,
      total_price,
      status,
      courseId,
      studentId,
    } = value;

    const newContract = await Contract.create({
      name,
      start_time,
      end_time,
      total_price,
      status,
      courseId,
      studentId,
    });

    res.status(201).send(newContract);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        {
          model: Course,
          attributes: ["id", "name"],
        },
        {
          model: Student,
          attributes: ["id", "fullName"],
        },
      ],
    });
    res.status(200).send(contracts);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          attributes: ["id", "name"],
        },
        {
          model: Student,
          attributes: ["id", "fullName"],
        },
      ],
    });

    if (!contract) {
      return res.status(404).send({ error: "Contract not found" });
    }

    res.status(200).send(contract);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateContractValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).send({ error: "Contract not found" });
    }

    const {
      name,
      start_time,
      end_time,
      total_price,
      status,
      courseId,
      studentId,
    } = value;

    await contract.update({
      name,
      start_time,
      end_time,
      total_price,
      status,
      courseId,
      studentId,
    });

    res.status(200).send(contract);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);

    if (!contract) {
      return res.status(404).send({ error: "Contract not found" });
    }

    await contract.destroy();

    res.status(200).send({ message: "Contract deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findByDate = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    if (!start_date || !end_date) {
      return sendErrorResponse(
        {
          message: "start_date and end_date are required",
        },
        res,
        400
      );
    }

    const contracts = await Contract.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      include: [
        {
          model: Course,
          attributes: ["name", "level", "language"],
        },
        {
          model: Student,
          attributes: ["full_name", "email"],
        },
      ],
      attributes: ["name", "status", "total_price", "createdAt"],
    });

    res.status(200).send(contracts);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  findByDate,
};
