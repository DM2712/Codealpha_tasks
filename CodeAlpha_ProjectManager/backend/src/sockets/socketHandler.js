let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join a project room to receive real-time updates for that project
    socket.on('join:project', (projectId) => {
      if (projectId) {
        socket.join(`project:${projectId}`);
        console.log(`[Socket.io] Socket ${socket.id} joined project room: project:${projectId}`);
      }
    });

    // Leave a project room
    socket.on('leave:project', (projectId) => {
      if (projectId) {
        socket.leave(`project:${projectId}`);
        console.log(`[Socket.io] Socket ${socket.id} left project room: project:${projectId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

const emitToProject = (projectId, event, data) => {
  if (ioInstance && projectId) {
    ioInstance.to(`project:${projectId}`).emit(event, data);
  }
};

module.exports = {
  initSocket,
  emitToProject,
};
