const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.set('view enginw', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
}));

const conection = require('./database/db');

console.log(__dirname);

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});


app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    const email = req.body.email;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    conection.query('INSERT INTO usuarios SET ?',{usuario:user, nombre:name, rol:rol, contrasena:passwordHaash, correo: email}, async (error, results) => {
    if (error) {
        console.log(error);
    }else {
        res.send('register')
    }
})
})


app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    if(user && pass){
        conection.query('SELECT * FROM usuarios WHERE Usuario = ?', [user], async (error, results) => {
            
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].Contrasena))){
                res.send('usuario incorrecto');
            }else {
                res.send('login correcto')
            }
    })
    };
})


app.listen(3000, (req, res) => {
    console.log('server running in http://localhost:3000');
})  