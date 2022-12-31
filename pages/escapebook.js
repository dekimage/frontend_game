import { useState } from "react";
import styles from "../styles/Escape.module.scss";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const database = {
  goin: {
    story:
      "Good job! You have learned the ancient art of using the portal. I hope you are ready to explore the lands! Before we go, we'll need to stop by the Tavern so you can pick up some goods that might help you on the way.",
    clue: 9,
    travel: 7,
  },
  1211: {
    story:
      "The time has come! It's noon hour at noon minutes. Quickly! You must go to the forest. Seek the trees of life and discover their secret. ",
    clue: 5,
    travel: "The hour of now.",
  },
  xerar: {
    story:
      "It seems you have leveled up in these flourishing woods back at your days. I see you are not a newbie. Well then, how about we go to a more majestic place? Prepare yourself! The road is long but short. We are going to Dalaran! Quickly, the clock's ticking, get into the portal!",
    clue: 44,
    travel: 9,
  },
  662912: {
    story:
      "Oops oops, we might have a broken theader in the timespace fabric. The portal is twiching. It's setting us off course to a place far away from this world. It sends you home!",
    clue: 0,
    travel: 4,
  },
  zpbmjk: {
    story:
      "Wooooah we are back on our track. That was a wild curve. Now... I hope you are hungry for some fishing... As we are going to Zangarmarsh! Pack your Fishing pole! Quickly!",
    clue: 0,
    travel: 6,
  },
  52: {
    story:
      "That was a good fishing session...but we have made a big mistake! A rare fish suddenly appears and grabs your attention. As you look in to it closly you can see it makes a movement with its lips. As you come closer to hear what it says...you hear the scary fish saying: I will send you to Blackrock's hidden dungeon! NOOOO! As you hear that you find yourself instantly teleported to a locked dungeon room...",
    clue: 2,
    travel: 10,
  },
  785: {
    story:
      "WoW! You managed to escape that dungeon! Great work! Let's celebrate your success in Stormwind ",
    clue: 0,
    travel: 3,
  },
  2320: {
    story:
      "It seems you like your new item! Well, we don't have time. A word has come from my ol'friend o pirate - Salty Dog. He's calling us to help him count the hats in Booty Bay. Pack your stuff and jump!",
    clue: 3,
    travel: 5,
  },
  57: {
    story:
      "Salty Dog is happy! You got all the pirate's hats, even your dad's hat! As you walk towards the flight master you notice a old lady whispering your name... You move closer to her, curious to see what she has to tell you. She reveals a giant crystal ball and as you look closer, you can see giant rocks flying and waterfalls flowing from them... You instantly remember a name. Nagrand. Before you have time to say it, you are already teleported there.",
    clue: 2,
    travel: 11,
  },
  1089: {
    story:
      "You have solved the Nagrand high puzzle. Your potential is incredible! As you slowly reach your hand to pull the final rock, you feel something pulling you from above. It's a wormhole that was generated as a trap to send visitors back in time! You are not teleported back in the dinosaur era. You traveling to Un'Goro Crater!",
    clue: 4,
    travel: 8,
  },
  123: {
    story:
      "You have solved the Nagrand high puzzle. Your potential is incredible! As you slowly reach your hand to pull the final rock, you feel something pulling you from above. It's a wormhole that was generated as a trap to send visitors back in time! You are not teleported back in the dinosaur era. You traveling to Un'Goro Crater!",
    clue: 4,
    travel: 2,
  },
  452: {
    story:
      "BRAVO SMIKENCE MOE GO RESI MOETO ESCAPEBOOKCE :3 te sakam najmnogu, srekja nova godinaaaa!! :3",
    clue: 8,
    travel: 0,
  },
  denar162: {
    story: "Last hint: ke pravam escapebook part 2 :3",
    clue: 0,
    travel: 0,
  },
};

const EscapeBook = () => {
  const [code, setCode] = useState("");
  const [hp, setHp] = useState(10);
  const [story, setStory] = useState();
  const [clue, setClue] = useState();
  const [travel, setTravel] = useState();
  const [error, setError] = useState();

  const checkResult = () => {
    if (!database[code]) {
      setError("Oops Wrong Code!");
      setHp(hp - 1);
      setStory("");
      setClue("");
      setTravel("");
      if (hp - 1 == 0) {
        setError("You lose :( Try again");
      }
    }
    if (database[code]) {
      setError("CORRECT!");
      const result = database[code];
      setStory(result.story);
      setClue(result.clue);
      setTravel(result.travel);
    }
  };
  return (
    <div className={styles.escapeBook}>
      <div>ENTER CODE TO OPEN PORTALS</div>
      <div>YOUR HP: {hp} HEARTS</div>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toLocaleLowerCase())}
        className={styles.inputBar}
      />
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkResult();
          }
        }}
        onClick={() => checkResult()}
        className="btn btn-action m1"
      >
        <div style={{ fontSize: "22px" }}>ENTER</div>
      </div>
      {error && <div>{error}</div>}
      {error && error == "CORRECT!" && (
        <img src={`${baseUrl}/checked.png`} height="20px" />
      )}
      {story && <div className={styles.story}>{story}</div>}
      {clue && (
        <div className={styles.content}>
          {clue > 30 ? "Take the Item:" : "Take Clue:"} {clue}
        </div>
      )}
      {travel && <div className={styles.content}>Travel to Page: {travel}</div>}
    </div>
  );
};

export default EscapeBook;
