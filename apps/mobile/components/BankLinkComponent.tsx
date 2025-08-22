import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { create, open, dismissLink } from 'react-native-plaid-link-sdk';

interface PlaidLinkProps {
  linkToken: string;
  onSuccess: (publicToken: string, metadata: any) => void;
  onExit?: (exitData: any) => void;
}

export default function PlaidLink({ linkToken, onSuccess, onExit }: PlaidLinkProps) {
  const handleLinkBank = async () => {
    if (!linkToken) {
      Alert.alert('Error', 'Link token is required');
      return;
    }

    try {
      console.log('Creating Plaid Link with token:', linkToken);
      
      // Create link configuration
      await create({
        token: linkToken,
        noLoadingState: false,
      });

      console.log('Opening Plaid Link...');
      
      // Open Plaid Link with callbacks
      await open({
        onSuccess: (success) => {
          console.log('Plaid Link success:', success);
          onSuccess(success.publicToken, success.metadata);
          dismissLink();
        },
        onExit: (exit) => {
          console.log('Plaid Link exit:', exit);
          onExit?.(exit);
          dismissLink();
        },
      });
    } catch (error) {
      console.error('Error with Plaid Link:', error);
      Alert.alert('Error', 'Failed to open Plaid Link');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Bank Account</Text>
      <Text style={styles.description}>
        Securely connect your bank account to fund your crypto purchases
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLinkBank}
      >
        <Text style={styles.buttonText}>
          Connect Bank Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});