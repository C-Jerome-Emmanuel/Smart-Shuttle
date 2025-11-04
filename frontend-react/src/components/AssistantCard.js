// frontend-react/src/components/AssistantCard.js
import React, { useEffect, useState } from 'react';
import '../App.css';

const assistantData = {
  "Airport": "🛫 From Airport, you can take the Metro Blue Line to reach city center. Shuttle buses also connect to Guindy and CMBT.",
  "Metro Station": "🚇 The Metro Station connects to both Blue and Green lines. First train: 5:30 AM, Last train: 11 PM.",
  "Kelambakkam Bus Stand": "🚌 Buses available every 10-15 mins towards Siruseri, T Nagar, and CMBT. First bus at 5 AM.",
  "Tambaram": "🚉 Tambaram is a major suburban hub. Frequent EMU trains to Chennai Beach, Chengalpattu. Buses every 5 mins.",
  "Vandalur": "🐅 Vandalur Zoo nearby! Suburban trains available to Chennai Beach and Chengalpattu every 20 minutes."
};

const AssistantCard = ({ destination }) => {
  const [info, setInfo] = useState("ℹ️ Select a destination to get metro/bus info here.");

  useEffect(() => {
    setInfo(assistantData[destination] || "ℹ️ No additional info available.");
  }, [destination]); // Update info when destination changes

  return (
    <div className="card">
      <h2>Assistant Help</h2>
      <div id="assistantBox" className="assistant-box">
        {info}
      </div>
    </div>
  );
};

export default AssistantCard;