
import { useState, useEffect } from 'react';
import { getPrayerGroups, joinPrayerGroup } from './appwrite';

export const useGroups = (user) => {
    const [groups, setGroups] = useState([]);
    const [groupCode, setGroupCode] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchGroups();
        }
    }, [user]);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const fetchedGroups = await getPrayerGroups();
            setGroups(fetchedGroups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const joinGroup = async (groupId, userId, code = groupCode) => {
        setLoading(true);
        try {
            const { alreadyMember, message, error } = await joinPrayerGroup(groupId, userId, code);
            if (error) {
                throw new Error(error);
            }
            return { alreadyMember, message };
        } catch (error) {
            console.error("Error joining group:", error);
            return { error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // console.log(groups)
    return {
        groups,
        groupCode,
        setGroupCode,
        loading,
        fetchGroups,
        joinGroup,
    };
};
