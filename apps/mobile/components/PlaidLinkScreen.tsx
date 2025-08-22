import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Session } from '@supabase/supabase-js';
import PlaidLink from './PlaidLink';
import { createPlaidLinkToken, exchangePublicToken } from '../lib/api';

interface PlaidLinkScreenProps {
  session: Session;
}

export default function PlaidLinkScreen({ session }: PlaidLinkScreenProps) {
  const [linkToken, setLinkToken] = useState<string>('');

  useEffect(() => {
    fetchLinkToken();
  }, []);

  const fetchLinkToken = async () => {
    try {
      const token = await createPlaidLinkToken(session);
      setLinkToken(token);
    } catch (error) {
      console.error('Error fetching link token:', error);
      Alert.alert('Error', 'Failed to initialize bank connection');
    }
  };

  const handlePlaidSuccess = async (publicToken: string, metadata: any) => {
    try {
      console.log('Public token received:', publicToken);
      console.log('Account metadata:', metadata);
      console.log('User ID from session:', session.user.id);

      await exchangePublicToken(session, {
        publicToken,
        accountId: metadata.accounts?.[0]?.id,
        institutionName: metadata.institution?.name,
      });

      Alert.alert(
        'Success', 
        `Connected to ${metadata.institution.name}!\nAccount: ${metadata.accounts[0].name}\nUser ID: ${session.user.id}`
      );
    } catch (error) {
      console.error('Error handling Plaid success:', error);
      Alert.alert('Error', 'Failed to complete bank connection');
    }
  };

  const handlePlaidExit = (exitData: any) => {
    console.log('Plaid Link exited:', exitData);
    if (exitData.error) {
      Alert.alert('Connection Failed', exitData.error.displayMessage || 'Unable to connect bank account');
    }
  };

  // Don't render the component until we have a link token
  if (!linkToken) {
    // TODO: Show loading state while fetching link token
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.userText}>Logged in as: {session.user.email}</Text>
        <Text style={styles.userIdText}>User ID: {session.user.id}</Text>
      </View>
      
      <PlaidLink
        linkToken={linkToken}
        onSuccess={handlePlaidSuccess}
        onExit={handlePlaidExit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userInfo: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  userText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  userIdText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});