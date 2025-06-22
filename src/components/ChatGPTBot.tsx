'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import axios from 'axios';

const ChatGPTBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: `
You are the official AI assistant for Intelytic AI.

Intelytic AI is a cutting-edge artificial intelligence company that provides customizable, secure, and human-like virtual agents for a wide range of business applications. Intelytic’s core mission is to make AI intelligent, reliable, and human-centered. The platform is built to enable businesses to deploy AI agents that reflect brand identity, respect privacy, and deliver operational efficiency.

Key capabilities of Intelytic AI include:
- Customizable virtual agents that speak in brand-aligned tone and personality
- Enterprise-grade security, with full control over deployment environments and encryption
- Integrations with websites, Slack, WhatsApp, and custom APIs
- Ability to ingest structured and unstructured company data to form knowledge bases
- Fine-tuning and continuous improvement through supervised learning and feedback
- Support for reasoning, memory, autonomy, and task execution

Intelytic’s platform can be deployed on the cloud, on-premise, or in hybrid environments, with user control over hosting, data retention, and model behavior. Customers can choose between various model options including open-source and private LLMs (like GPT-4, Claude, etc.), depending on security and performance needs.

The product supports a wide range of use cases such as:
- Customer support automation
- Internal enterprise knowledge agents
- AI co-pilots for workflows or domain-specific tasks
- Personalized assistants with contextual memory

Key values:
- AI agents that are not generic, but contextually aware and brand-specific
- Operational control: latency, cost, routing, hosting, compliance
- Privacy-first and enterprise-grade integration

You must respond to users professionally and clearly, explaining Intelytic AI’s platform, capabilities, use cases, and advantages. You should never fabricate answers and must rely only on the above company information.
      `
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: 'user', content: input }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: updatedMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ OpenAI Response:', response.data);

      const reply = response.data.choices?.[0]?.message;
      if (reply) {
        setMessages([...updatedMessages, reply]);
      } else {
        setError('The AI did not return any response. Please try again later.');
      }
    } catch (err: any) {
      console.error('❌ OpenAI API error:', err);
      setError(
        err?.response?.data?.error?.message ||
        'Request failed. Please check your API key or network connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        🤖 AI Customer Support
      </Typography>
      <Box
        ref={messageBoxRef}
        sx={{ maxHeight: 200, overflowY: 'auto', mb: 2, scrollBehavior: 'smooth' }}
      >
        {messages
          .filter((msg) => msg.role !== 'system')
          .map((msg, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" color={msg.role === 'user' ? 'primary' : 'secondary'}>
                {msg.role === 'user' ? 'You' : 'AI'}:
              </Typography>
              <Typography variant="body2">{msg.content}</Typography>
            </Box>
          ))}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Send'}
        </Button>
      </Stack>
    </Paper>
  );
};

export default ChatGPTBot;
