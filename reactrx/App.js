/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,  
  TextInput,
} from 'react-native';

import axios from 'axios';

import {from, BehaviorSubject} from 'rxjs';
import {map, filter, mergeMap, delay, debounceTime, distinctUntilChanged} from 'rxjs/operators';

  let searchSubject=new BehaviorSubject('');
  let searchSubjectObservable = searchSubject.pipe(
    filter(val => val.length>2),
    debounceTime(750),
    distinctUntilChanged(),
    mergeMap(val => from(getPokemon(val)))
  );
  
  const getPokemon = async name => {
    const {results: allPokemon } = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
    .then(res => res.data);
    console.log(allPokemon);
    return allPokemon.filter(pokemon=>pokemon.name.includes(name));
  }

  const useObservable = (observable, setter) => {
    useEffect(()=>{
      let subscription = observable.subscribe( result => {
        console.log(result);
        setter(result);
      });
  
      return ()=>subscription.unsubscribe();
    },[observable, setter]);
  }


const App = () => {

  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);

  useObservable(searchSubjectObservable, setResult);

  handleSearch = search => {
    setSearch(search);
    searchSubject.next(search);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput value={search} onChangeText={handleSearch} placeholder="search pokemon"/>
      <Text>Hello : {search}</Text>
      {
        result.length<=0 ? <Text>No data {result.length}</Text> : result.map(pok=><Text>{pok.name}</Text>)
      }
    </View>
  );
};

export default App;


// 