import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState, useRef, useEffect } from "react";

const Home = () => {
  const [userInput, setUserInput] = useState("");

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };
  const messagesEndRef = useRef(null);
  const [apiOutput, setApiOutput] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setAnswers((allAnswers) => [
      ...allAnswers,
      { text: userInput, user: true },
    ]);
    setIsGenerating(true);
    const dataToSend = answers.map((item) =>
      item.user ? `Me: ${item.text}. \n` : `Freind: ${item.text} \n`
    );
    dataToSend.push(`Me: ${userInput}. \n`);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: dataToSend }),
    });
    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);
    setAnswers((allAnswers) => [
      ...allAnswers,
      {
        text: output.text.split(":")?.[1] ?? output.text.split(":")?.[0],
        user: false,
      },
    ]);
    setUserInput("");
    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (answers.length !== 0)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answers]);

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Your Robo Buddy ❤️ For Whenever you wanna chat ✉️</h1>
          </div>
        </div>
      </div>
      <div className="scrollContainer">
        {answers.length === 0 && (
          <>
            {/* <h1 style={{ color: "white", padding: 10 }}>
              You can start a conversation by tapping on of the options below
              and break the ice 🧊 with your new freind !
            </h1> */}
          </>
        )}
        {answers.map((item) => {
          const isYou = item.user;
          return (
            <div style={{ marginBottom: 10 }}>
              <p
                style={{
                  marginBottom: 0,
                  paddingBottom: 0,
                  fontWeight: "bold",
                  fontSize: 22,
                  color: !isYou ? "red" : "white",
                }}
              >
                {isYou ? "You" : "Freind ❤️"}
              </p>
              <p
                style={{
                  fontSize: 16,
                  marginTop: 0,
                  color: "white",
                  fontWeight: "light",
                }}
              >
                {item.text}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="prompt-container">
        <textarea
          className="prompt-box"
          placeholder="start typing here"
          value={userInput}
          disabled={isGenerating}
          onChange={onUserChangedText}
        />
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? "generate-button loading" : "generate-button"
            }
            onClick={!isGenerating && callGenerateEndpoint}
          >
            <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p>Send</p>}
            </div>
          </a>
        </div>
      </div>
      {/* {apiOutput && (
        <div className="output">
          <div className="output-header-container">
            <div className="output-header">
              <h3>Output</h3>
            </div>
          </div>
          <div className="output-content">
            <p>{apiOutput}</p>
          </div>
        </div>
      )} */}
      {/* <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div> */}
    </div>
  );
};

export default Home;
