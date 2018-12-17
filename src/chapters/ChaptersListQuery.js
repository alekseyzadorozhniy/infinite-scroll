import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ChaptersList from './ChaptersList';

const chaptersQuery = gql`
  query chapters($cursor: String) {
    chapters(first: 10, after: $cursor) @client {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const ChaptersListQuery = () => (
  <Query query={chaptersQuery}>
    {({ data, fetchMore }) =>
      data && (
        <ChaptersList
          chapters={data.chapters}
          onLoadMore={() =>
            fetchMore({
              variables: {
                cursor: data.chapters.pageInfo.endCursor
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                const newEdges = fetchMoreResult.chapters.edges;
                const pageInfo = fetchMoreResult.chapters.pageInfo;

                return newEdges.length
                  ? {
                      // Put the new data at the end of the list and update `pageInfo`
                      // so we have the new `endCursor` and `hasNextPage` values
                      chapters: {
                        __typename: previousResult.chapters.__typename,
                        edges: [...previousResult.chapters.edges, ...newEdges],
                        pageInfo
                      }
                    }
                  : previousResult;
              }
            })
          }
        />
      )
    }
  </Query>
);

export default ChaptersListQuery;
