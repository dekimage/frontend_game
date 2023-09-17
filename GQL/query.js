import { gql } from "apollo-boost";

export const GET_ORDERS = gql`
  query GetOrders($id: ID!) {
    orders(filters: { user: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          status
          payment_env
          amount
          transaction_details
          payment_details
          createdAt
          product {
            data {
              id
              attributes {
                name
                amount
                price
                type
                description
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

export const GET_PRO_CARDS = gql`
  query {
    cards(pagination: { limit: 100 }, filters: { type: { eq: "premium" } }) {
      data {
        id
        attributes {
          name
          type
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
        }
      }
    }
  }
`;

export const GET_BOOKMARKS = gql`
  query GetBookmarks($userId: ID!) {
    usersPermissionsUser(id: $userId) {
      data {
        id
        attributes {
          savedCasestudies {
            data {
              id
              attributes {
                title
                card {
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
          savedCasestudies {
            data {
              id
              attributes {
                title
                card {
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
          savedExercises {
            data {
              id
              attributes {
                title
                card {
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
          savedExperiments {
            data {
              id
              attributes {
                title
                card {
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
          savedExpertopinions {
            data {
              id
              attributes {
                card {
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
          savedIdeas {
            data {
              id
              attributes {
                title
                card {
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
          savedMetaphors {
            data {
              id
              attributes {
                title
                card {
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
          savedQestions {
            data {
              id
              attributes {
                card {
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
          savedQuotes {
            data {
              id
              attributes {
                card {
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
          savedStories {
            data {
              id
              attributes {
                title
                card {
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
          savedTips {
            data {
              id
              attributes {
                card {
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
`;

export const GET_FAQS = gql`
  query {
    faqs {
      data {
        id
        attributes {
          question
          answer
          sortOrder
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

// FOR DASHBOARD ANALYTICS
export const GET_CONTENT = gql`
  query {
    cards(pagination: { limit: 100 }) {
      data {
        id
        attributes {
          realm {
            data {
              id
              attributes {
                name
              }
            }
          }
          name
          expansion {
            data {
              id
            }
          }
          casestudies {
            data {
              id
            }
          }
          exercises {
            data {
              id
            }
          }
          experiments {
            data {
              id
            }
          }
          expertopinions {
            data {
              id
            }
          }
          ideas {
            data {
              id
            }
          }
          metaphores {
            data {
              id
            }
          }

          quotes {
            data {
              id
            }
          }
          questions {
            data {
              id
            }
          }
          stories {
            data {
              id
            }
          }
          tips {
            data {
              id
            }
          }
          actions {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

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
    objectives(pagination: { limit: 25 }) {
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

export const GET_USERCARD_QUERY = gql`
  query GetUserCards($userId: ID!, $cardId: ID!) {
    usercards(
      filters: { user: { id: { eq: $userId } }, card: { id: { eq: $cardId } } }
    ) {
      data {
        id
        attributes {
          is_favorite
          completed
          is_new
          rating
          completed_at
          is_unlocked
          progressMap
          progressQuest
          card {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
                coming_soon
                is_open
                relationCount
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
              }
            }
          }
        }
      }
    }
  }
`;

// QUIZ
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
          coming_soon
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

export const GET_PLAYER_CARD = gql`
  query ($id: ID!) {
    card(id: $id) {
      data {
        id
        attributes {
          name
          last_day
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
          coming_soon
          relationCount
          friendreward {
            data {
              id
              attributes {
                friends_count
              }
            }
          }
          streakreward {
            data {
              id
              attributes {
                streak_count
              }
            }
          }
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

          ideas {
            data {
              id
              attributes {
                title
                content
                sortOrder
                isOpen
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

          stories {
            data {
              id
              attributes {
                title
                content
                sortOrder
                isOpen
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

          tips {
            data {
              id
              attributes {
                content
                sortOrder
                isOpen
              }
            }
          }

          quotes {
            data {
              id
              attributes {
                author
                content
                sortOrder
                isOpen
              }
            }
          }

          questions {
            data {
              id
              attributes {
                question
                description
                sortOrder
                isOpen
              }
            }
          }

          metaphores {
            data {
              id
              attributes {
                title
                content
                sortOrder
                isOpen
              }
            }
          }

          expertopinions {
            data {
              id
              attributes {
                author
                content
                sortOrder
                isOpen
              }
            }
          }

          experiments {
            data {
              id
              attributes {
                title
                content
                sortOrder
                isOpen
                source
              }
            }
          }

          exercises {
            data {
              id
              attributes {
                title
                content
                sortOrder
                isOpen
                duration
                bestTime
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

          casestudies {
            data {
              id
              attributes {
                title
                content
                sortOrder
                isOpen
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

          cards(pagination: { limit: 25 }) {
            data {
              id
              attributes {
                name
                description
                type
                rarity
                cost
                is_open
                coming_soon
                relationCount
                friendreward {
                  data {
                    id
                    attributes {
                      friends_count
                    }
                  }
                }
                streakreward {
                  data {
                    id
                    attributes {
                      streak_count
                    }
                  }
                }
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
    streakrewards(pagination: { limit: 25 }) {
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
                obtained_by_description
                rarity
                require
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
                cost
                is_open
                coming_soon
                relationCount
                streakreward {
                  data {
                    id
                    attributes {
                      streak_count
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
                rarity
                require
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
                cost
                is_open
                relationCount
                coming_soon
                friendreward {
                  data {
                    id
                    attributes {
                      friends_count
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
                coming_soon
                relationCount
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
                coming_soon
                relationCount
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
                coming_soon
                relationCount
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
                coming_soon
                relationCount
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

export const GET_PROBLEMS = gql`
  query {
    problems(pagination: { limit: 100 }) {
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

          cards {
            data {
              id
              attributes {
                name
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
    levelrewards(pagination: { limit: 100 }) {
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
                obtained_by_description
                rarity
                require
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
// BUDDY
export const GET_USER_ID = gql`
  query ($id: ID) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          username
          level
          xp
          stars
          streak
          energy
          highest_streak_count
          highest_buddy_shares
          pro
          stats

          shared_buddies {
            data {
              id
              attributes {
                username
                level
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
              }
            }
          }

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
                coming_soon
                relationCount
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

export const GET_PRODUCTS = gql`
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
