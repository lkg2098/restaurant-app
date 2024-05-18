import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function UserSearchResult({username}) {
  return <Text style={styles.textBox}>{username}</Text>;
}

const styles = StyleSheet.create({
  textBox: {
    backgroundColor: '#d3d3d3',
    padding: 10,
  },
});
