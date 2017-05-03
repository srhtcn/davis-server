const aws = require("aws-sdk");
const logger = require("./logger");

const LexModelBuildingService = aws.LexModelBuildingService;
const LexRuntime = aws.LexRuntime;

/**
 * Static class for interacting with lex
 *
 * @class Lex
 */
class Lex {
  /**
   * Get an instance of the singleton
   *
   * @static
   * @returns
   *
   * @memberOf Lex
   */
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return new Lex();
  }

  /**
   * Creates an instance of Lex.
   *
   *
   * @memberOf Lex
   */
  constructor() {
    this.lexModelBuildingService = new LexModelBuildingService({
      accessKeyId: process.env.AWS_KEY_ID,
      apiVersion: "2017-04-19",
      region: process.env.LEX_REGION || "us-east-1",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.lexRuntime = new LexRuntime({
      accessKeyId: process.env.AWS_KEY_ID,
      apiVersion: process.env.LEX_API_VERSION || "2016-11-28",
      region: process.env.LEX_REGION || "us-east-1",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.name = process.env.LEX_NAME;
    this.alias = process.env.LEX_ALIAS;
  }

  /**
   * Get a JSON representation of a Lex bot from the model building service
   *
   * @returns {Promise<LexModelBuildingService.GetBotResponse>}
   *
   * @memberOf Lex
   */
  async getBot() {
    const data = await new Promise((resolve, reject) => {
      this.lexModelBuildingService.getBot({
        name: process.env.LEX_NAME,
        versionOrAlias: process.env.LEX_ALIAS,
      }, (err, lexResponse) => {
        if (err) {
          logger.error({ err });
          reject(err);
        } else {
          resolve(lexResponse);
        }
      });
    });

    return data;
  }

  /**
   * Get a JSON representation of a Lex intent from the model building service
   *
   * @param {string} name
   * @param {string} version
   * @returns {Promise<LexModelBuildingService.GetIntentResponse>}
   *
   * @memberOf Lex
   */
  async getIntent(name, version) {
    const data = await new Promise((resolve, reject) => {
      this.lexModelBuildingService.getIntent({
        name,
        version,
      }, (err, lexResponse) => {
        if (err) {
          logger.error({ err });
          reject(err);
        } else {
          resolve(lexResponse);
        }
      });
    });

    return data;
  }

  /**
   * Get a JSON representation of a Lex slot from the model building service
   *
   * @param {string} name
   * @param {string} version
   * @returns {Promise<LexModelBuildingService.GetSlotTypeResponse>}
   *
   * @memberOf Lex
   */
  async getSlotType(name, version) {
    const data = await new Promise((resolve, reject) => {
      this.lexModelBuildingService.getSlotType({
        name,
        version,
      }, (err, lexResponse) => {
        if (err) {
          logger.error({ err });
          reject(err);
        } else {
          resolve(lexResponse);
        }
      });
    });

    return data;
  }

  /**
   * Ask a Lex bot a question
   *
   * @param {string} inp
   * @param {string} scope
   * @returns {Promise<LexRuntime.PostTextResponse>}
   *
   * @memberOf Lex
   */
  async ask(inp, scope) {
    logger.debug(`Asking Lex: ${inp}`);
    const lexStart = process.hrtime();
    const data = await new Promise((resolve, reject) => {
      this.lexRuntime.postText({
        botAlias: this.alias,
        botName: this.name,
        inputText: inp,
        userId: scope,
      }, (err, lexResponse) => {
        if (err) {
          logger.error({ err });
          reject(err);
        }
        const lexEnd = process.hrtime();
        const startms = lexStart[0] * 1000000 + lexStart[1] / 1000; // eslint-disable-line
        const endms = lexEnd[0] * 1000000 + lexEnd[1] / 1000; // eslint-disable-line
        const lexTime = (endms - startms) / 1000;
        logger.debug(`Lex responded in ${lexTime.toFixed()} ms`);
        resolve(lexResponse);
      });
    });

    return data;
  }
}

module.exports = Lex.getInstance();
