
/**
* Mail Sender : based on NodeMailer
*/

var nodemailer = require('nodemailer'),
    smtpTransport = null,
    defMailOpts = {
        from: 'Mail System <herrerag.irvin@gmail.com>',
        to: 'irvin.herrerag@gmail.com'
    };

module.exports = {
    init: function () {

        // create reusable transport method (opens pool of SMTP connections)
        smtpTransport = nodemailer.createTransport('SMTP',{
            service: 'Gmail',
            auth: {
                user: 'herrerag.irvin@gmail.com',
                pass: 'Digital88'
            }
        });
    },
    sendMail: function (mailOptions, options) {

        function mergeOpts(obj1,obj2){
            var obj3 = {};
            for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
            for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
            return obj3;
        }

        var mailOpts = mergeOpts(mailOptions, defMailOpts),
            emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            opts = options || {};

        if (!mailOpts.subject) { throw new Error('No subject specified.');}
        if (!mailOpts.name) { throw new Error('No name specified.');}
        if (mailOpts.message.length > 1000) { throw new Error('Message limit exceeded.');}
        if (mailOpts.sender.match(emailRegex) > 0) { throw new Error('E-mail is not valid.');}

        // send mail with defined transport object
        smtpTransport.sendMail({
            to: mailOpts.to,
            from: mailOpts.from,
            subject: '[Mail System] [' + mailOpts.sender + '] ' + mailOpts.subject,
            text: mailOpts.message
        }, function(error, response){
            if(error){
                if (opts.onFailure) { opts.onFailure.call(null, error)}
                console.log(error);
            }else{
                if (opts.onComplete) { opts.onComplete.call(null, response.message)}
                console.log('Message sent: ' + response.message);
            }
        });
    },
    close: function () {
        smtpTransport.close(); // shut down the connection pool, no more messages
    }
};
