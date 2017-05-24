## lb-connector-sendcloud

`lb-connector-sendcloud` is the Loopback connector module which allow to send emails via Mandrill.

## 1. Installation
```sh
npm install lb-connector-sendcloud --save
```

## 2. Configuration

datasources.json

```js
{
    "sendcloud": {
        "connector": "lb-connector-sendcloud",
        "apiUser": "[your api user here]",
        "apiKey": "[your api key here]"
    }
}
```

model-config.json

```js
{
    "Email": {
        "dataSource": "sendcloud",
        "public": false
    }
}
```

Additionaly you can set defaults

```js
{
    "sendcloud": {
        "connector": "lb-connector-sendcloud",
        "apiUser": "[your api user here]",
        "apiKey": "[your api key here]",
        "defaults": {
        }
    }
}
```

Configuration in JavaScript

```js
var DataSource = require('loopback-datasource-juggler').DataSource;
var dsSendcloud = new DataSource('lb-connector-sendcloud', {
     "apiUser": "[your api user here]",
     "apiKey": "[your api key here]"
});
loopback.Email.attachTo(dsSendcloud);
```

## 3. Use

Basic option same as built in Loopback

```js
loopback.Email.send({
    to: "test@to.com",
    from: "test@from.com",
    subject: "subject",
    text: "plain text message",
    html: "html <b>message</b>"
},
function(err, result) {
    if(err) {
        console.log('Upppss something crash');
        return;
    }
    console.log(result);
});
```

Some advantages - now you can use templates from Sendcloud

```js
loopback.Email.send({
    to: "test@to.com",
    from: "test@from.com",
    subject: "subject",
    template: {
        name: "signup-confirm"
    }
    contentSummary: 'the summary of your content'
    labelId: "123456"
},
function(err, result) {
    if(err) {
        console.log('Upppss something crash');
        return;
    }
    console.log(result);
});
```

To customize emails using vars
 
#### Single Recipient
```js
var
  params,
  user = {
    firstName: 'Paul',
    email: 'paul@example.com'
  }
  
  params = {
    to: user.email,
    template: {
      name: 'test-email',
    }
    ,vars: [
        //in your sendcloud template `*|FIRST_NAME|*`
        {
          name: 'FIRST_NAME',
          content: user.firstName
        }
      ]
  };
  
  loopback.Email.send( params, function( err, email ) {
      ...
  })
```
        
#### Multiple Recipients 
```js
var
  params,
  users = [
    {
      firstName: 'Kaitlin',
      email: 'kaitlin@example.com'
    },
    {
      firstName: 'Ryan',
      email: 'ryan@example.com'
    }
  ];

params = {
  to: users.map( function( user ) {
    return user.email;
  }),   
  template: {
    name: 'test-email'
  },
  vars: {
        name: 'FIRST_NAME'
      }
};

loopback.Email.send( params, function( err, email ) {
    ...
})
```
