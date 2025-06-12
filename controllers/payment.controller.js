const { sendErrorResponse } = require("../helpers/send_error_response");
const Contract = require("../models/contract.model");
const Course = require("../models/course.model");
const Owner = require("../models/owner.model");
const Payment = require("../models/payment.model");
const Student = require("../models/student.model");
const {
  paymentValidation,
  updatePaymentValidation,
} = require("../validations/payment.validation");

const create = async (req, res) => {
  try {
    const { error, value } = paymentValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { amount, method, date, contractId, studentId } = value;

    const payment = await Payment.create({
      amount,
      method,
      date,
      contractId,
      studentId,
    });

    res.status(201).send({ message: "Payment created", data: payment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).send({ data: payments });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).send({ error: "Payment not found" });
    }

    res.status(200).send({ data: payment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updatePaymentValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { id } = req.params;
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).send({ error: "Payment not found" });
    }

    const { amount, method, date, contractId, studentId } = value;

    await payment.update({
      amount,
      method,
      date,
      contractId,
      studentId,
    });

    res.status(200).send({ message: "Payment updated", data: payment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).send({ error: "Payment not found" });
    }

    await payment.destroy();
    res.status(200).send({ message: "Payment deleted" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findPaymentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).send({ error: "studentId is required" });
    }

    const payments = await Payment.findAll({
      where: { studentId },
      include: [
        {
          model: Student,
          attributes: ["full_name", "email"],
        },
        {
          model: Contract,
          include: [
            {
              model: Course,
              include: [
                {
                  model: Owner,
                  attributes: ["full_name", "email"],
                },
              ],
              attributes: ["name"],
            },
          ],
          attributes: ["name", "status"],
        },
      ],
      attributes: ["amount", "date", "method", "createdAt"],
    });

    res.status(200).send(payments);
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
  findPaymentsByStudent,
};
