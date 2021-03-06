const User = require('../models/user');
const UserNotification = require('../models/notification');
const userController = require('../controllers/user');
const notificationController = require('../controllers/notification');

module.exports = function(http) {
    const io = require('socket.io')(http, { path: '/socket' });


    io.on('connection', (socket) => {
        const user = new User();
        let message;

        socket.on('connection', (userData) => {
            user = userData;
        });

        const roomRef = user.id.toString();

        socket.join(roomRef);

        socket.on('notification/invite_board', async (data) => {
            const path = 'notification/board/invitation';

            if (data.userEmail) {
                const notification = new UserNotification();
                message = user.firstname + ' ' + user.lastname + ', invited you to join the board ' + data.boardName;

                try {
                    const receiverId = await findUserId(data.userEmail);
                    notification.title = path;
                    notification.message = message;
                    notification.userId = receiverId;
                    const receiverRoomRef = receiverId.toString();
                    await createNotification(notification);
                    socket.broadcast.to(receiverRoomRef).emit(path, message);
                } catch (e) {
                    console.log(e);
                }
            } else {
                message = 'Failed to send the invitation. You must target a current user email address and must be into your board administration panel.';

                try {
                    socket.emit(path, message);
                } catch (e) {
                    console.log(e);
                }
            }
        });

        socket.on('notification/invite_organization', async (data) => {
            const path = 'notification/organization/invitation';

            if (data.userEmail) {
                const notification = new UserNotification();
                message = data.organizationName + ', invited you to join them';

                try {
                    const receiverId = findUserId(data.userEmail);
                    notification.title = path;
                    notification.message = message;
                    notification.userId = receiverId;
                    const receiverRoomRef = receiverId.toString();
                    await createNotification(notification);
                    socket.broadcast.to(receiverRoomRef).emit(path, message);
                } catch (e) {
                    console.log(e);
                }
            } else {
                message = 'Failed to send the invitation. You must target a current user email address and must be into your organization administration panel.';

                try {
                    socket.emit(path, message);
                } catch (e) {
                    console.log(e);
                }
            }
        });

        socket.on('notification/acceptation_organization', async (data) => {

        });

        socket.on('notification/rejection_organization', async (data) => {

        });

        socket.on('notification/acceptation_board', async (data) => {

        });

        socket.on('notification/rejection_board', async (data) => {

        });

        socket.on('notification/acceptation', async (data) => {
            if (data.event === 'organization') {

            } else if (data.event === 'board') {

            }
        });

        socket.on('notification/rejection', async (data) => {
            if (data.event === 'organization') {

            } else if (data.event === 'board') {

            }
        });
    });

    /**
     * Async method that find the user.id for the given user.email
     *
     * @returns {json({user.id<id>})}
     */
    findUserId = async (userEmail) => {
        try {
            return await userController.getUserId(userEmail);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Async method that create a new notification
     *
     * @returns {json({})}
     */
    CreateNotification = async (notification) => {
        try {
            await notificationController.createNotification(notification);
        } catch (e) {
            console.log(e);
        }
    }

}