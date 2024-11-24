import React from 'react';
import io from 'socket.io-client';
import { useState, useRef ,useEffect} from 'react';
import { useSelector } from "react-redux";

// Define the WebRTCVideoCall component
const WebRTCVideoCall = () => {
  

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [offerData, setOfferData] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  // Define toggleAudio, toggleVideo functions
  const { _id } = useSelector((state) => state.user);
  // Define WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  // Create a new RTCPeerConnection
  const peerConnection = new RTCPeerConnection(configuration);
  const peerConnection2 = new RTCPeerConnection(configuration);

  const startMediaStream = async () => {
    try {
      console.log("we have set the media stream for this user")
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      console.log("we have set the media stream for this user, stream : ",stream);
      // Add the stream to the peer connection
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };
  peerConnection.ontrack = (event) => {
    // Ensure that the remote video ref is available
    console.log("9");
    console.log("*****************");
    if (remoteVideoRef.current) {
      // Attach the remote stream to the remote video element
      remoteVideoRef.current.srcObject = event.streams[0];
      console.log("event streams0",event.streams[0] );
      console.log("remoteVideoRef.current.srcObject",remoteVideoRef.current.srcObject);
  console.log("1111111111")
    }
    console.log("10");
  };
  peerConnection2.ontrack = (event) => {
  
    // Ensure that the remote video ref is available
    console.log("5", event);
    console.log("*****************");
    if (remoteVideoRef.current) {
      // Attach the remote stream to the remote video element
      remoteVideoRef.current.srcObject = event.streams[0];
  
      // Log additional information about the MediaStream object
      console.log("Number of streams received:", event.streams.length);
      event.streams.forEach((stream, index) => {
        console.log(`Stream ${index + 1}:`);
        console.log("Stream ID:", stream.id);
        console.log("Stream active:", stream.active);
        console.log("Stream tracks:", stream.getTracks());
        console.log("Stream getAudioTracks:", stream.getAudioTracks());
        console.log("Stream getVideoTracks:", stream.getVideoTracks());
      });
    }
    console.log("6");
  };
// Example: Sending an offer
const sendOffer = async () => {
  try {
    console.log("1");
    
    await startMediaStream();
    // Create an SDP offer
    const offer = await peerConnection.createOffer();
    // Set local description
    await peerConnection.setLocalDescription(offer);
    console.log("my user id is", _id);
    console.log("the local description",peerConnection.localDescription);
    console.log("peerConnection",peerConnection);
    // Send the SDP offer to the signaling server
   /* socket.emit('offer', {
      offer: peerConnection.localDescription,
      userId: _id,
    });*/
    console.log("tba3thet el offer");
    console.log("2");
  } catch (error) {
    console.error('Error creating or sending offer:', error);
  }
};

  // Set up Socket.IO connection to the signaling server
 // const socket = io('https://localhost:8082'); // Replace with your signaling server URL



/*  socket.on('answer', (answer) => {
    console.log("11");
    console.log('Received answer raj3et marra okhra:', answer);
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("the peerconnection of the first user :" ,peerConnection);
    console.log("12");
  });*/

const checkConnectionState = (peerConnection) => {
  console.log("connection state",peerConnection.connectionState );
  return peerConnection.connectionState === 'stable';
};
const startMediaStream2 = async () => {
  try {
    console.log("we have set the media stream2 for this user2")
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    console.log("we have set the media stream for this user2, stream2 : ",stream);
    // Add the stream to the peer connection

    stream.getTracks().forEach(track => peerConnection2.addTrack(track, stream));
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
};
const handleCallAcceptance = async (offerData) => {
  const{ off ,originateUserIdsocketid } = offerData;
  try {
    await startMediaStream2();
    // Set the remote description with the offer data
   await peerConnection2.setRemoteDescription(new RTCSessionDescription(off));
   console.log("7");
    // Create an SDP answer
    const answer = await peerConnection2.createAnswer();
    console.log("7.0")
    await peerConnection2.setLocalDescription(answer);
    console.log("7.1")
    console.log("checking the peerConnection to check the onTrack",peerConnection2);
    console.log("checking localdescription of peerConnection2", peerConnection2.localDescription)
    // Send the SDP answer back to the initiator user
 /*   socket.emit('answer', {
      answer: peerConnection2.localDescription,
      originateUserIdsocketid: originateUserIdsocketid,
    });*/
    console.log("8");
  } catch (error) {
    console.error('Error generating or sending SDP answer of the call acceptance:', error);
  }
};
/*
socket.on('offer', async (data) => {
  console.log("3");
  console.log('Received offer:', data); 
  const{ off ,originateUserIdsocketid } = data;
  console.log("is the offer good",off);
  console.log("the originate socket id :",originateUserIdsocketid)
  try {
 
   
      console.log("peerConnection.localDescription",peerConnection.localDescription)
      setOfferData(data);
      console.log("checking if the offerData const got set ===" ,offerData);


      console.log('Generated and sent SDP answer');
      console.log("4");
  } catch (error) {
      console.error('Error generating or sending SDP answer:', error);
  }
});*/




// Call startMediaStream when the component mounts
// useEffect(() => {
//   startMediaStream();
//   // When remote track arrives, add it to the remote video element

// }, []);
 // Function to toggle audio mute/unmute
 const toggleAudio = () => {
  setIsAudioMuted(prevState => !prevState);
  const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
  audioTracks.forEach(track => {
    track.enabled = isAudioMuted;
  });
};

  // Function to toggle video enable/disable
  const toggleVideo = () => {
    setIsVideoEnabled(prevState => !prevState);
    const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = isVideoEnabled;
    });
  };


  // Render your WebRTC video call UI here
  return (
    <div>
     <div>
      <h2>Your Video</h2>
      <video ref={localVideoRef} autoPlay muted style={{ width: '200px', height: '150px', backgroundColor: '#000' }}></video>
    </div>
    <div>
      <h2>Remote Video</h2>
      <video ref={remoteVideoRef} autoPlay style={{ width: '200px', height: '150px', backgroundColor: '#000' }}></video>
    </div>

    {/* Buttons for toggling audio and video */}
    <button onClick={toggleAudio}>
      {isAudioMuted ?'Unmute Audio'  : 'Mute Audio'}
    </button>
    <button onClick={toggleVideo}>
      {isVideoEnabled ? 'Enable Video' : 'Disable Video'}
    </button>

    {/* Button for initiating the call */}
    <button onClick={sendOffer} disabled={isCalling}>
      {isCalling ? 'Calling...' : 'Call'}
    </button>

    {/* Your WebRTC video call UI */}
    <button onClick={sendOffer}>Send Offer</button>

    {/* Button for accepting the call */}
    <button onClick={() => handleCallAcceptance(offerData)}>Accept Call</button>

    </div>
  );
};

export default WebRTCVideoCall;
