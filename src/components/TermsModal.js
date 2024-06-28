import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const TermsModal = ({ modalVisible, setModalVisible }) => {
    const { t } = useTranslation();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <Text style={styles.modalTitle}>{t('terms_and_conditions')}</Text>

                        <Text style={styles.sectionTitle}>1. Introduction</Text>
                        <Text style={styles.modalText}>
                            These Terms of Service (hereinafter referred to as the "Agreement") govern the use of the Hambax application
                            (hereinafter referred to as the "Application"), which provides a service for event organizers and end clients
                            (event attendees). Please read this Agreement carefully before using the Application. By using the Application,
                            you agree to the terms of this Agreement.
                        </Text>

                        <Text style={styles.sectionTitle}>2. Registration and Account</Text>
                        <Text style={styles.modalText}>
                            2.1. To use all the features of the Application, users must register an account. The registration process differs
                            for end users (attendees) and event organizers.
                        </Text>
                        <Text style={styles.modalText}>2.2. End users must provide the following information during registration:</Text>
                        <Text style={styles.listItem}>- Email address</Text>
                        <Text style={styles.listItem}>- Password</Text>
                        <Text style={styles.modalText}>2.3. Event organizers must provide the following information during registration:</Text>
                        <Text style={styles.listItem}>- Email address</Text>
                        <Text style={styles.listItem}>- Password</Text>
                        <Text style={styles.listItem}>- Personal address</Text>
                        <Text style={styles.listItem}>- Contact details (phone number)</Text>
                        <Text style={styles.listItem}>- Organization details (name, address, contact details, tax number)</Text>
                        <Text style={styles.modalText}>
                            2.4. All users can optionally fill out their profile by providing their name, avatar, and country of residence or
                            by enabling geolocation.
                        </Text>

                        <Text style={styles.sectionTitle}>3. Data Collection and Use</Text>
                        <Text style={styles.modalText}>
                            3.1. We collect the following user data:
                        </Text>
                        <Text style={styles.listItem}>- Personal information provided during registration</Text>
                        <Text style={styles.listItem}>- Optionally provided profile information (name, avatar, country)</Text>
                        <Text style={styles.modalText}>
                            3.2. User data is stored in encrypted form on our servers.
                        </Text>
                        <Text style={styles.modalText}>
                            3.3. In the future, we may collect behavioral data to improve the Application and provide a more personalized experience.
                        </Text>

                        <Text style={styles.sectionTitle}>4. Data Security</Text>
                        <Text style={styles.modalText}>
                            4.1. We take all necessary measures to protect user data, including encryption.
                        </Text>
                        <Text style={styles.modalText}>
                            4.2. Users must keep their account credentials (login and password) secure and not share them with third parties.
                        </Text>

                        <Text style={styles.sectionTitle}>5. Payments and Refunds</Text>
                        <Text style={styles.modalText}>
                            5.1. The Application sells event tickets. Refunds are not provided as the value of tickets may vary depending on the date of the event.
                        </Text>

                        <Text style={styles.sectionTitle}>6. User-Generated Content</Text>
                        <Text style={styles.modalText}>
                            6.1. Event organizers can post content, including photos and videos, and end users can comment on these posts and rate events.
                        </Text>
                        <Text style={styles.modalText}>
                            6.2. Hambax does not claim ownership of user-generated content. However, by posting content, users grant Hambax the right to use it within the scope of the Application.
                        </Text>

                        <Text style={styles.sectionTitle}>7. User Conduct</Text>
                        <Text style={styles.modalText}>
                            7.1. Users are prohibited from:
                        </Text>
                        <Text style={styles.listItem}>- Posting aggressive, racist, politically controversial, or adult content</Text>
                        <Text style={styles.listItem}>- Engaging in any form of aggression</Text>

                        <Text style={styles.sectionTitle}>8. Changes to the Agreement</Text>
                        <Text style={styles.modalText}>
                            8.1. We reserve the right to make changes to this Agreement. Users will be notified of changes through the Application or via email.
                        </Text>
                        <Text style={styles.modalText}>
                            8.2. By continuing to use the Application after changes have been made, users agree to the new terms.
                        </Text>

                        <Text style={styles.sectionTitle}>9. Contact Information</Text>
                        <Text style={styles.modalText}>
                            9.1. To contact us with questions or complaints, please use the following contact information:
                            [Provide contact details such as email address and phone number]
                        </Text>

                        <Text style={styles.sectionTitle}>10. Miscellaneous Legal Aspects</Text>
                        <Text style={styles.modalText}>
                            10.1. This Agreement is governed by the laws of the country where Hambax is registered.
                        </Text>
                        <Text style={styles.modalText}>
                            10.2. We do not provide any warranties regarding the operation of the Application and are not liable for any damages that may result from its use.
                        </Text>
                        <Text style={styles.modalText}>
                            10.3. Termination of Application Use:
                        </Text>
                        <Text style={styles.listItem}>- We may terminate or suspend a user's access to the Application if they violate the terms of this Agreement.</Text>

                        <Text style={styles.modalText}>
                            Thank you for using Hambax!
                        </Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>{t('close')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        margin: 30
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    listItem: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e28743',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TermsModal;
