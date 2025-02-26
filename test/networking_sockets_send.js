process.env.IS_TESTING = true

const { init } = require('../index.js')

const client = init(480, true)

client.networking_utils.initRelayNetworkAccess();

// we shouldn't need to listen for p2p requests since we're sending it

const mySteamId = client.localplayer.getSteamId().steamId64;
console.log(mySteamId);

// now actually listen for new messages
/*
setInterval(() => {
  let messages = client.networking_sockets.receiveP2PMessages(10); // 10 _from each_ connection
  messages.forEach(message => console.log(message));
}, 1000 / 60);
*/

// now let's send a connection request to the server
client.networking_sockets.connectP2P(mySteamId, 0);

const main = async () => {

  // this seems to return true no matter what
  while(client.networking_sockets.isConnected(mySteamId) === false){
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("Connected to server!");

  setInterval(() => {
    let messages = client.networking_sockets.receiveP2PMessages(10); // 10 _from each_ connection
    messages.forEach(message => {
      console.log("message from", message.steamId, ":", message.data.toString());
      client.networking_sockets.sendP2PMessage(message.steamId, Buffer.from(`${new Date()}: Hello, from client!`), 1);
    });
  }, 1000 / 60);

  setTimeout(() => {
    console.log("sent message")
    client.networking_sockets.sendP2PMessage(mySteamId, Buffer.from("Hello, from client!"), 1);  
  }, 5000)
  
}
main();
