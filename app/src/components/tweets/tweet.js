import React from "react";
import PropTypes from "prop-types";

const Tweet = (props) => {
  const { displayPicture, tweetText, tweetedBy, tweetedAt } = props;
  return (
    <div className="flex flex-row gap-4 px-8 py-6 justify-items-stretch w-full break-words break-all bg-gray-50 hover:bg-gray-100 ">
      <img
        className="rounded-full self-start"
        src={displayPicture}
        alt="Display Picture"
      />
      <div className="flex flex-col gap-6 justify-items-stretch w-full">
        <div className="break-all break-words font-normal">{tweetText}</div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 justify-between">
          <div className="md:text-left font-bold text-gray-500">
            {tweetedBy}
          </div>
          <div className="md:text-right font-medium text-gray-500">
            {tweetedAt}
          </div>
        </div>
      </div>
    </div>
  );
};

Tweet.propTypes = {
  displayPicture: PropTypes.string.isRequired,
  tweetText: PropTypes.string.isRequired,
  tweetedBy: PropTypes.string.isRequired,
  tweetedAt: PropTypes.string.isRequired,
};

export default Tweet;
