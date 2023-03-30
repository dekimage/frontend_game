import React from "react";
import { RewardLink } from "../todayComp";

import baseUrl from "../../utils/settings";

const RewardLinkSection = () => {
  const rewardLinksData = [
    {
      img: `${baseUrl}/favorite.png`,
      link: "/favorites",
      text: "Favorites",
    },
    {
      img: `${baseUrl}/recent.png`,
      link: "/recent",
      text: "Recent",
    },
    {
      img: `${baseUrl}/random.png`,
      link: "/random-card",
      text: "Random Card",
    },
    {
      img: `${baseUrl}/energy.png`,
      link: "/open-today",
      text: "Open Today",
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
