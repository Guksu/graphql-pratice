import { ApolloServer, gql } from "apollo-server";

const DUMMY_DATA = [
  {
    id: 0,
    name: "min",
    age: 20,
  },
  {
    id: 1,
    name: "haha",
    age: 30,
  },
];

//타입 정의
const typeDefs = gql`
  type Person {
    id: ID!
    name: String!
    age: Int!
    nmaeWithAge: String!
  }

  # RootType으로 필수
  type Query {
    allPerson: [Person]
    person(id: ID!): Person
  }

  # GET요청이 아닌 경우
  type Mutation {
    createUser(name: String!, age: Int!): Person!
    deleteUser(id: ID!): Person
  }
`;

// 비즈니스 로직
const resolvers = {
  Query: {
    allPerson() {
      return DUMMY_DATA;
    },
    // root : 상위 resolver에서 반환한 값, 최상위 Query에서는 root가 undefined 또는 null
    // arg : client에서 보낸 parameter
    person(root, arg) {
      return DUMMY_DATA.filter((p) => p.id == arg.id)[0];
    },
  },
  Mutation: {
    createUser(_, arg) {
      const newUser = {
        id: DUMMY_DATA.length,
        name: arg.name,
        age: arg.age,
      };
      DUMMY_DATA.push(newUser);
      return DUMMY_DATA.find((p) => p.id === newUser.id);
    },

    deleteUser(_, arg) {
      const index = DUMMY_DATA.findIndex((p) => p.id == arg.id);
      if (index === -1) return null;

      const deletedUser = DUMMY_DATA[index];
      DUMMY_DATA.splice(index, 1);
      return deletedUser;
    },
  },

  // DB에 저장되지 않는 값도 resolver에서 로직처리로 반환 가능하다.
  // api 호출 -> 기본값 반환 -> 값이 없으면 리졸버 탐색(기본값은 root에 저장)
  // 단 type에 정의된 명칭과 동일해야한다.
  Person: {
    nmaeWithAge(root) {
      return `${root.name}-${root.age}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀Server Running on ${url}`);
});
