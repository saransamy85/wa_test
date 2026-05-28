const express = require('express');

const app = express();

app.get('/', (req, res) => {

    res.send('Railway Working');

});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        'Server Running on Port ' + PORT
    );

});
