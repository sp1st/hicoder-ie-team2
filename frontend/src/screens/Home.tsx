import React, { useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import {
  YStack,
  XStack,
  Button,
  Input,
  Text,
  View,
  Tabs,
  SizableText,
  // Separator,
} from 'tamagui';
import type { TabsContentProps } from 'tamagui';
import { GlassWater } from '@tamagui/lucide-icons';

interface HomeProps {
  onLogin: () => void;
}

export default function Home({ onLogin }: HomeProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('tab2');

  console.log('Current activeTab:', activeTab);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#60A5FA" />
      
      {/* メインコンテナ */}
      <YStack style={styles.mainContainer}>
        
        {/* ロゴ部分 */}
        <YStack style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <GlassWater size={60} color="#2563EB" />
          </View>
        </YStack>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="horizontal"
            flexDirection="column"
            width="100%"
            height={300}
            overflow="hidden"
            style={styles.tabsContainer}
          >
          <YStack style={styles.tabsList}>
            <XStack>
              <Button
                flex={1}
                style={[
                  styles.tabButton,
                  activeTab === 'tab1' && styles.activeTabButton
                ]}
                onPress={() => setActiveTab('tab1')}
              >
                <SizableText 
                  fontFamily="$body" 
                  style={[
                    styles.tabTextCenter,
                    activeTab === 'tab1' ? styles.activeTabText : styles.inactiveTabText
                  ]}
                >
                  ログイン
                </SizableText>
              </Button>
              <Button
                flex={1}
                style={[
                  styles.tabButton,
                  activeTab === 'tab2' && styles.activeTabButton
                ]}
                onPress={() => setActiveTab('tab2')}
              >
                <SizableText 
                  fontFamily="$body" 
                  style={[
                    styles.tabTextCenter,
                    activeTab === 'tab2' ? styles.activeTabText : styles.inactiveTabText
                  ]}
                >
                  アカウントを作成
                </SizableText>
              </Button>
            </XStack>
          </YStack>
          {/* <Separator /> */}

          <TabsContent value="tab1">
            <YStack style={styles.formContainer}>
              <Input
                placeholder="username"
                value={username}
                onChangeText={setUsername}
                style={styles.inputField}
              />
              <Input
                placeholder="passwords"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputField}
              />

            <Text style={styles.forgotPasswordText}>
              パスワードをお忘れですか？
            </Text>

            <Button
              style={styles.loginButton}
              pressStyle={{ scale: 0.98 }}
              onPress={onLogin}
            >
              <Text style={styles.loginButtonText}>
                ログイン
              </Text>
            </Button>
            </YStack>
          </TabsContent>

          <TabsContent value="tab2">
            <YStack style={styles.formContainer}>
              <Input
                placeholder="username"
                value={username}
                onChangeText={setUsername}
                style={styles.inputField}
              />
              <Input
                placeholder="passwords"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputField}
              />

            <Button
              style={styles.loginButton}
              pressStyle={{ scale: 0.98 }}
              onPress={onLogin}
            >
              <Text style={styles.loginButtonText}>
                アカウントを作成
              </Text>
            </Button>
            </YStack>
          </TabsContent>
        </Tabs>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a1d8e6', // blue-400
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  contentCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  formContainer: {
    width: '100%',
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  inputField: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    width: '100%',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#38a1db',
    borderRadius: 16,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  tabsContainer: {
    borderColor: '#E5E7EB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  tabsList: {
    backgroundColor: '#82cddd',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  tabTextCenter: {
    textAlign: 'center',
  },
  tabButton: {
    backgroundColor: '#82cddd',
    // borderRadius: 8,
    // paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#86b3e0',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  inactiveTabText: {
    // color: '#6B7280',
    color: 'white',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#86b3e0',
    borderColor: '#86b3e0',
    borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
  },
});

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      flex={1}
      style={[styles.tabContent, { padding: 8, alignItems: 'center', justifyContent: 'center' }]}
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}