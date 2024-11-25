const { Logger } = require('./Logger');
const { Core } = require('./Core')
class Functions {
    constructor(client) {
        this.client = client
        this.logger = new Logger({host: this.client.config.host, port: this.client.config.port})
        this.config = this.client.config
        this.init()
    }

    coreInit() {
        setTimeout( async () => {
            if (this.client.pos && typeof this.client.pos === 'object') {
                this.client.core = new Core(this.client)
                this.client.on('core:refilled',()=>{
                    setTimeout(() => {
                        this.client.core.run(`sudo ${this.client.username} /prefix ${this.config.selfcare.prefix}`)
                    }, 75);
                })
            } else {
                this.coreInit()
            }
        }, 25);
    }

    init() {
    
        this.client.on('login', ()=>{
            this.logger.log('Logged in')
            this.coreInit()
        })

        this.client.on('world_border_center',(packet)=>{
            if (packet.x != this.client.pos.x && packet.z != this.client.pos.z) {
                this.client.chat(`/worldborder center ${this.client.pos.x} ${this.client.pos.z}`)
            }
        })

        this.client.on('error', (err) => {
            this.logger.error(err)
        })

        this.client.on('end',(reason)=>{
            this.logger.warn(reason)
            setTimeout(()=>{
                this.client.startClient(this.client.serverInfo)
                this.client.clients.delete(this.client)
                this.client = null
            },5200)
        })
    }
}

module.exports = { Functions }