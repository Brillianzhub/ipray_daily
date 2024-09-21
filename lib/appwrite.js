import { Account, Avatars, Client, ID, Databases, Query, Storage, OAuthProvider } from 'react-native-appwrite';
import { Alert } from 'react-native';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.brillianzhub.ipray',
    projectId: "6659a034000bb03e26e1",
    databaseId: '6659a12b001b25c25d71',
    userCollectionId: '6659a200002b100ae5a4',
    prayerPointsCollectionId: '665ae8630025631be897',
    discoveryCollectionId: '66653cfd00163c542f71',
    audioCollectionId: '6659a3b000078a3f06d3',
    categoryCollectionId: '665aea14002d9667b0e1',
    bookmarksCollectionId: '6668885600170e487903',
    userPrayerTimeCollectionId: '6669700f002a6ac8af3c',
    storageId: '6659a498002189004c46',
    prayerGroupsCollectionId: '667a7f0400115e2abb98',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    bookmarksCollectionId,
    prayerPointsCollectionId,
    audioCollectionId,
    categoryCollectionId,
    storageId,
    discoveryCollectionId,
    userPrayerTimeCollectionId,
    prayerGroupsCollectionId
} = config

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);



export async function socialAuth(provider, successUrl, failureUrl) {
    try {
        await account.createOAuth2Session(
            provider,
            successUrl,
            failureUrl,
            ['repo', 'user', 'account']
        );
    } catch (error) {
        console.error('Failed to authenticate with social provider:', error);
        throw new Error(error.message);
    }
}


export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        )
        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


export const deleteAccount = async () => {
    try {
        await account.deleteSession('current'); // Deletes the current session, adjust if necessary
        return true;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};


export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession
            (email, password)
        return session;
    } catch (error) {
        throw new Error(error);
    }
}


export const getCurrentUser = async () => {
    try {

        const currentAccount = await account.get();

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0]
    } catch (error) {
        console.log(error);
    }
}


export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            prayerPointsCollectionId,
            [Query.orderDesc('$createdAt')]
        );

        const shuffledPosts = shuffle(posts.documents);

        return shuffledPosts;
    } catch (error) {
        throw new Error('Error fetching posts: ' + error.message);
    }
};

export const getAllPosts2 = async () => {
    try {
        const response = await fetch('https://www.brillianzhub.com/ipray/prayerpoints/');

        if (!response.ok) {
            throw new Error('Error fetching posts: ' + response.statusText);
        }

        const result = await response.json();

        const posts = result;

        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Error fetching posts: ' + error.message);
    }
};



// Function to shuffle an array
function shuffle(array) {
    const shuffledArray = [...array]; // Create a copy to avoid modifying the original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}



export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            prayerPointsCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error;
    }
}


export const getAllDiscovery = async () => {
    try {
        const discovery = await databases.listDocuments(
            databaseId,
            discoveryCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return discovery.documents;
    } catch (error) {
        throw new Error;
    }
}


export const getAllAudio = async () => {
    try {
        const audio = await databases.listDocuments(
            databaseId,
            audioCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return audio.documents;
    } catch (error) {
        throw new Error;
    }
}


export const getAllCategory = async () => {
    try {
        const categories = await databases.listDocuments(
            databaseId,
            categoryCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return categories.documents;
    } catch (error) {
        throw new Error;
    }
}


export const getAllCategory2 = async () => {
    try {
        const response = await fetch('https://www.brillianzhub.com/ipray/categories/');

        if (!response.ok) {
            throw new Error('Error fetching categories: ' + response.statusText);
        }
        const result = await response.json();
        const categories = result;
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Error fetching categories: ' + error.message);
    }
};


// Get prayer points that matches search query
export async function searchPosts(query) {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            prayerPointsCollectionId,
            [Query.search("text", query), Query.search("bible_verse", query)]
        );

        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}


export const getPrayersByCategory = async (categoryTerm) => {
    if (!categoryTerm) {
        throw new Error('Category is required');
    }

    try {
        const postsResponse = await databases.listDocuments(databaseId, prayerPointsCollectionId);
        const posts = postsResponse.documents;

        const categoriesResponse = await databases.listDocuments(databaseId, categoryCollectionId);
        const categories = categoriesResponse.documents;

        const category = categories.find(cat => cat.title && cat.title.toLowerCase() === categoryTerm.toLowerCase());

        if (!category) {
            throw new Error(`Category '${categoryTerm}' not found`);
        }
        const categoryId = category.$id;

        const filteredPosts = posts.filter(post => post.category && post.category.$id === categoryId);

        filteredPosts.sort((a, b) => {
            const titleA = a.title || '';
            const titleB = b.title || '';
            return titleA.localeCompare(titleB);
        });

        return filteredPosts;
    } catch (error) {
        throw new Error(`Error fetching prayers by category: ${error.message}`);
    }
};


export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserPrayerTime(userId) {

    try {
        const user_prayer_time = await databases.listDocuments(
            databaseId,
            userPrayerTimeCollectionId,
            [Query.equal('users', userId)]
        );
        return user_prayer_time.documents;
    } catch (error) {
        console.log('Failed to fetch user prayer time', error)
    }
};


export const updateUserPrayerTime = async (collectionId, prayerTime) => {
    try {
        const response = await databases.updateDocument(
            databaseId,
            userPrayerTimeCollectionId,
            collectionId,
            { 'time_prayer': prayerTime }
        );
        return response;
    } catch (error) {
        console.error("Error updating prayer time:", error);
    }
};


export const createPrayerGroup = async (form) => {
    try {
        const newPrayerGroup = await databases.createDocument(
            databaseId,
            prayerGroupsCollectionId,
            ID.unique(),
            {
                name: form.name,
                description: form.description,
                open: form.open,
                creator: form.userId,
                group_code: form.groupCode,
            }
        );

        return newPrayerGroup;
    } catch (error) {
        throw new Error(error);
    }
}


export const getPrayerGroups = async () => {
    try {
        const response = await databases.listDocuments(
            databaseId,
            prayerGroupsCollectionId,
            [Query.orderDesc('$createdAt')]
        );
        return response.documents;
    } catch (error) {
        throw new Error(error);
    }
};



export const joinPrayerGroup = async (groupId, userId, groupCode) => {
    try {
        const group = await databases.getDocument(
            databaseId,
            prayerGroupsCollectionId,
            groupId,
        );

        if (!group.open && group.group_code !== groupCode) {
            return { error: 'Invalid group code. Contact group admin!', alreadyMember: false };
        }

        let members = group.members || [];

        const memberId = members.find(item => item.$id)?.$id;

        if (memberId === userId) {
            return { alreadyMember: true, message: 'User is already a member of this group.' };
        }

        members.push(userId);

        const response = await databases.updateDocument(
            databaseId,
            prayerGroupsCollectionId,
            groupId,
            { members }
        );
        return { response, alreadyMember: false, message: 'User successfully added to the group.' };
    } catch (error) {
        console.error('Error fetching or updating group:', error);
        return { error: error.message, alreadyMember: false };
    }
};


export const memberContactList = async (groupId) => {
    try {
        const group = await databases.getDocument(
            databaseId,
            prayerGroupsCollectionId,
            groupId
        );

        const members = group.members || [];

        const memberEmail = members.map(member => ({
            email: member.email,
            username: member.username,
        }));

        const emails = memberEmail.map(obj => obj.email);

        return emails

    } catch (error) {
        console.error('Error fetching member contact list:', error);
        throw new Error(error.message);
    }
};