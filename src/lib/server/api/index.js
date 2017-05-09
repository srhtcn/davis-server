// global modules
const Router = require("express").Router;
const Joi = require("joi");

// davis modules
const davis = require("../../core/davis");
const logger = require("../../core/logger");

// routes
const auth = require("./auth");
const dynatrace = require("./dynatrace");
const system = require("./system");

const v1 = Router();

v1.use(auth);

v1.post("/ask", async (req, res) => {
  const schema = Joi.object().keys({ raw: Joi.string().min(1).required() });

  const validate = Joi.validate(req.body, schema);

  if (validate.error) {
    res.status(400).json({
      message: validate.error.details[0].message,
      success: false,
    });
    return;
  }

  const dreq = {
    raw: validate.value.raw,
    scope: `${req.user.activeTenant.url}:web:${req.user.email}`,
    user: req.user,
  };

  try {
    const dres = await davis.ask(dreq);
    res.status(200).json({ success: true, response: dres });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      message: "An unhandled error occurred",
      success: false,
    });
  }
});

v1.use("/system", system);
v1.use("/dynatrace", dynatrace);

// Global API 404
v1.use((req, res) => { res.status(404).send({ status: false, message: "Invalid route" }); });

// Global API Error Handler
v1.use((err, req, res) => {
  logger.error({ err });
  res.status(500).json({ success: false, message: "An unhandled error occurred" });
});

module.exports.v1 = v1;