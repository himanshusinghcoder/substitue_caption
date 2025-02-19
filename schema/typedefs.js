const { gql } = require('apollo-server-express');

module.exports = gql`
  type Caption {
    id: ID!
    playerOutName: String!
    playerOutNumber: String!
    playerInName: String!
    playerInNumber: String!
    substitutionTime: String!
  }

  type Query {
    captions: [Caption]
  }

  type Mutation {
    triggerCaption(
      playerOutName: String!
      playerOutNumber: String!
      playerInName: String!
      playerInNumber: String!
      substitutionTime: String!
    ): Caption!

    hideCaption: String
  }

  type Subscription {
    captionTriggered: Caption
    captionHidden: String
  }
`;
