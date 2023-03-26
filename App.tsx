/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  AppState,
  AppStateStatus,
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
} from 'react-native/Libraries/NewAppScreen';
import { getIntent } from 'react-native-get-intent';
import { getPostDetails } from './Logic';
import RNExitApp from 'react-native-exit-app';

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

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        console.log(`state ${state}`);
        if (state === 'active') {
          getIntent().then(async (intent) => {
            if (intent.extras['android.intent.extra.TEXT']){
              let url = String(intent.extras['android.intent.extra.TEXT']).split('/?',1)[0];
              url = url + '.json';

              if (url.includes('reddit')) {
                console.log(url);

                await getPostDetails(url);

                setTimeout(() => {
                  RNExitApp.exitApp();
               }, 2000);

              } else {
                ToastAndroid.show('Link is not a reddit link', ToastAndroid.SHORT);
              }
            }
          });
        }
      }
    );
    subscription.remove;
  });


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
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="How to">
            Share links from reddit to <Text style={styles.highlight}>RShare</Text>, get the media URL copied to the clipboard
          </Section>
          {/* <Section title="imgUrl">
            <Text>imgUrl: {JSON.stringify(imgUrl, null, 2)}</Text>
          </Section> */}
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
