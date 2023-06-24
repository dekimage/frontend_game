import React from "react";

import baseUrl from "@/utils/settings";
import { RewardLink } from "./RewardLink";

const RewardLinkSection = () => {
  const rewardLinksData = [
    {
      img: `${baseUrl}/favorite.png`,
      link: "/favorites",
      text: "Favorites",
    },
    {
      img: `${baseUrl}/bookmark.png`,
      link: "/bookmarks",
      text: "Bookmarks",
    },
    {
      img: `${baseUrl}/random.png`,
      link: "/random-card",
      text: "Random Card",
    },
    {
      img: `${baseUrl}/recent.png`,
      link: "/recent",
      text: "Recent",
    },
  ];

  return (
    <div className="section">
      {rewardLinksData.map(({ img, link, text }, index) => (
        <RewardLink key={index} img={img} link={link} text={text} />
      ))}
    </div>
  );
};

export default RewardLinkSection;
