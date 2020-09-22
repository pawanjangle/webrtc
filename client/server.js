const express  = require( "express" );
var io = require( "socket.io" )
( {
		path: "/webrtc"
} )
const app = express(  );
app.use( express.static( __dirname + '/build' ) );
app.get( "/", ( req, res, next ) =>{
res.sendFile( __dirname + '/build/index.html')
});
const port = 8080;
const server = app.listen( port, (  ) => console.log( "express server is listening on port: ", port ));
io.listen( server );
const peers = io.of( '/webrtcPeer' );
let connectedPeers = new Map(  );
peers.on( 'connection', socket =>{
console.log( socket.id );
socket.emit( 'connection-success', { success: socket.id} );
connectedPeers.set( socket.id, socket );
socket.on( 'disconnect', (  )=>{
console.log( 'disconnected' );
connectedPeers.delete( socket.id )
})
} )
