import { gql } from "apollo-boost";

export const GET_OBJECTIVES_QUERY = gql`
  query {
    objectives {
      data {
        id
        attributes {
          name
          link
          time_type
          description
          requirement
          requirement_amount
          reward_type
          reward_amount
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

export const GET_CARD_PLAYER = gql`
  query ($id: ID!) {
    card(id: $id) {
      data {
        id
        attributes {
          name
          description
          type
          rarity
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
          realm {
            data {
              id
              attributes {
                color
                name
              }
            }
          }
          slides {
            id
            question
            idea_title
            idea_content
            image {
              data {
                id
                attributes {
                  url
                }
              }
            }
            answers {
              text
              is_correct
            }
          }
        }
      }
    }
  }
`;

export const GET_USERCARDS_QUERY = gql`
  query ($id: ID!) {
    usercard(id: $id) {
      data {
        id
        attributes {
          is_favorite
          level
          completed
          quantity
          is_new
          glory_points
          is_unlocked
          card {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                is_open
                realm {
                  data {
                    id
                    attributes {
                      color
                      name
                      image {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                    }
                  }
                }
                expansion {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
                actions {
                  data {
                    id
                    attributes {
                      name
                      type
                      level
                      duration
                      tips
                      stats {
                        difficulty
                        fun
                        short_term
                        long_term
                      }
                      steps {
                        content
                      }
                    }
                  }
                }
                communityactions {
                  data {
                    id
                    attributes {
                      name
                      type
                      duration
                      votes
                      reports
                      steps {
                        content
                      }
                      user {
                        data {
                          id
                          attributes {
                            username
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          completed_actions {
            data {
              id
            }
          }
          upvoted_actions {
            data {
              id
            }
          }
          community_actions_completed {
            data {
              id
            }
          }
          reported_actions {
            data {
              id
            }
          }

          community_actions_claimed {
            data {
              id
              attributes {
                name
                type
                duration
                votes
                reports
                steps {
                  content
                }
                user {
                  data {
                    id
                    attributes {
                      username
                    }
                  }
                }
              }
            }
          }

          my_community_actions {
            data {
              id
              attributes {
                name
                type
                duration
                votes
                reports
                is_private
                steps {
                  content
                }
                user {
                  data {
                    id
                    attributes {
                      username
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CARD_ID = gql`
  query ($id: ID!) {
    card(id: $id) {
      data {
        id
        attributes {
          name
          description
          type
          rarity
          is_open
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
          expansion {
            data {
              id
              attributes {
                name
              }
            }
          }
          realm {
            data {
              id
              attributes {
                color
                name
                image {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          actions {
            data {
              id
              attributes {
                name
                type
                level
                duration
                tips
                stats {
                  difficulty
                  fun
                  short_term
                  long_term
                }
                steps {
                  content
                }
              }
            }
          }
          communityactions {
            data {
              id
              attributes {
                name
                type
                duration
                votes
                reports
                steps {
                  content
                }
                user {
                  data {
                    id
                    attributes {
                      username
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_REALM_ID = gql`
  query ($id: ID!) {
    realm(id: $id) {
      data {
        id
        attributes {
          name
          description
          image {
            data {
              id
              attributes {
                url
              }
            }
          }

          problems {
            data {
              id
              attributes {
                name
                realm {
                  data {
                    id
                    attributes {
                      name
                      image {
                        data {
                          id
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
          }

          courses {
            data {
              id
              attributes {
                name
                students
                price
                discount
                course_details {
                  id
                  duration
                  actions
                  concepts
                  questions
                  sessions
                  days
                }
                last_updated
                rating
                image {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }

          cards {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                is_open
                image {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
                expansion {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
                realm {
                  data {
                    id
                    attributes {
                      name
                      color
                      image {
                        data {
                          id
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
          }
        }
      }
    }
  }
`;

export const GET_STREAKS_QUERY = gql`
  query {
    streakrewards {
      data {
        id
        attributes {
          reward_amount
          streak_count
          reward_card {
            data {
              id
              attributes {
                name
                rarity
                image {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          reward_box {
            data {
              id
              attributes {
                name
                image {
                  data {
                    id
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

export const GET_FRIENDS_QUERY = gql`
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
                rarity
                image {
                  data {
                    id
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

export const GET_COLLECTION = gql`
  query ($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          usercards {
            data {
              id
              attributes {
                is_new
                is_favorite
                completed
                quantity
                glory_points
                level
                is_unlocked
                card {
                  data {
                    id
                    attributes {
                      name
                      rarity
                      type
                      is_open
                      image {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                      realm {
                        data {
                          id
                          attributes {
                            name
                            color
                            image {
                              data {
                                id
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
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_STATS = gql`
  query ($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          usercards {
            data {
              attributes {
                completed
                quantity
                is_unlocked
                level
                card {
                  data {
                    id
                    attributes {
                      is_open
                      realm {
                        data {
                          id
                          attributes {
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PROBLEM_ID = gql`
  query ($id: ID!) {
    problem(id: $id) {
      data {
        id
        attributes {
          name
          other_names
          source
          expected_time_amount
          expected_time_type
          course {
            data {
              id
              attributes {
                name
                students
                price
                discount
                course_details {
                  id
                  duration
                  actions
                  concepts
                  questions
                  sessions
                  days
                }
                last_updated
                rating
                image {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }

          actions {
            data {
              id
              attributes {
                name
                duration
                type
                level
                tips
                stats {
                  difficulty
                  fun
                  short_term
                  long_term
                }
                steps {
                  content
                }
                image {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          realm {
            data {
              id
              attributes {
                name
                color
                image {
                  data {
                    id
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
    }
  }
`;

export const GET_COURSES = gql`
  query {
    courses {
      data {
        id
        attributes {
          name
          description
          students
          price
          last_updated
          full_price
          rating
          rating_amount
          discount
          course_details {
            id
            duration
            actions
            concepts
            questions
            sessions
            days
          }
          image {
            data {
              id
              attributes {
                url
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

export const GET_COURSE_ID = gql`
  query ($id: ID!) {
    course(id: $id) {
      data {
        id
        attributes {
          name
          description
          students
          price
          full_price
          rating
          rating_amount
          discount
          what_you_learn
          requirements
          who_is_for
          what_you_complete
          updatedAt
          course_details {
            id
            duration
            actions
            concepts
            questions
            days
          }
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
          problems {
            data {
              id
              attributes {
                name
              }
            }
          }
          days {
            id
            index
            contents {
              id
              index
              storyline
              type
              title
              timer
              duration
              action {
                data {
                  id
                  attributes {
                    name
                  }
                }
              }
              question {
                data {
                  id
                  attributes {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// export const GET_USERCOURSE_ID = gql`
//   query ($id: ID!) {
//     usercourse(id: $id) {
//       data {
//         id
//         attributes {
//           user_permissions_user {
//             data {
//               id
//               attributes {
//                 username
//               }
//             }
//           }
//           username
//           last_completed_day
//           last_completed_content
//           is_purchased
//           rewards_claimed
//           times_started
//         }
//       }
//     }
//   }
// `;

export const GET_PROBLEMS = gql`
  query {
    problems {
      data {
        id
        attributes {
          name
          other_names
          source
          expected_time_amount
          expected_time_type
          course {
            data {
              id
              attributes {
                name
              }
            }
          }
          actions {
            data {
              id
              attributes {
                name
                duration
                type
                image {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          realm {
            data {
              id
              attributes {
                name
                color
                image {
                  data {
                    id
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

export const GET_REALMS = gql`
  query {
    realms {
      data {
        id
        attributes {
          name
          description
          coming_soon
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
          expansion {
            data {
              id
              attributes {
                name
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

export const GET_REWARDS_QUERY = gql`
  query {
    levelrewards {
      data {
        id
        attributes {
          level
          is_premium
          reward_type
          reward_amount
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

export const GET_BOX_ID = gql`
  query ($id: ID!) {
    box(id: $id) {
      data {
        id
        attributes {
          name
          description
          require
          price
          price_type
          image {
            data {
              attributes {
                url
              }
            }
          }
          expansion {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_ID = gql`
  query ($id: ID) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          username
          level
          xp
          gems
          stars
          streak
          energy
          highest_streak_count
          highest_buddy_shares
          is_subscribed
          actions {
            data {
              id
              attributes {
                name
                type
                level
                duration
                tips
                stats {
                  difficulty
                  fun
                  short_term
                  long_term
                }
                steps {
                  content
                }
              }
            }
          }
          communityactions {
            data {
              id
              attributes {
                name
                votes
                reports
                duration
                steps {
                  content
                }
                type
              }
            }
          }
          last_unlocked_cards {
            data {
              id
              attributes {
                name
              }
            }
          }
          last_unlocked_cards {
            data {
              id
              attributes {
                name
              }
            }
          }
          followedBy {
            data {
              id
              attributes {
                username
              }
            }
          }
          followers {
            data {
              id
              attributes {
                username
              }
            }
          }
          usercards {
            data {
              id
              attributes {
                is_new
                is_favorite
                completed
                quantity
                glory_points
                level
                is_unlocked
                card {
                  data {
                    id
                    attributes {
                      name
                      rarity
                      type
                      is_open
                      image {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                      realm {
                        data {
                          id
                          attributes {
                            name
                            color
                            image {
                              data {
                                id
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
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_IDAGAGAGAG = gql`
  query ($id: ID!) {
    user(id: $id) {
      data {
        id
        attributes {
          name
          description
          require
          price
          price_type
          image {
            data {
              attributes {
                url
              }
            }
          }
          expansion {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_BOXES = gql`
  query {
    boxes {
      data {
        id
        attributes {
          name
          description
          require
          price
          price_type
          image {
            data {
              attributes {
                url
              }
            }
          }
          expansion {
            data {
              id
              attributes {
                name
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

    products {
      data {
        id
        attributes {
          name
          description
          price
          discount
          bonus_amount
          type
          google_id
          apple_id
          is_disabled
          amount
          image {
            data {
              attributes {
                url
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

    expansion(id: 2) {
      data {
        id
        attributes {
          name
          description
          price
          discount_price
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;
