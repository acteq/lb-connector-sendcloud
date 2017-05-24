require('./helpers/init.js');
var juggler = require('loopback-datasource-juggler');

var rewire = require("rewire"),
    Connector = rewire('../lib/sendcloud'),
    DataSource = juggler.DataSource,
    ModelBuilder = juggler.ModelBuilder,
    Email, ds;


describe('sendcloud init', function() {
    it('should throw error ', function() {
        expect(function() { new Connector(); }).to.throw();
    });

    it('should have property sendcloud with api key', function() {
        var apiUser = '',
            apiKey = '',
            connector = new Connector({ apiUser: apiUser, apiKey: apiKey });

        expect(connector).to.have.a.property('sendcloud');
        expect(connector.sendcloud.apiKey).to.equal(apiKey);
    });

    it('should have property sendcloud with api key', function() {
        var apiUser = '',
            apiKey = '',
            connector = new Connector({ apiUser: apiUser, apiKey: apiKey });

        expect(connector).to.have.a.property('sendcloud');
        expect(connector.sendcloud.apiKey).to.equal(apiKey);
    });
});

describe('sendcloud message send', function() {

    beforeEach(function() {
        ds = new DataSource({
            connector: Connector,
            apiUser: '',
            apiKey: ''
        });

        var modelBuilder = new ModelBuilder();
        Email = modelBuilder.define('Email');
        Email.attachTo(ds);
    });

    it('Should send - Email.send', function(done) {
        var msg = {
            from: 'no-reply@malichina.com',
            to: 'lxiang@malichina.com',
            subject: 'Test subject',
            text: 'Plain text',
            html: 'Html <b>content</b>'
        };

        Email.send(msg, function(err, result) {
            expect(err).equal(null);
            done();
        });
    });

    it('Should send - Email.prototype.send', function(done) {
        var msg = {
            from: 'no-reply@malichina.com',
            to: 'lxiang@malichina.com',
            subject: 'Test subject',
            text: 'Plain text',
            html: 'Html <b>content</b>'
        };

        var email = new Email(msg);

        email.send(function(err, result) {
            // expect(err).equal(null);
            done();
        });
    });

    it('Should send template - Email.send', function(done) {
        var msg = {
            from: 'no-reply@malichina.com',
            to: ['lxiang@malichina.com', 'site@malichina.com'],
            subject: 'Test subject',
            text: 'Plain text',
            html: 'Html <b>content</b>',
            template: {
                name: 'active'
            },
            vars: {
                '%name%': ['测试', '测试']
            }
        };

        Email.send(msg, function(err, result) {
            // expect(err).result.equal(false);
            // expect(result).result.equal(null);
            done();
        });
    });

});