const sendErrorResponse = (error, res, status) => {
  console.log(error);
  res.status(status).send({ error: "Xatolik", message: error.message });
};

module.exports = {
  sendErrorResponse,
};
