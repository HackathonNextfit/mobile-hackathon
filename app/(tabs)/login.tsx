import {Image, StyleSheet, Text} from 'react-native';
import {ThemedView} from '@/components/ThemedView';
import {ThemedText} from '@/components/ThemedText';
import {HelloWave} from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLogin() {

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
            headerImage={<Ionicons size={300} name="diamond" style={styles.headerImage}/>}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Login!</ThemedText>
                <HelloWave/>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#833ab4',
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
