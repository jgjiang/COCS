module.exports = function (io) {
    // collaboration sessons
    var collaborations = [];

    // map from socketId to sessionId
    var socketIdToSessionId = [];

    io.on('connection', socket => {
        let sessionId = socket.handshake.query['sessionId'];

        // 建立一个映射，将每个用户连接的socket的 id 存在这个数组里
        socketIdToSessionId[socket.id] = sessionId;

        // add socket.id to corresponding collaboration session participants
        if (!(sessionId in collaborations)) {
            collaborations[sessionId] = {
                'participants': []
            };
        }

        collaborations[sessionId]['participants'].push(socket.id);

        // socket events listeners
        // 客户端做了change，发送给server端的change监听器进行监听
        socket.on('change', (delta) => {
            console.log("change" + socketIdToSessionId[socket.id] + " " + delta);
            forwardEvents(socket.id, 'change', delta);
        });

        // handle curorMove events
        socket.on('cursorMove', (cursor) => {
            console.log( "cursorMove " + socketIdToSessionId[socket.id] + " " + cursor ) ;
            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;
            forwardEvents(socket.id, 'cursorMove', JSON.stringify(cursor));
        });

        function forwardEvents(socketId, eventName, dataString) {
            let sessionId = socketIdToSessionId[socketId];

            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socket.id != participants[i]) {
                        io.to(participants[i]).emit(eventName, dataString);
                    }
                }
            } else {
                console.log("WARNING: could not tie socket_id to any collaboration");
            }
        }

    });
};