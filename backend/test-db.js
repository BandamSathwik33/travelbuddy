const mongoose = require('mongoose');
const uri = 'mongodb+srv://bandamsathwik:bandamsathwik@cluster0.6hgtuoo.mongodb.net/tripsync?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => {
    console.log('Connected!');
    process.exit(0);
  })
  .catch(e => {
    console.error('Failed:', e);
    process.exit(1);
  });
