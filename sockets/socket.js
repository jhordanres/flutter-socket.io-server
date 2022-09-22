const {io} = require('../index.js');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Guns and Rose'));
bands.addBand(new Band('Mago de Oz'));
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Mana'));
console.log(bands);



//Mensajes de Sockets y conectar
io.on('connection', client => {
    console.log('Cliente conectado');

    //Para emitirles todas las bandas al cliente que se conecte
    client.emit('active-bands', bands.getBands());

    //Para desconectar al usuario del server
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    //Para recibir (escuchar) el mensaje emitido del lado del servidor
    client.on('mensaje', (payload) =>{
        console.log('Mensaje',payload);

        //Para que el servidor reciva el mensaje emitido y lo muestre en todos los usuarios conectados
        io.emit('mensaje',{admin:'Nuevo mensaje'});

    });

    client.on('emitir-mensaje', (payload) =>{
        //io.emit('nuevo-mensaje', payload); //Esto emite el mensaje a todos
        client.broadcast.emit('nuevo-mensaje', payload); //Emite el mensaje a todos menos al que lo emitio
        //console.log(payload);
    });

    client.on('vote-band', (payload) =>{
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) =>{
        const newBand = new Band(payload.name)
        bands.addBand(newBand)
        io.emit('active-bands', bands.getBands());
    });

    client.on('delet-band', (payload) =>{
        bands.deletBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

  });