import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { styles } from './style';

interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt?: string;
}

export default function ChatRoom() {
  const route = useRoute<any>();
  const { receiverId, receiverName } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const setupChat = async () => {
      const token = await AsyncStorage.getItem('token');
      const uid = await AsyncStorage.getItem('userId');
      if (!token || !uid) {
        console.warn('Missing token or userId');
        return;
      }
      setUserId(uid);

      const socket = io('http://192.168.0.203:5000', {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
      });

      socketRef.current = socket;

      socket.on('connect', () => console.log('Socket connected:', socket.id));
      socket.on('connect_error', (err) =>
        console.error('Socket connection error:', err.message)
      );

      socket.on('receive_message', (msg: Message) => {
        if (
          (msg.senderId === receiverId && msg.receiverId === uid) ||
          (msg.senderId === uid && msg.receiverId === receiverId)
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      socket.on('message_sent', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });

      try {
        const res = await fetch(
          `http://192.168.0.203:5000/chat/messages?senderId=${uid}&receiverId=${receiverId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data.data)) setMessages(data.data);
        else if (Array.isArray(data)) setMessages(data);
        else console.warn('Invalid messages format:', data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    setupChat();

    return () => {
      socketRef.current?.disconnect();
      console.log('Socket disconnected');
    };
  }, [receiverId]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !userId) return;
    const msg: Message = {
      senderId: userId,
      receiverId,
      content: input.trim(),
    };
    socketRef.current.emit('send_message', msg);
    setInput('');
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const groupedMessages = messages.reduce<Record<string, Message[]>>((groups, msg) => {
    const date = formatDate(msg.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{receiverName}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        style={styles.messagesContainer}
      >
        {Object.keys(groupedMessages).map((date) => (
          <View key={date}>
            <Text style={styles.dateLabel}>{date}</Text>
            {groupedMessages[date].map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.message,
                  msg.senderId === userId ? styles.sent : styles.received,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.senderId === userId && { color: '#fff' },
                  ]}
                >
                  {msg.content}
                </Text>
                {msg.createdAt && (
                  <Text
                    style={[
                      styles.timeText,
                      msg.senderId === userId && { color: '#eaeaea' },
                    ]}
                  >
                    {formatTime(msg.createdAt)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
