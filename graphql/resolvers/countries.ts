import gql from 'graphql-tag';

export default gql`
  query allCountries($filter: CountryFilterInput) {
    countries: countries(filter: $filter) {
      code
      name
      emoji
      __typename
    }
  }
`;

