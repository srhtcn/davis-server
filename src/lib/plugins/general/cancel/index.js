"use strict";

const Plugin = require("../../../core/plugin");

class Cancel extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "davisGeneralCancel";
  }

  async ask(req) {
    return this.davis.plugins.davisGeneralStop.ask(req);
  }
}

module.exports = Cancel;
