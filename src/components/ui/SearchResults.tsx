import React from "react";

interface SearchResultsProps {
  searchText: string;
}

type Props = SearchResultsProps;

export const SearchResults = ({ searchText }: Props) => {
  return (
    <div>
      <div>Search results for "{searchText}"</div>
    </div>
  );
};
