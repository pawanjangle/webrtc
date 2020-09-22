import React from 'react';
import io from 'socket.io-client';
class App extends React.Component{
constructor( props ){
super( props );
this.localVideoref = React.createRef(  );
this.remoteVideoref = React.createRef(  );
this.socket = null;
}
componentDidMount(  ){
this.socket = io( 
'/webrtcPeer',
{
path: '/webrtc',
query: {}
}
 )
 this.socket.on( 'connection-success', success =>{
 console.log( success )
 });
const pc_config = null;
this.pc = new RTCPeerConnection( pc_config );
this.pc.onicecandidate = ( e ) =>{
if( e.candidate ){
console.log( JSON.stringify( e.candidate ) )
}
}
this.pc.oniceconnectionstatechange = ( e ) =>{
console.log( e )
}
this.pc.onaddstream = ( e ) =>{
this.remoteVideoref.current.srcObject = e.stream
}
const constraints = { video: true }
const success = ( stream ) =>{
window.localStream = stream;
this.localVideoref.current.srcObject = stream;
this.pc.onaddstream( stream );
}
const failure = ( e ) =>{
console.log( 'getUserMedia error: ', e )
}
navigator.mediaDevices.getUserMedia( constraints).then( success )
.catch( failure )
}
createOffer = (  ) =>{
console.log( 'offer' )
this.pc.createOffer( {offerToReceiveVideo: 1} )
.then( sdp =>{ console.log( JSON.stringify( sdp ) )
this.pc.setLocalDescription( sdp )
}, e =>{} )
}
setRemoteDescription = (  ) =>{
const desc = JSON.parse( this.textref.value );
this.pc.setRemoteDescription( new RTCSessionDescription( desc ) );
}
createAnswer = (  ) =>{
console.log( 'Answer' );
this.pc.createAnswer( { offerToReceiveVideo: 1} )
.then( sdp =>{
console.log( JSON.stringify( sdp ));
this.pc.setLocalDescription( sdp );
}, e =>{} )
}
addCandidate = (  ) =>{
const candidate = JSON.parse( this.textref.value );
console.log( 'Adding candidate', candidate);
this.pc.addIceCandidate( new RTCIceCandidate( candidate ) )
}
render(  ){

  return (
    <div className="App">
<video ref = { this.localVideoref}  style = {{ width: 240, height: 240, margin: 5, backgroundColor: "black" }}autoplay playsinline controls="false"/>
<video ref = { this.remoteVideoref}  style = {{ width: 240, height: 240, margin: 5, backgroundColor: "black" }}autoplay playsinline controls="false"/>
<button onClick ={this.createoffer}>offer</button>
<button onClick ={this.createAnswer}>answer</button>
<br/>
<textarea ref ={ ref =>{ this.textref = ref}}/>
<br/>
<button onClick ={this.setRemoteDescription}>set remote description</button>
<button onClick ={this.addCandidate}>add candidate</button>
    </div>
  );
  }
}

export default App;