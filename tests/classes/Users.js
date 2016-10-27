'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

chai.should();

const Davis = require('../../lib/Davis');

describe('Users', () => {
  const davis = new Davis();
  const Users = davis.classes.Users;
  const users = new Users(davis);

  const email = 'testuser@dynatrace.com';

  it('should return a list of timezones',
    () => Users.getValidTimezones().should.contain('america/detroit'));

  it('should not find a valid Alexa user',
    () => users.validateAlexaUser('shouldNotExist').should.eventually.be.rejected);

  it('should find a valid Alexa user', () => {
    const alexaID = 'shouldExist';

    return users.createUser(email, 'test', true)
      .then(() => users.updateUser(email, { alexa_ids: [alexaID] }))
      .then(() => users.validateAlexaUser(alexaID))
      .then(user => (user.email).should.equal(email));
  });

  it('should fail to update the timezone',
    () => users.updateUser(email, { timezone: 'invalid' }).should.eventually.be.rejected);

  it('should successfully update the timezone',
    () => users.updateUser(email, { timezone: 'america/detroit' }).should.eventually.be.resolved);
});