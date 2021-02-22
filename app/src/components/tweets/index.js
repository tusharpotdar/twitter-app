import React, { useEffect, useState, useCallback } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import PropTypes from "prop-types";
import Tweet from "./tweet";
import socketIOClient from "socket.io-client";

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [pauseStreaming, setStreaming] = useState(false);

  useEffect(() => {
    const socket = socketIOClient();
    socket.on("FromAPI", (message) => {
      const { data, includes } = JSON.parse(message);
      const { id, text } = data;
      const { profile_image_url, username, created_at } = includes.users[0];
      const d = {
        id,
        tweetText: text || "",
        displayPicture: profile_image_url || "",
        tweetedBy: username || "",
        tweetedAt: created_at || "",
      };
      setTweets([d, ...tweets]);
    });
  });

  const renderThumb = useCallback(
    ({ ...props }) => {
      return <div className="rounded-md bg-gray-300" {...props} />;
    },
    [tweets]
  );

  const CustomScrollbars = useCallback(
    (props) => (
      <Scrollbars
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}
        {...props}
      />
    ),
    [tweets]
  );

  const renderTweets = tweets.map((tweet) => {
    const { id, displayPicture, tweetText, tweetedBy, tweetedAt } = tweet;
    return (
      <Tweet
        key={id}
        displayPicture={displayPicture}
        tweetText={tweetText}
        tweetedBy={tweetedBy}
        tweetedAt={tweetedAt}
      />
    );
  });
  return (
    <>
      <div className="flex justify-end">
        <span
          onClick={() => setStreaming(!pauseStreaming)}
          className="focus:border-transparent text-center cursor-pointer hover:bg-blue-400 hover:text-white block w-20 bg-white border-blue-400 border-2 text-blue-500 rounded-md"
        >
          {pauseStreaming ? "Resume" : "Pause"}
        </span>
      </div>
      <CustomScrollbars>
        <div className="divide-y">{renderTweets}</div>
      </CustomScrollbars>
    </>
  );
};

Tweets.defaultProps = {
  tweets: [],
};

Tweets.propTypes = {
  tweets: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        displayPicture: PropTypes.string.isRequired,
        tweetText: PropTypes.string.isRequired,
        tweetedBy: PropTypes.string.isRequired,
        tweetedAt: PropTypes.string.isRequired,
      })
    ).isRequired
  ),
};

export default Tweets;
