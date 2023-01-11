import { createServer } from '@steelskysoftware/facade-server'
import { wait } from '@steelskysoftware/facade-toolbox'
import * as SIO from 'socket.io'

export class SocketServer {
  constructor(options = {}) {
    const {
      logger = console.log,
      onExit = () => {
        this.io && this.io.close()
        this.server && this.server.close()
      },
      port = 9999,
      serverNamespace = 'socket-server',
    } = options

    this.logger = logger
    this.onExit = onExit
    this.port = port
    this.serverNamespace = serverNamespace
  }

  async createServer() {
    try {
      this.server = await createServer({
        namespace: this.serverNamespace,
        client: false,
        port: this.port,
        onExit: this.onExit,
      })

      this.io = new SIO.Server(this.server)

    } catch (e) {
      throw new Error(e)
    }
  }

  async namespace(nsp, callbacks = {}) {
    while(!this.io) {
      await wait(250)
    }

    const {
      connectCallback = () => {},
      eventCallback = () => {},
      closeCallback = () => {},
      disconnectCallback = () => {},
    } = callbacks

    this.io.of(nsp).on('connection', (socket) => {
      connectCallback(socket)

      socket.onAny((event, data = {}) => {
        eventCallback(socket, event, data)
      })
    })

    this.io.of(nsp).on('close', (e) => {
      closeCallback(e)
    })

    this.io.of(nsp).on('disconnect', (e) => {
      disconnectCallback(e)
    })

    return this.io.of(nsp)
  }
}