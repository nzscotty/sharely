/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  AppState,
  AppStateStatus,
  BackHandler,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import { getIntent, Intent } from 'react-native-get-intent';
import Clipboard from '@react-native-clipboard/clipboard';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [intent, setIntent] = React.useState<Intent>();
  const [originalUrl, setOriginalUrl] = React.useState<string>();
  const [redditDataUrl, setRedditDataUrl] = React.useState<string | null>(null);
  const [imgUrl, setImgUrl] = React.useState<string | null>();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        console.log(`state ${state}`)
        if (state === 'active') {
          getIntent().then((intent) => {
            setIntent(intent)
            if(intent.extras["android.intent.extra.TEXT"]){
              setOriginalUrl(intent.extras["android.intent.extra.TEXT"] as string)
              let url = String(intent.extras["android.intent.extra.TEXT"]).split("/?",1)[0]
              url = url + ".json"
              setRedditDataUrl(url)
            }
          });
        }
      }
    );
    subscription.remove;
  });

  useEffect( () => {
    if(redditDataUrl != null) {
      console.log(redditDataUrl)
      const getUrlAsync = async () => {
        return fetch(redditDataUrl as string)
        .then(response => response.json())
        .then(json => {
          console.log("YOU MADE IT HERE")
          console.log(JSON.stringify(json, null, 2))
          const imgUrl = json[0].data.children[0].data.url_overridden_by_dest as string 
          if(imgUrl.includes(".jpg") || imgUrl.includes(".png")) {
            console.log(`imgUrl ${imgUrl}`)
            setImgUrl(imgUrl)
            Clipboard.setString(imgUrl.toString());
            ToastAndroid.show('Image ulr copied to clipboard', ToastAndroid.SHORT);
            setTimeout(() => {
              BackHandler.exitApp();
           }, 2000);
          }
          const videoUrl = json[0].data.children[0].data.secure_media['reddit_video'].fallback_url as string 
          if(videoUrl.includes(".mp4")) {
            const videoUrlStripped = String(videoUrl).split("?",1)[0]
            console.log(`videoUrl ${videoUrlStripped}`)
            setImgUrl(videoUrlStripped)
            Clipboard.setString(videoUrlStripped.toString());
            ToastAndroid.show('Video url copied to clipboard', ToastAndroid.SHORT);
            setTimeout(() => {
              BackHandler.exitApp();
           }, 2000);
          }
          
        })
        .catch(error => {
          console.error(error);
        });
      }
      getUrlAsync()
    }
  }, [redditDataUrl])
  

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="imgUrl">
            <Text>imgUrl: {JSON.stringify(imgUrl, null, 2)}</Text>
          </Section>
          <Section title="Debug">
            <Text>Intent: {JSON.stringify(intent, null, 2)}</Text>
          </Section>
          <Section title="originalUrl">
            <Text>originalUrl: {JSON.stringify(originalUrl, null, 2)}</Text>
          </Section>
          <Section title="redditDataUrl">
            <Text>redditDataUrl: {JSON.stringify(redditDataUrl, null, 2)}</Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
