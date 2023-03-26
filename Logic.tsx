import Clipboard from '@react-native-clipboard/clipboard';
import { ToastAndroid } from 'react-native';


export const getPostDetails = async (redditDataUrl: string) => {
    if (redditDataUrl.length < 0 ) {
        return 'Url is incomplete';
    }
    return fetch(redditDataUrl as string)
    .then(response => response.json())
    .then(json => {
      console.debug(json)

      const imgUrl = json[0].data.children[0].data.url_overridden_by_dest as string;
      if (imgUrl.includes('.jpg') || imgUrl.includes('.png') || imgUrl.includes('.gif')) {
        console.log(`imgUrl ${imgUrl}`);
        Clipboard.setString(imgUrl.toString());
        ToastAndroid.show('Image URL copied to clipboard', ToastAndroid.SHORT);
       return imgUrl;
      }
      const videoUrl = json[0].data.children[0].data.secure_media.reddit_video.fallback_url as string;
      if (videoUrl.includes('.mp4')) {
        const videoUrlStripped = String(videoUrl).split('?',1)[0];
        console.log(`videoUrl ${videoUrlStripped}`);
        Clipboard.setString(videoUrlStripped.toString());
        ToastAndroid.show('Video URL copied to clipboard', ToastAndroid.SHORT);
        return videoUrlStripped;
      }

    })
    .catch(error => {
      console.error(error);
      ToastAndroid.show(`Error: ${error}`, ToastAndroid.LONG);
      return `Error: ${error}`;
    });
  };
