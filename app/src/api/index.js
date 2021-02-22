import axios from "axios";

const getTrends = () => {
  return axios.get("/trends");
};

const getTweets = () => {};

export default {
  getTrends,
  getTweets,
};
