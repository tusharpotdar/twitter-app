import React, { useEffect, useState } from "react";
import ReactWordCloud from "react-wordcloud";
import PropTypes from "prop-types";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import api from "../../api";

const Trends = () => {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    api
      .getTrends()
      .then(({ data }) => {
        console.log(data);
        const trends = data.map((i) => {
          return {
            text: i.name || "",
            value: i.tweet_volume || 0,
            url: i.url || "",
          };
        });
        console.log(trends);
        setTrends(trends);
      })
      .catch(() => console.error("Error fetching trends"));
  }, []);

  const callbacks = {
    onWordClick: (word) => window.open(word.url, "_blank"),
    getWordTooltip: (word) => `${word.text} (${word.value})`,
  };

  const options = {
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [5, 60],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  };

  return (
    <ReactWordCloud options={options} words={trends} callbacks={callbacks} />
  );
};

Trends.defaultProps = {
  trends: [],
};

Trends.propTypes = {
  trends: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    )
  ),
};

export default Trends;
