import React, { useState } from "react";
import GetAllRooms from "./components/GetAllRooms";
import GetAllChat from "./components/GetAllChat";
import GetAllUser from "./components/GetAllUser";
// import GetAllUser from "./componentsDemo/GetAllUser";

function App() {
  const [currentRoom, updateCurrentRoom] = useState();
  const [currentUser, updateCurrentUser] = useState();
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "0 0 320px", padding: "20px" }}>
        <GetAllUser
          currentUser={currentUser}
          updateCurrentUser={updateCurrentUser}
        />
        <br />
        <GetAllRooms
          currentRoom={currentRoom}
          updateCurrentRoom={updateCurrentRoom}
        />
        {/* <GetAllUser /> */}
      </div>
      <div style={{ flex: "0 0 calc(100% - 400px)", padding: "20px" }}>
        {currentRoom && currentUser && (
          <GetAllChat currentRoom={currentRoom} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}

export default App;
