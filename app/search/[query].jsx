import { FlatList, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import TextCard from '../../components/TextCard'
import { RefreshControl } from 'react-native'

import useAppwrite from '../../lib/useAppwrite'

import { searchPosts } from '@/lib/appwrite'
import { useLocalSearchParams } from 'expo-router'



const Search = () => {

    const { query } = useLocalSearchParams()

    const { data: posts, refetch } = useAppwrite(
        () => searchPosts(query));
    const [refreshing, setRefreshing] = useState(false);


    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    useEffect(() => {
        refetch()
    }, [query])

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={posts}
                // data={[]}

                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <TextCard
                        text={item}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4">

                        <Text className="font-pmedium text-sm text-black-100">Search Results for</Text>
                        <Text className="text-2xl font-psemibold text-black">{query}</Text>
                        <View className="mt-6 mb-8">
                            <SearchInput initialQuery={query} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos found for this query"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}

export default Search
