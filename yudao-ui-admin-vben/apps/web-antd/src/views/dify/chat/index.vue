<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert title="Dify 智能对话" url="https://doc.iocoder.cn/ai/dify/" />
    </template>

    <div class="dify-chat-container">
      <!-- 侧边栏 - 对话列表 -->
      <div class="chat-sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">{{ $t('dify.chat.conversations') }}</h3>
          <Button
            type="primary"
            size="small"
            @click="createNewConversation"
          >
            {{ $t('dify.chat.newChat') }}
          </Button>
        </div>

        <div class="conversation-list">
          <div
            v-for="conversation in conversations"
            :key="conversation.id"
            :class="['conversation-item', { active: currentConversationId === conversation.id }]"
            @click="selectConversation(conversation.id!)"
          >
            <div class="conversation-name">{{ conversation.name }}</div>
            <div class="conversation-time">{{ formatTime(conversation.updateTime) }}</div>
            <!-- 只对临时对话显示删除按钮 -->
            <Button
              v-if="conversation.id?.startsWith('temp_')"
              type="text"
              size="small"
              danger
              @click.stop="deleteConversationHandler(conversation.id!)"
            >
              {{ $t('common.delete') }}
            </Button>
          </div>
        </div>
      </div>

      <!-- 主聊天区域 -->
      <div class="chat-main">
        <div v-if="!currentConversationId" class="chat-welcome">
          <div class="welcome-content">
            <h2>{{ $t('dify.chat.welcome') }}</h2>
            <p>{{ $t('dify.chat.welcomeDesc') }}</p>
            <Button type="primary" @click="createNewConversation">
              {{ $t('dify.chat.startChat') }}
            </Button>
          </div>
        </div>

        <div v-else class="chat-content">
          <!-- 消息列表 -->
          <div ref="messagesContainer" class="messages-container">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="['message-item', `message-${message.role}`]"
            >
              <div class="message-avatar">
                <Avatar v-if="message.role === 'user'" :size="32">
                  <UserIcon />
                </Avatar>
                <Avatar v-else :size="32" style="background-color: #1890ff">
                  <BotIcon />
                </Avatar>
              </div>
              <div class="message-content">
                <!-- 显示加载状态或消息内容 -->
                <div v-if="message.status === 'pending' && !message.content" class="message-loading">
                  <Spin size="small" />
                  <span>{{ $t('dify.chat.thinking') }}</span>
                </div>
                <div v-else class="message-text" v-html="formatMessageContent(message.content)"></div>
                <div v-if="message.createTime" class="message-time">{{ formatTime(message.createTime) }}</div>
              </div>
            </div>


          </div>

          <!-- 建议问题区域 -->
          <div v-if="suggestedQuestions.length > 0" class="suggested-questions">
            <div class="suggested-title">{{ $t('dify.chat.suggestedQuestions') }}</div>
            <div class="questions-list">
              <Button
                v-for="(question, index) in suggestedQuestions"
                :key="index"
                type="default"
                size="small"
                class="question-btn"
                @click="handleSuggestedQuestionClick(question)"
              >
                {{ question }}
              </Button>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-area">
            <!-- 流式模式切换 -->
            <div class="stream-mode-toggle">
              <Switch
                v-model:checked="isStreamMode"
                size="small"
              />
              <span class="toggle-label">{{ $t('dify.chat.streamMode') }}</span>
              <span class="toggle-desc">{{ $t('dify.chat.streamModeDesc') }}</span>
            </div>

            <div class="input-container">
              <TextArea
                v-model:value="inputMessage"
                :placeholder="$t('dify.chat.inputPlaceholder')"
                :auto-size="{ minRows: 1, maxRows: 4 }"
                @keydown="handleKeyDown"
              />
              <Button
                type="primary"
                :loading="isLoading"
                :disabled="!inputMessage.trim()"
                @click="sendMessage"
              >
                {{ $t('dify.chat.send') }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { Avatar, Button, Input, message, Modal, Spin, Switch } from 'ant-design-vue';
import { DocAlert, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { createIconifyIcon } from '@vben/icons';

// 创建图标组件
const UserIcon = createIconifyIcon('lucide:user');
const BotIcon = createIconifyIcon('lucide:bot');

import type { DifyChatApi } from '#/api/dify/chat';
import {
  getConversationList,
  getMessageList,
  getSuggestedQuestions,
  sendMessage as sendChatMessage,
  sendStreamMessage,
} from '#/api/dify/chat';

const { TextArea } = Input;

// 响应式数据
const conversations = ref<DifyChatApi.ChatConversationList[]>([]);
const messages = ref<DifyChatApi.DisplayMessage[]>([]);
const currentConversationId = ref<string>('');
const inputMessage = ref('');
const isLoading = ref(false);
const isStreamMode = ref(true); // 默认开启流式模式
const suggestedQuestions = ref<string[]>([]); // 建议问题列表
const messagesContainer = ref<HTMLElement>();

// 加载对话历史列表
async function loadConversations() {
  try {
    const res = await getConversationList();
    // 确保 conversations.value 是数组
    conversations.value = Array.isArray(res.data) ? res.data : [];

    // 默认选中第一条对话
    if (conversations.value.length > 0) {
      selectConversation(conversations.value[0].id!);
    }
  } catch (error) {
    console.error('Failed to load conversations:', error);
    message.error($t('dify.chat.loadConversationsError'));
    // 确保即使出错也初始化为空数组
    conversations.value = [];
  }
}

// 加载消息列表
async function loadMessages(conversationId: string) {
  try {
    const res = await getMessageList(conversationId);
    const messageList = res.data || [];

    // 转换消息格式，适配新的数据结构
    const convertedMessages: DifyChatApi.DisplayMessage[] = [];

    messageList.forEach(msg => {
      // 添加用户消息
      convertedMessages.push({
        id: `${msg.id}_user`,
        role: 'user',
        content: msg.query,
        createTime: new Date(msg.created_at * 1000).toISOString(),
      });

      // 添加助手回复
      convertedMessages.push({
        id: msg.id,
        role: 'assistant',
        content: msg.answer,
        createTime: new Date(msg.created_at * 1000).toISOString(),
      });
    });

    messages.value = convertedMessages;
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Failed to load messages:', error);
    message.error($t('dify.chat.loadMessagesError'));
    // 确保即使出错也初始化为空数组
    messages.value = [];
  }
}

// 创建新对话（前端临时创建，不调用接口）
function createNewConversation() {
  const newConversation: DifyChatApi.ChatConversationList = {
    id: `temp_${Date.now()}`,
    name: `${$t('dify.chat.newChat')} ${new Date().toLocaleString()}`,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  };

  // 确保 conversations.value 是数组
  if (!Array.isArray(conversations.value)) {
    conversations.value = [];
  }

  // 添加到对话列表开头
  conversations.value.unshift(newConversation);
  selectConversation(newConversation.id!);
}

// 选择对话
function selectConversation(conversationId: string) {
  currentConversationId.value = conversationId;

  // 清空建议问题
  suggestedQuestions.value = [];

  // 如果是临时对话，清空消息列表，不调用接口
  if (conversationId.startsWith('temp_')) {
    messages.value = [];
  }
  // 注意：不在这里调用 loadMessages，让 watch 监听器来处理
}

// 删除对话（仅删除前端临时对话）
function deleteConversationHandler(conversationId: string) {
  Modal.confirm({
    title: $t('dify.chat.deleteConversationTitle'),
    content: $t('dify.chat.deleteConversationContent'),
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: () => {
      // 确保 conversations.value 是数组
      if (!Array.isArray(conversations.value)) {
        conversations.value = [];
        return;
      }

      // 从对话列表中移除
      conversations.value = conversations.value.filter(conv => conv.id !== conversationId);

      // 如果删除的是当前对话，清空当前状态
      if (currentConversationId.value === conversationId) {
        currentConversationId.value = '';
        messages.value = [];

        // 如果还有其他对话，选中第一个
        if (conversations.value.length > 0) {
          selectConversation(conversations.value[0].id!);
        }
      }

      message.success($t('dify.chat.deleteConversationSuccess'));
    },
  });
}

// 发送消息
async function sendMessage() {
  if (!inputMessage.value.trim() || !currentConversationId.value) {
    return;
  }

  const userMessage: DifyChatApi.DisplayMessage = {
    id: `msg_${Date.now()}_user`,
    role: 'user',
    content: inputMessage.value,
    createTime: new Date().toISOString(),
  };

  // 确保 messages.value 是数组
  if (!Array.isArray(messages.value)) {
    messages.value = [];
  }

  messages.value.push(userMessage);
  const messageContent = inputMessage.value;
  inputMessage.value = '';
  // 在流式模式下不需要设置isLoading，因为我们使用消息状态来控制显示
  if (!isStreamMode.value) {
    isLoading.value = true;
  }

  await nextTick();
  scrollToBottom();

  try {
    // 准备请求数据
    const requestData = {
      query: messageContent,
      // user: 'user-123', // 用户标识，可以从用户信息中获取
      inputs: {}, // 默认为空对象
      response_mode: isStreamMode.value ? 'streaming' : 'blocking',
      conversation_id: currentConversationId.value.startsWith('temp_') ? undefined : currentConversationId.value,
      auto_generate_name: true, // 自动生成标题
    };

    // 创建助手消息占位符
    const assistantMessage: DifyChatApi.DisplayMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant',
      content: '',
      createTime: new Date().toISOString(),
      status: 'pending',
    };

    messages.value.push(assistantMessage);
    await nextTick();
    scrollToBottom();

    // 根据模式调用不同的接口
    let response: DifyChatApi.SendMessageResponse;
    if (isStreamMode.value) {
      // 流式模式
      response = await sendStreamMessage(requestData, {
        onMessage: (_chunk: string, fullMessage: string) => {
          // 实时更新助手消息内容
          const messageIndex = messages.value.findIndex(msg => msg.id === assistantMessage.id);
          if (messageIndex !== -1 && messages.value[messageIndex]) {
            messages.value[messageIndex].content = fullMessage;
            messages.value[messageIndex].status = 'pending';
          }
          // 自动滚动到底部
          nextTick(() => scrollToBottom());
        },
        onComplete: (finalResponse: DifyChatApi.SendMessageResponse) => {
          // 更新最终消息
          const messageIndex = messages.value.findIndex(msg => msg.id === assistantMessage.id);
          if (messageIndex !== -1 && messages.value[messageIndex]) {
            messages.value[messageIndex].id = finalResponse.message_id || assistantMessage.id;
            messages.value[messageIndex].content = finalResponse.answer;
            messages.value[messageIndex].status = 'success';
            messages.value[messageIndex].createTime = new Date().toISOString();
            messages.value[messageIndex].tokens = finalResponse.metadata?.usage?.total_tokens;
          }

          // 处理临时对话ID更新
          if (currentConversationId.value.startsWith('temp_') && finalResponse.conversation_id) {
            if (Array.isArray(conversations.value)) {
              const tempConversation = conversations.value.find(conv => conv.id === currentConversationId.value);
              if (tempConversation) {
                tempConversation.id = finalResponse.conversation_id;
                currentConversationId.value = finalResponse.conversation_id;
              }
            }
          }
        },
        onError: (error: Error) => {
          console.error('Stream error:', error);
          const messageIndex = messages.value.findIndex(msg => msg.id === assistantMessage.id);
          if (messageIndex !== -1 && messages.value[messageIndex]) {
            messages.value[messageIndex].content = '抱歉，发生了错误，请重试。';
            messages.value[messageIndex].status = 'error';
          }
        }
      });
    } else {
      // 阻塞模式
      response = await sendChatMessage(requestData);
      // 更新助手消息
      const messageIndex = messages.value.findIndex(msg => msg.id === assistantMessage.id);
      if (messageIndex !== -1 && messages.value[messageIndex]) {
        messages.value[messageIndex].id = response.message_id || assistantMessage.id;
        messages.value[messageIndex].content = response.answer;
        messages.value[messageIndex].createTime = new Date().toISOString();
        messages.value[messageIndex].tokens = response.metadata?.usage?.total_tokens;
        messages.value[messageIndex].status = 'success';
      }
    }

    // 只在阻塞模式下处理临时对话ID更新（流式模式在onComplete中已处理）
    if (!isStreamMode.value && currentConversationId.value.startsWith('temp_') && response.conversation_id) {
      // 确保 conversations.value 是数组
      if (Array.isArray(conversations.value)) {
        const tempConversation = conversations.value.find(conv => conv.id === currentConversationId.value);
        if (tempConversation) {
          tempConversation.id = response.conversation_id;
          currentConversationId.value = response.conversation_id;
        }
      }
    }

    // 获取建议问题
    if (response.message_id) {
      // loadSuggestedQuestions(response.message_id);
    }

    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Failed to send message:', error);
    message.error($t('dify.chat.sendMessageError'));
  } finally {
    isLoading.value = false;
  }
}

// 处理键盘事件
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// 滚动到底部
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

// 格式化时间
function formatTime(time?: string) {
  if (!time) return '';
  try {
    const date = new Date(time);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return $t('dify.chat.justNow');
    if (diffInMinutes < 60) return $t('dify.chat.minutesAgo', { count: diffInMinutes });
    if (diffInMinutes < 1440) return $t('dify.chat.hoursAgo', { count: Math.floor(diffInMinutes / 60) });
    return date.toLocaleDateString();
  } catch {
    return '';
  }
}

// 格式化消息内容（支持简单的 markdown）
function formatMessageContent(content: string) {
  if (!content || typeof content !== 'string') {
    return '';
  }
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

// 加载建议问题
async function loadSuggestedQuestions(messageId: string) {
  try {
    const response = await getSuggestedQuestions(messageId);
    if (response.result === 'success' && response.data) {
      // 解析 JSON 字符串格式的建议问题数组
      const questions = JSON.parse(response.data);
      suggestedQuestions.value = Array.isArray(questions) ? questions : [];
    } else {
      suggestedQuestions.value = [];
    }
  } catch (error) {
    console.error('Failed to load suggested questions:', error);
    suggestedQuestions.value = [];
  }
}

// 点击建议问题
function handleSuggestedQuestionClick(question: string) {
  inputMessage.value = question;
  suggestedQuestions.value = []; // 清空建议问题
}

// 监听当前对话变化
watch(currentConversationId, (newId) => {
  if (newId && !newId.startsWith('temp_')) {
    // 只有真实的对话ID才加载消息
    loadMessages(newId);
  }
});

// 组件挂载时加载数据
onMounted(() => {
  loadConversations();
});
</script>

<style lang="scss" scoped>
.dify-chat-container {
  display: flex;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  min-height: 600px; /* 设置最小高度 */
}

.chat-sidebar {
  width: 300px;
  background: hsl(var(--card));
  border-right: 1px solid hsl(var(--border));
  display: flex;
  flex-direction: column;

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid hsl(var(--border));
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sidebar-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: hsl(var(--foreground));
    }
  }

  .conversation-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;

    .conversation-item {
      padding: 12px;
      margin-bottom: 4px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;

      &:hover {
        background: hsl(var(--accent));
      }

      &.active {
        background: hsl(var(--primary) / 0.1);
        border-color: hsl(var(--primary));
      }

      .conversation-name {
        font-weight: 500;
        color: hsl(var(--foreground));
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .conversation-time {
        font-size: 12px;
        color: hsl(var(--muted-foreground));
      }
    }
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: hsl(var(--background));
}

.chat-welcome {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .welcome-content {
    text-align: center;
    max-width: 400px;

    h2 {
      color: hsl(var(--foreground));
      margin-bottom: 16px;
    }

    p {
      color: hsl(var(--muted-foreground));
      margin-bottom: 24px;
      line-height: 1.6;
    }
  }
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保占满高度 */
  overflow: hidden; /* 防止整体滚动 */
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
  min-height: 0; /* 允许 flex 子元素缩小 */

  .message-item {
    display: flex;
    margin-bottom: 16px;
    align-items: flex-start;

    &.message-user {
      flex-direction: row-reverse;

      .message-content {
        margin-right: 12px;
        margin-left: 0;

        .message-text {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }

        .message-time {
          text-align: left;
        }
      }
    }

    &.message-assistant {
      .message-content {
        margin-left: 12px;

        .message-text {
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
        }
      }
    }

    .message-avatar {
      flex-shrink: 0;

      :deep(.ant-avatar) {
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }

    .message-content {
      max-width: 70%;

      .message-text {
        padding: 12px 16px;
        border-radius: 12px;
        line-height: 1.6;
        word-wrap: break-word;

        :deep(code) {
          background: hsl(var(--muted));
          padding: 2px 4px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        :deep(strong) {
          font-weight: 600;
        }

        :deep(em) {
          font-style: italic;
        }
      }

      .message-time {
        font-size: 12px;
        color: hsl(var(--muted-foreground));
        margin-top: 4px;
        text-align: right;
      }

      .message-loading {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: hsl(var(--muted));
        border-radius: 12px;
        color: hsl(var(--muted-foreground));
      }
    }
  }
}

.suggested-questions {
  padding: 16px;
  border-top: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.3);
  flex-shrink: 0; /* 防止被压缩 */

  .suggested-title {
    font-size: 14px;
    font-weight: 500;
    color: hsl(var(--foreground));
    margin-bottom: 12px;
  }

  .questions-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .question-btn {
      border-radius: 16px;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--background));
      color: hsl(var(--foreground));
      transition: all 0.2s;

      &:hover {
        border-color: hsl(var(--primary));
        background: hsl(var(--primary) / 0.1);
        color: hsl(var(--primary));
      }
    }
  }
}

.suggested-questions {
  padding: 16px;
  border-top: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.3);

  .suggested-title {
    font-size: 14px;
    font-weight: 500;
    color: hsl(var(--foreground));
    margin-bottom: 12px;
  }

  .questions-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .question-btn {
      border-radius: 16px;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--background));
      color: hsl(var(--foreground));
      transition: all 0.2s;

      &:hover {
        border-color: hsl(var(--primary));
        background: hsl(var(--primary) / 0.1);
        color: hsl(var(--primary));
      }
    }
  }
}

.input-area {
  border-top: 1px solid hsl(var(--border));
  padding: 16px;
  background: hsl(var(--background));
  flex-shrink: 0; /* 防止被压缩 */

  .stream-mode-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: hsl(var(--muted));
    border-radius: 6px;

    .toggle-label {
      font-weight: 500;
      color: hsl(var(--foreground));
    }

    .toggle-desc {
      font-size: 12px;
      color: hsl(var(--muted-foreground));
    }
  }

  .input-container {
    display: flex;
    gap: 12px;
    align-items: flex-end;

    :deep(.ant-input) {
      flex: 1;
      border-radius: 8px;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--background));
      color: hsl(var(--foreground));

      &:focus {
        border-color: hsl(var(--primary));
        box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
      }
    }

    :deep(.ant-btn) {
      border-radius: 8px;
      height: auto;
      padding: 8px 16px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dify-chat-container {
    flex-direction: column;
    height: calc(100vh - 120px);
  }

  .chat-sidebar {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid hsl(var(--border));

    .conversation-list {
      .conversation-item {
        padding: 8px 12px;

        .conversation-name {
          font-size: 14px;
        }
      }
    }
  }

  .messages-container {
    .message-item {
      .message-content {
        max-width: 85%;
      }
    }
  }
}

// 滚动条样式
.conversation-list::-webkit-scrollbar,
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.conversation-list::-webkit-scrollbar-track,
.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.conversation-list::-webkit-scrollbar-thumb,
.messages-container::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 3px;
}

.conversation-list::-webkit-scrollbar-thumb:hover,
.messages-container::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}
</style>