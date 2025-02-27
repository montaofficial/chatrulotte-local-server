const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
// Updated socket.io with CORS settings:
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Allow all CORS requests
app.use(cors());
// Serve static files from the "www" folder
app.use(express.static('www'));

// Socket.IO chat logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Broadcast received messages to everyone
    socket.on('chat message', (msg) => {
        io.emit('chat message', { senderId: socket.id, text: msg });
    });

    // Listen for clear chat event from clients
    socket.on('clear chat', () => {
        io.emit('clear chat');
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Express endpoint to clear chat (emits "clear chat" to all clients)
app.post('/clean', (req, res) => {
    io.emit('clear chat');
    res.json({ status: 'ok', message: 'Chat cleared.' });
    console.log("cleaned");
});

// Express endpoint to generate a random partner bio
app.post('/new', (req, res) => {
    const partnerBio = [];

    // 20% chance to include Language
    if (Math.random() < 0.2) {
        partnerBio.push("Language: Italian");
    }

    // 20% chance to include Bio
    if (Math.random() < 0.2) {
        const bios = [
            "...", "Qui per parlare", "wewe", "Ciao ;)", "Suca",
            "Vivo per viaggiare", "Amante della pizza", "Appassionato di calcio", "Gourmet in erba", "Vibes positive",
            "Sempre sorridente", "Sognatore ad occhi aperti", "In cerca di avventure", "Curioso e creativo", "Amico fedele",
            "Musica e vita", "Libero pensatore", "Cacciatore di emozioni", "Vita e passione", "Cuore aperto",
            "Risate e sogni", "L'amore per il caffè", "Arte e anima", "Viaggiatore instancabile", "Semplice e genuino",
            "Fiero dei suoi sogni", "Esploratore urbano", "Cercatore di verità", "Rinascita continua", "Risveglio interiore",
            "Chiacchierone", "Misterioso", "Enigmatico", "Solare", "Determinato",
            "Ottimista", "Ambizioso", "Ribelle", "Paziente", "Energico",
            "Empatico", "Sincero", "Generoso", "Riservato", "Curioso"
        ];
        const randomBio = bios[Math.floor(Math.random() * bios.length)];
        partnerBio.push("Bio: " + randomBio);
    }

    // 20% chance to include Music
    if (Math.random() < 0.2) {
        const genres = {
            Pop: ["Pop", "Pop music", "Popular", "Pop tunes", "Pop vibe"],
            Rock: ["Rock", "Rock music", "Rock n roll", "Rock 'n roll", "Rock vibes"],
            HipHop: ["Hip Hop", "Hip-Hop", "Rap", "Urban", "Hip Hop beats"],
            Jazz: ["Jazz", "Smooth jazz", "Jazz music", "Jazz tunes", "Jazz vibes"],
            Classical: ["Classical", "Classical music", "Orchestral", "Symphonic", "Classical tunes"]
        };
        const genreKeys = Object.keys(genres);
        const randomGenreKey = genreKeys[Math.floor(Math.random() * genreKeys.length)];
        const randomVariant = genres[randomGenreKey][Math.floor(Math.random() * genres[randomGenreKey].length)];
        partnerBio.push("Music: " + randomVariant);
    }

    // 20% chance to include Age
    if (Math.random() < 0.2) {
        const age = Math.floor(Math.random() * (28 - 18 + 1)) + 18;
        partnerBio.push("Age: " + age);
    }

    io.emit('clear chat');
    setTimeout(() => {
        io.emit('chat message', { senderId: "", text: "Connected with Somebody" });
    }, 100);

    res.json({ partnerBio });

    console.log("new user", partnerBio);

    partnerBio.forEach(element => {
        setTimeout(() => {
            io.emit('chat message', { senderId: "", text: element });
        }, Math.round(Math.random() * 400) + 200);
    });


});

// Listen on IP 10.11.4.110, port 8021
server.listen(8021, () => {
    console.log('Server listening on http://10.11.4.110:8021');
});