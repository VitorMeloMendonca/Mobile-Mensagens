var User = require('../models/user');
var Mensage = require('../models/mensage');
var config = require('../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
    
    var token = jsonwebtoken.sign({
        _id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresIn: "5 days"
    });
    
    return token;
}

module.exports = function (app, express) {
    
    var api = express.Router();
    
    api.post('/signup', function (req, res) {
        
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        });
        
        var token = createToken(user);
        
        user.save(function (err) {
            if (err) {
                console.log(err);
                
                if (err.code === 11000) {
                    res.send({ message: 'O usuário informado já foi criado no sistema!', errors: true });
                    return;
                }
                
                res.send(err);
                return;
            }
            else {
                res.json(
                    {
                        success: true, 
                        message: 'Usuário criado com sucesso!',
                        token: token
                    });
            }
        });
    });
    
    api.post('/login', function (req, res) {
        
        User.findOne({
            username: req.body.username
        }).select('name username password role').exec(function (err, user) {
            
            if (err)
                throw err;
            
            if (!user) {
                res.send({ message: "Usuário não existe!", errors: true });
            }
            else if (user) {
                
                console.log(user);
                
                var validPassword = user.comparePassword(req.body.password);
                
                if (!validPassword) {
                    res.send({ message: 'Senha inválida', errors: true });
                }
                else {
                    
                    var token = createToken(user);
                    
                    res.json({
                        success: true,
                        message: 'Login realizado com sucesso!',
                        token: token,
                        user: user
                    });
                }
            }
        });
    });
    
    
    api.get('/UserByUsername', function (req, res) {
        
        console.log(req.query);
        
        User.findOne({
            username: req.query.username
        }).select('name username password role').exec(function (err, user) {
            
            console.log(user);
            res.json(user);
        });
    });
    
    //Before Destination A
    
    api.use(function (req, res, next) {
    
        var token = req.body.token || req.param("token") || req.headers['x-access-token'];
    
        if (token) {
    
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({ success: false, message: 'Falha na autenticação do usuário.' });
                }
                else {
                    res.decoded = decoded;
                    next();
                }
            });
        }
        else {
            res.status(403).send({ success: false, message: 'No token provided.' });
        }
    });
    
    //Destination B
    
    api.get('/users', function (req, res) {
        
        User.find({}, function (err, users) {
            
            if (err) {
                res.send(err);
                return;
            }
            
            res.json(users);
        });
    });
    
    api.post('/UpdateUser', function (req, res) {
        
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });
        
        User.update(
            { "_id": req.body._id },
            { "$set": { "name": req.body.name, "username" : req.body.username } },
              function (err, result) {
                if (err)
                    throw err;
                
                res.json({ message: 'Usuário foi atualizado com sucesso!', user: req.body, errors: false });
            });
    });
    
    api.post('/UpdateRoleUser', function (req, res) {
        
        var descricaoMensagem = null;
        
        if (req.body.role == 'admin') {
            descricaoMensagem = 'Usuário agora é um administrador do sistema!';
        }
        else {
            descricaoMensagem = 'Usuário não é mais um administrador do sistema!';
        }
        
        User.update(
            { "_id": req.body._id },
            { "$set": { "role": req.body.role } },
              function (err, result) {
                if (err)
                    throw err;
                else
                    res.json({ message: descricaoMensagem, user: req.body, errors: false });
                
            });
    });
    
    api.post('/RemoveUser', function (req, res) {
        
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });
        
        User.findById(req.body._id, function (err, user) {
            user.remove(function (err, message) {
                if (err) {
                    res.send(err);
                    return;
                }
                else {
                    res.json({ message: 'Usuário foi removido com sucesso!' });
                }
            });
        });
    });
    
    api.post('/RemoveMensage', function (req, res) {
        
        var mensage = new Mensage({
            category: req.body.category,
            text: req.body.text,
            author: req.body.author,
            isActive: req.body.isActive
        });
        
        Mensage.findById(req.body._id, function (err, mensage) {
            mensage.remove(function (err, result) {
                if (err) {
                    res.send(err);
                    return;
                }
                else {
                    res.json({ message: 'Mensagem foi removida com sucesso!' });
                }
            });
        });
    });
    
    api.post('/SaveMensage', function (req, res) {
        
        var mensage = new Mensage({
            category: req.body.category,
            text: req.body.text,
            author: req.body.author,
            isActive: req.body.isActive,
            idUser: req.body.idUser
        });
        
        mensage.save(function (err, mensage) {
            if (err) {
                res.send(err);
                return;
            }
            else {
                res.json({ message: 'Mensagem foi criada com sucesso!', mensage: mensage });
            }
        });
    });
    
    api.post('/UpdateMensage', function (req, res) {
        
        Mensage.update(
            { "_id": req.body._id },
            { "$set": { "category": req.body.category, "text" : req.body.text } },
              function (err, result) {
                if (err)
                    throw err;
                else
                    res.json({ message: 'Usuário foi atualizado com sucesso!', mensage: req.body, errors: false });
                
            });
    });
    
    api.post('/UpdateStatusMensage', function (req, res) {
        
        var descricaoMensagem = null;
        
        if (req.body.isActive) {
            descricaoMensagem = 'Mensagem foi habilitada com sucesso!';
        }
        else {
            descricaoMensagem = 'Mensagem foi desabilitada com sucesso!';
        }
        
        Mensage.update(
            { "_id": req.body._id },
            { "$set": { "isActive": req.body.isActive } },
              function (err, result) {
                if (err)
                    throw err;
                else
                    res.json({ message: descricaoMensagem, mensage: req.body });
                
            });
    });
    
    api.get('/AllMensages', function (req, res) {
        
        Mensage.find({}, function (err, mensages) {
            
            if (err) {
                res.send(err);
                return;
            }
            
            res.json(mensages);
        });
    });
    
    api.get('/me', function (req, res) {
        res.json(req.decoded);
    });
    
    return api;
}