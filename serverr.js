const express = require('express');
const app = express();
const session = require('express-session');
const port = 8080;


app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//konfigurasi session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized:false
}));

//autentikasi
const authenticate = (req, res, next) => {
    if (req?.session.isAuthenticated) {
        next();
    } else {
        res.status(401).send('Tidak Terautentikasi')
    }
};

//Route login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123'){
        req.session.isAuthenticated = true;
        res.send('Login sukses')
    } else {
        res.status(401).send('Kredensial Tidak Valid');
    }
});

//Route logout
app.get('/logout',(req, res) => {
    //menghapus session penguna
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Logout');
        }
    });
});

//Route GET yang membutuhkan autentikasi
app.get('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (GET)');
});

//Route POST yang membutuhkan autentikasi
app.post('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (POST)');
});

//Route PUT yang membutuhkan autentikasi
app.put('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (PUT)');
});

//Route DELETE yang membutuhkan autentikasi
app.delete('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (DELETE)');
});

//server berjalan pada port 8080
app.listen(port, () => {
    console.log(`server berjalan pada port ${port}`);
}) 