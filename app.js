const express = require('express');
const data = require('./data/employees.json');
const { body, validationResult, check } = require('express-validator');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// console.log(data);



// //1. Todos los empleadoos
// app.get('/employees/', (req, res) => {
//     res.json(data);
// });

//2. Devuelve los primeros 2 empleados. Del elemento 0 al elemento 1 del listado.
app.get('/employees', (req, res) => {
    console.log(req.query.page);
    console.log(typeof(req.query.page));
    // switch(+req.query.page){
    //     case 1:
    //         res.json(data.slice(0,2));
    //         break;
    //     case 2:
    //         res.json(data.slice(2,4));
    //         break;
    //     default:
    //         res.json(data);
    // }
    
    if(req.query.page){
        if(isNaN(req.query.page)){
            console.log('Not a number');
            return res.status(400).json({message : 'Page is not a number'});
        }
        else{
            const N = +req.query.page;
            const startIndex = (2 * (N - 1));
            const endIndex = (2 * (N - 1) + 1) + 1;
        
            console.log({startIndex}, {endIndex});
            res.json(data.slice( startIndex, endIndex));
        } 

        }
    else if(req.query.user){
        if(req.query.user == 'true')
            res.json(data.filter(e => e.privileges == 'user'));
        else
            res.json({});
    }
    else if(req.query.badges){
        res.json(data.filter(e => e.badges.includes(req.query.badges)));
    }
    else{
        res.json(data); 
    }
});

app.get('/employees/oldest', (req, res) => {
    let oldestEmployee = data[0];
    // console.log(oldestEmployee);
    
    data.map(e => {
        // console.log(e.age);
        if(e.age > oldestEmployee.age)
            oldestEmployee = e;
    });

    res.json(oldestEmployee);
});

app.get('/employees/:name', (req, res) => {
    const name = req.params.name;
    const foundEmployee = data.find( e => e.name === name);
    if(foundEmployee){
        res.json(foundEmployee);
    }
    else{
        res.status(404).json({code: 'not_found'});
    }
});

app.post('/employees', 
    check('name').exists().withMessage('Name is required'), 
    check('age').exists().withMessage('Age is required'), 
    check('phone').exists().withMessage('Phone is required'), 
    check('privileges').exists().withMessage('Privileges are required'), 
    check('favorites').exists().withMessage('Favorites are required'), 
    check('finished').exists().withMessage('Finished is required'), 
    check('badges').exists().withMessage('Badges are required'), 
    check('points').exists().withMessage('Points are required'), 
    (req, res) => {
        const newEmployee = req.body;
        console.log(newEmployee);
        console.log(req.body.age);
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()){
            // res.status(400).json({errors});
            res.status(400).json({ code: 'bad_request'});
        }
        else{
            data.push(req.body)
            console.log(data);
            // res.json({data: req.body });
            res.json({message: 'New employee added' });

        }
});

app.listen(8000, () => console.log(new Date()));