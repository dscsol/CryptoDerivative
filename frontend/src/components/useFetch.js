import { useState, useEffect } from "react";
import axios from "axios";
// import axios from "redaxios";
// const axios = require("redaxios");

const useFetch = ({ url, method = "get", body }) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const abortCont = new AbortController();
    axios(
      {
        method: method,
        url: url,
        body: body,
      },
      { signal: abortCont.signal }
    )
      .then((res) => {
        console.log(res);
        setData(res.data);
        setIsPending(false);
        setError(null);
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "AbortError") {
          console.log("Fetch Abort");
        } else {
          setError(err.message);
          setIsPending(false);
        }
      });

    // console.log(abortCont.signal);

    return;
    () => abortCont.abort();
  }, [url]);
  return { data, isPending, error };
};

export default useFetch;
