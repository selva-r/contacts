/**
 *  ------------------------------------------------------------------------
 *  
 *  Server Initialization
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const contactRoutes = require('./src/routes/contacts');
const contactGrpRoutes = require('./src/routes/contact-group');
const dbConn = require('./src/entity');

const opts = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
}
dbConn.initDb(process.env.DB_URI, opts);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/v1', contactRoutes);
app.use('/v1', contactGrpRoutes);

app.all('*', (req, res) => {
  res.status(404).send('Nah ! Not found');
});

app.listen(process.env.PORT, () => console.log('Server listening on port 3000!'))