import React, { useState } from "react";
import Tweets from "./tweets";
import Trends from "./trends";
import socketIOClient from "socket.io-client";

function App() {
  const [action, setAction] = useState("Home");

  const isHome = action === "Home";
  const isTrends = !isHome;
  const socket = socketIOClient();

  return (
    <div className="main-container">
      <div className="flex flex-col gap-8 my-20">
        <label
          className={`btn ${(isHome && "btn-active") || ""}`}
          onClick={() => setAction("Home")}
        >
          Home
        </label>
        <label
          className={`btn ${(isTrends && "btn-active") || ""}`}
          onClick={() => setAction("Trends")}
        >
          # Trends
        </label>
      </div>
      <div className="list-container">
        <div className="pb-3 px-3 font-bold text-gray-500 text-2xl">
          {action}
        </div>
        {(isHome && <Tweets socket={socket} />) || <Trends />}
      </div>
    </div>
  );
}

export default App;
