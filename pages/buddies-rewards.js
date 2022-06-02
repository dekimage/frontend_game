// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// *** COMPONENTS ***
import { ImageUI } from "../components/reusableUI";

// *** ACTIONS ***
import { claimUserReward } from "../actions/action";
// *** DATA ***
import { levelRewards } from "../data/rewards";

import { normalize } from "../utils/calculations";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Streak.module.scss";

const GET_STREAKS_QUERY = gql`
  query {
    friendrewards {
      data {
        id
        attributes {
          reward_amount
          friends_count
          reward_card {
            data {
              id
              attributes {
                name
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
      meta {
        pagination {
          page
          pageSize
          total
          pageCount
        }
      }
    }
  }
`;

const FriendReward = ({ friendReward, setSelectedReward }) => {
  const {
    reward_card,
    id,
    reward_amount,
    friends_count,
    isCollected,
    isReady,
  } = friendReward;

  return (
    <div
      className={styles.streak}
      onClick={() => setSelectedReward(friends_count)}
    >
      <ImageUI imgUrl={reward_card.image.url} className={styles.image} />
      <div>{reward_card.name}</div>
      <div>X{reward_amount}</div>
      <div>{friends_count}</div>
      <div>{isCollected && "CLaimed!"}</div>
      <div>{isReady && "Ready To Collect!"}</div>
    </div>
  );
};

const FriendsTower = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_STREAKS_QUERY);
  const gql_data = data && normalize(data);

  const [selectedReward, setSelectedReward] = useState(0);

  // console.log(store.user && store.user.friends_rewards);

  const mergeRewards = (rewards, userRewards) => {
    return rewards.map((r) => {
      if (userRewards[r.friends_count]) {
        return {
          ...r,
          isCollected: true,
        };
      }
      return {
        ...r,
        isReady: store.user.highestBuddyShares >= r.friends_count,
      };
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading Friend Rewards...</div>;
  }

  return (
    <div className="background_dark">
      <div className="section">
        <div className="title">Streak: {store.user.highestBuddyShares}</div>
        {gql_data && store.user && store.user.friends_rewards && (
          <div>
            {mergeRewards(
              gql_data.friendsRewards,
              store.user.friends_rewards
            ).map((friendReward, i) => (
              <FriendReward
                friendReward={friendReward}
                key={i}
                setSelectedReward={setSelectedReward}
              />
            ))}
          </div>
        )}
        <div
          className="btn btn-primary"
          onClick={() => {
            claimUserReward(dispatch, selectedReward);
          }}
        >
          Claim
        </div>
      </div>
    </div>
  );
};

export default FriendsTower;
