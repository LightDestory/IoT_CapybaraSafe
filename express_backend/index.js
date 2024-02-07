const mqtt = require('mqtt')
const express = require('express')
const app = express()
const http_port = 3000

const protocol = 'mqtt'
const host = 'mqttserver.lightdestory.com'
const mqtt_port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${mqtt_port}`

const topics = ['testing/gateway', 'testing/alert']

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'iotproject',
    password: 'iotproject',
    reconnectPeriod: 1000,
  })
  
  client.on('connect', () => {
    console.log('Connected')
    client.subscribe(topics, () => {
      console.log(`Subscribe to topics`)
    })
  })

  client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
  })

  app.get('/api/send', function(req, res) {
    const text = req.query.text;
    client.publish("testing/alert", text, (error) => {
        if (error) {
          console.error('publish failed', error)
          res.send(503, "Fail");
          return
        }
      })
    res.sendStatus(200, "Success");
  });

  app.listen(http_port, () => {
    console.log(`Running on ${http_port}`)
  })