import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const request_permissions = async () => {
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { return false } else { return true }
      }
}

const compress_image = async (image) => {
    return await ImageManipulator.manipulateAsync(
        image.uri || image.localUri,
        { compress: 0.3, format: 'png' },
       );
}



const open_file_manager = async () => {
    const image =  await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [1, 1],
        quality: 1,
      });

    const compressed = await ImageManipulator.manipulateAsync(
        image.uri || image.localUri,
        [{ resize: { width: 400 } }],
        { compress: 0.7, format: 'png' },
       );
    
    return compressed
    
}

const select_image_handler = async () => {
    return request_permissions().then(async (granted) => {
        if(granted){
            return open_file_manager()
        } else {
            return false
        }
    })
}

export { select_image_handler }