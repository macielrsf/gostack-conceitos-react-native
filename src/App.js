import React, {useEffect, useState} from "react";

import {
    ScrollView,
    SafeAreaView,
    View,
    FlatList,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        const initialLoad = async () => {
            const res = await api.get('repositories'); 

            if ( res.status === 200 ) {
                setRepositories(res.data);
            }
        }

        initialLoad();
    }, []);

    async function handleLikeRepository(id) {
        const res = await api.post(`repositories/${id}/like`);

        if ( res.status === 200 ) {
            const repository = res.data;
            const repos = repositories.map(r => r.id === id ? repository : r);

            setRepositories(repos);
        }
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
            <ScrollView style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    {repositories.map(repository => (
                        <View key={repository.id} style={styles.repositoryContainer}>
                            <Text style={styles.repository}>{repository.title}</Text>

                            <View style={styles.techsContainer}>
                                {repository?.techs?.length && repository.techs.map(tech => (
                                    <Text key={tech} style={styles.tech}>
                                        {tech}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.likesContainer}>
                                <Text
                                    style={styles.likeText}
                                    testID={`repository-likes-${repository.id}`}>
                                    {repository.likes} curtidas
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleLikeRepository(repository.id)}
                                testID={`like-button-${repository.id}`}>
                                <Text style={styles.buttonText}>Curtir</Text>
                            </TouchableOpacity>
                        </View>

                    ))}
                </SafeAreaView>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7159c1",
    },
    repositoryContainer: {
        marginBottom: 15,
        marginHorizontal: 15,
        backgroundColor: "#fff",
        padding: 20,
    },
    repository: {
        fontSize: 32,
        fontWeight: "bold",
    },
    techsContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    tech: {
        fontSize: 12,
        fontWeight: "bold",
        marginRight: 10,
        backgroundColor: "#04d361",
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: "#fff",
    },
    likesContainer: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    likeText: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 10,
    },
    button: {
        marginTop: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 10,
        color: "#fff",
        backgroundColor: "#7159c1",
        padding: 15,
    },
});
