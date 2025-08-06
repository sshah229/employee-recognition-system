import { gql } from 'apollo-server';

export const typeDefs = gql`
  """
  An employee recognition event.
  """
  type Recognition {
    id: ID!
    from: ID!
    to: ID        # null if anonymous
    message: String!
    emoji: String!
    visibility: Visibility!
    team: String
    keywordTags: [String!]!
    createdAt: String!
  }

  enum Visibility {
    PUBLIC
    PRIVATE
    ANONYMOUS
  }

  """
  Queries to fetch recognitions.
  """
  type Query {
    allRecognitions: [Recognition!]!
    recognitionsByTeam(team: String!): [Recognition!]!
  }

  """
  Mutations to create recognitions.
  """
  type Mutation {
    addRecognition(
      from: ID!
      to: ID
      message: String!
      emoji: String!
      visibility: Visibility!
      team: String
      keywordTags: [String!]!
    ): Recognition!
  }

  """
  Subscription for real-time updates when a recognition is added.
  """
  type Subscription {
    recognitionAdded: Recognition!
  }
`;
