import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { euCountries } from '../data/countries';

const CountryPickerModal = ({ visible, onClose, onSelectCountry }) => {
    const [query, setQuery] = useState('');
    const [filteredCountries, setFilteredCountries] = useState(euCountries);

    const handleSearch = (text) => {
        setQuery(text);
        if (text === '') {
            setFilteredCountries(euCountries);
        } else {
            const regex = new RegExp(`${text.trim()}`, 'i');
            setFilteredCountries(euCountries.filter((country) => country.name.search(regex) >= 0));
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Поиск страны..."
                        value={query}
                        onChangeText={handleSearch}
                    />
                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.countryItem}
                                onPress={() => {
                                    onSelectCountry(item.name);
                                    onClose();
                                }}
                            >
                                <Text style={styles.countryText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '85%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    searchInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    countryItem: {
        paddingVertical: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    countryText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#e28743',
    },
});

export default CountryPickerModal;
