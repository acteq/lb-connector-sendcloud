/**
 * Dependencies
 */

var assert = require('assert'),
    _ = require('lodash'),
    Q = require('q');
var axios = require('axios');
var querystring = require('querystring');

/**
 * Export the connector class
 */

module.exports = SendcloudConnector;

/**
 * Configure and create an instance of the connector
 */

function SendcloudConnector(settings) {
    assert(typeof settings === 'object', 'cannot init connector without settings');
    this.sendcloud = { apiUser: settings.apiUser, apiKey: settings.apiKey };
}

SendcloudConnector.initialize = function(dataSource, callback) {

    dataSource.connector = new SendcloudConnector(dataSource.settings);
    if (callback) {
        callback();
    }
};

SendcloudConnector.prototype.DataAccessObject = Mailer;

function Mailer() {

}


/**
 * Send transactional email with options
 *
 * Basic options:
 *
 * {
 *   from: { name: "evenemento", email: "crew@evenemento.co" },
 *   to: "hello@evenemento.co",
 *   subject: "Ho ho",
 *   text: "Plain text message",
 *   html: "<b>Html messages</b> put here"
 * }
 *
 * Full list of options are available here:
 * http://sendcloud.sohu.com/doc/email_v2/send_email/#_1
 * http://sendcloud.sohu.com/doc/email_v2/send_email/#_2
 *
 * if option `template' is set than message will be send as template:
 *
 * {
 *   from: { name: "evenemento", email: "crew@evenemento.co" },
 *   to: "hello@evenemento.co",
 *   subject: "Ho ho",
 *   template: {
 *      name: "signup-confirm",
 *      content: {
 *        name: "NewUser Name",
 *        accountId: "123456"
 *      }
 *   }
 * }
 *
 * 
 * http://api.sendcloud.net/apiv2/mail/send
 * apiUser	string	是	API_USER
apiKey	string	是	API_KEY
from	string	是	发件人地址. 举例: support@ifaxin.com, 当配置通过DMARC后，平台将使用当前域名作为from的域名后缀。DMARC是什么?
to	string	*	收件人地址. 多个地址使用';'分隔, 如 ben@ifaxin.com;joe@ifaxin.com
subject	string	是	标题. 不能为空
cc	string	否	抄送地址. 多个地址使用';'分隔
bcc	string	否	密送地址. 多个地址使用';'分隔
replyTo	string	否	设置用户默认的回复邮件地址.多个地址使用';'分隔，地址个数不能超过3个. 如果 replyTo 没有或者为空, 则默认的回复邮件地址为 from

contentSummary	string	*	邮件摘要. 该字段传入值后，若原邮件已有摘要，会覆盖原邮件的摘要；若原邮件中没有摘要将会插入摘要。了解邮件摘要的更多内容，请点击这里
fromName	string	否	发件人名称. 显示如: ifaxin客服支持<support@ifaxin.com>
labelId	int	否	本次发送所使用的标签ID. 此标签需要事先创建
headers	string	否	邮件头部信息. JSON 格式, 比如:{"header1": "value1", "header2": "value2"}
attachments	file	否	邮件附件. 发送附件时, 必须使用 multipart/form-data 进行 post 提交 (表单提交)
respEmailId	string (true, false)	否	默认值: true. 是否返回 emailId. 有多个收件人时, 会返回 emailId 的列表
useNotification	string (true, false)	否	默认值: false. 是否使用回执
useAddressList	string (true, false)	否	默认值: false. 是否使用地址列表发送. 比如: to=group1@maillist.sendcloud.org;group2@maillist.sendcloud.org
xsmtpapi	string	否	SMTP 扩展字段. 详见 X-SMTPAPI

plain	string	否	邮件的内容. 邮件格式为 text/plain
html	string	*	邮件的内容. 邮件格式为 text/html

 *
 * http://api.sendcloud.net/apiv2/mail/sendtemplate
 * 参数	类型	必须	说明
apiUser	string	是	API_USER
apiKey	string	是	API_KEY
from	string	是	发件人地址. 举例: support@ifaxin.com,当配置通过DMARC后，平台将使用当前域名作为from的域名后缀。DMARC是什么?
to	string	*	地址列表. 在 useAddressList=true 时使用
subject	string	*	邮件标题
cc			不支持
bcc			不支持
replyTo	string	否	设置用户默认的回复邮件地址.多个地址使用';'分隔，地址个数不能超过3个. 如果 replyTo 没有或者为空, 则默认的回复邮件地址为 from

contentSummary	string	*	邮件摘要. 该字段传入值后，若原邮件已有摘要，会覆盖原邮件的摘要；若原邮件中没有摘要将会插入摘要。了解邮件摘要的更多内容，请点击这里
fromName	string	否	发件人名称. 显示如: ifaxin客服支持<support@ifaxin.com>
labelId	int	否	本次发送所使用的标签ID. 此标签需要事先创建
headers	string	否	邮件头部信息. JSON 格式, 比如:{"header1": "value1", "header2": "value2"}
attachments	file	否	邮件附件. 发送附件时, 必须使用 multipart/form-data 进行 post 提交 (表单提交)
respEmailId	string (true, false)	否	默认值: true. 是否返回 emailId. 有多个收件人时, 会返回 emailId 的列表
useNotification	string (true, false)	否	默认值: false. 是否使用回执
useAddressList	string (true, false)	否	默认值: false. 是否使用地址列表发送. 比如: to=group1@maillist.sendcloud.org;group2@maillist.sendcloud.org
xsmtpapi	string	*	SMTP 扩展字段. 详见 X-SMTPAPI

templateInvokeName	string	是	邮件模板调用名称



SendCloud 支持在邮件中使用「变量替换」.
1. 在普通发送, 模板发送 中使用变量, 来作为占位符
2. 在地址列表, X-SMTPAPI 中设置变量的值
3, SendCloud 会根据不同收件人, 来替换邮件内容中相应变量的值

 * @param {Object} options
 * @param {Function} callback
 */

Mailer.send = function(options, cb) {
    var dataSource = this.dataSource,
        settings = dataSource && dataSource.settings,
        connector = dataSource.connector,
        deferred = Q.defer(),
        sendcloudMessage = {};

    if (options.__data) {
        options = _.clone(options.__data);
    } else {
        options = _.clone(options);
    }

    var fn = function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
        cb && cb(err, result);
    };

    assert(connector, 'Cannot send mail without a connector!');

    if (connector.sendcloud) {

        if (_.isString(options.from)) {
            sendcloudMessage.from = options.from
        } else if (_.isObject(options.from)) {
            sendcloudMessage.fromName = options.from.name;
            sendcloudMessage.from = options.from.email;
        } else {
            if (options.fromName) {
                sendcloudMessage.fromName = options.fromName || undefined;
            }
            if (options.from) {
                sendcloudMessage.from = options.from || undefined;
            }
        }
        delete options.from;

        if (_.isString(options.to)) {
            sendcloudMessage.to = options.to; //options.to.replace(/,|\s+/g, ';');
            sendcloudMessage.xsmtpapi = {
                to: [options.to]
            };
        } else if (_.isArray(options.to)) {
            sendcloudMessage.to = options.to.join(';');
            sendcloudMessage.xsmtpapi = {
                to: options.to
            };
        }
        delete options.to;

        if (_.isString(options.contentSummary)) {
            sendcloudMessage.contentSummary = options.contentSummary;
        }
        delete options.contentSummary;

        if (_.isObject(options.vars)) {
            sendcloudMessage.xsmtpapi.sub = options.vars;
        }
        delete options.vars;

        if (_.isObject(options.vars_section)) {
            sendcloudMessage.xsmtpapi.section = options.vars_section;
        }
        delete options.vars_section;

        sendcloudMessage.xsmtpapi = JSON.stringify(sendcloudMessage.xsmtpapi);

        if (typeof options.template === 'object') {
            assert(options.template.name, 'template name should be defined');

            sendcloudMessage.templateInvokeName = options.template.name;

            delete options.template;

            _.extend(sendcloudMessage, _.extend(options, connector.sendcloud))
                // , { encodeURIComponent: gbkEncodeURIComponent }
            axios.post('https://api.sendcloud.net/apiv2/mail/sendtemplate', querystring.stringify(sendcloudMessage))
                .then(function(response) {
                    if (response.data.result == true) {
                        fn(null, response.data);
                    } else {
                        console.error(response);
                        fn(response.data, null);
                    }
                    return response.data;
                }, function(error) {
                    console.log(error);
                    fn(error, null);
                    return error;
                });
        } else {
            _.extend(sendcloudMessage, _.extend(options, connector.sendcloud))
            axios.post('https://api.sendcloud.net/apiv2/mail/send', querystring.stringify(sendcloudMessage))
                .then(function(response) {
                    if (response.data.result == true) {
                        fn(null, response.data);
                    } else {
                        console.error(response);
                        fn(response.data, null);
                    }
                    return response.data;
                }, function(error) {
                    console.error(error);
                    fn(error, null);
                    return error;
                });
        }
    } else {
        console.warn('Warning: no connection with sendcloud');
        process.nextTick(function() {
            fn(null, options);
        });
    }
    return deferred.promise;
};

/**
 * Send an email instance using instance
 */

Mailer.prototype.send = function(fn) {
    return this.constructor.send(this, fn);
};