import { requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

export namespace DifyChatApi {
  export interface ChatMessage {
    data: ChatMessageList[];
    limit: number;
    has_more: boolean;
  }

  /** 对话消息信息 */
  export interface ChatMessageList {
    id: string;
    inputs: Record<string, any>;
    query: string;
    answer: string;
    feedback?: any;
    conversation_id: string;
    message_files: any[];
    retriever_resources: any[];
    agent_thoughts: any[];
    created_at: number;
  }

  /** 前端显示用的消息格式 */
  export interface DisplayMessage {
    id?: string;
    conversationId?: string;
    role: 'user' | 'assistant';
    content: string;
    createTime?: string;
    tokens?: number;
    status?: 'pending' | 'success' | 'error';
  }

  /** 对话会话信息 */
  export interface ChatConversation {

    data: ChatConversationList[];
    limit: number;
  }

  export interface ChatConversationList {
    id?: string;
    name: string;
    status?: number;
    createTime?: string;
    updateTime?: string;
    messageCount?: number;
  }

  /** 文件信息 */
  export interface FileInfo {
    type?: string;
    url?: string;
    transfer_method?: string;
    upload_file_id?: string;
  }

  /** 发送消息请求 */
  export interface SendMessageRequest {
    /** 用户输入/提问内容 */
    query: string;
    /** 允许传入 App 定义的各变量值，默认为空对象 */
    inputs?: Record<string, any>;
    /** 用户标识，用于定义终端用户的身份 */
    user?: string;
    /** 上传的文件列表 */
    files?: FileInfo[];
    /** 响应模式：streaming 流式模式（推荐），blocking 阻塞模式 */
    response_mode?: string;
    /** 会话 ID，需要基于之前的聊天记录继续对话时传入 */
    conversation_id?: string;
    /** 自动生成标题，默认 true */
    auto_generate_name?: boolean;
  }

  /** 流式消息回调 */
  export interface StreamMessageCallbacks {
    /** 消息片段回调 */
    onMessage?: (chunk: string, fullMessage: string) => void;
    /** 消息完成回调 */
    onComplete?: (response: SendMessageResponse) => void;
    /** 错误回调 */
    onError?: (error: Error) => void;
  }

  /** 使用信息 */
  export interface UsageInfo {
    currency?: string;
    latency?: number;
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    prompt_price?: string;
    completion_price?: string;
    total_price?: string;
  }

  /** 检索资源 */
  export interface RetrieverResource {
    position?: number;
    score?: number;
    content?: string;
    dataset_id?: string;
    dataset_name?: string;
    document_id?: string;
    document_name?: string;
    data_source_type?: string;
    segment_id?: string;
  }

  /** 元数据信息 */
  export interface MetadataInfo {
    usage?: UsageInfo;
    retriever_resources?: RetrieverResource[];
  }

  /** 发送消息响应 */
  export interface SendMessageResponse {
    event?: string;
    id?: string;
    mode?: string;
    answer: string;
    metadata?: MetadataInfo;
    task_id?: string;
    message_id?: string;
    conversation_id?: string;
    created_at?: number;
  }

  /** 建议问题响应 */
  export interface SuggestedQuestionsRespVO {
    result: string;
    data: string; // JSON 字符串格式的建议问题数组
  }


}

/** 获取对话历史列表 */
export function getConversationList() {
  return requestClient.get<DifyChatApi.ChatConversation>(
    '/dify/chat/conversations',
  );
}

/** 获取对话消息列表 */
export function getMessageList(conversationId: string) {
  return requestClient.get<DifyChatApi.ChatMessage>(
    '/dify/chat/messages',
    { params: { conversationId } },
  );
}

/** 发送消息 */
export function sendMessage(data: DifyChatApi.SendMessageRequest) {
  return requestClient.post<DifyChatApi.SendMessageResponse>(
    '/dify/chat/send-message',
    data,
    {
      timeout: 30000, // 30秒超时
    },
  );
}

/** 发送流式消息 */
export function sendStreamMessage(
  data: DifyChatApi.SendMessageRequest,
  callbacks?: DifyChatApi.StreamMessageCallbacks
) {
  return new Promise<DifyChatApi.SendMessageResponse>((resolve, reject) => {
    // 获取API基础URL
    const apiURL = import.meta.env.VITE_GLOB_API_URL || 'http://localhost:48080/admin-api';
    const url = `${apiURL}/dify/chat/send-message-stream`;

    // 获取认证token和其他headers
    const accessStore = useAccessStore();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
    };

    // 添加认证token
    if (accessStore.accessToken) {
      headers['Authorization'] = `Bearer ${accessStore.accessToken}`;
    }

    // 添加租户信息
    if (accessStore.tenantId) {
      headers['tenant-id'] = String(accessStore.tenantId);
    }
    if (accessStore.visitTenantId) {
      headers['visit-tenant-id'] = String(accessStore.visitTenantId);
    }

    // 使用 POST 请求发送流式消息
    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...data,
        response_mode: 'streaming',
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader');
      }

      let fullAnswer = '';
      let messageData: Partial<DifyChatApi.SendMessageResponse> = {};

      async function readStream(): Promise<void> {
        try {
          const { done, value } = await reader!.read();

          if (done) {
            messageData.answer = fullAnswer;
            const finalResponse = messageData as DifyChatApi.SendMessageResponse;
            callbacks?.onComplete?.(finalResponse);
            resolve(finalResponse);
            return;
          }

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data:data: ')) {
              // 处理双重data:前缀的情况
              try {
                const jsonData = JSON.parse(line.slice(11));

                if (jsonData.event === 'message') {
                  const newChunk = jsonData.answer || '';
                  fullAnswer += newChunk;
                  messageData = { ...messageData, ...jsonData };

                  // 实时回调，传递新的片段和完整消息
                  callbacks?.onMessage?.(newChunk, fullAnswer);
                } else if (jsonData.event === 'message_end') {
                  messageData.answer = fullAnswer;
                  const finalResponse = messageData as DifyChatApi.SendMessageResponse;
                  callbacks?.onComplete?.(finalResponse);
                  resolve(finalResponse);
                  return;
                }
              } catch (error) {
                console.error('Failed to parse SSE data:', error);
              }
            } else if (line.startsWith('data: ')) {
              // 处理标准data:前缀的情况
              try {
                const jsonData = JSON.parse(line.slice(6));

                if (jsonData.event === 'message') {
                  const newChunk = jsonData.answer || '';
                  fullAnswer += newChunk;
                  messageData = { ...messageData, ...jsonData };

                  // 实时回调，传递新的片段和完整消息
                  callbacks?.onMessage?.(newChunk, fullAnswer);
                } else if (jsonData.event === 'message_end') {
                  messageData.answer = fullAnswer;
                  const finalResponse = messageData as DifyChatApi.SendMessageResponse;
                  callbacks?.onComplete?.(finalResponse);
                  resolve(finalResponse);
                  return;
                }
              } catch (error) {
                console.error('Failed to parse SSE data:', error);
              }
            }
          }

          // 继续读取下一个chunk
          await readStream();
        } catch (error) {
          callbacks?.onError?.(error as Error);
          reject(error);
        }
      }

      return readStream();
    })
    .catch(error => {
      console.error('Stream request error:', error);
      callbacks?.onError?.(error);
      reject(error);
    });

    // 30秒超时
    setTimeout(() => {
      const timeoutError = new Error('Stream timeout');
      callbacks?.onError?.(timeoutError);
      reject(timeoutError);
    }, 30000);
  });
}

/** 获取建议问题 */
export function getSuggestedQuestions(messageId: string) {
  return requestClient.get<DifyChatApi.SuggestedQuestionsRespVO>(
    `/admin-api/dify/chat/messages/${messageId}/suggested`,
  );
}
