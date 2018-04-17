const EventEmitter = require('events');


module.exports = (client) => {
  if (client instanceof Object === false) return 'Invalid object type';
 const  _notes = new WeakMap();

  /**
   * This class add methods to the event class in node
   * 
   * @class Server
   * @extends {EventEmitter}
   */
  class Server extends EventEmitter {
    /**
     * Creates an instance of Server.
     * 
     * @param {object} client 
     * 
     * @memberof Server
     */
    constructor(client) {
      super();
      this.noteId = 1;
      _notes.set(this, {});
      process.nextTick(() => {
        this.emit('response', 'Type "help" for more information');
      })
      client.on('command', (command, args) => {
        switch (command) {
          case 'help':
          case 'ls':
          case 'add':
          case 'edit':
          case 'delete':
            this[command](args);
            break;

          default:
            this.emit('response', 'Unknown command')
            break;
        }
      })

    }
    /**
     * This method converts note to sting
     * 
     * @returns {void}
     * 
     * @memberof Server
     */
    noteString() {
      return Object.keys(_notes.get(this)).map((key) => {
        return `\n${key}: ${_notes.get(this)[key]}`;
      })
    }

    /**
     * This method add a note
     * 
     * @param {object} args- array 
     * 
     * @memberof Server
     */
    add(args) {
      _notes.get(this)[this.noteId] = args.join(' ');
      this.emit('response', `Note taken: ${this.noteId}`);
      this.noteId++;
    }
    /**
     * This method edit a taken note
     * 
     * @param {object} args- array
     *  
     * @memberof Server
     */
    edit(args) {
      const editKey = Object.keys(_notes.get(this)).includes(args[0]);
      if(editKey) {
        _notes.get(this)[args[0]] = args.slice(1).join(' ');
       return this.emit('response', `Note edited: ${this.noteId}`);
      };

      return this.emit('response', `Invalid id: ${args[0]}`);
    }
    /**
     * This method delete a note
     * 
     * @param {any} args 
     * @memberof Server
     */
    delete(args) {
      const deleteKey = Object.keys( _notes.get(this)).includes(args[0]);
      if (deleteKey) {
        delete _notes.get(this)[args[0]];
       return  this.emit('response', `Deleted note: ${args[0]}`)
      };

      return this.emit('response', `Note does not exist: ${args[0]}`);
    }
    /**
     * This method lis available notes
     * 
     * @memberof Server
     */
    ls() {
      if(Object.keys( _notes.get(this)).length === 0) {
        return this.emit('response', 'No available notes');
      }

      return this.emit('response', `Notes: \n${this.noteString()}`);
    }
    /**
     * This method help with available commands
     * 
     * @memberof Server
     */
    help() {
      this.emit('response',
      `Available commands:
        add note
        ls  
        delete <id>
        edit <id> note`
      )
    }
  }

  return new Server(client);
};
