import SIOC from 'socket.io-client'

export class SocketClient {
  constructor(options = {}) {
    const {
      logger = console.log,
      host = 'http://localhost',
      port = 9999,
      namespace = '*',
      connectCallback = () => {
        this.logger('connect')
      },
    } = options

    this.host = host
    this.port = port
    this.logger = logger
    this.namespace = namespace
    this.connectCallback = connectCallback

    this.socket = SIOC([this.host, ':', this.port, '/', this.namespace].join(''))
    this.socket.on('connect', this.connectCallback)
    this.logger('[socket-client]', [this.host, ':', this.port, '/', this.namespace].join(''))
  }
}
