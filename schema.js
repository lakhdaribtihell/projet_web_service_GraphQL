const { gql } = require("apollo-server");
const db = require("./db");

const typeDefs = gql`
  type Hotel {
    id: ID
    nom: String
    ville: String
    etoiles: Int
    prix_nuit: Float
  }

  type Query {
    hotels(ville: String, etoiles: Int, prixMax: Float): [Hotel]
  }
`;

const resolvers = {
  Query: {
    hotels: async (_, args) => {
      let query = "SELECT * FROM hotels WHERE 1=1";
      let params = [];

      if (args.ville) {
        query += " AND ville = ?";
        params.push(args.ville);
      }

      if (args.etoiles) {
        query += " AND etoiles = ?";
        params.push(args.etoiles);
      }

      if (args.prixMax) {
        query += " AND prix_nuit <= ?";
        params.push(args.prixMax);
      }

      const [rows] = await db.execute(query, params);
      return rows;
    }
  }
};

module.exports = { typeDefs, resolvers };
