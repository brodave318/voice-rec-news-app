import React, { useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import wordsToNumbers from "words-to-numbers";

import NewsCards from "./components/NewsCards/NewsCards";
import useStyles from "./styles.js";
import voiceNewsScreen from "./img/voiceNewsLogo.png";

const alanKey =
  "975fccaf501eb7b4aaa862ed80f4260e2e956eca572e1d8b807a3e2338fdd0dc/stage";

export default function App() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    alanBtn(
      {
        key: alanKey,
        onCommand: ({ command, articles, number }) => {
          if (command === "recentHeadlines") {
            setNewsArticles(articles);
            setActiveArticle(-2);
          } else if (command === "highlight") {
            setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
          } else if (command === "open") {
            const parsedNumber =
              number.length > 2
                ? wordsToNumbers(number, { fuzzy: true })
                : number;
            const article = articles[parsedNumber - 1];

            if (parsedNumber > 20) {
              alanBtn().playText("Please try again.");
            } else if (article) {
              window.open(article.url, "_blank");
              alanBtn().playText("Opening...");
            }
          }
        },
      },
      []
    );
  });

  return (
    <div>
      <div className={classes.logoContainer}>
        <img
          src={voiceNewsScreen}
          alt="voice news logo"
          style={{ paddingTop: "2rem" }}
          className={classes.voiceNewsLogo}
        />
        <h1>
          Voice
          <br />
          News!
        </h1>
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
}
