import React, {useState} from 'react';
import {TextInput, Text} from 'react-native';
import axios from 'axios';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import UserSearchResult from './UserSearchResult';

export default function UserSearch() {
  const [results, setResults] = useState([]);
  const handleQueryChange = async query => {
    console.log(`query: ${query}`);
    if (query.length > 0) {
      try {
        const response = await axios.post(
          'http://localhost:3000/users/search',
          {
            queryTerm: query,
          },
        );

        console.log(response.data.users);
        setResults(response.data.users);
      } catch (error) {
        console.log('something went wrong');
        console.log(error);
      }
    } else {
      setResults([]);
    }
  };

  const resultsMarkup = results.map(result => {
    return (
      <UserSearchResult key={result.username} username={result.username} />
    );
  });
  return (
    <>
      <TextInput
        onChangeText={handleQueryChange}
        placeholder="Search"
        style={{borderWidth: 1, borderColor: Colors.gray, padding: 4}}
      />

      {resultsMarkup}
    </>
  );
}
