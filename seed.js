const db = require('./models');

let consoles = [{name: 'Xbox One'},{name: 'Nintendo Switch'},{name: 'Playstation 4'}]
db.Console.deleteMany({}, (err, result) => {
    if(err) {
        console.log(err);
        process.exit();
    };
    console.log('Deleted Consoles');
    db.Console.create(consoles, (err, newConsoles) => {
        if(err) {
            console.log(err);
            process.exit();
        };
        console.log('Created Consoles');
        process.exit();
    })
})