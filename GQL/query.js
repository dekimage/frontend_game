import { gql } from "apollo-boost";

export const GET_AVATARS = gql`
  query {
    avatars {
      data {
        id
        attributes {
          name
          is_open
          require_level
          require_artifact
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

export const GET_ARTIFACTS_QUERY = gql`
  query {
    artifacts(pagination: { limit: 100 }) {
      data {
        id
        attributes {
          name
          short_name
          type
          require
          obtained_by_description
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
          is_premium
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
          cost
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
          completed_progress_max
          quantity
          is_new
          glory_points
          completed_at
          is_unlocked
          completed_contents
          league
          card {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
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

                actions {
                  data {
                    id
                    attributes {
                      name
                      type
                      level
                      duration
                      tips
                      examples

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

export const GET_ACTION_ID = gql`
  query ($id: ID!) {
    action(id: $id) {
      data {
        id
        attributes {
          name
          description
          type
          level
          duration
          tips
          examples
          steps {
            content
            timer
            task
          }
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
          card {
            data {
              id
              attributes {
                name
                cost
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

export const GET_CARD_ID = gql`
  query ($id: ID!) {
    card(id: $id) {
      data {
        id
        attributes {
          name
          description
          benefits
          last_day
          type
          cost
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

          days {
            id
            index
            contents {
              id
              index
              storyline
              type
              title
              duration
              action {
                data {
                  id
                  attributes {
                    name
                    type
                    level
                    duration
                    tips
                    examples

                    steps {
                      content
                      timer
                      task
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
                examples
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

          books {
            data {
              id
              attributes {
                name
                author
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

          cards(pagination: { limit: 15 }) {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
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
`;

export const GET_STREAKS_QUERY = gql`
  query {
    streakrewards {
      data {
        id
        attributes {
          reward_amount
          streak_count
          reward_type
          artifact {
            data {
              id
              attributes {
                name
                short_name
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

export const GET_FRIENDS_QUERY = gql`
  query {
    friendrewards {
      data {
        id
        attributes {
          reward_amount
          friends_count
          reward_type
          artifact {
            data {
              id
              attributes {
                name
                short_name
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
                completed_contents
                card {
                  data {
                    id
                    attributes {
                      name
                      rarity
                      cost
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

export const GET_USER_OPEN_TICKETS = gql`
  query ($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          card_tickets {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
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

          action_tickets {
            data {
              id
              attributes {
                name
                duration
                type
                level
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

export const GET_USER_RECENTS = gql`
  query ($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          last_completed_cards {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
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
          last_completed_actions {
            data {
              id
              attributes {
                name
                duration
                type
                level
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

export const GET_USER_FAVORITES = gql`
  query ($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          favorite_cards {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
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
          favorite_actions {
            data {
              id
              attributes {
                name
                duration
                type
                level
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

          cards {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
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

          actions {
            data {
              id
              attributes {
                name
                duration
                type
                level
                tips
                examples

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

              duration
              action {
                data {
                  id
                  attributes {
                    name
                    type
                    level
                    duration
                    tips
                    examples

                    steps {
                      content
                      timer
                      task
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

export const GET_BOOK_ID = gql`
  query ($id: ID!) {
    book(id: $id) {
      data {
        id
        attributes {
          name
          author
          image {
            data {
              id
              attributes {
                url
              }
            }
          }
          cards {
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
                examples

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

export const GET_BOOKS = gql`
  query {
    books {
      data {
        id
        attributes {
          name
          author
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
          artifact {
            data {
              id
              attributes {
                name
                short_name
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
          stats

          avatar {
            data {
              id
              attributes {
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

          claimed_artifacts {
            data {
              id
              attributes {
                name
                short_name
                type
                require
                obtained_by_description
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

          last_completed_cards {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
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

          last_completed_actions {
            data {
              id
              attributes {
                name
                duration
                type
                level
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
        }
      }
    }
  }
`;

export const GET_BOXES = gql`
  query {
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
  }
`;
