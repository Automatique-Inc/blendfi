import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidLinkProps {
  linkToken: string;
  onSuccess: (publicToken: string, metadata: any) => void;
  onExit?: (exitData: any) => void;
}

export default function PlaidLink({ linkToken, onSuccess, onExit }: PlaidLinkProps) {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      console.log('Plaid Link success:', { public_token, metadata });
      onSuccess(public_token, metadata);
    },
    onExit: (err, metadata) => {
      console.log('Plaid Link exit:', { err, metadata });
      onExit?.({ error: err, metadata });
    },
  });

  const handleLinkBank = () => {
    if (!linkToken) {
      Alert.alert('Error', 'Link token is required');
      return;
    }

    if (!ready) {
      Alert.alert('Error', 'Plaid Link not ready');
      return;
    }

    open();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Bank Account</Text>
      <Text style={styles.description}>
        Securely connect your bank account to fund your crypto purchases
      </Text>
      
      <TouchableOpacity
        style={[styles.button, !ready && styles.buttonDisabled]}
        onPress={handleLinkBank}
        disabled={!ready}
      >
        <Text style={styles.buttonText}>
          {!ready ? 'Loading Plaid...' : 'Connect Bank Account'}
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