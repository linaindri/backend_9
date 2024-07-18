const express = require('express');
const app = express();
const session = require('express-session');
const port = 5000;
const mysql = require('mysql2')


// untuk menerima req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// koneksi database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'backend'
});

connection.connect(error => {
    if (error) throw error;
    console.log('terhubung ke database ');
})

// konfigurasi session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Middleware untuk autentikasi
const authenticate = (req, res, next) => {
    if (req?.session.isAuthenticated) {
        // pengguna sudah terautentikasi
        next();
    } else {
        // pengguna belum terautentikasi 
        res.status(401).send('Tidak Terautentikasi');
    }
};

//register
app.post('/register', (req,res) => {
    const {username, password} = req.body;
    connection.query(`INSERT INTO user VALUES ('${username}', PASSWORD('${password}'))`,
        (error, results) => {
            if (error) throw error;
            res.json({message: 'Data berhasil ditambahkan', id: results.insertId})
        });
})

//login
app.post('/login', (req, res) => {
    const {username, password} = req.body;

    connection.promise().query(`SELECT * FROM user WHERE username = '${username}'
        AND password = PASSWORD('${password}')`)

    .then ((results) => {
        if((results.length > 0) ){
            req.session.isAuthenticated= true;
            res.json({message: 'berhasil login'});
        } else {
            res.status(401).send('username atau password salah');
        }
    })
});

// Route Logout 
app.get('/logout', (req, res) => {
    // menghapus session pengguna
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Logout');
        }
    });
});

// Route GET yang membutuhkan autentikasi 
app.get('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (GET)');
});
// Route GET yang membutuhkan autentikasi 
app.post('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (POST)');
});
// Route GET yang membutuhkan autentikasi 
app.put('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (PUT)');
});
// Route GET yang membutuhkan autentikasi 
app.delete('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (DELETE)');
});

// SERVER BERJALAN PADA PORT 5000
app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`);
});